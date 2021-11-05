import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ControlContainer, FormGroupDirective } from '@angular/forms';

@Component({
    selector: 'app-select',
    templateUrl: './select.component.html',
    styleUrls: ['./select.component.scss'],
    viewProviders: [
        {
            provide: ControlContainer,
            useExisting: FormGroupDirective,
        },
    ],
})
export class SelectComponent implements OnInit {
    @Output() applyFilter = new EventEmitter<string>();
    @Input() controlName: string;
    @Input() label: string;
    @Input() optionsArray: any[];
    @Input() dataIsLoading: boolean | undefined;

    constructor() {}

    ngOnInit(): void {}

    onApplyFilter = (changedValue: string) => {
        this.applyFilter.emit(changedValue);
    };
}
