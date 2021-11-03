import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { ReducedPokemon } from '../../shared/reducedPokemon.model';
import { PokedexService } from '../pokedex.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort, Sort } from '@angular/material/sort';
import pokemonTypes from '../../shared/pokemonTypes.json';
import { FilterValues } from 'src/app/shared/filterValues.model';

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

    filterValues: FilterValues;

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

    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

    constructor(private pokedexService: PokedexService) {}

    ngOnInit(): void {
        this.pokemonList.paginator = this.paginator;
        this.paginator._intl.itemsPerPageLabel = 'Pokemons per page';

        this.pokemonList.sort = this.sort;

        this.pokemonList.filterPredicate = this.customFilterPredicate;

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

    applyFilters = (filterOptions: {
        filterValues: FilterValues;
        changedValue: string;
    }) => {
        const filterValues = filterOptions.filterValues;
        const changedValue = filterOptions.changedValue;
        this.filterValues = filterValues;
        this.pokemonList.filter = changedValue;

        console.log(
            changedValue,
            this.filterValues,
            this.pokemonList.filteredData
        );

        // this.pokemonList.filter = filterValues.searchBar;

        if (this.pokemonList.paginator) {
            this.pokemonList.paginator.firstPage();
        }
    };

    customFilterPredicate = (data: ReducedPokemon, changedValue: string) => {
        let reducedMatchString = `${data.order}${data.form}`;
        data.names.forEach((name: Name) => {
            reducedMatchString += name.name.trim().toLocaleLowerCase();
        });

        const searchBarMatch = reducedMatchString.includes(
            this.filterValues.searchBar
        );

        let typeMatch = true;
        if (
            this.filterValues.firstType !== '' &&
            this.filterValues.firstType !== undefined
        ) {
            typeMatch =
                typeMatch &&
                data.types.some(
                    (type: string) => type === this.filterValues.firstType
                );
        }
        if (
            this.filterValues.secondType !== '' &&
            this.filterValues.secondType !== undefined
        ) {
            typeMatch =
                typeMatch &&
                data.types.some(
                    (type: string) => type === this.filterValues.secondType
                );
        }

        console.log('type match', typeMatch);
        // if (
        //     this.filterValues.firstType !== '' &&
        //     this.filterValues.firstType !== undefined &&
        //     this.filterValues.secondType !== '' &&
        //     this.filterValues.secondType !== undefined
        // ) {
        //     console.log('2 types');
        //     const typesMatch = data.types[0]
        // } else if (

        // )
        // const firstTypeMatch =
        //     this.filterValues.firstType !== '' &&
        //     this.filterValues.firstType !== undefined
        //         ? data.types[0] === this.filterValues.firstType
        //         : true;

        // const secondTypeMatch =

        const globalMatch = searchBarMatch && typeMatch;

        console.log(globalMatch, data.name);

        return globalMatch;
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

        console.log(this.pokemonList.data);
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
