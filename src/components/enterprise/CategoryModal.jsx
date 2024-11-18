// CategoryModal.jsx
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setSelectedCategories } from '../../redux/slice/EnterpriseSlice';
import styles from '../../styles/enterprise/CategoryModal.module.css';

const CATEGORIES = [
    '전체',
    '사회서비스제공형',
    '일자리제공형',
    '지역사회공헌형', 
    '혼합형',
    '기타(창의ㆍ혁신)형'
 ];

function CategoryModal({ isActive, handleClose, initialCategories = [] }) {
  const dispatch = useDispatch();
  const [localCategories, setLocalCategories] = useState(initialCategories);

  const toggleCategory = (category) => {
      setLocalCategories(prev => {
          if (category === '전체') {
              return prev.includes('전체') ? [] : ['전체'];
          }
          
          const newCategories = prev.includes(category)
              ? prev.filter(c => c !== category)
              : [...prev.filter(c => c !== '전체'), category];
          
          console.log('CategoryModal - Toggling Category:', {
              category,
              previousCategories: prev,
              newCategories
          });
          
          return newCategories;
      });
  };

  const handleConfirm = () => {
      console.log('CategoryModal - Confirming Categories:', {
          selectedCategories: localCategories
      });
      
      dispatch(setSelectedCategories(localCategories));
      handleClose();
  };

  return isActive ? (
      <div className={styles.categoryModalContainer}>
          <div className={styles.categoryModalBackground} onClick={handleClose}></div>
          <div className={styles.categoryModalContent}>
              <div className={styles.categoryModalHeader}>
                  <p className={styles.modalName}>카테고리 설정</p>
                  <p className={styles.modalMemo}>중복 선택 가능</p>
              </div>
              <div className={styles.categoryBtn}>
                  {CATEGORIES.map(category => (
                      <button 
                          key={category} 
                          className={localCategories.includes(category) ? `${styles.category} ${styles.selectedCategory}` : styles.category} 
                          onClick={() => toggleCategory(category)}
                      >
                          {category}
                      </button>
                  ))}
              </div>
              <button className={styles.okay} onClick={handleConfirm}>확인</button>
          </div>
      </div>
  ) : null;
}

export default CategoryModal;