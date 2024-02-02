import { Button } from "antd";
import * as React from "react";
import { WebPartContext } from "@microsoft/sp-webpart-base";
import { Popconfirm } from "antd";

import TaskServices from "../services/TaskServices";
export interface ITaskColumnsButtonsProps {
  data: any;
  service: TaskServices;
  context: WebPartContext;
}

class TaskColumnsButtons extends React.Component<
  ITaskColumnsButtonsProps,
  {openLoading:boolean}
> {

  public constructor(props) {
    super(props);

    this.state = {
      openLoading:false
    };
  }

  updateParentItemDetail = async () => {
    await this.props.service.updateItem(
      this.props.data.ParentListName,
      {
        CurrentTaskId: this.props.data.Id,
      },
      this.props.data.ParentItemId
    );
  };

  claimTask = () => {
    this.props.service
      .updateItem(
        "Form Associated Tasks",
        {
          AssignedToId: this.props.context.pageContext.legacyPageContext.userId,
        },
        this.props.data.Id
      )
      .then(() => {
        window.location.reload();
      });
  };

  onOpenButtonClick = () => {
    (async () => {
      await this.updateParentItemDetail();
    })();

    this.setState({ openLoading: true });

    setTimeout(() => {
      this.setState({ openLoading: false },()=>{
        window.open(this.props.data.Form_Link.Url);
      });
    }, 3000);
  };

  public render() {
    return (
      this.props.data.Status === "In Progress" && (
        <div style={{ display: "flex", alignItems: "center" }}>
          <Button
            type="primary"
            onClick={this.onOpenButtonClick}
            style={{ marginRight: "5px" }}
            loading={this.state.openLoading}
          >
            Open
          </Button>

          {this.props.data.AssignedToId !==
            this.props.context.pageContext.legacyPageContext.userId && (
            <Popconfirm
              title="Are you sure？"
              okText="Yes"
              cancelText="No"
              onConfirm={this.claimTask}
            >
              <Button>Claim</Button>
            </Popconfirm>
          )}
        </div>
      )
    );
  }
}

export default TaskColumnsButtons;
