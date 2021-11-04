import { Pipe, PipeTransform } from '@angular/core';
import { SingleStat } from '../models/single-stat.model';

@Pipe({
    name: 'getTotalStats',
})
export class GetTotalStats implements PipeTransform {
    transform(stats: SingleStat[]): number {
        return stats.reduce(
            (accumulator: number, current: SingleStat) =>
                accumulator + current.base_stat,
            0
        );
    }
}
