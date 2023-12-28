import * as React from "react";
import { ITaskPortalProps } from "./ITaskPortalProps";
import Tasks from "./Tasks";
import "./main.css";

export interface ITaskPortalState {}

export default class TaskPortal extends React.Component<
  ITaskPortalProps,
  ITaskPortalState
> {
  public componentDidMount(): void {}
  public render(): React.ReactElement<ITaskPortalProps> {
    return (
      <div>
        <Tasks context={this.props.context} />
      </div>
    );
  }
}
