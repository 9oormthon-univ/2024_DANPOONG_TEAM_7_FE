import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setSelectedSocialPurpose,  setSocialPurposeModalOpen } from '../../redux/slices/SocialPurposeSlice';
import { updateActiveFilters } from '../../redux/slices/FilteredEnterpriseListSlice'; // 추가
import styles from '../../styles/enterprise/SocialPurposeModal.module.css';
import checkIcon from '../../assets/images/enterprise/type-check.svg'

// 상수로 유형 정의
const SOCIALPURPOSE = [
   '전체',
   '사회서비스제공형',
   '일자리제공형',
   '지역사회공헌형', 
   '혼합형',
   '기타(창의ㆍ혁신)형'
];

function SocialPurposeModal({ isActive, handleClose, initialSocialPurpose = [] }) {
   const dispatch = useDispatch();
   console.log('SocialPurposeModal - Initial SocialPurpose:', initialSocialPurpose);
   const [localSocialPurpose, setLocalSocialPurpose] = useState(initialSocialPurpose);

   const toggleSocialPurpose = (socialPurpose) => {
       setLocalSocialPurpose(prev => {
           // '전체' 유형 선택 시 로직
           if (socialPurpose === '전체') {
               return prev.includes('전체') ? [] : ['전체'];
           }
           
           // 다른 유형 선택 시
           const newSocialPurpose = prev.includes(socialPurpose)
               ? prev.filter(t => t !== socialPurpose)
               : [...prev.filter(t => t !== '전체'), socialPurpose];
           
           console.log('SocialPurposeModal - Toggling SocialPurpose:', {
               socialPurpose,
               previousSocialPurpose: prev,
               newSocialPurpose
           });
           
           return newSocialPurpose;
       });
   };

   const handleConfirm = () => {
       console.log('SocialPurposeModal - Confirming SocialPurpose:', {
           selectedSocialPurpose: localSocialPurpose
       });
       
       // SocialPurposeSlice에 선택한 카테고리 저장
       dispatch(setSelectedSocialPurpose(localSocialPurpose));
        
       // FilteredEnterpriseListSlice에 필터 업데이트
       dispatch(updateActiveFilters({
            socialPurpose: localSocialPurpose
       }));
        
       handleClose();
   };

   return isActive ? (
       <div className={styles.socialPurposeModalContainer}>
           <div className={styles.socialPurposeModalBackground} onClick={handleClose}></div>
           <div className={styles.socialPurposeModalContent}>
               <div className={styles.socialPurposeModalHeader}>
                   <p className={styles.modalName}>유형 설정</p>
                   <p className={styles.modalMemo}>중복 선택 가능</p>
               </div>
               <div className={styles.socialPurposeBtn}>
                   {SOCIALPURPOSE.map(socialPurpose => (
                       <button 
                           key={socialPurpose} 
                           className={localSocialPurpose.includes(socialPurpose) ? `${styles.socialPurpose} ${styles.selectedSocialPurpose}` : styles.socialPurpose} 
                           onClick={() => toggleSocialPurpose(socialPurpose)}
                       >
                           {socialPurpose}
                       </button>
                   ))}
               </div>
               <button className={styles.okay} onClick={handleConfirm}>확인</button>
           </div>
       </div>
   ) : null;
}

export default SocialPurposeModal;