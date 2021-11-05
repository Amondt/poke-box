import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
    ControlContainer,
    FormBuilder,
    FormGroup,
    FormGroupDirective,
} from '@angular/forms';

@Component({
    selector: 'app-search-bar',
    templateUrl: './search-bar.component.html',
    styleUrls: ['./search-bar.component.scss'],
    viewProviders: [
        {
            provide: ControlContainer,
            useExisting: FormGroupDirective,
        },
    ],
})
export class SearchBarComponent implements OnInit {
    // @Output() formReady = new EventEmitter<FormGroup>();
    @Output() applyFilter = new EventEmitter<string>();
    @Input() controlName: string;
    // searchBarGroup: FormGroup;

    constructor(private fb: FormBuilder) {}

    ngOnInit(): void {
        // this.searchBarGroup = this.fb.group({
        //     searchBar: '',
        // });
        // this.formReady.emit(this.searchBarGroup);
    }

    onApplyFilter = (changedValue: string) => {
        this.applyFilter.emit(changedValue);
    };
}
