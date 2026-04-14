import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'mcvTruncateText',
    standalone: true
})
export class McvTruncateTextPipe implements PipeTransform {

  transform(value: string, length: number = 50, lineBreak:boolean=false): string {
    if(!value){
      return "";
    }
    let _result = value.length > length ? value.slice(0, length - 1) + "…" : value;
     return  lineBreak ?_result.split(/\r?\n/)[0]:_result;

  }
}