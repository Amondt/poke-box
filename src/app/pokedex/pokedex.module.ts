import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

import { PokedexComponent } from './pokedex.component';
import { PokemonListComponent } from './pokemon-list/pokemon-list.component';
import { SharedModule } from '../shared/modules/shared.module';
import { FiltersComponent } from './pokemon-list/filters/filters.component';

@NgModule({
    declarations: [PokedexComponent, PokemonListComponent, FiltersComponent],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        RouterModule.forChild([{ path: '', component: PokedexComponent }]),
        SharedModule,
    ],
})
export class PokedexModule {}
