import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ReducedPokemon } from '../shared/reducedPokemon.model';
import { PokedexService } from './pokedex.service';

@Component({
    selector: 'app-pokedex',
    templateUrl: './pokedex.component.html',
    styleUrls: ['./pokedex.component.scss'],
})
export class PokedexComponent implements OnInit {
    pokemonList: ReducedPokemon[] = [];
    pokemonListSubscription!: Subscription;

    constructor(private pokedexService: PokedexService) {}

    ngOnInit(): void {
        this.pokemonList = this.pokedexService.getPokemonList();
        this.pokemonListSubscription =
            this.pokedexService.pokemonListUpdated.subscribe(
                (pokemonList: ReducedPokemon[]) => {
                    this.pokemonList = pokemonList;
                }
            );
    }
}
