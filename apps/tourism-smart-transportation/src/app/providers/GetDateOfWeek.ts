import * as moment from 'moment';
import { extendMoment } from 'moment-range';
import { convertDateToVN } from './ConvertDate';

export function getISOWeeksInYear() {
  // const month = parseInt(moment().format('MM'));
  const month = 11;
  const year = new Date().getFullYear();
  // const year = parseInt(moment().format('YYYY'));

  const weekStart = new Date(year, 0, 1);
  console.log(weekStart);

  weekStart.setDate(weekStart.getDate() - (weekStart.getDay() || 7) + 1);

  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekEnd.getDate() + 6);

  const weeks: any = [];

  do {
    const weekNum = moment(weekStart, 'YYYY-MM-DD').week();

    weeks.push({
      weekNum: weekNum,
      start: convertDateToVN(weekStart.toString()),
      end: convertDateToVN(weekEnd.toString()),
    });

    weekStart.setDate(weekStart.getDate() + 7);
    weekEnd.setDate(weekEnd.getDate() + 7);
  } while (
    weekStart.getMonth() < month &&
    (weekStart.getMonth() || month < 12)
  );
  console.log(weeks);

  return weeks;
}

export function getFirstLastDateCurrentWeek() {
  const curr = new Date(); // get current date
  const first = curr.getDate() - curr.getDay() + 1; // First day is the day of the month - the day of the week
  const last = first + 6; // last day is the first day + 6
  const firstday = convertDateToVN(new Date(curr.setDate(first)).toString());
  const lastday = convertDateToVN(new Date(curr.setDate(last)).toString());
  const numOfWeek = moment(new Date()).week();
  let result = {};
  return (result = {
    weekNum: numOfWeek,
    start: firstday,
    end: lastday,
  });
}
