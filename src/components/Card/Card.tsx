import styles from './Card.module.css';

type Cdate = {
  day?: number;
  month?: string;
  year?: number;
  time?: string;
  weekday?: string;
};

type CardProps = {
  date: Cdate;
  name: string;
};

export function Card({ date, name }: CardProps) {
  return (
    <div className={styles.card}>
      <div className={styles.name}>
        <span>{name}</span>
      </div>
      <div className={styles.monthyear}>
        <span>{date.month}</span> <span>{date.year}</span>
      </div>
      <div className={styles.day}>{date.day}</div>
      <div className={styles.weekday}>
        <span>{date.weekday}</span>
      </div>
      <div className={styles.time}>{date.time && <span>{date.time}</span>}</div>
    </div>
  );
}
