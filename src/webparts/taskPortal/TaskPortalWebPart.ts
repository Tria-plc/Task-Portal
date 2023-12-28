import * as React from "react";
import * as ReactDom from "react-dom";
import { Version } from "@microsoft/sp-core-library";
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
} from "@microsoft/sp-webpart-base";

import * as strings from "TaskPortalWebPartStrings";
import TaskPortal from "./components/TaskPortal";
import { ITaskPortalProps } from "./components/ITaskPortalProps";

export interface ITaskPortalWebPartProps {
  description: string;
  listId: any;
}

export default class TaskPortalWebPart extends BaseClientSideWebPart<ITaskPortalWebPartProps> {
  public render(): void {
    const element: React.ReactElement<ITaskPortalProps> = React.createElement(
      TaskPortal,
      {
        context: this.context,
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
              groupFields: [],
            },
          ],
        },
      ],
    };
  }
}
