import { McvComponentConfig } from "./mcv-component-config";

export class McvComponentDialogConfig extends McvComponentConfig
{
  dialogTitle!: string;
  dialogSubTitle!: string;
  projectID?: number;
  contactID?: number;
  isReadOnly: boolean = false;
}
