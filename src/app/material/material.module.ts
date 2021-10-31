import { NgModule } from '@angular/core';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSortModule } from '@angular/material/sort';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@NgModule({
    imports: [
        MatToolbarModule,
        MatTableModule,
        MatPaginatorModule,
        MatTooltipModule,
        MatSortModule,
        MatProgressSpinnerModule,
        MatFormFieldModule,
        MatInputModule,
    ],
    exports: [
        MatToolbarModule,
        MatTableModule,
        MatPaginatorModule,
        MatTooltipModule,
        MatSortModule,
        MatProgressSpinnerModule,
        MatFormFieldModule,
        MatInputModule,
    ],
})
export class MaterialModule {}
