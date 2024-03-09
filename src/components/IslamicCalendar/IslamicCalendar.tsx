import { useNamedState } from 'use-named-state';
import { Card } from '../Card/Card';
import { useEffect } from 'react';

type GregorianDate = {
  weekday?: string;
  day?: number;
  ending?: string;
  month?: string;
  monthNumber?: number;
  year?: number;
};

export function IslamicCalendar() {
  const [islDate, setIslDate] = useNamedState<GregorianDate>('islamicDate', {});
  function gmod(n: number, m: number) {
    return ((n % m) + m) % m;
  }

  function kuwaiticalendar(adjust: number) {
    const queryParameters = new URLSearchParams(window.location.search);
    const preDate = queryParameters.get('date');
    // date of today
    let today = preDate ? new Date(preDate) : new Date();
    // adjust date (if necessary)
    if (adjust) {
      const adjustmili = 1000 * 60 * 60 * 24 * adjust;
      const todaymili = today.getTime() + adjustmili;
      today = new Date(todaymili);
    }
    // get parts of date
    let day = today.getDate();
    let month = today.getMonth();
    let year = today.getFullYear();
    // julianic years (april - march)
    let m = month + 1;
    let y = year;
    if (m < 3) {
      y -= 1;
      m += 12;
    }

    let a = Math.floor(y / 100);
    let b = 2 - a + Math.floor(a / 4);
    if (y < 1583) b = 0;
    if (y == 1582) {
      if (m > 10) b = -10;
      if (m == 10) {
        b = 0;
        if (day > 4) b = -10;
      }
    }

    const jd = Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m + 1)) + day + b - 1524;

    b = 0;
    if (jd > 2299160) {
      a = Math.floor((jd - 1867216.25) / 36524.25);
      b = 1 + a - Math.floor(a / 4);
    }
    const bb = jd + b + 1524;
    let cc = Math.floor((bb - 122.1) / 365.25);
    const dd = Math.floor(365.25 * cc);
    const ee = Math.floor((bb - dd) / 30.6001);
    day = bb - dd - Math.floor(30.6001 * ee);
    month = ee - 1;
    if (ee > 13) {
      cc += 1;
      month = ee - 13;
    }
    year = cc - 4716;

    const wd = adjust ? gmod(jd + 1 - adjust, 7) + 1 : gmod(jd + 1, 7) + 1;

    const iyear = 10631 / 30;
    const epochastro = 1948084;
    // const epochcivil = 1948085;

    const shift1 = 8.01 / 60;

    let z = jd - epochastro;
    const cyc = Math.floor(z / 10631);
    z = z - 10631 * cyc;
    const j = Math.floor((z - shift1) / iyear);
    const iy = 30 * cyc + j;
    z = z - Math.floor(j * iyear + shift1);
    let im = Math.floor((z + 28.5001) / 29.5);
    if (im == 13) im = 12;
    const id = z - Math.floor(29.5001 * im - 29);

    const myRes = new Array(8);

    myRes[0] = day; //calculated day (CE)
    myRes[1] = month - 1; //calculated month (CE)
    myRes[2] = year; //calculated year (CE)
    myRes[3] = jd - 1; //julian day number
    myRes[4] = wd - 1; //weekday number
    myRes[5] = id; //islamic date
    myRes[6] = im - 1; //islamic month
    myRes[7] = iy; //islamic year

    return myRes;
  }
  function writeIslamicDate(adjustment: number) {
    const wdNames = ['Ahad', 'Ithnin', 'Thulatha', 'Arbaa', 'Khams', 'Jumuah', 'Sabt'];
    const iMonthNames = [
      'Muharram',
      'Safar',
      "Rabi'ul Awwal",
      "Rabi'ul Akhir",
      'Jumadal Ula',
      'Jumadal Akhira',
      'Rajab',
      "Sha'ban",
      'Ramadan',
      'Shawwal',
      "Dhul Qa'ada",
      'Dhul Hijja',
    ];
    const iDate = kuwaiticalendar(adjustment);
    const date = new Date();
    const time = date.toLocaleTimeString('de', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const outputObject = {
      weekday: wdNames[iDate[4]],
      day: iDate[5],
      month: iMonthNames[iDate[6]],
      year: iDate[7],
      time,
    };
    return outputObject;
  }
  useEffect(() => {
    const getDate = () => {
      const dateObject = writeIslamicDate(-1);
      setIslDate(dateObject);
    };
    getDate();
    setInterval(getDate, 1000);
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, []);
  return (
    <>
      <Card date={islDate} />
    </>
  );
}
