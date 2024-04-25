import * as React from "react";
import { Table } from "antd";
import UploadedFilesListAction from "./UploadedFilesListAction";

const columns = (service, ServerRelativeUrl, refreshPage) => [
  {
    title: `${localStorage.getItem("lang") === "am" ? "የመዝገብ ስም" : "File Name"}`,
    dataIndex: "FileLeafRef",
    width: "60%",
  },
  {
    title: `${localStorage.getItem("lang") === "am" ? "ድርጊት" : "Action"}`,
    dataIndex: "",
    render: (text, props) => {
      return (
        <UploadedFilesListAction
          item={props}
          service={service}
          ServerRelativeUrl={ServerRelativeUrl}
          refreshPage={refreshPage}
        />
      );
    },
  },
];

export const UploadedFilesList = (props) => {
  return (
    <Table
      columns={columns(
        props.service,
        props.ServerRelativeUrl,
        props.refreshPage
      )}
      dataSource={props.data}
      style={{ width: "100%" }}
      loading={props.loading}
      pagination={false}
    />
  );
};
