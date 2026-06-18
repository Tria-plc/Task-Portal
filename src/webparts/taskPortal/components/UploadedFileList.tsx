import * as React from "react";
import { Table } from "antd";
import UploadedFilesListAction from "./UploadedFilesListAction";

const columns = (words, service, ServerRelativeUrl, refreshPage) => [

  {
    // title: this.props.words.FileName,
    title: `${words.FileName}`,
    dataIndex: "FileLeafRef",
    width: "60%",
  },
  {
    //this.props.words.Action,
    title: `${words.Action}`,
    dataIndex: "",
    render: (text, props) => {
      return (
        <UploadedFilesListAction
          item={props}
          service={service}
          ServerRelativeUrl={ServerRelativeUrl}
          refreshPage={refreshPage}
          words={words}
        />
      );
    },
  },
];

export const UploadedFilesList = (props) => {
  return (
    <Table
      columns={columns(
        props.words,
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
