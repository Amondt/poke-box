import { Component, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { ReducedPokemon } from '../../shared/reducedPokemon.model';
import { PokedexService } from '../pokedex.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort, Sort } from '@angular/material/sort';
import pokemonTypes from '../../shared/pokemonTypes.json';

export interface Stat {
    base_stat: number;
    name: string;
}

export interface Name {
    name: string;
    languageCode: string;
}

export interface Type {
    name: string;
    frName: string;
    color: string;
}

@Component({
    selector: 'app-pokemon-list',
    templateUrl: './pokemon-list.component.html',
    styleUrls: ['./pokemon-list.component.scss'],
})
export class PokemonListComponent implements OnInit {
    pokemonList = new MatTableDataSource<ReducedPokemon>([]);
    pokemonListSubscription: Subscription;
    sortedPokemonList: ReducedPokemon[];

    pokemonTypes = pokemonTypes;

    dataIsLoading = true;

    displayedColumns: string[] = [
        'order',
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

    @ViewChild(MatSort, { static: true }) sort: MatSort;
    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

    constructor(private pokedexService: PokedexService) {}

    ngOnInit(): void {
        console.log(this.pokemonTypes);

        this.pokemonList.paginator = this.paginator;
        this.paginator._intl.itemsPerPageLabel = 'Pokemons per page';

        this.pokemonList.sort = this.sort;

        this.pokemonList.filterPredicate = (
            data: ReducedPokemon,
            filter: string
        ) => {
            let reducedMatchString = `${data.order}${data.form}`;
            data.names.forEach((name: Name) => {
                reducedMatchString += name.name.trim().toLocaleLowerCase();
            });
            return reducedMatchString.includes(filter);
        };

        this.pokemonList.data = this.pokedexService.getPokemonList();
        if (this.pokemonList.data.length !== 0) this.dataIsLoading = false;

        this.pokemonListSubscription =
            this.pokedexService.pokemonListUpdated.subscribe(
                (pokemonList: ReducedPokemon[]) => {
                    this.pokemonList.data = pokemonList;
                    if (pokemonList.length !== 0) this.dataIsLoading = false;
                }
            );
    }

    applyFilter = (event: Event) => {
        const filterValue = (event.target as HTMLInputElement).value;
        this.pokemonList.filter = filterValue.trim().toLocaleLowerCase();

        if (this.pokemonList.paginator) {
            this.pokemonList.paginator.firstPage();
        }
    };

    sortData = (sort: Sort) => {
        const data = this.pokedexService.getPokemonList();

        if (!sort.active || sort.direction === '') {
            this.pokemonList.data = data;
            return;
        }

        this.pokemonList.data = data.sort(
            (a: ReducedPokemon, b: ReducedPokemon) => {
                const isAsc = sort.direction === 'asc';
                switch (sort.active) {
                    case 'order':
                        return this.compare(a.order, b.order, isAsc);
                    case 'name':
                        return this.compare(
                            this.getName(a.names, 'fr'),
                            this.getName(b.names, 'fr'),
                            isAsc
                        );
                    case 'total':
                        return this.compare(
                            this.getTotalStats(a.stats),
                            this.getTotalStats(b.stats),
                            isAsc
                        );
                    case 'hp':
                        return this.compare(
                            this.getSingleStat(a.stats, 'hp'),
                            this.getSingleStat(b.stats, 'hp'),
                            isAsc
                        );
                    case 'atk':
                        return this.compare(
                            this.getSingleStat(a.stats, 'attack'),
                            this.getSingleStat(b.stats, 'attack'),
                            isAsc
                        );
                    case 'def':
                        return this.compare(
                            this.getSingleStat(a.stats, 'defense'),
                            this.getSingleStat(b.stats, 'defense'),
                            isAsc
                        );
                    case 'spAtk':
                        return this.compare(
                            this.getSingleStat(a.stats, 'special-attack'),
                            this.getSingleStat(b.stats, 'special-attack'),
                            isAsc
                        );
                    case 'spDef':
                        return this.compare(
                            this.getSingleStat(a.stats, 'special-defense'),
                            this.getSingleStat(b.stats, 'special-defense'),
                            isAsc
                        );
                    case 'speed':
                        return this.compare(
                            this.getSingleStat(a.stats, 'speed'),
                            this.getSingleStat(b.stats, 'speed'),
                            isAsc
                        );
                    default:
                        return 0;
                }
            }
        );
    };

    compare = (a: number | string, b: number | string, isAsc: boolean) => {
        return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
    };

    getName = (names: Name[], languageCode: string) => {
        return names.find((name: Name) => name.languageCode === languageCode)!
            .name;
    };

    getSingleStat = (stats: Stat[], statName: string) => {
        return stats.find((stat) => stat.name === statName)!.base_stat;
    };

    getType = (type: string) => {
        return this.pokemonTypes.find(
            (singleType: Type) => singleType.name === type
        );
    };

    getTotalStats = (stats: Stat[]): number => {
        let total = 0;
        stats.forEach((stat: Stat) => {
            total += stat.base_stat;
        });

        return total;
    };
}
