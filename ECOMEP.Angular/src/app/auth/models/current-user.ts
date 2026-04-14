import { ContactTeam } from "src/app/contact/models/contact-team.model";
import { Contact } from "../../contact/models/contact";

export class CurrentUserStore
{
  username!: string;
  isChangePassword: boolean = false;
  agreementFlag: number = 0;
  token!: string;
  roles: string[] = [];
  refreshToken!: string;
  isAuth: boolean = false;
  contact!: Contact;
  sessionID!: string;
  isOTPRequired: boolean = false;
  teams:ContactTeam[]=[];
  userId?: string;
  isOutsideIP?: boolean;
  allowedModules?: string[];
}
