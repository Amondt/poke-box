import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { TeamBuilderComponent } from './team-builder.component';

@NgModule({
    declarations: [TeamBuilderComponent],
    imports: [
        CommonModule,
        RouterModule.forChild([{ path: '', component: TeamBuilderComponent }]),
    ],
})
export class TeamBuilderModule {}
