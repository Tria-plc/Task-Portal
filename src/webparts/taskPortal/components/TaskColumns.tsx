import * as React from "react";
import TaskServices from "../services/TaskServices";
import TaskColumnsButtons from "./TaskColumnsButtons";
import { renderStatus } from "./commonService";
import SPService from "./SPServices";
import { getDepartments } from "./deptsAdFetch";

export const TaskColumns = (
  service: TaskServices,
  spService: SPService,
  context
) => [
  {
    title: `${localStorage.getItem("lang") === "am" ? "ርዕስ" : "Title"}`,
    dataIndex: "Title",
    render: (text, props) => {
      // return props.Title;
      return props.Message ? props.Message : props.u36w;
    },
  },
  {
    title: `${localStorage.getItem("lang") === "am" ? "ቀን" : "Date"}`,
    dataIndex: "Created",
    render: (text, props) => {
      return new Date(props.Created).toLocaleDateString();
    },
  },
  {
    title: `${localStorage.getItem("lang") === "am" ? "የተግባር ሁኔታ" : "Task Status"}`,
    dataIndex: "Status",
    render: (text, props) => {
      console.log("propsssssssss", props);
      return renderStatus(props.Status);
    },
  },
  {
    title: `${localStorage.getItem("lang") === "am" ? "ድርጊት" : "Action"}`,
    dataIndex: "",
    render: (text, props) => {
      return (
        <TaskColumnsButtons
          service={service}
          data={props}
          context={context}
          spService={spService}
        />
      );
    },
  },
];
