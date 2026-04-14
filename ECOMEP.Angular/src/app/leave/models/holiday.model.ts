import { BaseEntity } from "src/app/shared/models/base-entity.model";

export class Holiday extends BaseEntity {
  title!: string;
  holidayDate!: Date;

  constructor(init?: Partial<Holiday>) {
    super(init);
    Object.assign(this, init);
  }
}
