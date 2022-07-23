import { DatePipe } from '@angular/common';
export function convertTime(value: string) {
  const time = new Date(value);
  const pipe = new DatePipe('en-US');
  const timeConverted = pipe.transform(time, 'yyyy-MM-ddTHH:mm:ss');
  return timeConverted as string;
}
export function convertHoursMinutes(value: string) {
  let hoursMinutes = '';
  const date = new Date(value);
  const hours = date.getHours();
  const minutes = date.getMinutes();
  hoursMinutes = hours + ':' + minutes;
  return hoursMinutes;
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
export function convertHoursToDateString(time: string) {
  const hours: any = time.split(':');
  const currentdate = new Date();
  const datetime =
    currentdate.getFullYear() +
    '-' +
    (currentdate.getMonth() + 1) +
    '-' +
    currentdate.getDate();
  const setTime = new Date(datetime);
  return setTime.setHours(hours[0], hours[1]);
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
export function convertDateToVN(value: string) {
  const dateCreate = new Date(value ? value.toString() : '');
  const pipe = new DatePipe('en-US');
  let dateCreated: any;
  if (value) {
    dateCreated = pipe.transform(dateCreate, 'dd/MM/yyyy');
  }
  return dateCreated;
}
