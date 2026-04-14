export class McvElasticEvent
{
  action!: string;
  type!: string;
  id!: string;
  x: number = 0;
  y: number = 0;
  direction: 'move' | 'left' | 'right' | 'top' | 'bottom' = 'top';
  left: number = 0;
  top: number = 0;
  width: number = 0;
  height: number = 0;
}
