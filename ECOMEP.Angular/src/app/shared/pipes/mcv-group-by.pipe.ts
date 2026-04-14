import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'mcvGroupBy',
    standalone: true
})
export class McvGroupByPipe implements PipeTransform
{
    transform(collection: any[], properties: string[], sortOrder: 'asc' | 'desc' = 'asc'): any
    {
        if (!collection)
        {
            return null;
        }

        const groupedResults = collection.reduce((groups, item) =>
        {
            const groupKey = properties.map(prop => item[prop]).join('-');
            groups[groupKey] = groups[groupKey] || [];
            groups[groupKey].push(item);
            return groups;
        }, {});

        const sortedKeys = Object.keys(groupedResults).sort();
        if (sortOrder === 'desc')
        {
            sortedKeys.reverse();
        }

        return sortedKeys.map(key => ({
            key,
            values: groupedResults[key]
        }));
    }
}
