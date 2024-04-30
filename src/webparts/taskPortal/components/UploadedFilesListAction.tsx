import { Modal, Button, message } from "antd";
import * as React from "react";
import SPService from "./SPServices";
import { CopyToClipboard } from "react-copy-to-clipboard";

export interface IUploadFileListActionProps {
  service: SPService;
  item: any;
  ServerRelativeUrl: any;
  refreshPage: any;
  words: any;
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
            message.success(this.props.words.LinkCopied);
          }}
        >
          <Button type="primary">
            {/*this.props.words.CopyLink */}
            {this.props.words.CopyLink}

          </Button>
        </CopyToClipboard>
        <a
          className="mx-2"
          href={`${this.props.item.EncodedAbsUrl}?web=0`}
          target="_blank"
        >
          {this.props.words.View}

        </a>
        <a
          className="mx-2"
          onClick={() => {
            this.setState({
              showDeleteConfirmation: true,
            });
          }}
        >
          {this.props.words.Delete}

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
              {this.props.words.Cancel}

            </Button>,
            <Button type="danger" onClick={this.deleteAttachment}>
              {this.props.words.Delete}

            </Button>,
          ]}
          destroyOnClose={true}
        >
          {/*
            this.props.words.deleteSignature
        */}
          {this.props.words.deleteSignature}
        </Modal>
      </div>
    );
  }
}

export default UploadedFilesListAction;
