import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedOnoffStore, setOnoffModalOpen } from '../../redux/slice/OnoffStoreSlice';
import { updateActiveFilters } from '../../redux/slice/FilteredEnterpriseListSlice';
import styles from '../../styles/enterprise/OnoffStoreModal.module.css';
import checkIcon from '../../assets/images/enterprise/type-check.svg'

// 상수로 카테고리 정의
const ONOFFSTORE = ['온라인','오프라인'];

function OnoffStoreModal({ handleClose }) {
   const dispatch = useDispatch();
   const { selectedOnoffStore, isOnoffModalOpen } = useSelector(state => state.onoffStore);
   // 단일 선택을 위해 배열 대신 단일 문자열 상태 사용
   const [localOnoffStore, setLocalOnoffStore] = useState(
    selectedOnoffStore.length > 0 ? selectedOnoffStore[0] : ''
    );


   const toggleOnoffStore = (onoffStore) => {
    // 이미 선택된 항목을 다시 클릭하면 선택 해제
    if (localOnoffStore === onoffStore) {
        setLocalOnoffStore('');
    } else {
        // 다른 항목 선택
        setLocalOnoffStore(onoffStore);
    }
    };

    const handleConfirm = () => {
        console.log('OnoffStoreModal - Confirming OnoffStore:', {
            selectedOnoffStore: localOnoffStore
        });
        
        // 단일 문자열을 배열로 변환하여 저장
        const onoffStoreArray = localOnoffStore ? [localOnoffStore] : [];
        
        dispatch(setSelectedOnoffStore(onoffStoreArray)); // OnoffStoreSlice 업데이트
        dispatch(updateActiveFilters({   // FilteredEnterpriseListSlice 업데이트
            onoffStore: onoffStoreArray
        }));
        dispatch(setOnoffModalOpen(false));
        handleClose();
    };

   if (!isOnoffModalOpen) return null;

   return (
       <div className={styles.onoffStoreModalContainer}>
           <div className={styles.onoffStoreModalBackground} onClick={handleClose}></div>
           <div className={styles.onoffStoreModalContent}>
               <div className={styles.onoffStoreModalHeader}>
                   <p className={styles.modalName}>온/오프라인</p>
                   <p className={styles.modalMemo}>하나만 선택 가능</p>
               </div>
               <div className={styles.onoffStoreBtn}>
                   {ONOFFSTORE.map(onoffStore => (
                       <button 
                           key={onoffStore} 
                           className={localOnoffStore.includes(onoffStore) ? `${styles.onoffStore} ${styles.selectedOnoffStore}` : styles.onoffStore} 
                           onClick={() => toggleOnoffStore(onoffStore)}
                       >
                           {onoffStore}
                       </button>
                   ))}
               </div>
               <div className={styles.buttonContainer}>
                   <button 
                       className={styles.okay} 
                       onClick={handleConfirm}
                   >
                       확인
                   </button>
               </div>
           </div>
       </div>
   );
}

export default OnoffStoreModal;