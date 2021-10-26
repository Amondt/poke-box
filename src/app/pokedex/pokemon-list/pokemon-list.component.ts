import { Component, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { ReducedPokemon } from '../../shared/reducedPokemon.model';
import { PokedexService } from '../pokedex.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

export interface Stat {
    base_stat: number;
    name: string;
}

@Component({
    selector: 'app-pokemon-list',
    templateUrl: './pokemon-list.component.html',
    styleUrls: ['./pokemon-list.component.scss'],
})
export class PokemonListComponent implements OnInit {
    pokemonList: ReducedPokemon[] = [];
    pokemonListSubscription!: Subscription;

    dataSource = new MatTableDataSource<ReducedPokemon>();
    displayedColumns: string[] = [
        'number',
        'name',
        'type',
        'total',
        'hp',
        'atk',
        'def',
        'spAtk',
        'spDef',
        'speed',
    ];

    @ViewChild(MatPaginator) paginator!: MatPaginator;

    constructor(private pokedexService: PokedexService) {}

    ngOnInit(): void {
        this.pokemonList = this.pokedexService.getPokemonList();
        this.pokemonListSubscription =
            this.pokedexService.pokemonListUpdated.subscribe(
                (pokemonList: ReducedPokemon[]) => {
                    this.pokemonList = pokemonList;
                    this.dataSource.data = pokemonList;
                }
            );

        console.log(this.pokemonList);
    }

    ngAfterViewInit() {
        this.dataSource.paginator = this.paginator;
        this.paginator._intl.itemsPerPageLabel = 'Pokemons per page';
    }

    getTotalStats = (stats: Stat[]): number => {
        let total = 0;
        stats.forEach((stat: Stat) => {
            total += stat.base_stat;
        });

        return total;
    };
}
