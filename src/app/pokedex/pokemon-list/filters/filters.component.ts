import {
    Component,
    EventEmitter,
    OnDestroy,
    OnInit,
    Output,
} from '@angular/core';
import pokemonTypes from '../../../shared/json/pokemonTypes.json';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { FilterValues } from 'src/app/shared/models/filter-values.model';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { ReducedMove } from 'src/app/shared/models/reduced-move.model';
import { Subscription } from 'rxjs';
import { PokedexService } from '../../pokedex.service';
import { SingleName } from 'src/app/shared/models/single-name.model';

@Component({
    selector: 'app-filters',
    templateUrl: './filters.component.html',
    styleUrls: ['./filters.component.scss'],
})
export class FiltersComponent implements OnInit, OnDestroy {
    movesList: ReducedMove[];
    movesListSubscription: Subscription;

    @Output() onApplyFilters = new EventEmitter<{
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
            statFilters: this.fb.group({
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
            }),
        });

        this.movesList = this.pokedexService.getMovesList();
        this.movesListSubscription =
            this.pokedexService.movesListUpdated.subscribe(
                (movesList: ReducedMove[]) => {
                    this.movesList = movesList;
                }
            );
    }

    controlCheckboxStatus = (group: string, type: string) => {
        const resArray = [];
        const object = (this.filtersForm.get(group) as FormGroup).value;
        for (const property in object) {
            resArray.push(object[property]);
        }
        if (type === 'indeterminate') {
            return (
                !resArray.every((res) => res === true) &&
                !resArray.every((res) => res === false)
            );
        } else {
            return (
                resArray.some((res) => res === true) ||
                !resArray.some((res) => res === false)
            );
        }
    };

    checkAll = (event: MatCheckboxChange, group: string) => {
        const formGroup = this.filtersForm.get(group) as FormGroup;
        for (const property in formGroup.value) {
            (formGroup.get(property) as FormControl).setValue(event.checked);
        }
        this.applyFilter(group);
    };

    applyFilter = (changedValue: string) => {
        const searchBar = <FormControl>this.filtersForm.get('searchBar');
        searchBar.setValue(searchBar.value.trim().toLocaleLowerCase());

        this.onApplyFilters.emit({
            filterValues: this.filtersForm.value,
            changedValue,
        });
    };

    ngOnDestroy() {
        this.movesListSubscription.unsubscribe();
    }
}
