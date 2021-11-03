import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MaterialModule } from './material.module';

import { BrandTitlePipe } from './brand-title.pipe';
import { ThreeCharacterNumber } from './three-character-number.pipe';

@NgModule({
    declarations: [BrandTitlePipe, ThreeCharacterNumber],
    imports: [CommonModule, MaterialModule],
    exports: [BrandTitlePipe, ThreeCharacterNumber, MaterialModule],
})
export class SharedModule {}
