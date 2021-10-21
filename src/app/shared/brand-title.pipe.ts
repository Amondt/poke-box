import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({
    name: 'brandTitle',
})
export class BrandTitlePipe implements PipeTransform {
    constructor(private sanitized: DomSanitizer) {}

    transform(value: string) {
        const splitedValue = value.split(' ');
        let newValue = '';
        splitedValue.forEach((word, index) => {
            newValue += `<span${
                index == 1 ? ' style="color: #ca2a1b"' : ''
            }>${word}</span$>`;
        });
        return this.sanitized.bypassSecurityTrustHtml(newValue);
    }
}
