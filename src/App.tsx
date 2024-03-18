import { IslamicCalendar } from './components/IslamicCalendar/IslamicCalendar';
import { GregorianCalendar } from './components/GregorianCalendar/GregorianCalendar';
import { useEffect } from 'react';
import styles from './App.module.css';
import { JulianicCalendar } from './components/JulianicCalendar/JulianicCalendar';

function App() {
  useEffect(() => {
    window.document.title = 'Calendars';
  }, []);
  return (
    <div className={styles.grid}>
      <JulianicCalendar />
      <GregorianCalendar />
      <IslamicCalendar />
    </div>
  );
}

export default App;
