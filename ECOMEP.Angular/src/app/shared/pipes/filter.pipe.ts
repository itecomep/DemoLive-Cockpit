import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter',
  standalone: true
})
export class FilterPipe implements PipeTransform {

  transform(items: any[], search: string): any[] {

    if (!items) return [];

    if (!search || search.trim() === '') {
      return items;
    }

    const term = search.toLowerCase();

    return items.filter(item =>
      item?.title?.toLowerCase().includes(term)
    );

  }

}