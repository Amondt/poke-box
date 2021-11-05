import { Pipe, PipeTransform } from '@angular/core';
import { SingleName } from '../models/single-name.model';
import { SingleStat } from '../models/single-stat.model';

@Pipe({
    name: 'getSingleValue',
})
export class GetSingleValuePipe implements PipeTransform {
    transform(
        values: (SingleName | SingleStat)[],
        filter: string,
        type: string
    ): string | number {
        switch (type) {
            case 'name':
                return (
                    values.find((value) => {
                        return (value as SingleName).languageCode === filter;
                    }) as SingleName
                ).name;
            case 'stat':
                return (
                    values.find((value) => {
                        return (value as SingleStat).name === filter;
                    }) as SingleStat
                ).base_stat;
            // case ''
            default:
                return '';
        }
    }
}
