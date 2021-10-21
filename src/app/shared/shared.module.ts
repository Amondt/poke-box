import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { BrandTitlePipe } from './brand-title.pipe';

@NgModule({
    declarations: [BrandTitlePipe],
    imports: [CommonModule],
    exports: [BrandTitlePipe],
})
export class SharedModule {}
