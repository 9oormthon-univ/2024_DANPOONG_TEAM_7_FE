import styles from '../styles/FontTest.module.css';

function FontTest() {
  return (
    <div>
      <h1 className={styles.title}>프리텐다드 볼드</h1>
      <h2 className={styles.subtitle}>프리텐다드 미디움 1234 ^&*%$</h2>
      <p className={styles.content}>프리텐다드 레귤러</p>
    </div>
  );
}

export default FontTest;