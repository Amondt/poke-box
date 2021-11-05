import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

import { PokedexComponent } from './pokedex.component';
import { PokemonListComponent } from './pokemon-list/pokemon-list.component';
import { SharedModule } from '../shared/modules/shared.module';
import { FiltersComponent } from './pokemon-list/filters/filters.component';
import { SearchBarComponent } from './pokemon-list/filters/search-bar/search-bar.component';
import { SelectComponent } from './pokemon-list/filters/select/select.component';
import { CheckboxGroupComponent } from './pokemon-list/filters/checkbox-group/checkbox-group.component';
import { NumberComparisonComponent } from './pokemon-list/filters/number-comparison/number-comparison.component';

@NgModule({
    declarations: [PokedexComponent, PokemonListComponent, FiltersComponent, SearchBarComponent, SelectComponent, CheckboxGroupComponent, NumberComparisonComponent],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        RouterModule.forChild([{ path: '', component: PokedexComponent }]),
        SharedModule,
    ],
})
export class PokedexModule {}
