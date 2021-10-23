import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Pokemon } from '../shared/pokemon.model';
import { PokedexService } from './pokedex.service';

@Component({
    selector: 'app-pokedex',
    templateUrl: './pokedex.component.html',
    styleUrls: ['./pokedex.component.scss'],
})
export class PokedexComponent implements OnInit {
    pokemonList: Pokemon[] = [];
    pokemonListSubscription!: Subscription;

    constructor(private pokedexService: PokedexService) {}

    ngOnInit(): void {
        this.pokedexService.dbToBeUpdated().then((res) => {
            console.log(res);

            if (res) this.pokedexService.fetchPokemonList();
        });

        this.pokemonListSubscription =
            this.pokedexService.pokemonListUpdated.subscribe(
                (pokemonList: Pokemon[]) => {
                    this.pokemonList = pokemonList;
                }
            );

        this.pokemonList = this.pokedexService.getPokemonList();
    }
}
