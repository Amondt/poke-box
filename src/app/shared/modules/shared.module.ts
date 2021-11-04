import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MaterialModule } from './material.module';

import { BrandTitlePipe } from '../pipes/brand-title.pipe';
import { ThreeCharacterNumber } from '../pipes/three-character-number.pipe';
import { GetSingleValuePipe } from '../pipes/get-single-value.pipe';
import { GetTypeValue } from '../pipes/get-type-value.pipe';
import { GetTotalStats } from '../pipes/get-total-stats.pipe';

@NgModule({
    declarations: [
        BrandTitlePipe,
        ThreeCharacterNumber,
        GetSingleValuePipe,
        GetTypeValue,
        GetTotalStats,
    ],
    imports: [CommonModule, MaterialModule],
    exports: [
        BrandTitlePipe,
        ThreeCharacterNumber,
        GetSingleValuePipe,
        GetTypeValue,
        GetTotalStats,
        MaterialModule,
    ],
})
export class SharedModule {}
