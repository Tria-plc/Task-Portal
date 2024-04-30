import * as React from "react";
import { Icon, message, Upload } from "antd";
const { Dragger } = Upload;

export interface IImageUploadProps {
  fileChangeHandler: Function;
  removeAttachment: Function;
  multiple: boolean;
  words: any;
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
          {this.props.words.DragFileToUpload}
        </p>
        <p className="ant-upload-hint">
          {this.props.words.SupportSingleBulkUpload}
          {this.props.words.CompanyDataOrFiles}
        </p>
      </Dragger>
    );
  }
}

export default ImageUpload;
