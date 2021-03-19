import { addDays, isEqual, compareAsc, format } from "date-fns";

export interface Holidays {
  firstDay: string; // ISO
  lastDay: string; // ISO
}

export const formatHolidays = (
  holidays: Holidays[],
  holidayFormat = "dd-MM-yyyy"
): string[] => {
  return holidays.reduce((accum: string[], item) => {
    const result: string[] = [];
    let firstDate = new Date(item.firstDay);
    const lastDate = new Date(item.lastDay);
    if (isEqual(firstDate, lastDate)) {
      result.push(format(firstDate, holidayFormat));
    } else if (compareAsc(firstDate, lastDate) === 1) {
      do {
        result.push(format(firstDate, holidayFormat));
        firstDate = addDays(firstDate, 1);
      } while (!isEqual(firstDate, lastDate));
    }

    accum = [...accum, ...result];
    return accum;
  }, []);
};
