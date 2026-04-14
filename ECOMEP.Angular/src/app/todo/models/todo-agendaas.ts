import { BaseEntity } from "src/app/shared/models/base-entity.model";


export class TodoAgenda extends BaseEntity
{
  title!: string;
  comment!: string;
  todoID: number = 0;
  constructor()
  {
    super();
  }
}
