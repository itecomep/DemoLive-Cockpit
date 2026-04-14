import { DecimalPipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'mcvNonZero',
    standalone: true
})
export class McvNonZeroPipe extends DecimalPipe {

  // override transform(value: number, digitsInfo?: string, replaceChar: string = ''): any {
  //   return value != 0 ? super.transform(value, digitsInfo) : replaceChar;
  // }

}
