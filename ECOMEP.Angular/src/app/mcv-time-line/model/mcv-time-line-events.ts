import * as uuid from 'uuid';

export class McvTimeLineEvent
{
  guid: string;
  id!: string;
  title: string;
  subTitle!: string;
  start: Date;
  end: Date;
  actualStart: Date = new Date();
  actualEnd: Date = new Date();
  resourceID!: string;
  resourceTitle!: string;
  resourceSubTitle!: string;
  avatarUrl?: string;
  eventData: any;
  entityID!: string;
  entityTitle!: string;
  entity!: string;
  entityLabel!: string;
  position = 0;
  width = 0;
  rowIndex = 0;
  isOverlapped: boolean = false;
  isSlim: boolean = false;
  colorClass!: string;
  status!: string;
  moveDirection: 'vertical' | 'horizontal' | 'both' | 'none' = 'horizontal';
  resizeDirection: 'left' | 'right' | 'both' | 'none' = 'both';
  editMode: 'pre' | 'post' | 'both' | 'none' = 'both';
  eventType: 'Task' | 'Time' | 'Holiday' = 'Time';

  taskDue: Date = new Date();
  taskCompleted: Date = new Date();
  taskChildren: any[] = [];

  children: McvTimeLineEvent[] = [];
  parentGuid!: string;
  isLive: boolean = false;

  constructor()
  {
    this.guid = uuid.v4();
    this.title = 'New event';
    this.start = new Date();
    this.end = new Date();
    this.end.setHours(this.start.getHours() + 1);
    this.rowIndex = 0;
    this.children = [];
  }


}
