import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { CardexComponent } from './cardex.component';

@NgModule({
    declarations: [CardexComponent],
    imports: [
        CommonModule,
        RouterModule.forChild([{ path: '', component: CardexComponent }]),
    ],
})
export class CardexModule {}
