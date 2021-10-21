import { Component, Input, OnInit } from '@angular/core';

export interface menuListItem {
    path: string;
    name: string;
}

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
    @Input() title: string = '';

    menuList: menuListItem[] = [
        { path: '/pokedex', name: 'pokedex' },
        { path: '/team-builder', name: 'team builder' },
        { path: '/cardex', name: 'cardex' },
    ];

    constructor() {}

    ngOnInit(): void {}
}
