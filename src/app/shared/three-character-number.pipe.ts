import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'threeCharacterNumber',
})
export class ThreeCharacterNumber implements PipeTransform {
    transform(value: number) {
        return ('00' + value).slice(-3);
    }
}
