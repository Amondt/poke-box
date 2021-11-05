import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
    ControlContainer,
    FormControl,
    FormGroup,
    FormGroupDirective,
} from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';

@Component({
    selector: 'app-checkbox-group',
    templateUrl: './checkbox-group.component.html',
    styleUrls: ['./checkbox-group.component.scss'],
    viewProviders: [
        {
            provide: ControlContainer,
            useExisting: FormGroupDirective,
        },
    ],
})
export class CheckboxGroupComponent implements OnInit {
    @Output() applyFilter = new EventEmitter<string>();
    @Input() mainForm: FormGroup;
    @Input() groupName: string;
    controlNames: string[] = [];

    constructor() {}

    ngOnInit(): void {
        const object = (this.mainForm.get(this.groupName) as FormGroup).value;
        for (const property in object) {
            this.controlNames.push(property);
        }
    }

    onApplyFilter = (changedValue: string) => {
        this.applyFilter.emit(changedValue);
    };

    controlCheckboxStatus = (group: string, type: string) => {
        const resArray = [];
        const object = (this.mainForm.get(group) as FormGroup).value;
        for (const property in object) {
            resArray.push(object[property]);
        }
        if (type === 'indeterminate') {
            return (
                !resArray.every((res) => res === true) &&
                !resArray.every((res) => res === false)
            );
        } else {
            return (
                resArray.some((res) => res === true) ||
                !resArray.some((res) => res === false)
            );
        }
    };

    checkAll = (event: MatCheckboxChange, group: string) => {
        const formGroup = this.mainForm.get(group) as FormGroup;
        for (const property in formGroup.value) {
            (formGroup.get(property) as FormControl).setValue(event.checked);
        }
        this.onApplyFilter(group);
    };
}
