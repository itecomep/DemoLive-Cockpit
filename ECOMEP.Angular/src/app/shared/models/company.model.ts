import { BaseEntity } from "./base-entity.model";

export class Company extends BaseEntity {
  title!: string;
  initials!: string;
  vhrRate: number = 0;
  gstin?: string;
  gstStateCode?: string;
  pan?: string;
  tan?: string;
  udhyam?: string;
  logoUrl?: string;
  bank?: string;
  bankBranch?: string;
  bankIFSCCode?: string;
  swiftCode?: string;
  bankAccount?: string;
  address?: string;
  signStampUrl?: string;
}
