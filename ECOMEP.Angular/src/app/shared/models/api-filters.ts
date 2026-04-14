export class ApiFilter
{
  key!: string;
  value!: string;
  operator?: string = 'eq';
  valueType?: string = 'string';

  constructor(init?: Partial<ApiFilter>)
  {
    Object.assign(this, init);
  }
}
