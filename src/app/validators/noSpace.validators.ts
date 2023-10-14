import { AbstractControl, ValidationErrors } from '@angular/forms';

export class noSpace {
  static noSpaceValidator(control: AbstractControl): ValidationErrors | null {
    return !control.value.trim() ? { noSpaceValidator: true } : null;
  }
}
