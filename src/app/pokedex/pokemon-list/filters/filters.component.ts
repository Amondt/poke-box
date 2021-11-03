import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import pokemonTypes from '../../../shared/pokemonTypes.json';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { FilterValues } from 'src/app/shared/filterValues.model';

@Component({
    selector: 'app-filters',
    templateUrl: './filters.component.html',
    styleUrls: ['./filters.component.scss'],
})
export class FiltersComponent implements OnInit {
    @Output() onApplyFilters = new EventEmitter<{
        ['filterValues']: FilterValues;
        ['changedValue']: string;
    }>();

    pokemonTypes = pokemonTypes;

    filtersForm: FormGroup;

    constructor(private fb: FormBuilder) {}

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
        });

        console.log(this.filtersForm.value);
    }

    applyFilter = (changedValue: string) => {
        const searchBar = <FormControl>this.filtersForm.get('searchBar');
        searchBar.setValue(searchBar.value.trim().toLocaleLowerCase());

        this.onApplyFilters.emit({
            filterValues: this.filtersForm.value,
            changedValue,
        });
    };
}
