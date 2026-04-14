export class CityOption
{
  id!: string;
  city!: string;
  state!: string;
  country!: string;

  constructor(init?: Partial<CityOption>)
  {
    Object.assign(this, init);
  }
}

export class CountryCode
{
  country!: string;
  code!: string;

  constructor(init?: Partial<CountryCode>)
  {
    Object.assign(this, init);
  }
}

export class StateCode
{
  state!: string;
  tin!: string;
  stateCode!: string;

  constructor(init?: Partial<StateCode>)
  {
    Object.assign(this, init);
  }
}