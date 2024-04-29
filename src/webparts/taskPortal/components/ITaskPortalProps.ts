import { WebPartContext } from "@microsoft/sp-webpart-base";
import SPService from "./SPServices";
export interface ITaskPortalProps {
  context: WebPartContext;
  spService: SPService;
}
