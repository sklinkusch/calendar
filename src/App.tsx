import { IslamicCalendar } from './components/IslamicCalendar/IslamicCalendar';
import { GregorianCalendar } from './components/GregorianCalendar/GregorianCalendar';
import styles from './App.module.css';

function App() {
  return (
    <div className={styles.grid}>
      <GregorianCalendar />
      <IslamicCalendar />
    </div>
  );
}

export default App;
