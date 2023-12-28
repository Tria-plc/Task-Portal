export const TaskColumns = [
  {
    title: "Date",
    dataIndex: "Created",
    render: (props) => {
      return new Date(props.Created).toLocaleDateString();
    },
  },
  {
    title: "Task",
    dataIndex: "TaskStatus",
  },
  {
    title: "",
    dataIndex: "",
  },
];
