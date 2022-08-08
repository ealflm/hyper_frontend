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
  const hours = (date.getHours() < 10 ? '0' : '') + date.getHours();
  const minutes = (date.getMinutes() < 10 ? '0' : '') + date.getMinutes();
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
  setTime.setHours(hours[0], hours[1]);
  return setTime;
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

const convertBase = (function () {
  function convertBase(baseFrom: any, baseTo: any) {
    return function (num: any) {
      return parseInt(num, baseFrom).toString(baseTo);
    };
  }

  // binary to decimal
  convertBase.bin2dec = convertBase(2, 10);

  // binary to hexadecimal
  convertBase.bin2hex = convertBase(2, 16);

  // decimal to binary
  convertBase.dec2bin = convertBase(10, 2);

  // decimal to hexadecimal
  convertBase.dec2hex = convertBase(10, 16);

  // hexadecimal to binary
  convertBase.hex2bin = convertBase(16, 2);

  // hexadecimal to decimal
  convertBase.hex2dec = convertBase(16, 10);

  return convertBase;
})();

export function convertHexToLittleEndian(uiCard: string) {
  const data = convertBase.dec2hex(uiCard);
  const dataHex = data.match(/../g);
  const hexLittleEndian = dataHex
    ? dataHex.reverse().join('').toUpperCase()
    : '';
  return hexLittleEndian;
}
export function convertHexToDecimal(hexString: string) {
  const data = hexString.match(/../g);
  const hexToDecimal = data ? data.reverse().join('').toUpperCase() : '';
  return convertBase.hex2dec(hexToDecimal);
}
