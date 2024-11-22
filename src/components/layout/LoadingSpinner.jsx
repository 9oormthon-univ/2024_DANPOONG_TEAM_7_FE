import React from 'react';
import { createContext, useContext, useState } from 'react';
import styles from '../../styles/layout/LoadingSpinner.module.css';

// 전역 로딩 상태 관리를 위한 Context 생성
const LoadingContext = createContext({
  isLoading: false,
  setIsLoading: () => {},
});

// Loading Provider 컴포넌트
export const LoadingProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  
  return (
    <LoadingContext.Provider value={{ isLoading, setIsLoading }}>
      {children}
      {isLoading && <LoadingSpinner />}
    </LoadingContext.Provider>
  );
};

// Loading Hook
export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error('useLoading must be used within a LoadingProvider');
  }
  return context;
};

// 로딩 스피너 컴포넌트
const LoadingSpinner = () => {
  return (
    <div className={styles.overlay}>
      <div className={styles.container}>
        {[...Array(4)].map((_, index) => (
          <div
            key={index}
            className={styles.dot}
          />
        ))}
      </div>
    </div>
  );
};

export default LoadingSpinner;