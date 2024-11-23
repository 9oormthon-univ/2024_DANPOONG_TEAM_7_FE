import React , { useState }from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styles from '../../styles/enterprise/TypeModal.module.css';

//redux
import { setSelectedTypes, setTypeModalOpen } from '../../redux/slices/TypeSlice';
import { updateActiveFilters } from '../../redux/slices/FilteredEnterpriseListSlice'; 

// 상수로 카테고리 정의
const TYPE = [
  '교육', '보건', '사회복지', '환경',
  '문화/예술', '관광/운동', '보육',
  '산림보전및관리', '가사/간병',
  '문화재보존혹은활용관련서비스',
  '고용서비스', '청소등사업시설관리',
  '지역개발', '사회서비스제공형',
  '정보통신', '제조', '유통',
  '녹색에너지', '기타', '전체'
];

function TypeModal({ handleClose }) {
    const dispatch = useDispatch();
    const { selectedTypes, isTypeModalOpen } = useSelector(state => state.type);

    const [tempSelectedTypes, setTempSelectedTypes] = useState(selectedTypes);

    const handleTypeSelect = (type) => {
        if (type === '전체') {
            setTempSelectedTypes(
                tempSelectedTypes.includes('전체') ? [] : ['전체']
            );
        } else {
            setTempSelectedTypes(prev => {
                // 이미 '전체'가 선택되어 있었다면 제거
                if (prev.includes('전체')) {
                    prev = [];
                }
                
                // 해당 타입이 이미 선택되어 있으면 제거, 아니면 추가
                return prev.includes(type)
                    ? prev.filter(t => t !== type)
                    : [...prev, type];
            });
        }
    };

    // 모달 닫기 - 변경 사항을 저장하지 않음
    const handleCancel = () => {
        setTempSelectedTypes(selectedTypes); // 원래 선택 상태로 복원
        handleClose();
        dispatch(setTypeModalOpen(false));
    };

    // 확인 버튼 클릭 시 - 변경 사항을 저장
    const handleConfirm = () => {
        dispatch(setSelectedTypes(tempSelectedTypes)); // CategorySlice 업데이트
        dispatch(updateActiveFilters({   // FilteredEnterpriseListSlice 업데이트
            types: tempSelectedTypes
        }));
        handleClose();
        dispatch(setTypeModalOpen(false));
    };

    // 선택 상태 확인 함수 - 임시 선택 상태를 사용
    const isTypeSelected = (type) => {
        return tempSelectedTypes.includes(type);
    };

    if (!isTypeModalOpen) return null;

    return (
        <div className={styles.typeModalContainer}>
            <div className={styles.typeModalBackground} onClick={handleCancel}></div>
            <div className={styles.typeModalContent}>
                <div className={styles.typeModalHeader}>
                    <p className={styles.modalName}>카테고리 설정</p>
                    <p className={styles.modalMemo}>중복 선택 가능</p>
                </div>
                <div className={styles.typeBtn}>
                    <div className={styles.row}>
                        <button 
                            className={`${styles.education} ${isTypeSelected('교육') && styles.selectedType}`}
                            onClick={() => handleTypeSelect('교육')}
                        >
                            교육
                        </button>
                        <button 
                            className={`${styles.health} ${isTypeSelected('보건') && styles.selectedType}`}
                            onClick={() => handleTypeSelect('보건')}
                        >
                            보건
                        </button>
                        <button 
                            className={`${styles.socialWelfare} ${isTypeSelected('사회복지') && styles.selectedType}`}
                            onClick={() => handleTypeSelect('사회복지')}
                        >
                            사회복지
                        </button>
                        <button 
                            className={`${styles.environment} ${isTypeSelected('환경') && styles.selectedType}`}
                            onClick={() => handleTypeSelect('환경')}
                        >
                            환경
                        </button>
                    </div>
                    <div className={styles.row}>
                        <button 
                            className={`${styles.cultureArt} ${isTypeSelected('문화, 예술') ? styles.selectedType : ''}`}
                            onClick={() => handleTypeSelect('문화, 예술')}
                        >
                            문화/예술
                        </button>
                        <button 
                            className={`${styles.tourismSports} ${isTypeSelected('관광/운동') ? styles.selectedType : ''}`}
                            onClick={() => handleTypeSelect('관광/운동')}
                        >
                            관광/운동
                        </button>
                        <button 
                            className={`${styles.childcare} ${isTypeSelected('보육') ? styles.selectedType : ''}`}
                            onClick={() => handleTypeSelect('보육')}
                        >
                            보육
                        </button>
                    </div>
                    <div className={styles.row}>
                        <button 
                            className={`${styles.forestConservationManagement} ${isTypeSelected('산림보전및관리') ? styles.selectedType : ''}`}
                            onClick={() => handleTypeSelect('산림보전및관리')}
                        >
                            산림 보전 및 관리
                        </button>
                        <button 
                            className={`${styles.housekeepingCare} ${isTypeSelected('가사/간병') ? styles.selectedType : ''}`}
                            onClick={() => handleTypeSelect('가사/간병')}
                        >
                            가사/간병
                        </button>
                    </div>
                    <div className={styles.row}>
                        <button 
                            className={`${styles.culturalHeritageConservationUtilization} ${isTypeSelected('문화재보존혹은활용관련서비스') ? styles.selectedType : ''}`}
                            onClick={() => handleTypeSelect('문화재보존혹은활용관련서비스')}
                        >
                            문화재 보존 혹은 활용 관련 서비스
                        </button>
                    </div>
                    <div className={styles.row}>
                        <button 
                            className={`${styles.employmentServices} ${isTypeSelected('고용서비스') ? styles.selectedType : ''}`}
                            onClick={() => handleTypeSelect('고용서비스')}
                        >
                            고용 서비스
                        </button>
                        <button 
                            className={`${styles.facilityManagementCleaning} ${isTypeSelected('청소등사업시설관리') ? styles.selectedType : ''}`}
                            onClick={() => handleTypeSelect('청소등사업시설관리')}
                        >
                            청소 등 사업 시설 관리
                        </button>
                    </div>
                    <div className={styles.row}>
                        <button 
                            className={`${styles.regionalDevelopment} ${isTypeSelected('지역개발') ? styles.selectedType : ''}`}
                            onClick={() => handleTypeSelect('지역개발')}
                        >
                            지역 개발
                        </button>
                        <button 
                            className={`${styles.socialServiceProvision} ${isTypeSelected('사회서비스제공형') ? styles.selectedType : ''}`}
                            onClick={() => handleTypeSelect('사회서비스제공형')}
                        >
                            사회 서비스 제공형
                        </button>
                    </div>
                    <div className={styles.row}>
                        <button 
                            className={`${styles.informationTechnology} ${isTypeSelected('정보통신') ? styles.selectedType : ''}`}
                            onClick={() => handleTypeSelect('정보통신')}
                        >
                            정보 통신
                        </button>
                        <button 
                            className={`${styles.manufacturing} ${isTypeSelected('제조') ? styles.selectedType : ''}`}
                            onClick={() => handleTypeSelect('제조')}
                        >
                            제조
                        </button>
                        <button 
                            className={`${styles.distribution} ${isTypeSelected('유통') ? styles.selectedType : ''}`}
                            onClick={() => handleTypeSelect('유통')}
                        >
                            유통
                        </button>
                    </div>
                    <div className={styles.row}>
                        <button 
                            className={`${styles.greenEnergy} ${isTypeSelected('녹색에너지') ? styles.selectedType : ''}`}
                            onClick={() => handleTypeSelect('녹색에너지')}
                        >
                            녹색 에너지
                        </button>
                        <button 
                            className={`${styles.others} ${isTypeSelected('기타') ? styles.selectedType : ''}`}
                            onClick={() => handleTypeSelect('기타')}
                        >
                            기타
                        </button>
                        <button 
                            className={`${styles.all} ${isTypeSelected('전체') ? styles.selectedType : ''}`}
                            onClick={() => handleTypeSelect('전체')}
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

export default TypeModal;