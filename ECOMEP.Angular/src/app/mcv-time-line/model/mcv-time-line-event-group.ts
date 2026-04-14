import * as uuid from 'uuid';
import { McvTimeLineEvent } from './mcv-time-line-events';

export class McvTimeLineEventGroup
{
  guid: string;
  title!: string;
  subTitle!: string;
  events: McvTimeLineEvent[] = [];
  avatarUrl?: string;
  resourceID!: string;
  viewDate: Date = new Date();
  groupType: 'resource' | 'week' = 'resource';

  constructor(
  )
  {
    this.guid = uuid.v4();
    this.events = [];
  }


}
