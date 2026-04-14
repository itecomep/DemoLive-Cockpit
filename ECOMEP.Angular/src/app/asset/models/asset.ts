import { Contact } from "../../contact/models/contact";
import { BaseBlobEntity,BaseEntity } from "src/app/shared/models/base-entity.model";

export class Asset extends BaseEntity {
  title!: string;
  subtitle!: string;
  code!: string;
  codeFlag!: number;
  category!: string;
  cost: number = 0;
  quantity: number = 0;
  purchaseDate?: Date;
  validityDate?: Date;
  warrantyDate?: Date;
  isWarrantyExpired: boolean = false;
  isValidityExpired: boolean = false;
  availableQuantity: number = 0;
  attributes: AssetAttribute[] = [];
  attachments: AssetAttachment[] = [];
  vendors: AssetVendor[] = [];
  primaryAssets: AssetLink[] = [];
  secondaryAssets: AssetLink[] = [];
  schedules: AssetSchedule[] = [];

  constructor(init?: Partial<Asset>) {
    super(init);
    Object.assign(this, init);
  }
}

export class AssetLink extends BaseEntity {
  primaryAssetID!: number;
  primaryAsset!: Asset;
  secondaryAssetID!: number;
  secondaryAsset!: Asset;
}

export class AssetAttribute extends BaseEntity {
  assetID!: number;
  attributeKey?: string;
  attributeValue?: string;
  inputType!: string;
  isRequired: boolean = false;
  inputOptions!: string;
}

export class AssetAttachment extends BaseBlobEntity {
  assetID!: number;
  constructor(init?: Partial<AssetAttachment>) {
    super(init);
    Object.assign(this, init);
  }
}

export class AssetVendor extends BaseEntity {
  assetID!: number;
  contactID!: number;
  contact?: Contact;
  title?: string;
  constructor(init?: Partial<AssetVendor>) {
    super(init);
    Object.assign(this, init);
  }
}

export class AssetSchedule extends BaseEntity {
  assetID!: number;
  asset!: Asset;
  contactID!: number;
  contact?: Contact;
  category!: string;
  title?: string;
  isRepeat: boolean = false;
  cost: number = 0;
  cronExpression?: string;
  nextScheduleDate?: Date;
  startDate?: Date;
  endDate?: Date;
  resolutionMessage!:string;
  expenseID?: number;
  components: AssetScheduleComponentModel[] = [];
  attachments: AssetScheduleAttachment[] = [];

  constructor(init?: Partial<AssetSchedule>) {
    super(init);
    Object.assign(this, init);
  }
}

export class AssetScheduleComponentModel extends BaseEntity {
  component!: string;
  warrantyDate?: Date;
  cost!: number;
  scheduleID!: number;
}

export class AssetScheduleAttachment extends BaseBlobEntity {
  assetScheduleID!: number;
  constructor(init?: Partial<AssetScheduleAttachment>) {
    super(init);
    Object.assign(this, init);
  }
}