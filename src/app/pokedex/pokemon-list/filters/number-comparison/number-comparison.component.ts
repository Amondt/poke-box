import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ControlContainer, FormGroupDirective } from '@angular/forms';

@Component({
    selector: 'app-number-comparison',
    templateUrl: './number-comparison.component.html',
    styleUrls: ['./number-comparison.component.scss'],
    viewProviders: [
        {
            provide: ControlContainer,
            useExisting: FormGroupDirective,
        },
    ],
})
export class NumberComparisonComponent implements OnInit {
    @Output() applyFilter = new EventEmitter<string>();
    @Input() groupName: string;
    @Input() label: string;

    constructor() {}

    ngOnInit(): void {}

    onApplyFilter = (changedValue: string) => {
        this.applyFilter.emit(changedValue);
    };
}
