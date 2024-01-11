import * as React from "react";
import { Table } from "antd";

import TaskServices from "../services/TaskServices";
import { TaskColumns } from "./TaskColumns";
import { WebPartContext } from "@microsoft/sp-webpart-base";
export interface ITasksProps {
  context: WebPartContext;
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

  public taskService = new TaskServices(
    this.props.context,
    "Form Associated Tasks"
  );

  public componentDidMount(): void {
    this.setState({
      isLoading: true,
    });

    const viewFields = `<ViewFields>
                          <FieldRef Name='Id' />
                          <FieldRef Name='Title' />
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
      this.setState({ tasks: tasks.d.results, isLoading: false });
    });
  }

  rowClassNameFn = (record) => {
    if (record.isOpen === false) return "isOpen";
  };

  public render() {
    return (
      <Table
        columns={TaskColumns(this.taskService, this.props.context)}
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
