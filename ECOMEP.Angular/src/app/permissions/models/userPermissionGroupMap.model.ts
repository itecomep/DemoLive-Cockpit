import { BaseEntity } from "src/app/shared/models/base-entity.model";


export class UserPermissionGroupMap extends BaseEntity {

       
    userID!: number;
    permissionGroupID!: number;

  constructor(init?: Partial<UserPermissionGroupMap>) {
    super(init);
    Object.assign(this, init);
  }
}

