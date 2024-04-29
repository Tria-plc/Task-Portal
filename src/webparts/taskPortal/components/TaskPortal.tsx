import * as React from "react";
import { ITaskPortalProps } from "./ITaskPortalProps";
import Tasks from "./Tasks";
import SPService from "./SPServices";
import "./main.css";

export default class TaskPortal extends React.Component<ITaskPortalProps, any> {
  private spService: SPService;

  constructor(props: ITaskPortalProps) {
    super(props);
    this.spService = new SPService(this.props.context);
  }

  public render(): React.ReactElement<ITaskPortalProps> {
    return (
      <div className="w-100 text-center">
        <Tasks context={this.props.context} spService={this.spService} />
      </div>
    );
  }
}
