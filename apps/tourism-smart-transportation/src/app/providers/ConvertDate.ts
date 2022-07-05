import { DatePipe } from '@angular/common';
export function convertTime(value: string) {
  const time = new Date(value);
  const pipe = new DatePipe('en-US');
  const timeConverted = pipe.transform(time, 'yyyy-MM-ddTHH:mm:ss');
  return timeConverted as string;
}
