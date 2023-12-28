import { Button } from "antd";
import * as React from "react";
import TaskServices from "../services/TaskServices";
import { WebPartContext } from "@microsoft/sp-webpart-base";
export interface ITaskColumnsButtonsProps {
  data: any;
  service: TaskServices;
  context: WebPartContext;
}

class TaskColumnsButtons extends React.Component<
  ITaskColumnsButtonsProps,
  any
> {
  updateParentItemDetail = () => {
    this.props.service
      .updateItem(
        this.props.data.ParentListName,
        {
          CurrentTaskId: this.props.data.Id,
        },
        this.props.data.ParentItemId
      )
      .then(() => {});
  };

  claimTask = () => {
    this.props.service
      .updateItem(
        this.props.data.ParentListName,
        {
          AssignedToId: this.props.context.pageContext.legacyPageContext.userId,
        },
        this.props.data.ParentItemId
      )
      .then(() => {
        window.location.reload();
      });
  };

  onOpenButtonClick = () => {
    window.open(this.props.data.Form_Link.Url);
    this.updateParentItemDetail();
  };

  public render() {
    return (
      this.props.data.Status === "In Progress" && (
        <div style={{ display: "flex", alignItems: "center" }}>
          <Button
            type="primary"
            onClick={this.onOpenButtonClick}
            style={{ marginRight: "5px" }}
          >
            Open
          </Button>
          {this.props.data.AssignedToId !==
            this.props.context.pageContext.legacyPageContext.userId && (
            <Button type="ghost" onClick={this.claimTask}>
              Claim
            </Button>
          )}
        </div>
      )
    );
  }
}

export default TaskColumnsButtons;
