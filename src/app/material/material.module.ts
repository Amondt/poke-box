import { NgModule } from '@angular/core';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';

@NgModule({
    imports: [
        MatToolbarModule,
        MatTableModule,
        MatPaginatorModule,
        MatTooltipModule,
    ],
    exports: [
        MatToolbarModule,
        MatTableModule,
        MatPaginatorModule,
        MatTooltipModule,
    ],
})
export class MaterialModule {}
