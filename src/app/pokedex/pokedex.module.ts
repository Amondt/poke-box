import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { PokedexComponent } from './pokedex.component';

@NgModule({
    declarations: [PokedexComponent],
    imports: [
        CommonModule,
        RouterModule.forChild([{ path: '', component: PokedexComponent }]),
    ],
})
export class PokedexModule {}
