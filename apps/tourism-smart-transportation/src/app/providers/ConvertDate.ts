import { DatePipe } from '@angular/common';
export function convertTime(value: string) {
  const time = new Date(value);
  const pipe = new DatePipe('en-US');
  const timeConverted = pipe.transform(time, 'yyyy-MM-ddTHH:mm:ss');
  return timeConverted as string;
}
export function formatDateToFE(value: string) {
  const dateConvert = new Date(value ? value.toString() : '');
  return dateConvert;
  // const pipe = new DatePipe('en-US');
  // let dateConverted: any;
  // if (value) {
  //   dateConverted = pipe.transform(dateConvert, 'YYYY-MM-DDTHH:mm:ss.sssZ');
  // }
  // return dateConverted;
}
export function convertDateOfBirth(value: string) {
  const dobRes = new Date(value ? value.toString() : '');
  const pipe = new DatePipe('en-US');
  let dobPipe: any;
  if (value) {
    dobPipe = pipe.transform(dobRes, 'yyyy/MM/dd');
  }
  return dobPipe;
}
