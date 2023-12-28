import { WebPartContext } from "@microsoft/sp-webpart-base";
import * as $ from "jquery";
import { SPHttpClient } from "@microsoft/sp-http";

const updateHeader = {
  headers: {
    "content-type": "application/json;odata.metadata=full",
    accept: "application/json;odata.metadata=full",
    "X-HTTP-Method": "MERGE",
    "IF-MATCH": "*",
  },
};

class TaskServices {
  public constructor(
    private context: WebPartContext,
    private listTitle: string
  ) {}

  webUrl = this.context.pageContext.web.absoluteUrl;

  async getItems(extraFilter?: string, viewFields?: string) {
    let viewXml;
    if (extraFilter) {
      viewXml = `<View><Query><OrderBy><FieldRef Name='Created' Ascending='FALSE' /></OrderBy><Where><And><Or><Eq><FieldRef Name='AssignedTo' /><Value Type='Integer'><UserID/></Value></Eq><Membership Type='CurrentUserGroups'><FieldRef Name='AssignedTo' /></Membership></Or>${extraFilter}</And></Where></Query>${
        viewFields ? viewFields : ""
      }</View>`;
    } else
      viewXml = `<View><Query><OrderBy><FieldRef Name='Created' Ascending='FALSE' /></OrderBy><Where><Or><Eq><FieldRef Name='AssignedTo' /><Value Type='Integer'><UserID/></Value></Eq><Membership Type='CurrentUserGroups'><FieldRef Name='AssignedTo' /></Membership></Or></Where></Query>${
        viewFields ? viewFields : ""
      }</View>`;

    const fetchedDigest = await this.getFormDigest(this.webUrl);
    const formDigestValue =
      fetchedDigest.d.GetContextWebInformation.FormDigestValue;
    const tempPromise: any = new Promise(async (resolve, reject) => {
      return $.ajax({
        url: `${this.webUrl}/_api/web/lists/getByTitle('${this.listTitle}')/getitems`,
        method: "POST",
        data:
          "{ 'query' : {'__metadata': { 'type': 'SP.CamlQuery' }, \"ViewXml\": \"" +
          viewXml +
          '" }}',

        headers: {
          Accept: "application/json; odata=verbose",
          "content-type": "application/json; odata=verbose",
          "X-RequestDigest": formDigestValue,
        },
        success: (data) => {
          resolve(data);
        },
        error: function (error) {
          reject(error);
        },
      });
    });
    return await tempPromise;
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

  updateItem(listName: string, data: any, id, webUrl = this.webUrl) {
    const url: string =
      webUrl +
      "/_api/web/lists/getByTitle('" +
      listName +
      "')/items(" +
      id +
      ")";

    const options = {
      headers: updateHeader.headers,
      body: JSON.stringify(data),
    };
    return this.context.spHttpClient
      .post(url, SPHttpClient.configurations.v1, options)
      .then((result) => {
        return result;
      })
      .catch((err) => {
        throw new Error(`error`);
      });
  }
}

export default TaskServices;
