import { Pipe, PipeTransform } from '@angular/core';
import pokemonTypes from '../json/pokemonTypes.json';
import { SingleType } from '../models/single-type.model';

@Pipe({
    name: 'getTypeValue',
})
export class GetTypeValue implements PipeTransform {
    pokemonTypes = pokemonTypes;

    transform(filter: string, type: string): string {
        switch (type) {
            case 'color':
                return (
                    this.pokemonTypes.find((value) => {
                        return value.name === filter;
                    }) as SingleType
                ).color;
            case 'genericName':
                return (
                    this.pokemonTypes.find((value: SingleType) => {
                        return value.name === filter;
                    }) as SingleType
                ).name;
            case 'frName':
                return (
                    this.pokemonTypes.find((value: SingleType) => {
                        return value.name === filter;
                    }) as SingleType
                ).frName;
            default:
                return '';
        }
    }
}
