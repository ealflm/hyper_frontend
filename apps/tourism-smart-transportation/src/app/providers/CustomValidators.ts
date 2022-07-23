import { DatePipe } from '@angular/common';
import {
  AbstractControl,
  ValidatorFn,
  FormControl,
  FormGroup,
  ValidationErrors,
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
export const LICENSE_PLATES_REGEX = /^[0-9]{2}[A-Z]{1}[0-9]{1}-[0-9]{4,5}/;
export const PHONE_NUMBER_REGEX = /(03|05|07|08|09|01[2|6|8|9])+([0-9]{8})\b/;
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
function GetAge(date: string): number {
  const today = new Date();
  const birthDate = new Date(date);
  let age = today.getFullYear() - birthDate.getFullYear();
  const month = today.getMonth() - birthDate.getMonth();

  if (month < 0 || (month === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  // console.log('Age: ' + age + '\nBirthday: ' + birthDate);
  return age;
}

export function AgeCheck(controlName: string) {
  return (formGroup: FormGroup) => {
    const control = formGroup.controls[controlName];

    if (control?.errors && !control.errors['under18']) {
      return;
    }

    if (GetAge(control?.value) < 18) {
      control.setErrors({ under18: true });
      return;
    } else {
      return control.setErrors(null);
    }
  };
}

export function checkMoreThanTodayValidator(controlName: string) {
  return (formGroup: FormGroup) => {
    const control = formGroup.controls[controlName];
    const start: Date = formGroup.controls[controlName].value[0];
    const time = new Date(start);
    const today = new Date();
    if (control?.errors && !control.errors['dateRange']) {
      return;
    }
    if (start) {
      const isMoreThanTodyValid = time.getTime() - today.getTime() >= 0;
      if (isMoreThanTodyValid) {
        return;
      } else {
        control.setErrors({ dateRange: true });
      }
    }
  };
}
export function checkMoreThanMinDistance(
  minControlName: string,
  maxDistanceControlName: string
) {
  return (formGroup: FormGroup) => {
    const minDistanceControl = formGroup.controls[minControlName];
    const maxDistanceControl = formGroup.controls[maxDistanceControlName];
    if (
      maxDistanceControl.errors &&
      !maxDistanceControl.errors['mustMoreThan']
    ) {
      // return if another validator has already found an error on the matchingControl
      return;
    }
    if (
      parseFloat(minDistanceControl.value) >=
      parseFloat(maxDistanceControl.value)
    ) {
      maxDistanceControl.setErrors({ mustMoreThan: true });
    } else {
      maxDistanceControl.setErrors(null);
    }
  };
}
export function validateEmty(control: FormControl) {
  const isWhitespace = (control.value || '').trim().length === 0;
  const isValid = !isWhitespace;
  return isValid ? null : { whitespace: true };
}
export function checkMoreThanTimeStart(
  controlNameTimeStart: string,
  controlNameTimeEnd: string
) {
  return (formGroup: FormGroup) => {
    const controlTimeStart = formGroup.controls[controlNameTimeStart];
    const controlTimeEnd = formGroup.controls[controlNameTimeEnd];
    const timeStart = new Date(controlTimeStart.value).getTime();
    const timeEnd = new Date(controlTimeEnd.value).getTime();

    if (controlTimeEnd?.errors && !controlTimeEnd.errors['MustMoreStart']) {
      return;
    }
    const isMoreThanTodyValid = timeStart < timeEnd;
    if (isMoreThanTodyValid) {
      return;
    } else {
      controlTimeEnd.setErrors({ MustMoreStart: true });
    }
  };
}
