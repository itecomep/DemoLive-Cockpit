import { BaseEntity } from "src/app/shared/models/base-entity.model";
export class TimeLineGroup extends BaseEntity
{
  inputLabel: string | null = '';
  group: any[] = [];
}
