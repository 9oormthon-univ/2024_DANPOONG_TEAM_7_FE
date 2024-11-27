import React, { useState } from 'react';
import styles from '../../styles/enterprise/SocialPurposeModal.module.css';
import { useEnterprise } from '../../contexts/EnterpriseContext';

const SOCIALPURPOSE = [
   '전체',
   '사회서비스제공형',
   '일자리제공형',
   '지역사회공헌형', 
   '혼합형',
   '기타(창의ㆍ혁신)형'
];

function SocialPurposeModal({ isActive, handleClose }) {
   const { activeFilters, updateFilters } = useEnterprise();
   const [localSocialPurpose, setLocalSocialPurpose] = useState(
       activeFilters.socialPurpose || []
   );

   const toggleSocialPurpose = (socialPurpose) => {
       setLocalSocialPurpose(prev => {
           if (socialPurpose === '전체') {
               return prev.includes('전체') ? [] : ['전체'];
           }
           
           const newSocialPurpose = prev.includes(socialPurpose)
               ? prev.filter(t => t !== socialPurpose)
               : [...prev.filter(t => t !== '전체'), socialPurpose];
           
           return newSocialPurpose;
       });
   };

   const handleConfirm = () => {
       updateFilters({ socialPurpose: localSocialPurpose });
       handleClose();
   };

   if (!isActive) return null;

   return (
       <div className={styles.socialPurposeModalContainer}>
           <div className={styles.socialPurposeModalBackground} onClick={handleClose} />
           <div className={styles.socialPurposeModalContent}>
               <div className={styles.socialPurposeModalHeader}>
                   <p className={styles.modalName}>유형 설정</p>
                   <p className={styles.modalMemo}>중복 선택 가능</p>
               </div>
               <div className={styles.socialPurposeBtn}>
                   {SOCIALPURPOSE.map(socialPurpose => (
                       <button 
                           key={socialPurpose} 
                           className={`${styles.socialPurpose} ${
                               localSocialPurpose.includes(socialPurpose) ? 
                               styles.selectedSocialPurpose : ''
                           }`}
                           onClick={() => toggleSocialPurpose(socialPurpose)}
                       >
                           {socialPurpose}
                       </button>
                   ))}
               </div>
               <button className={styles.okay} onClick={handleConfirm}>확인</button>
           </div>
       </div>
   );
}

export default SocialPurposeModal;