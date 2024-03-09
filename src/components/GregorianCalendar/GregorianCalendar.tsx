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

export function GregorianCalendar() {
  const [gregDate, setGregDate] = useNamedState<GregorianDate>('gregorianDate', {});
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
    const getDate = () => {
      const date = new Date();
      const weekday = days[date.getDay()];
      const day = date.getDate();
      const ending = getEnding(day);
      const month = months[date.getMonth()];
      const monthNumber = date.getMonth();
      const year = date.getFullYear();
      const hour = date.getHours();
      const semanticHours = hour < 10 ? `0${hour}` : `${hour}`;
      const minute = date.getMinutes();
      const semanticMins = minute < 10 ? `0${minute}` : `${minute}`;
      const second = date.getSeconds();
      const semanticSecs = second < 10 ? `0${second}` : `${second}`;
      const time = `${semanticHours}:${semanticMins}:${semanticSecs}`;
      const completeDate = { weekday, day, ending, month, monthNumber, year, time };
      setGregDate(completeDate);
    };
    getDate();
    setInterval(getDate, 1000);
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, []);
  return (
    <>
      <Card date={gregDate} />
    </>
  );
}
