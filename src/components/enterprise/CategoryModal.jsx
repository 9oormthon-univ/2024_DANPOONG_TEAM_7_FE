import React , { useState }from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedCategories, setCategoryModalOpen } from '../../redux/slice/CategorySlice';
import { updateActiveFilters } from '../../redux/slice/FilteredEnterpriseListSlice'; 
import styles from '../../styles/enterprise/CategoryModal.module.css';

// 상수로 카테고리 정의
const CATEGORIES = [
  '교육', '보건', '사회복지', '환경',
  '문화/예술', '관광/운동', '보육',
  '산림보전및관리', '가사/간병',
  '문화재보존혹은활용관련서비스',
  '고용서비스', '청소등사업시설관리',
  '지역개발', '사회서비스제공형',
  '정보통신', '제조', '유통',
  '녹색에너지', '기타', '전체'
];

function CategoryModal({ handleClose }) {
    const dispatch = useDispatch();
    const { selectedCategories, isCategoryModalOpen } = useSelector(state => state.category);

    const [tempSelectedCategories, setTempSelectedCategories] = useState(selectedCategories);

    const handleCategorySelect = (category) => {
        if (category === '전체') {
            setTempSelectedCategories(
                tempSelectedCategories.includes('전체') ? [] : ['전체']
            );
        } else {
            setTempSelectedCategories(prev => {
                // 이미 '전체'가 선택되어 있었다면 제거
                if (prev.includes('전체')) {
                    prev = [];
                }
                
                // 해당 타입이 이미 선택되어 있으면 제거, 아니면 추가
                return prev.includes(category)
                    ? prev.filter(t => t !== category)
                    : [...prev, category];
            });
        }
    };

    // 모달 닫기 - 변경 사항을 저장하지 않음
    const handleCancel = () => {
        setTempSelectedCategories(selectedCategories); // 원래 선택 상태로 복원
        handleClose();
        dispatch(setCategoryModalOpen(false));
    };

    // 확인 버튼 클릭 시 - 변경 사항을 저장
    const handleConfirm = () => {
        dispatch(setSelectedCategories(tempSelectedCategories)); // CategorySlice 업데이트
        dispatch(updateActiveFilters({   // FilteredEnterpriseListSlice 업데이트
            categories: tempSelectedCategories
        }));
        handleClose();
        dispatch(setCategoryModalOpen(false));
    };

    // 선택 상태 확인 함수 - 임시 선택 상태를 사용
    const isCategorySelected = (category) => {
        return tempSelectedCategories.includes(category);
    };

    if (!isCategoryModalOpen) return null;

    return (
        <div className={styles.categoryModalContainer}>
            <div className={styles.categoryModalBackground} onClick={handleCancel}></div>
            <div className={styles.categoryModalContent}>
                <div className={styles.categoryModalHeader}>
                    <p className={styles.modalName}>카테고리 설정</p>
                    <p className={styles.modalMemo}>중복 선택 가능</p>
                </div>
                <div className={styles.categoryBtn}>
                    <div className={styles.row}>
                        <button 
                            className={`${styles.education} ${isCategorySelected('교육') && styles.selectedCategory}`}
                            onClick={() => handleCategorySelect('교육')}
                        >
                            교육
                        </button>
                        <button 
                            className={`${styles.health} ${isCategorySelected('보건') && styles.selectedCategory}`}
                            onClick={() => handleCategorySelect('보건')}
                        >
                            보건
                        </button>
                        <button 
                            className={`${styles.socialWelfare} ${isCategorySelected('사회복지') && styles.selectedCategory}`}
                            onClick={() => handleCategorySelect('사회복지')}
                        >
                            사회복지
                        </button>
                        <button 
                            className={`${styles.environment} ${isCategorySelected('환경') && styles.selectedCategory}`}
                            onClick={() => handleCategorySelect('환경')}
                        >
                            환경
                        </button>
                    </div>
                    <div className={styles.row}>
                        <button 
                            className={`${styles.cultureArt} ${isCategorySelected('문화, 예술') ? styles.selectedCategory : ''}`}
                            onClick={() => handleCategorySelect('문화, 예술')}
                        >
                            문화/예술
                        </button>
                        <button 
                            className={`${styles.tourismSports} ${isCategorySelected('관광/운동') ? styles.selectedCategory : ''}`}
                            onClick={() => handleCategorySelect('관광/운동')}
                        >
                            관광/운동
                        </button>
                        <button 
                            className={`${styles.childcare} ${isCategorySelected('보육') ? styles.selectedCategory : ''}`}
                            onClick={() => handleCategorySelect('보육')}
                        >
                            보육
                        </button>
                    </div>
                    <div className={styles.row}>
                        <button 
                            className={`${styles.forestConservationManagement} ${isCategorySelected('산림보전및관리') ? styles.selectedCategory : ''}`}
                            onClick={() => handleCategorySelect('산림보전및관리')}
                        >
                            산림 보전 및 관리
                        </button>
                        <button 
                            className={`${styles.housekeepingCare} ${isCategorySelected('가사/간병') ? styles.selectedCategory : ''}`}
                            onClick={() => handleCategorySelect('가사/간병')}
                        >
                            가사/간병
                        </button>
                    </div>
                    <div className={styles.row}>
                        <button 
                            className={`${styles.culturalHeritageConservationUtilization} ${isCategorySelected('문화재보존혹은활용관련서비스') ? styles.selectedCategory : ''}`}
                            onClick={() => handleCategorySelect('문화재보존혹은활용관련서비스')}
                        >
                            문화재 보존 혹은 활용 관련 서비스
                        </button>
                    </div>
                    <div className={styles.row}>
                        <button 
                            className={`${styles.employmentServices} ${isCategorySelected('고용서비스') ? styles.selectedCategory : ''}`}
                            onClick={() => handleCategorySelect('고용서비스')}
                        >
                            고용 서비스
                        </button>
                        <button 
                            className={`${styles.facilityManagementCleaning} ${isCategorySelected('청소등사업시설관리') ? styles.selectedCategory : ''}`}
                            onClick={() => handleCategorySelect('청소등사업시설관리')}
                        >
                            청소 등 사업 시설 관리
                        </button>
                    </div>
                    <div className={styles.row}>
                        <button 
                            className={`${styles.regionalDevelopment} ${isCategorySelected('지역개발') ? styles.selectedCategory : ''}`}
                            onClick={() => handleCategorySelect('지역개발')}
                        >
                            지역 개발
                        </button>
                        <button 
                            className={`${styles.socialServiceProvision} ${isCategorySelected('사회서비스제공형') ? styles.selectedCategory : ''}`}
                            onClick={() => handleCategorySelect('사회서비스제공형')}
                        >
                            사회 서비스 제공형
                        </button>
                    </div>
                    <div className={styles.row}>
                        <button 
                            className={`${styles.informationTechnology} ${isCategorySelected('정보통신') ? styles.selectedCategory : ''}`}
                            onClick={() => handleCategorySelect('정보통신')}
                        >
                            정보 통신
                        </button>
                        <button 
                            className={`${styles.manufacturing} ${isCategorySelected('제조') ? styles.selectedCategory : ''}`}
                            onClick={() => handleCategorySelect('제조')}
                        >
                            제조
                        </button>
                        <button 
                            className={`${styles.distribution} ${isCategorySelected('유통') ? styles.selectedCategory : ''}`}
                            onClick={() => handleCategorySelect('유통')}
                        >
                            유통
                        </button>
                    </div>
                    <div className={styles.row}>
                        <button 
                            className={`${styles.greenEnergy} ${isCategorySelected('녹색에너지') ? styles.selectedCategory : ''}`}
                            onClick={() => handleCategorySelect('녹색에너지')}
                        >
                            녹색 에너지
                        </button>
                        <button 
                            className={`${styles.others} ${isCategorySelected('기타') ? styles.selectedCategory : ''}`}
                            onClick={() => handleCategorySelect('기타')}
                        >
                            기타
                        </button>
                        <button 
                            className={`${styles.all} ${isCategorySelected('전체') ? styles.selectedCategory : ''}`}
                            onClick={() => handleCategorySelect('전체')}
                        >
                            전체
                        </button>
                    </div>
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

export default CategoryModal;