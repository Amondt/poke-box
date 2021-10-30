import { Injectable } from '@angular/core';
// declare var require: any;
// @ts-ignore: TS2591
const Pokedex = require('pokeapi-js-wrapper');

@Injectable({ providedIn: 'root' })
export class PokeapiWrapperService {
    customOptions = {
        timeout: 100 * 1000, // 5s
    };
    pokeAPIWrapper = new Pokedex.Pokedex(this.customOptions);

    getPokemonsList = async (offset = 0, limit = 100000) => {
        const pokemonList = await this.pokeAPIWrapper.getPokemonsList({
            offset,
            limit,
        });
        return pokemonList;
    };

    getPokemonByName = async (names: string | string[]) => {
        return await this.pokeAPIWrapper.getPokemonByName(names);
    };

    getPokemonSpeciesByName = async (names: string | string[]) => {
        return await this.pokeAPIWrapper.getPokemonSpeciesByName(names);
    };
}
