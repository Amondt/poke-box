import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { PokedexComponent } from './pokedex.component';
import { PokemonListComponent } from './pokemon-list/pokemon-list.component';
import { MaterialModule } from '../material/material.module';
import { SharedModule } from '../shared/shared.module';

@NgModule({
    declarations: [PokedexComponent, PokemonListComponent],
    imports: [
        CommonModule,
        RouterModule.forChild([{ path: '', component: PokedexComponent }]),
        MaterialModule,
        SharedModule,
    ],
})
export class PokedexModule {}
