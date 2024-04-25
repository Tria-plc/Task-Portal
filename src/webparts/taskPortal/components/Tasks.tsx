import * as React from "react";
import { Modal, Table } from "antd";
import TaskServices from "../services/TaskServices";
import { TaskColumns } from "./TaskColumns";
import SPService from "./SPServices";
import { WebPartContext } from "@microsoft/sp-webpart-base";
import { Button } from "antd";
import MyData from "./MyData";

// const styles = {
//   customTable: {
//     width: "100%",
//     margin: "20px",
//     border: "1px solid #e8e8e8",
//     borderRadius: "8px",
//     boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
//   },
//   tableHeader: {
//     backgroundColor: "#f0f0f0",
//     borderBottom: "2px solid #ddd",
//   },
//   evenRow: {
//     backgroundColor: "#f9f9f9",
//   },
//   hoverRow: {
//     backgroundColor: "#e6f7ff",
//     cursor: "pointer",
//   },
//   pagination: {
//     margin: "10px 0",
//     textAlign: "right",
//   },
// };

export interface ITasksProps {
  context: WebPartContext;
  spService: SPService;
}

export interface ITasksState {
  isLoading: boolean;
  tasks: any[];
  showSigntureModal: boolean;
}

class Tasks extends React.Component<ITasksProps, ITasksState> {
  public constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      tasks: [],
      showSigntureModal: false,
    };
  }

  public taskService = new TaskServices(
    this.props.context,
    "Form Associated Tasks"
  );

  public componentDidMount(): void {
    this.setState({
      isLoading: true,
    });

    this.getTasks();
  }

  rowClassNameFn = (record) => {
    if (record.isOpen === false) return "isOpen";
  };

  getTasks = () => {
    const viewFields = `<ViewFields>
                          <FieldRef Name='Id' />
                          <FieldRef Name='Title' />
                          <FieldRef Name='Message' />
                          <FieldRef Name='u36w' />
                          <FieldRef Name='AssignedToId' />
                          <FieldRef Name='AssignedTo' />
                          <FieldRef Name='Created' />
                          <FieldRef Name='Status' />
                          <FieldRef Name='Body' />
                          <FieldRef Name='Form_Link' />
                          <FieldRef Name='ParentItemId' />
                          <FieldRef Name='ParentListName' />
                        </ViewFields>`;

    this.taskService.getItems(null, viewFields).then((tasks) => {
      const result = tasks.d.results;

      this.setState({
        tasks: result,
        isLoading: false,
      });
    });
  };

  public render() {
    return (
      <div
        className="d-flex flex-column justify-content-center align-items-center mx-auto bg-white"
        style={{ width: "80%" }}
      >
        <div className="row p-2 w-100">
          <div className="col-4"></div>
          <h4 className="col-4 text-center">
            {localStorage.getItem("lang") === "am" ? "የእኔ ተግባራት" : "My Tasks"}
          </h4>
          <div className="col-4">
            <Button
              type="primary"
              onClick={() => {
                this.setState({ showSigntureModal: true });
              }}
              className="float-right"
            >
              {localStorage.getItem("lang") === "am"
                ? "የእኔ ፊርማ"
                : "My Signature"}
            </Button>
          </div>
        </div>
        <Table
          columns={TaskColumns(
            this.taskService,
            this.props.spService,
            this.props.context
          )}
          dataSource={this.state.tasks}
          loading={this.state.isLoading}
          rowClassName={this.rowClassNameFn}
          pagination={{
            defaultPageSize: 10,
            showSizeChanger: true,
            pageSizeOptions: ["10", "20", "30"],
          }}
          className="w-100"
        />

        <Modal
          visible={this.state.showSigntureModal}
          onCancel={() => this.setState({ showSigntureModal: false })}
          title={
            localStorage.getItem("lang") === "am" ? "የእኔ ፊርማ" : "My Signature"
          }
          width={1000}
          maskClosable={false}
          footer={[]}
        >
          <MyData
            context={this.props.context}
            spService={this.props.spService}
          />
        </Modal>
      </div>
    );
  }
}

export default Tasks;
