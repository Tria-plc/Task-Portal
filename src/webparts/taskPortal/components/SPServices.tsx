import { WebPartContext } from "@microsoft/sp-webpart-base";
import {
  SPHttpClientResponse,
  SPHttpClient,
  ISPHttpClientOptions,
} from "@microsoft/sp-http";

const getHeader = {
  headers: {
    accept: "application/json;",
  },
};
const postHeader = {
  headers: {
    "content-type": "application/json;odata.metadata=full",
    accept: "application/json;odata.metadata=full",
  },
};
const deleteHeader = {
  headers: {
    "content-type": "application/json;odata.metadata=full",
    "IF-MATCH": "*",
    "X-HTTP-Method": "DELETE",
  },
};
const updateHeader = {
  headers: {
    "content-type": "application/json;odata.metadata=full",
    accept: "application/json;odata.metadata=full",
    "X-HTTP-Method": "MERGE",
    "IF-MATCH": "*",
  },
};

export default class SPService {
  public description: string;
  public webUrl: string;

  constructor(private context: WebPartContext) {
    console.log(
      "this.context.pageContext.web.description",
      this.context.pageContext.web.description
    );
    // Move initialization to the constructor
    this.description = this.context.pageContext.web.description;
    this.webUrl = this.context.pageContext.web.absoluteUrl;
  }

  getDepartmentsFromAD(Ou: string) {
    let depdata = [];

    return (
      fetch(`${window.location.origin}:2023/adexplorer/getorgstr?ou=` + Ou)
        // return fetch(` http://smart:2023/adexplorer/getorgstr?ou=` + Ou)
        .then((response) => response.json())
        .then((data) => {
          depdata = data;
          return depdata;
        })
        .catch(() => {
          throw new Error(`error`);
        })
    );
  }
  getParentSiteTitle(): string {
    return this.description;
  }
  async post(url: string, postInformation, check = false): Promise<any> {
    const options: ISPHttpClientOptions = {
      headers: postInformation.headers,
      body: JSON.stringify(postInformation.body),
    };
    return this.context.spHttpClient
      .post(url, SPHttpClient.configurations.v1, options)
      .then(async (response: any): Promise<any> => {
        if (response.ok) {
          let jsonResponse = await response.json();

          let responseValue = {
            hasError: false,
            value: jsonResponse.value,
          };
          return responseValue;
        } else {
          let jsonResponse = await response.json();
          let error = {
            hasError: true,
            error: await jsonResponse.error,
          };
          return Promise.reject(error);
        }
      })
      .catch((error: any): void => {
        //console.error(error ? error.message : "");
        console.error(error);
        return error;
      });
  }
  getDepInfo = (depName: any): Promise<any> => {
    const queryParams: any = {
      queryParams: {
        AllowEmailAddresses: true,
        AllowMultipleEntities: false,
        AllUrlZones: false,
        MaximumEntitySuggestions: 5,
        PrincipalSource: 15,
        PrincipalType: 12,
        QueryString: depName,
      },
    };
    const url: string =
      this.webUrl +
      "/_api/SP.UI.ApplicationPages.ClientPeoplePickerWebServiceInterface.clientPeoplePickerSearchUser";
    const options: ISPHttpClientOptions = {
      headers: postHeader.headers,
      body: queryParams,
    };
    return this.post(url, options)
      .then((result) => {
        const resultKey = JSON.parse(result.value);

        let ensuruserParam: any;
        if (resultKey.length > 0) {
          ensuruserParam = { logonName: resultKey[0].Key };
        }

        return this.getFinalDepInfo(ensuruserParam);
      })
      .catch((err) => {
        throw new Error(err);
      });
  };

  getFinalDepInfo(data: any) {
    const url: string = this.webUrl + "/_api/web/ensureuser";
    const options: ISPHttpClientOptions = {
      headers: postHeader.headers,
      body: JSON.stringify(data),
    };
    return this.context.spHttpClient
      .post(url, SPHttpClient.configurations.v1, options)
      .then((response: any) => {
        if (response.hasOwnProperty("error")) {
          throw new Error("err on api");
        } else {
          return response
            .json()
            .then((json) => {
              return json;
            })
            .catch((err) => {
              return response;
            });
        }
      });
  }
}
