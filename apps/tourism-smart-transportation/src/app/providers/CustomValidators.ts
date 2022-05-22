import {
  AbstractControl,
  ValidatorFn,
  FormControl,
  FormGroup,
} from '@angular/forms';
// export class CustomValidators {
//   constructor() {}
//   static onlyChar(): ValidatorFn {
//     return (control: AbstractControl): { [key: string]: boolean } | null => {
//       if (control.value == '') return null;

//       const re = new RegExp('^[a-zA-Z ]*$');
//       if (re.test(control.value)) {
//         return null;
//       } else {
//         return { onlyChar: true };
//       }
//     };
//   }
//   static mustMatch(controlName: string, matchingControlName: string) {
//     return (formGroup: FormGroup) => {
//       const control = formGroup.controls[controlName];
//       const matchingControl = formGroup.controls[matchingControlName];

//       if (matchingControl.errors && !matchingControl.errors?.['mustMatch']) {
//         return;
//       }

//       // set error on matchingControl if validation fails
//       if (control.value !== matchingControl.value) {
//         matchingControl.setErrors({ mustMatch: true });
//       } else {
//         matchingControl.setErrors(null);
//       }
//       return null;
//     };
//   }
// }

// custom validator to check that two fields match
export function MustMatch(controlName: string, matchingControlName: string) {
  return (formGroup: FormGroup) => {
    const control = formGroup.controls[controlName];
    const matchingControl = formGroup.controls[matchingControlName];

    if (matchingControl.errors && !matchingControl.errors['mustMatch']) {
      // return if another validator has already found an error on the matchingControl
      return;
    }

    // set error on matchingControl if validation fails
    if (control.value !== matchingControl.value) {
      matchingControl.setErrors({ mustMatch: true });
    } else {
      matchingControl.setErrors(null);
    }
  };
}
