import {
    Component,
    EventEmitter,
    OnDestroy,
    OnInit,
    Output,
} from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { Subscription } from 'rxjs';

import { FilterValues } from 'src/app/shared/models/filter-values.model';
import { ReducedMove } from 'src/app/shared/models/reduced-move.model';
import { ReducedAbility } from 'src/app/shared/models/reduced-ability.model';

import { PokedexService } from '../../pokedex.service';

import pokemonTypes from '../../../shared/json/pokemonTypes.json';

@Component({
    selector: 'app-filters',
    templateUrl: './filters.component.html',
    styleUrls: ['./filters.component.scss'],
})
export class FiltersComponent implements OnInit, OnDestroy {
    movesList: ReducedMove[];
    movesListSubscription: Subscription;
    movesDataIsLoading = true;

    abilitiesList: ReducedAbility[];
    abilitiesListSubscription: Subscription;
    abilitiesDataIsLoading = true;

    @Output() applyFilters = new EventEmitter<{
        ['filterValues']: FilterValues;
        ['changedValue']: string;
    }>();

    pokemonTypes = pokemonTypes;

    filtersForm: FormGroup;

    constructor(
        private fb: FormBuilder,
        private pokedexService: PokedexService
    ) {}

    ngOnInit(): void {
        this.filtersForm = this.fb.group({
            searchBar: '',
            firstType: '',
            secondType: '',
            isFilters: this.fb.group({
                isBattleOnly: true,
                isMega: true,
                isLegendary: true,
                isMythical: true,
                isBaby: true,
            }),
            generationFilters: this.fb.group({
                generationI: true,
                generationII: true,
                generationIII: true,
                generationIV: true,
                generationV: true,
                generationVI: true,
                generationVII: true,
                generationVIII: true,
            }),
            hp: this.fb.group({
                value: null,
                comparisonSign: 'equal',
            }),
            attack: this.fb.group({
                value: null,
                comparisonSign: 'equal',
            }),
            defense: this.fb.group({
                value: null,
                comparisonSign: 'equal',
            }),
            speed: this.fb.group({
                value: null,
                comparisonSign: 'equal',
            }),
            'special-attack': this.fb.group({
                value: null,
                comparisonSign: 'equal',
            }),
            'special-defense': this.fb.group({
                value: null,
                comparisonSign: 'equal',
            }),
            firstMove: '',
            secondMove: '',
            ability: '',
        });

        console.log(this.filtersForm);

        this.movesList = this.pokedexService.getMovesList();
        if (this.movesList.length > 0) this.movesDataIsLoading = false;
        this.movesListSubscription =
            this.pokedexService.movesListUpdated.subscribe(
                (movesList: ReducedMove[]) => {
                    this.movesList = movesList;
                    if (this.movesList.length > 0)
                        this.movesDataIsLoading = false;
                }
            );

        this.abilitiesList = this.pokedexService.getAbilitiesList();
        if (this.abilitiesList.length > 0) this.abilitiesDataIsLoading = false;
        this.abilitiesListSubscription =
            this.pokedexService.abilitiesListUpdated.subscribe(
                (abilitiesList: ReducedAbility[]) => {
                    this.abilitiesList = abilitiesList;
                    if (this.abilitiesList.length > 0)
                        this.abilitiesDataIsLoading = false;
                }
            );
    }

    onFormReady = (name: string, form: FormGroup) => {
        this.filtersForm.setControl(name, form);
        console.log(this.filtersForm);
    };

    onApplyFilter = (changedValue: string) => {
        this.applyFilters.emit({
            filterValues: this.filtersForm.value,
            changedValue,
        });
    };

    ngOnDestroy() {
        this.movesListSubscription.unsubscribe();
        this.abilitiesListSubscription.unsubscribe();
    }
}
