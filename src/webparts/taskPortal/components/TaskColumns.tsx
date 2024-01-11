import * as React from "react";
import TaskServices from "../services/TaskServices";
import TaskColumnsButtons from "./TaskColumnsButtons";
import { renderStatus } from "./commonService";

export const TaskColumns = (service: TaskServices, context) => [
  {
    title: "Title",
    dataIndex: "Title",
    render: (text, props) => {
      return props.Title;
    },
  },
  {
    title: "Date",
    dataIndex: "Created",
    render: (text, props) => {
      return new Date(props.Created).toLocaleDateString();
    },
  },
  {
    title: "Task Status",
    dataIndex: "Status",
    render: (text, props) => {
      console.log(props);
      return renderStatus(props.Status);
    },
  },
  {
    title: "Action",
    dataIndex: "",
    render: (text, props) => {
      return (
        <TaskColumnsButtons service={service} data={props} context={context} />
      );
    },
  },
];
