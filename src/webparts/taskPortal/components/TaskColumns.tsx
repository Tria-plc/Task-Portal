import * as React from "react";
import TaskServices from "../services/TaskServices";
import TaskColumnsButtons from "./TaskColumnsButtons";
import { renderStatus } from "./commonService";
import SPService from "./SPServices";
//import { getDepartments } from "./deptsAdFetch";

export const TaskColumns = (
  service: TaskServices,
  spService: SPService,
  words: any,
  context) => [
    {
      title: `${words.Title}`,
      dataIndex: "Title",
      render: (text, props) => {
        // return props.Title;
        return props.Message ? props.Message : props.u36w;
      },
    },
    {
      title: `${words.Date}`,
      dataIndex: "Created",
      render: (text, props) => {
        return new Date(props.Created).toLocaleDateString();
      },
    },
    {
      title: `${words.TaskStatus}`,
      dataIndex: "Status",
      render: (text, props) => {
        console.log("propsssssssss", props);
        return renderStatus(props.Status);
      },
    },
    {
      title: `${words.Action}`,
      dataIndex: "",
      render: (text, props) => {
        return (
          <TaskColumnsButtons
            service={service}
            data={props}
            context={context}
            spService={spService}
            words={words}
          />
        );
      },
    },
  ];
