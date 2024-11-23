import { useEffect, useRef, useState } from 'react';
import styles from '../../styles/login/DatePicker.module.css';

const DatePicker = ({ onDateSelect }) => {
  const today = new Date();
  const [selectedYear, setSelectedYear] = useState(today.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(today.getMonth() + 1);
  const [selectedDay, setSelectedDay] = useState(today.getDate());

  const yearRef = useRef(null);
  const monthRef = useRef(null);
  const dayRef = useRef(null);

  const years = Array.from(
    { length: 65 }, 
    (_, i) => today.getFullYear() - i
  );
  
  // 현재 월부터 1월까지 역순으로 생성
  const getMonthsForYear = (year) => {
    if (year === today.getFullYear()) {
      return Array.from(
        { length: today.getMonth() + 1 }, 
        (_, i) => today.getMonth() + 1 - i
      );
    }
    return Array.from({ length: 12 }, (_, i) => 12 - i);
  };

  const months = getMonthsForYear(selectedYear);
  
  // 선택된 년/월의 일수 계산 (현재 월인 경우 오늘까지만)
  const getDaysInMonth = (year, month) => {
    if (year === today.getFullYear() && month === (today.getMonth() + 1)) {
      return today.getDate();
    }
    return new Date(year, month, 0).getDate();
  };

  // 일 배열 생성 (역순)
  const days = Array.from(
    { length: getDaysInMonth(selectedYear, selectedMonth) },
    (_, i) => getDaysInMonth(selectedYear, selectedMonth) - i
  );

  // 스크롤 이벤트 처리 함수
  const handleScroll = (element, items, setValue) => {
    if (!element.current) return;
    
    const itemHeight = 40;
    const scrollTop = element.current.scrollTop;
    const selectedIndex = Math.round(scrollTop / itemHeight);
    const selectedValue = items[selectedIndex];
    
    if (selectedValue) {
      setValue(selectedValue);
    }
  };

  useEffect(() => {
    const yearElement = yearRef.current;
    const monthElement = monthRef.current;
    const dayElement = dayRef.current;

    let yearTimer, monthTimer, dayTimer;

    const handleYearScroll = () => {
      clearTimeout(yearTimer);
      yearTimer = setTimeout(() => handleScroll(yearRef, years, setSelectedYear), 100);
    };

    const handleMonthScroll = () => {
      clearTimeout(monthTimer);
      monthTimer = setTimeout(() => handleScroll(monthRef, months, setSelectedMonth), 100);
    };

    const handleDayScroll = () => {
      clearTimeout(dayTimer);
      dayTimer = setTimeout(() => handleScroll(dayRef, days, setSelectedDay), 100);
    };

    yearElement?.addEventListener('scroll', handleYearScroll);
    monthElement?.addEventListener('scroll', handleMonthScroll);
    dayElement?.addEventListener('scroll', handleDayScroll);

    return () => {
      yearElement?.removeEventListener('scroll', handleYearScroll);
      monthElement?.removeEventListener('scroll', handleMonthScroll);
      dayElement?.removeEventListener('scroll', handleDayScroll);
    };
  }, [selectedYear, selectedMonth]); 

  useEffect(() => {
    const dateString = `${selectedYear}-${String(selectedMonth).padStart(2, '0')}-${String(selectedDay).padStart(2, '0')}`;
    onDateSelect(dateString);
  }, [selectedYear, selectedMonth, selectedDay, onDateSelect]);

  return (
    <div className={styles.container}>
      <div className={styles.pickerContainer}>
        <div className={styles.columnContainer}>
          {/* 년도 컬럼 */}
          <div ref={yearRef} className={styles.column}>
            {years.map((year) => (
              <div
                key={year}
                className={`${styles.item} ${year === selectedYear ? styles.selected : ''}`}
              >
                {year}년
              </div>
            ))}
          </div>

          {/* 월 컬럼 */}
          <div ref={monthRef} className={styles.column}>
            {months.map((month) => (
              <div
                key={month}
                className={`${styles.item} ${month === selectedMonth ? styles.selected : ''}`}
              >
                {month}월
              </div>
            ))}
          </div>

          {/* 일 컬럼 */}
          <div ref={dayRef} className={styles.column}>
            {days.map((day) => (
              <div
                key={day}
                className={`${styles.item} ${day === selectedDay ? styles.selected : ''}`}
              >
                {day}일
              </div>
            ))}
          </div>

          <div className={styles.gradientTop} />
          <div className={styles.gradientBottom} />
        </div>
      </div>
    </div>
  );
};

export default DatePicker;