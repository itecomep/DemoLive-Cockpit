import { ApiFilter } from "src/app/shared/models/api-filters";

export class PagedListConfig
{
  searchKey: string | any = '';
  sort!: string;
  filters: ApiFilter[] = [];
  route!: string;
  showAll: boolean = false;
  showAssigned: boolean = false;
  pageSize: number = 30;
  groupBy: string[] = [];
  keyPropertyName: string | string[] = '';
  pageIndex: number = 0;
  odataFilter: string = '';

  constructor(init?: Partial<PagedListConfig>)
  {
    Object.assign(this, init);
  }
}
