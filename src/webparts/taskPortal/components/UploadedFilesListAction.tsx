import { Modal, Button, message } from "antd";
import * as React from "react";
import SPService from "./SPServices";
import { CopyToClipboard } from "react-copy-to-clipboard";

export interface IUploadFileListActionProps {
  service: SPService;
  item: any;
  ServerRelativeUrl: any;
  refreshPage: any;
}

export interface IUploadFileListActionState {
  showDeleteConfirmation: boolean;
  signatureLink: any;
}

class UploadedFilesListAction extends React.Component<
  IUploadFileListActionProps,
  IUploadFileListActionState
> {
  public constructor(props: IUploadFileListActionProps) {
    super(props);
    this.state = {
      showDeleteConfirmation: false,
      signatureLink: null,
    };
  }

  componentDidMount(): void {
    const link = `${window.location.origin}${this.props.ServerRelativeUrl}/${this.props.item.FileLeafRef}`;
    this.setState({ signatureLink: link });
  }

  deleteAttachment = async () => {
    this.props.service
      .deleteItem("Form Signatures", this.props.item.Id)
      .then(() => {
        this.setState({ showDeleteConfirmation: false });
        this.props.refreshPage();
      });
  };

  public render() {
    return (
      <div className="d-flex align-items-center">
        <CopyToClipboard
          text={this.state.signatureLink}
          onCopy={() => {
            message.success("Link Copied!");
          }}
        >
          <Button type="primary">{localStorage.getItem("lang") === "am" ? "አገናኝ ቅዳ" : "Copy Link"}</Button>
        </CopyToClipboard>
        <a
          className="mx-2"
          href={`${this.props.item.EncodedAbsUrl}?web=0`}
          target="_blank"
        >
          {localStorage.getItem("lang") === "am" ? "ይመልከቱ" : "View"}
        </a>
        <a
          className="mx-2"
          onClick={() => {
            this.setState({
              showDeleteConfirmation: true,
            });
          }}
        >
          {localStorage.getItem("lang") === "am" ? "ሰርዝ" : "Delete"}
        </a>

        <Modal
          visible={this.state.showDeleteConfirmation}
          onCancel={() => {
            this.setState({
              showDeleteConfirmation: false,
            });
          }}
          title={null}
          footer={[
            <Button
              onClick={() => {
                this.setState({
                  showDeleteConfirmation: false,
                });
              }}
            >
              ${localStorage.getItem("lang") === "am" ? "ሰርዝ" : "Cancel"}
            </Button>,
            <Button type="danger" onClick={this.deleteAttachment}>
              {localStorage.getItem("lang") === "am" ? "ሰርዝ" : "Delete"}
            </Button>,
          ]}
          destroyOnClose={true}
        >
          {localStorage.getItem("lang") === "am" ? "ፊርማ ይሰረዝ?" : "Delete Signature ?"}
        </Modal>
      </div>
    );
  }
}

export default UploadedFilesListAction;
