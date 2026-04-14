import { BaseEntity } from "src/app/shared/models/base-entity.model";


export class PermissionGroup extends BaseEntity {

       
    title!: string;
    roleCodes!: string[];

  constructor(init?: Partial<PermissionGroup>) {
    super(init);
    Object.assign(this, init);
  }
}

