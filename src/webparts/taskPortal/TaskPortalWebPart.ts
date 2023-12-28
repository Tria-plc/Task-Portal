import * as React from "react";
import * as ReactDom from "react-dom";
import { Version } from "@microsoft/sp-core-library";
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField,
  PropertyPaneDropdown,
  IPropertyPaneDropdownOption,
} from "@microsoft/sp-webpart-base";

import { SPHttpClient, SPHttpClientResponse } from "@microsoft/sp-http";

import * as strings from "TaskPortalWebPartStrings";
import TaskPortal from "./components/TaskPortal";
import { ITaskPortalProps } from "./components/ITaskPortalProps";

export interface ITaskPortalWebPartProps {
  description: string;
  listId: any;
}

export default class TaskPortalWebPart extends BaseClientSideWebPart<ITaskPortalWebPartProps> {
  public isFirstLoad = "true";
  public listIdDropDownOptions = [];
  protected onInit(): Promise<void> {
    return this.fetchLists();
  }
  public render(): void {
    const element: React.ReactElement<ITaskPortalProps> = React.createElement(
      TaskPortal,
      {
        context: this.context,
        listId: this.properties.listId,
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse("1.0");
  }

  populateListIdProperty(data) {
    var listIdValues: IPropertyPaneDropdownOption[] = [];
    if (data.value.length > 0) {
      for (var i = 0; i < data.value.length; i++) {
        var list = data.value[i];
        // console.log(field);
        var dataa: IPropertyPaneDropdownOption = {
          key: list.Id,
          text: list.Title,
        };
        listIdValues.push(dataa);
      }
      this.listIdDropDownOptions = listIdValues;

      this.context.propertyPane.refresh();
      console.log("under populate list id property");
    }
  }

  fetchLists() {
    this.isFirstLoad = "false";
    const url: string =
      this.context.pageContext.site.absoluteUrl +
      `/_api/web/lists?$filter=(IsCatalog eq false and Hidden eq false)`;

    return this.context.spHttpClient
      .get(url, SPHttpClient.configurations.v1)
      .then((response: SPHttpClientResponse) => response.json())
      .then(
        (data) => {
          this.populateListIdProperty(data);
        },
        (error) => {
          console.error("Oops Error");
        }
      );
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription,
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneDropdown("listId", {
                  label: "Select a list edited",
                  options: this.listIdDropDownOptions,
                }),
              ],
            },
          ],
        },
      ],
    };
  }
}
