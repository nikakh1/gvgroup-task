import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function emailValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const pattern = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    return pattern.test(control.value) ? null : { invalidEmailPattern: true };
  };
}

export function numericValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const pattern = /^\d+$/;
    return pattern.test(control.value) ? null : { invalidNumberPattern: true };
  };
}
