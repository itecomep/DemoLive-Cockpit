import { Pipe, PipeTransform } from '@angular/core';
import { orderBy } from 'lodash';

@Pipe({
    name: 'mcvSortBy',
    standalone: true
})
export class McvSortByPipe implements PipeTransform {

  transform(value: any[], column: string = '', order : 'asc'|'desc'='asc'): any[] {
    if (!value || !order) { return value; } // no array
    if (value.length <= 1) { return value; } // array with only one item
    if (!column || column === '') { 
      if(order==='asc'){return value.sort()}
      else{return value.sort().reverse();}
    } // sort 1d array
    return orderBy(value, [column], [order]);
  }
}