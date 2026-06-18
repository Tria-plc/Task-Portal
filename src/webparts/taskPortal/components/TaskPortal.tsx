import * as React from "react";
import { ITaskPortalProps } from "./ITaskPortalProps";
import Tasks from "./Tasks";
import SPService from "./SPServices";
import "./main.css";
import { English, Amharic } from "../services/words";

export default class TaskPortal extends React.Component<ITaskPortalProps, any> {
  private spService: SPService;

  constructor(props: ITaskPortalProps) {
    super(props);
    this.spService = new SPService(this.props.context);
  }

  public render(): React.ReactElement<ITaskPortalProps> {

    const lang = localStorage.getItem("lang")
    const words = lang == "am" ? Amharic : English

    return (
      <div className="w-100 text-center">
        <Tasks context={this.props.context} words={words} spService={this.spService} />
      </div>
    );
  }
}
