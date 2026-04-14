import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'mcvManHour',
    standalone: true
})
export class McvManHourPipe implements PipeTransform {

  transform(value: number, includeMinutes: boolean=true): any {
    // console.log('pipeValue',value);
    return this.convert(value,includeMinutes);
  }

  convert(value:number,includeMinutes:boolean){
    const sign = value < 0 ? "-" : "";
    const hr = Math.floor(Math.abs(value));
    const min = Math.floor((Math.abs(value) * 60) % 60);
    return includeMinutes?sign + (hr < 10 ? "0" : "") + hr + "h " + (min < 10 ? "0" : "") + min+ 'm':sign + (hr < 10 ? "0" : "") + hr + "h";
   }
}
