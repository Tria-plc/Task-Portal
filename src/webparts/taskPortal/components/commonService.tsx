import * as React from "react";

function renderStatus(param) {
  console.log(param);
  switch (param) {
    case "Pending":
      return <span className={`badge badge-primary`}>{param}</span>;
    case "In Progress":
      return <span className={`badge badge-primary`}>{param}</span>;
    case "Reassigned":
      return <span className={`badge badge-success`}>{param}</span>;
    case "Approved":
      return <span className={`badge badge-success`}>{param}</span>;
    case "Accepted":
      return <span className={`badge badge-success`}>{param}</span>;
    case "Adjust":
      return <span className={`badge badge-warning`}>{param}</span>;
    case "Rejected":
      return <span className={`badge badge-danger`}>{param}</span>;
    default:
      return <span className={`badge`}>{param}</span>;
  }
}

export { renderStatus };
