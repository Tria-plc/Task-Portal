import * as React from "react";
import { Modal, Table } from "antd";
import SPService from "./SPServices";
import { WebPartContext } from "@microsoft/sp-webpart-base";
import { UploadedFilesList } from "./UploadedFileList";
import { Button } from "antd";
import ImageUpload from "./ImageDragger";
export interface IMyDataProps {
  context: WebPartContext;
  spService: SPService;
}

export interface IMyDataState {
  files: any[];
  loading: boolean;
  showUploadModal: boolean;
  documentLibraryDetails: any;
}

class MyData extends React.Component<IMyDataProps, IMyDataState> {
  public constructor(props) {
    super(props);

    this.state = {
      files: [],
      loading: true,
      showUploadModal: false,
      documentLibraryDetails: null,
    };

    this.uploadNewSignature = this.uploadNewSignature.bind(this);
  }

  componentDidMount(): void {
    this.getLibraryDetails();
  }

  async getLibraryDetails() {
    await this.props.spService
      .getLibraryInformationByName("Form Signatures")
      .then((res) => {
        console.log("library details", res);
        this.setState({
          documentLibraryDetails: res.value[0],
        });
      });

    this.getFiles();
  }

  public getFiles() {
    this.props.spService
      .getFilteredItems(
        "Form Signatures",
        `?$filter=AuthorId eq ${this.props.spService.loggedUserId}&$select=*,FileLeafRef,EncodedAbsUrl`
      )
      .then((res) => {
        console.log("signatures", res);

        this.setState({
          files: res.value,
          loading: false,
        });
      });
  }

  fileChangeHandler = (file) => {
    const files = this.state.files;
    files.push(file);
    this.setState({ files: files });
  };

  async uploadNewSignature() {
    const file = this.state.files[0];
    console.log("file", file);

    const username = this.props.spService.webLoginName;

    this.props.spService
      .postFileByServerRelativeUrl(
        this.state.documentLibraryDetails.ServerRelativeUrl,
        file,
        `${username.split("\\")[1]}.${
          file.name.split(".")[file.name.split(".").length - 1]
        }`
      )
      .then(() => {
        this.setState({ showUploadModal: false });
        this.refreshPage();
      });
  }

  refreshPage = () => {
    this.setState({ loading: true });
    this.getFiles();
  };

  public render() {
    return (
      <div className="mx-auto bg-white">
        {this.state.files && this.state.files.length > 0 ? (
          <UploadedFilesList
            service={this.props.spService}
            data={this.state.files}
            ServerRelativeUrl={
              this.state.documentLibraryDetails.ServerRelativeUrl
            }
            loading={this.state.loading}
            refreshPage={this.refreshPage}
          />
        ) : (
          <div
            style={{ width: "50%" }}
            className="d-flex flex-column justify-content-center align-items-center mx-auto"
          >
            <small className="text-danger">
            {localStorage.getItem("lang") === "am" ? "ምንም ፊርማ አልሰቀሉም!" : "You haven't uploaded any signature!"}
            </small>
            <Button
              icon="file-add"
              onClick={() => {
                this.setState({ showUploadModal: true });
              }}
              className="mt-2"
            >
              {localStorage.getItem("lang") === "am" ? "ሰቀላ ፊርማ" : "Upload Signature"}
            </Button>
          </div>
        )}

        <Modal
          visible={this.state.showUploadModal}
          onCancel={() => this.setState({ showUploadModal: false })}
          title={`${localStorage.getItem("lang") === "am" ? "አዲስ ፊርማ ስቀል" : "Upload New Signature"}`}
          width={1000}
          maskClosable={false}
          onOk={this.uploadNewSignature}
          okText="Save"
        >
          <ImageUpload
            fileChangeHandler={this.fileChangeHandler}
            removeAttachment={(event) => {
              this.setState({ files: [] });
            }}
            multiple={false}
          />
        </Modal>
      </div>
    );
  }
}

export default MyData;
