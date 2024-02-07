import * as React from "react";
import { ITaskPortalProps } from "./ITaskPortalProps";
import Tasks from "./Tasks";
import SPService from "./SPServices"; // Import the SPService class
import "./main.css";

export interface ITaskPortalState {}

export default class TaskPortal extends React.Component<
  ITaskPortalProps,
  ITaskPortalState
> {
  private spService: SPService; // Declare an instance variable for SPService

  constructor(props: ITaskPortalProps) {
    super(props);

    // Create an instance of SPService and pass the WebPartContext
    this.spService = new SPService(this.props.context);
  }

  public componentDidMount(): void {}
  public render(): React.ReactElement<ITaskPortalProps> {
    return (
      <div className="w-100">
        <Tasks context={this.props.context} spService={this.spService} />
      </div>
    );
  }
}
