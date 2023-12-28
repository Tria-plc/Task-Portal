import * as React from "react";
import { Table } from "antd";

import TaskServices from "../services/TaskServices";
import { TaskColumns } from "./TaskColumns";
export interface ITasksProps {
  listId: any;
}

export interface ITasksState {
  tasks: any[];
  isLoading: boolean;
}

class Tasks extends React.Component<ITasksProps, ITasksState> {
  public constructor(props) {
    super(props);

    this.state = {
      tasks: null,
      isLoading: false,
    };
  }

  public taskService = new TaskServices(this.props.listId);

  public componentDidMount(): void {
    this.setState({
      isLoading: true,
    });

    const viewFields = `<ViewFields>
                          <FieldRef Name='Id' />
                          <FieldRef Name='Created' />
                          <FieldRef Name='TaskStatus' />
                          <FieldRef Name='Reassign_x0020_Remark' />
                        </ViewFields>`;
    this.taskService.getItems(null, viewFields).then((tasks) => {
      this.setState({ tasks, isLoading: false });
    });
  }

  rowClassNameFn = (record) => {
    if (record.isOpen === false) return "isOpen";
  };

  public render() {
    return (
      <Table
        columns={TaskColumns}
        dataSource={this.state.tasks}
        loading={this.state.isLoading}
        rowClassName={this.rowClassNameFn}
        pagination={{
          defaultPageSize: 10,
          showSizeChanger: true,
          pageSizeOptions: ["10", "20", "30"],
        }}
      />
    );
  }
}

export default Tasks;
