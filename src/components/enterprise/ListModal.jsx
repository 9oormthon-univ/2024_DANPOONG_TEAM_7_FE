import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import CategoryModal from './CategoryModal';
import TypeModal from './TypeModal';
import styles from '../../styles/enterprise/ListModal.module.css';

function ListModal({ isActive, handleClose }) {
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isTypeModalOpen, setIsTypeModalOpen] = useState(false);
  const [selectedType, setSelectedType] = useState('');
  
  // Redux store에서 기업 데이터와 선택된 카테고리 가져오기
  const { socialEnterprises, filteredEnterprises, selectedCategories } = useSelector(state => state.enterprise);

  // Redux store의 데이터 상태 확인
  console.log('ListModal - Redux State:', {
   totalEnterprises: socialEnterprises.length,
   filteredEnterprises: filteredEnterprises.length,
   selectedCategories
   });
  
  // 표시할 기업 데이터 결정
  const enterprises = selectedCategories.includes('전체')
       ? socialEnterprises
       : filteredEnterprises;

  console.log('ListModal - Displayed Enterprises:', {
   count: enterprises.length,
   isFiltered: selectedCategories.length > 0 && !selectedCategories.includes('전체'),
   categories: selectedCategories
  });

  const openCategoryModal = () => {
      setIsCategoryModalOpen(true);
  };

  const closeCategoryModal = () => {
      setIsCategoryModalOpen(false);
  };

  const openTypeModal = (type) => {
      setIsTypeModalOpen(true);
      setSelectedType(type);
  };

  const closeTypeModal = () => {
      setIsTypeModalOpen(false);
      setSelectedType('');
  };

  if (!isActive) return null;

  return (
      <div className={styles.listModalContainer}>
          <div className={styles.listModalBackground} onClick={handleClose}></div>
          <div className={styles.listModalContent}>
              <div className={styles.listModalHeader}>
                  <button className={styles.alignmentBtn} onClick={() => openCategoryModal('category')}>
                      <p>카테고리별</p>
                  </button>
                  <button className={styles.alignmentBtn} onClick={() => openTypeModal('type')}>
                      <p>유형별</p>
                  </button>
                  <button className={styles.alignmentBtn}>
                      <p>온 오프</p>
                  </button>
              </div>
              <div className={styles.companySorting}>
                  <button className={styles.sortingReviewBtn}>리뷰 순</button>
                  <button className={styles.sortingRecommendationBtn}>높은 추천 순</button>
              </div>
              <div className={styles.companyList}>
                  {selectedCategories.length === 0 ? (
                      socialEnterprises.map((list, index) => (
                          <div key={list.number || index} className={styles.socialEnterprise}>
                              <div className={styles.listRow}>
                                  <p className={styles.listCompanyName}>{list.companyName}</p>
                                  <p className={styles.listSocialPurposeType}>{list.socialPurposeType}</p>
                              </div>
                              <div className={styles.listRow}>
                                  <p className={styles.listAddress}>{list.address}</p>
                              </div>
                              <div className={styles.listRow}>
                                  <button className={styles.listInfo}>정보 보기</button>
                              </div>
                          </div>
                      ))
                  ) : enterprises && enterprises.length > 0 ? (
                      enterprises.map((list, index) => (
                          <div key={list.number || index} className={styles.socialEnterprise}>
                              <div className={styles.listRow}>
                                  <p className={styles.listCompanyName}>{list.companyName}</p>
                                  <p className={styles.listSocialPurposeType}>{list.socialPurposeType}</p>
                              </div>
                              <div className={styles.listRow}>
                                  <p className={styles.listAddress}>{list.address}</p>
                              </div>
                              <div className={styles.listRow}>
                                  <button className={styles.listInfo}>정보 보기</button>
                              </div>
                          </div>
                      ))
                  ) : (
                      <p>선택한 카테고리에 해당하는 기업이 없습니다.</p>
                  )}
              </div>
          </div>

          {isCategoryModalOpen && (
              <CategoryModal
                  isActive={isCategoryModalOpen}
                  handleClose={closeCategoryModal}
                  initialCategories={selectedCategories}
              />
          )}

          {isTypeModalOpen && (
              <TypeModal
                  isActive={isTypeModalOpen}
                  handleClose={closeTypeModal}
                  selectedType={selectedType}
                  setSelectedType={setSelectedType}
              />
          )}
      </div>
  );
}

export default ListModal;