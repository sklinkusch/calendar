import { useNamedState } from 'use-named-state';
import { useEffect } from 'react';
import { days, months } from '../../constants/Constants';
import { Card } from '../Card/Card';

type GregorianDate = {
  weekday?: string;
  day?: number;
  ending?: string;
  month?: string;
  monthNumber?: number;
  year?: number;
};

export function JulianicCalendar() {
  const [julDate, setJulDate] = useNamedState<GregorianDate>('julianicDate', {});
  useEffect(() => {
    const getEnding = (day: number) => {
      if (!day) return;
      switch (day) {
        case 1:
        case 21:
        case 31:
          return 'st';
        case 2:
        case 22:
          return 'nd';
        case 3:
        case 23:
          return 'rd';
        default:
          return 'th';
      }
    };
    const getJulianDate = (date: GregorianDate, dayDifference: number) => {
      const { day, monthNumber, year } = date;
      if (!day) return;
      if (typeof monthNumber !== 'number') return;
      if (typeof year !== 'number') return;
      let jday, jmonth, jyear;
      if (day > dayDifference) {
        jday = day - dayDifference;
        jmonth = monthNumber;
        jyear = year;
      } else if ([1, 3, 5, 7, 8, 10].includes(monthNumber)) {
        jday = 31 + day - dayDifference;
        jmonth = monthNumber - 1;
        jyear = year;
      } else if ([4, 6, 9, 11].includes(monthNumber)) {
        jday = 30 + day - dayDifference;
        jmonth = monthNumber - 1;
        jyear = year;
      } else if (monthNumber === 2 && year % 4 === 0) {
        jday = 29 + day - dayDifference;
        jmonth = monthNumber - 1;
        jyear = year;
      } else if (monthNumber === 2) {
        jday = 28 + day - dayDifference;
        jmonth = monthNumber - 1;
        jyear = year;
      } else {
        jday = 31 + day - dayDifference;
        jmonth = 11;
        jyear = year - 1;
      }
      const monthName = months[jmonth];
      const jending = getEnding(jday);
      return { day: jday, ending: jending, month: monthName, monthNumber: jmonth, year: jyear };
    };
    const getDate = () => {
      const queryParameters = new URLSearchParams(window.location.search);
      const preDate = queryParameters.get('date');
      const date = preDate ? new Date(preDate) : new Date();
      const weekday = days[date.getDay()];
      const day = date.getDate();
      const monthNumber = date.getMonth();
      const year = date.getFullYear();
      const julYear = monthNumber < 2 ? year - 1 : year;
      const century = Math.floor(julYear / 100);
      const a = Math.floor(century / 4);
      const b = century % 4;
      const dayDifference = 3 * a + b - 2;
      const gdate = { day, monthNumber, year };
      const julianicDate = getJulianDate(gdate, dayDifference);
      if (!julianicDate) return;
      const { day: jday, ending: jending, month: jmonth, monthNumber: jmonthNumber, year: jyear } = julianicDate;
      const timeDate = new Date();
      const time = timeDate.toLocaleTimeString('de', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      const completeDate = {
        weekday,
        day: jday,
        ending: jending,
        month: jmonth,
        monthNumber: jmonthNumber,
        year: jyear,
        time,
      };
      setJulDate(completeDate);
    };
    getDate();
    setInterval(getDate, 500);
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, []);
  return (
    <>
      <Card date={julDate} name="Julian Calendar" />
    </>
  );
}
