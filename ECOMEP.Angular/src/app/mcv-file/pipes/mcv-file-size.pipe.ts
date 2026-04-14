import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'mcvFileSize',
    standalone: true
})
export class McvFileSizePipe implements PipeTransform
{

  transform(value: any, args?: any): any
  {
    return this.convert(value);
  }

  convert(value: number)
  {
    let s = value;
    const format = ['bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB'];
    let i = 0;
    while (i < format.length && s >= 1024)
    {
      s = s / 1024.0;
      i++;
    }
    const result = s.toFixed(2);
    return `${result} ${format[i]}`;
  }
}
