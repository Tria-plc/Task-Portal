import * as React from "react";
import { Icon, message, Upload } from "antd";
const { Dragger } = Upload;

export interface IImageUploadProps {
  fileChangeHandler: Function;
  removeAttachment: Function;
  multiple: boolean;
}

class ImageUpload extends React.Component<IImageUploadProps> {
  public render() {
    return (
      <Dragger
        multiple={this.props.multiple}
        onChange={(info) => {
          const { status } = info.file;
          if (status === "done") {
            message.success(`${info.file.name} file uploaded successfully.`);
            this.props.fileChangeHandler(info.file);
          } else if (status === "error") {
            message.error(`${info.file.name} file upload failed.`);
          }
        }}
        onRemove={(file) => {
          this.props.removeAttachment(file);
        }}
      >
        <p className="ant-upload-drag-icon">
          <Icon type="inbox" />
        </p>
        <p className="ant-upload-text">
          {localStorage.getItem("lang") === "am"
            ? "ለመስቀል ፋይሉን ጠቅ ያድርጉ ወይም ወደዚህ አካባቢ ይጎትቱት"
            : "Click or Drag File To This Area To Upload"}
        </p>
        <p className="ant-upload-hint">
          {localStorage.getItem("lang") === "am"
            ? "ለአንድ ነጠላ ወይም ለጅምላ ጭነት ድጋፍ። መስቀልን በጥብቅ ይከለክላል"
            : "Support For a Single Or Bulk Upload. Strictly Prohibit From Uploading"}
          {localStorage.getItem("lang") === "am"
            ? "የኩባንያ ውሂብ ወይም ሌላ ባንድ ፋይሎች"
            : "Company Data Or Other Band Files"}
        </p>
      </Dragger>
    );
  }
}

export default ImageUpload;
