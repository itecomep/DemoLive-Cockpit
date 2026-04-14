import { Pipe, PipeTransform } from '@angular/core';
import { AbstractControl } from '@angular/forms';

@Pipe({
    name: 'otpInputKeys',
    standalone: true
})
export class OtpInputKeysPipe implements PipeTransform
{

  transform(value: { [key: string]: AbstractControl<any, any>; } | undefined, ...args: unknown[]): string[]
  {
    if (!value)
    {
      return [];
    }
    return Object.keys(value)
  }

}
