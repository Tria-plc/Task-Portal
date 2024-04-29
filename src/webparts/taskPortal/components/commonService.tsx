import * as React from "react";

function renderStatus(param) {
  console.log(param);
  switch (param) {
    case "Pending":
      return <span className={`badge badge-primary`}>{localStorage.getItem("lang") === "am" ? "በመጠባበቅ ላይ" : "Pending"}</span>;
    case "In Progress":
      return <span className={`badge badge-primary`}>{localStorage.getItem("lang") === "am" ? "በሂደት ላይ" : "In Progress"}</span>;
    case "Reassigned":
      return <span className={`badge badge-success`}>{localStorage.getItem("lang") === "am" ? "እንደገና ተመድቧል" : "Reassigned"}</span>;
    case "Approved":
      return <span className={`badge badge-success`}>{localStorage.getItem("lang") === "am" ? "ጸድቋል" : "Approved"}</span>;
    case "Accepted":
      return <span className={`badge badge-success`}>{localStorage.getItem("lang") === "am" ? "ተቀባይነት አግኝቷል" : "Accepted"}</span>;
    case "Adjust":
      return <span className={`badge badge-warning`}>{localStorage.getItem("lang") === "am" ? "አስተካክል" : "Adjust"}</span>;
    case "Rejected":
      return <span className={`badge badge-danger`}>{localStorage.getItem("lang") === "am" ? "ውድቅ ተደርጓል" : "Rejected"}</span>;
    default:
      return <span className={`badge`}>{param}</span>;
  }
}

export { renderStatus };
