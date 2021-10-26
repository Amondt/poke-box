import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { BrandTitlePipe } from './brand-title.pipe';
import { ThreeCharacterNumber } from './three-character-number.pipe';

@NgModule({
    declarations: [BrandTitlePipe, ThreeCharacterNumber],
    imports: [CommonModule],
    exports: [BrandTitlePipe, ThreeCharacterNumber],
})
export class SharedModule {}
