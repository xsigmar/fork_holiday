import {
  isHoliday,
  isBusinessDay,
  addBusinessDay,
  businessDayDiff
} from "./index";
import { formatHolidays } from "./common/index";

const holidays = [
  {
    firstDay: "2020-11-04T00:00:00Z",
    lastDay: "2020-11-04T00:00:00Z"
  },
  {
    firstDay: "2020-09-01T00:00:00Z",
    lastDay: "2020-09-01T00:00:00Z"
  }
];

describe("isHoliday", () => {
  it("The transmitted day is not a holiday, the list of holidays has not been transmitted", () => {
    const date = new Date("2020-11-04T00:00:00Z");

    expect(isHoliday(date)).toBeFalsy();
  });
  it("The transmitted day is a public holiday according to the transmitted holiday list", () => {
    const date = new Date("2020-11-04T00:00:00Z");

    expect(
      isHoliday(date, {
        holidayFormat: "dd-MM-yyyy",
        holidays: formatHolidays(holidays)
      })
    ).toBeTruthy();
  });
  it("The transmitted day is not a holiday according to the transmitted holiday list", () => {
    const date = new Date("2020-11-08T00:00:00Z");

    expect(
      isHoliday(date, {
        holidayFormat: "dd-MM-yyyy",
        holidays: formatHolidays(holidays)
      })
    ).toBeFalsy();
  });
});

describe("isBusinessDay", () => {
  it("The transferred day is not a day off", () => {
    expect(isBusinessDay(new Date("2020-11-02T00:00:00Z"))).toBeTruthy();
    expect(isBusinessDay(new Date("2020-11-04T00:00:00Z"))).toBeTruthy();
    expect(isBusinessDay(new Date("2020-11-05T00:00:00Z"))).toBeTruthy();
  });
  it("The transferred day is a day off", () => {
    expect(isBusinessDay(new Date("2020-11-07T00:00:00Z"))).toBeFalsy();
    expect(isBusinessDay(new Date("2020-11-08T00:00:00Z"))).toBeFalsy();
  });
  it("The date is a holiday", () => {
    expect(
      isBusinessDay(new Date("2020-11-04T00:00:00Z"), {
        holidayFormat: "dd-MM-yyyy",
        holidays: formatHolidays(holidays)
      })
    ).toBeFalsy();
  });
});
describe("addBusinessDay", () => {
  it("Working day added without holiday", () => {
    expect(addBusinessDay(new Date("2020-11-02T00:00:00Z"), 2)).toEqual(
      new Date("2020-11-04T00:00:00Z")
    );
    expect(addBusinessDay(new Date("2020-11-05T00:00:00Z"), 3)).toEqual(
      new Date("2020-11-10T00:00:00Z")
    );
  });
  it("Added a working day with a holiday", () => {
    expect(
      addBusinessDay(new Date("2020-11-02T00:00:00Z"), 2, {
        holidayFormat: "dd-MM-yyyy",
        holidays: formatHolidays(holidays)
      })
    ).toEqual(new Date("2020-11-05T00:00:00Z"));
  });
});

describe("businessDayDiff", () => {
  it("Dates are equal", () => {
    expect(
      businessDayDiff(
        new Date("2020-11-02T00:00:00Z"),
        new Date("2020-11-02T00:00:00Z")
      )
    ).toEqual(0);
  });
  it("Get the difference in working days between dates excluding holidays", () => {
    expect(
      businessDayDiff(
        new Date("2020-11-02T00:00:00Z"),
        new Date("2020-11-09T00:00:00Z")
      )
    ).toEqual(5);
    expect(
      businessDayDiff(
        new Date("2020-11-09T00:00:00Z"),
        new Date("2020-11-02T00:00:00Z")
      )
    ).toEqual(5);
  });
  it("Get the difference in working days between dates including holidays", () => {
    expect(
      businessDayDiff(
        new Date("2020-11-02T00:00:00Z"),
        new Date("2020-11-09T00:00:00Z"),
        {
          holidayFormat: "dd-MM-yyyy",
          holidays: formatHolidays(holidays)
        }
      )
    ).toEqual(4);
  });
});
