import { useNamedState } from 'use-named-state';
import { useEffect } from 'react';
import './App.css';

type GregorianDate = {
  weekday?: string;
  day?: number;
  ending?: string;
  month?: string;
  monthNumber?: number;
  year?: number;
};

const daysPerMonth: { [key: string]: number } = {
  '0': 31,
  '1': 28,
  '1l': 29,
  '2': 31,
  '3': 30,
  '4': 31,
  '5': 30,
  '6': 31,
  '7': 31,
  '8': 30,
  '9': 31,
  '10': 30,
  '11': 31,
};
const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

function App() {
  const [gregDate, setGregDate] = useNamedState<GregorianDate>('gregorianDate', {});
  const [julDate, setJulDate] = useNamedState<GregorianDate>('julianDate', {});

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
    const julianDate = (gregorianDate: GregorianDate) => {
      const gregorianDay = gregorianDate.day ? gregorianDate.day : null;
      const gregorianMonth = typeof gregorianDate.monthNumber === 'number' ? gregorianDate.monthNumber : null;
      const gregorianYear = gregorianDate.year ? gregorianDate.year : null;
      if (!gregorianDay || typeof gregorianMonth !== 'number' || !gregorianYear) return null;
      const centuries = Math.floor(gregorianYear / 100);
      const a = Math.floor(centuries / 4);
      const b = centuries % 4;
      const dayDifference = 3 * a + b - 2;
      if (gregorianDay > dayDifference) {
        const ending = getEnding(gregorianDay - dayDifference);
        const weekday = new Date(gregorianYear, gregorianMonth, gregorianDay - dayDifference).getDay();
        return {
          weekday: days[weekday],
          day: gregorianDay - dayDifference,
          ending,
          month: months[gregorianMonth],
          year: gregorianYear,
        };
      }
      if (gregorianMonth) {
        let gmmo = `${gregorianMonth - 1}`;
        const leapYear = gregorianYear % 4 === 0;
        if (gmmo === '1' && leapYear) {
          gmmo = '1l';
        }
        const dpm = daysPerMonth[gmmo];
        const ending = getEnding(dpm + gregorianDay - dayDifference);
        const weekday = new Date(gregorianYear, gregorianMonth - 1, dpm + gregorianDay - dayDifference).getDay();
        return {
          weekday: days[weekday],
          day: dpm + gregorianDay - dayDifference,
          ending,
          month: months[gregorianMonth - 1],
          year: gregorianYear,
        };
      }
      const dpm = daysPerMonth['11'];
      const ending = getEnding(dpm + gregorianDay - dayDifference);
      const weekday = new Date(gregorianYear - 1, 11, dpm + gregorianDay - dayDifference).getDay();
      return {
        weekday: days[weekday],
        day: dpm + gregorianDay - dayDifference,
        ending,
        month: months['11'],
        year: gregorianYear - 1,
      };
    };
    const getDate = () => {
      const date = new Date();
      const weekday = days[date.getDay()];
      const day = date.getDate();
      const ending = getEnding(day);
      const month = months[date.getMonth()];
      const monthNumber = date.getMonth();
      const year = date.getFullYear();
      const completeDate = { weekday, day, ending, month, monthNumber, year };
      setGregDate(completeDate);
      const julianicDate = julianDate(completeDate);
      if (julianicDate) setJulDate(julianicDate);
    };
    getDate();
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, []);

  return (
    <>
      <h2>Gregorianic Date</h2>
      <p>
        Today is <span>{gregDate.weekday}</span>, the <span>{gregDate.day}</span>
        <sup>{gregDate.ending}</sup> <span>{gregDate.month}</span> <span>{gregDate.year}</span>.
      </p>
      <h2>Julianic Date</h2>
      <p>
        Today is <span>{julDate.weekday}</span>, the <span>{julDate.day}</span>
        <sup>{julDate.ending}</sup> <span>{julDate.month}</span> <span>{julDate.year}</span>.
      </p>
    </>
  );
}

export default App;
