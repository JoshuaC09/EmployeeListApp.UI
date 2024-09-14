// src/app/directives/number-format.directive.ts
import { Directive, ElementRef, HostListener } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appNumberFormat]',
  standalone: true,
})
export class NumberFormatDirective {
  constructor(private el: ElementRef, private control: NgControl) {}

  @HostListener('input', ['$event.target.value'])
  onInput(value: string) {
    let newVal = value.replace(/\D/g, '');
    newVal = newVal.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

    this.el.nativeElement.value = newVal;
    this.control.control?.setValue(newVal.replace(/,/g, ''), {
      emitEvent: false,
    });
  }

  @HostListener('blur')
  onBlur() {
    const value = this.control.value;
    if (value) {
      const formattedValue = value
        .toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      this.el.nativeElement.value = formattedValue;
    }
  }
}
