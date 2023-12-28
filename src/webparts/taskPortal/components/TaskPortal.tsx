import * as React from "react";
import { ITaskPortalProps } from "./ITaskPortalProps";
import Tasks from "./Tasks";

export interface ITaskPortalState {}

export default class TaskPortal extends React.Component<
  ITaskPortalProps,
  ITaskPortalState
> {
  public componentDidMount(): void {}
  public render(): React.ReactElement<ITaskPortalProps> {
    return (
      <div>
        <Tasks listId={this.props.listId} />
      </div>
    );
  }
}
