import { WebPartContext } from "@microsoft/sp-webpart-base";
import {
  SPHttpClientResponse,
  SPHttpClient,
  ISPHttpClientOptions,
} from "@microsoft/sp-http";
import * as $ from "jquery";

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
  loggedUserId = this.context.pageContext.legacyPageContext.userId;

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

  getFormDigest(siteCollUrl = null) {
    let restUrl = `${this.webUrl}/_api/contextinfo`;
    if (siteCollUrl) {
      restUrl = `${siteCollUrl}/_api/contextinfo`;
    }

    return $.ajax({
      url: restUrl,
      type: "POST",
      headers: {
        Accept: "application/json;odata=verbose",
        "Content-Type": "application/json;odata=verbose",
      },
      data: "",
      success: function (data) {
        return data;
      },
      error: function (xhr) {
        console.log(xhr.status + ": " + xhr.statusText);
      },
    });
  }

  getFileBuffer(file) {
    var deferred = $.Deferred();
    var reader = new FileReader();
    reader.onloadend = function (e: any) {
      deferred.resolve(e.target.result);
    };
    reader.onerror = function (e: any) {
      deferred.reject(e.target.error);
    };
    reader.readAsArrayBuffer(file.originFileObj);
    return deferred.promise();
  }

  async postFileByServerRelativeUrl(serverRelativeUrl, file): Promise<any> {
    const fileName = file.name;

    const fetchedDigest = await this.getFormDigest();
    const formDigestValue =
      fetchedDigest.d.GetContextWebInformation.FormDigestValue;
    const url: string =
      this.webUrl +
      "/_api/web/getFolderByServerRelativeUrl('" +
      serverRelativeUrl +
      "')/files/add(url='" +
      fileName +
      "',overwrite=true)?$expand=ListItemAllFields";

    const arrayBuffer = await this.getFileBuffer(file);

    return $.ajax({
      url: url,
      type: "POST",
      headers: {
        accept: "application/json;odata=verbose",
        "X-RequestDigest": formDigestValue,
      },
      data: arrayBuffer,
      processData: false,
      success: function (data) {
        return data;
      },
      error: function (xhr) {
        throw new Error(`error`);
      },
    });
  }

  get(url: string, check: Boolean = false): Promise<any> {
    return this.context.spHttpClient
      .get(url, SPHttpClient.configurations.v1, {
        headers: getHeader.headers,
      })
      .then(async (response) => {
        return response.json().then((json) => {
          return json;
        });
      })
      .catch((err) => {
        return err;
      });
  }

  getFilteredItems(
    listName: string,
    query,
    siteUrl = this.webUrl
  ): Promise<any> {
    const url: string =
      siteUrl + "/_api/web/lists/getByTitle('" + listName + "')/items" + query;

    return this.get(url)
      .then((result) => {
        return result;
      })
      .catch((err) => {
        throw new Error(`error`);
      });
  }

  updateItem(listName: string, data: any, id, toJson = true): Promise<any> {
    const url: string =
      this.webUrl +
      "/_api/web/lists/getByTitle('" +
      listName +
      "')/items(" +
      id +
      ")";
    const options: ISPHttpClientOptions = {
      headers: updateHeader.headers,
      body: data,
    };
    return this.post(url, options, toJson)
      .then((result) => {
        return result;
      })
      .catch((err) => {
        throw err;
      });
  }

  deleteItem(listName: string, id, webUrl = this.webUrl) {
    const url: string =
      webUrl +
      "/_api/web/lists/getByTitle('" +
      listName +
      "')/items(" +
      id +
      ")";
    const options: ISPHttpClientOptions = {
      headers: deleteHeader.headers,
    };
    return this.context.spHttpClient
      .post(url, SPHttpClient.configurations.v1, options)
      .then((response) => {
        return response.json().catch((err) => {
          return response;
        });
      })
      .catch((err) => {
        throw new Error(err);
      });
  }

  getLibraryInformationByName(libraryName: string): Promise<any> {
    const restUrl = `${this.webUrl}/_api/web/folders?$filter=Name eq '${libraryName}'`;
    return this.get(restUrl)
      .then((json) => {
        return json;
      })
      .catch((err) => {
        return err;
      });
  }
}
