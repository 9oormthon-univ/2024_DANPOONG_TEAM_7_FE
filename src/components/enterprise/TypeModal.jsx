import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setSelectedTypes, setTypeModalOpen } from '../../redux/slice/TypeSlice';
import { updateActiveFilters } from '../../redux/slice/FilteredEnterpriseListSlice'; // 추가
import styles from '../../styles/enterprise/TypeModal.module.css';
import checkIcon from '../../assets/images/enterprise/type-check.svg'

// 상수로 유형 정의
const TYPES = [
   '전체',
   '사회서비스제공형',
   '일자리제공형',
   '지역사회공헌형', 
   '혼합형',
   '기타(창의ㆍ혁신)형'
];

function TypeModal({ isActive, handleClose, initialTypes = [] }) {
   const dispatch = useDispatch();
   console.log('TypeModal - Initial Types:', initialTypes);
   const [localTypes, setLocalTypes] = useState(initialTypes);

   const toggleType = (type) => {
       setLocalTypes(prev => {
           // '전체' 유형 선택 시 로직
           if (type === '전체') {
               return prev.includes('전체') ? [] : ['전체'];
           }
           
           // 다른 유형 선택 시
           const newTypes = prev.includes(type)
               ? prev.filter(t => t !== type)
               : [...prev.filter(t => t !== '전체'), type];
           
           console.log('TypeModal - Toggling Type:', {
               type,
               previousTypes: prev,
               newTypes
           });
           
           return newTypes;
       });
   };

   const handleConfirm = () => {
       console.log('TypeModal - Confirming Types:', {
           selectedTypes: localTypes
       });
       
       // TypeSlice에 선택한 카테고리 저장
       dispatch(setSelectedTypes(localTypes));
        
       // FilteredEnterpriseListSlice에 필터 업데이트
       dispatch(updateActiveFilters({
            types: localTypes
       }));
        
       handleClose();
   };

   return isActive ? (
       <div className={styles.typeModalContainer}>
           <div className={styles.typeModalBackground} onClick={handleClose}></div>
           <div className={styles.typeModalContent}>
               <div className={styles.typeModalHeader}>
                   <p className={styles.modalName}>유형 설정</p>
                   <p className={styles.modalMemo}>중복 선택 가능</p>
               </div>
               <div className={styles.typeBtn}>
                   {TYPES.map(type => (
                       <button 
                           key={type} 
                           className={localTypes.includes(type) ? `${styles.type} ${styles.selectedType}` : styles.type} 
                           onClick={() => toggleType(type)}
                       >
                           {type}
                       </button>
                   ))}
               </div>
               <button className={styles.okay} onClick={handleConfirm}>확인</button>
           </div>
       </div>
   ) : null;
}

export default TypeModal;