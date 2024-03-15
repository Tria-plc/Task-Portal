import { Button, Modal, Select } from "antd";
import * as React from "react";
import { WebPartContext } from "@microsoft/sp-webpart-base";
import { Popconfirm } from "antd";
import { getDepartments } from "./deptsAdFetch";
import TaskServices from "../services/TaskServices";
import SPService from "./SPServices";
const { Option } = Select;
export interface ITaskColumnsButtonsProps {
  data: any;
  service: TaskServices;
  context: WebPartContext;
  spService: SPService;
}

class TaskColumnsButtons extends React.Component<
  ITaskColumnsButtonsProps,
  {
    openLoading: boolean;
    showModal: boolean;
    selectedDepartment: string;
    departments: any[];
  }
> {
  public servicess = new SPService(this.props.context);

  public constructor(props) {
    super(props);

    this.state = {
      openLoading: false,
      showModal: false,
      selectedDepartment: "",
      departments: [],
    };
  }
  onReassignButtonClick = () => {
    this.setState({ showModal: true });
  };
  handleDepartmentChange = (value: string) => {
    this.setState({ selectedDepartment: value });
  };
  handleModalOk = () => {
    this.setState({ showModal: false });
  };
  private async fetchSiteTitle() {
    const siteTitle = await this.props.spService.getParentSiteTitle();
    return siteTitle;
  }
  componentDidMount() {
    console.log("  this.props.spService.servicess", this.servicess);
    console.log(
      " this.props.spService.description",
      this.props.spService.description
    );
    getDepartments(this.servicess, this.props.spService.description)
      .then((departments) => {
        console.log("departments", departments);
        this.setState({ departments });
      })
      .catch((error) => {
        console.error("Error fetching departments:", error.message);
      });
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
  handleModalCancel = () => {
    this.setState({ showModal: false });
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
  async componentDidUpdate(
    prevProps: ITaskColumnsButtonsProps,
    prevState: any
  ) {
    if (this.state.selectedDepartment !== prevState.selectedDepartment) {
      const userDep = await this.props.spService.getDepInfo(
        this.state.selectedDepartment
      );
      console.log("userDep", userDep);
      console.log("this.props", this.props);
      const prevAssignedToID = this.props.data.AssignedToId;
      console.log("prevAssignedTo", prevAssignedToID);
      this.props.service
        .updateItem(
          "Form Associated Tasks",
          {
            AssignedToId: userDep.Id,
            PreviouslyAssignedToId: prevAssignedToID,
          },
          this.props.data.Id
        )
        .then(() => {
          console.log("Item updated successfully");
        })
        .catch((error) => {
          console.error("Error updating item:", error.message);
        });
    }
  }

  onOpenButtonClick = () => {
    (async () => {
      await this.updateParentItemDetail();
    })();

    this.setState({ openLoading: true });

    setTimeout(() => {
      this.setState({ openLoading: false }, () => {
        window.open(this.props.data.Form_Link.Url);
      });
    }, 3000);
  };

  public render() {
    console.log("this.servicess", this.servicess);
    console.log("this.state.departments", this.state.departments);
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
          <Button
            onClick={this.onReassignButtonClick}
            style={{ marginRight: "5px" }}
          >
            Reassign
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
          <Modal
            title="Reassign Task"
            visible={this.state.showModal}
            onOk={this.handleModalOk}
            onCancel={this.handleModalCancel}
          >
            <p>Task Information: {this.props.data.TaskInfo}</p>

            <Select
              style={{ width: "100%" }}
              placeholder="Select Department"
              onChange={this.handleDepartmentChange}
            >
              {this.state.departments.map((department) => (
                <Option key={department.value} value={department.Name}>
                  {department.label}
                </Option>
              ))}
            </Select>
          </Modal>
        </div>
      )
    );
  }
}

export default TaskColumnsButtons;
