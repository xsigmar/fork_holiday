import { format, isWeekend, addDays, isEqual, isBefore } from "date-fns";

type ArgDate = Date | number;

export type HolidayOptions = {
  holidays: string[];
  holidayFormat: string;
};
export const HolidayOptionsDefault: HolidayOptions = {
  holidays: [],
  holidayFormat: "dd-MM-yyyy"
};

export const isHoliday = (
  date: ArgDate,
  options: HolidayOptions = HolidayOptionsDefault
): boolean => options.holidays.includes(format(date, options.holidayFormat));

export const isBusinessDay = (
  date: ArgDate,
  options: HolidayOptions = HolidayOptionsDefault
): boolean => {
  if (isHoliday(date, options)) {
    return false;
  }
  return !isWeekend(date);
};

/**
 * @param date
 * @param number
 * @param options
 * @desc
 * */
export const addBusinessDay = (
  date: ArgDate,
  number: number,
  options: HolidayOptions = HolidayOptionsDefault
): Date => {
  let _date = new Date(date);

  if (number < 0) {
    number = Math.round(-1 * number) * -1;
  } else {
    number = Math.round(number);
  }
  const signal = number < 0 ? -1 : 1;
  let remaining = Math.abs(number);

  while (remaining > 0) {
    _date = addDays(_date, signal);
    if (isBusinessDay(_date, options)) {
      remaining--;
    }
  }
  return _date;
};

export const businessDayDiff = (
  dateFrom: ArgDate,
  dateTo: ArgDate,
  options: HolidayOptions = HolidayOptionsDefault
) => {
  let _dateFrom = isBefore(dateFrom, dateTo) ? dateFrom : dateTo;
  const _dateTo = isBefore(dateTo, dateFrom) ? dateFrom : dateTo;

  let daysBetween = 0;

  if (isEqual(_dateFrom, _dateTo)) {
    return daysBetween;
  }

  while (isBefore(_dateFrom, _dateTo)) {
    if (isBusinessDay(_dateFrom, options)) {
      daysBetween += 1;
    }
    _dateFrom = addDays(_dateFrom, 1);
  }

  return daysBetween;
};
