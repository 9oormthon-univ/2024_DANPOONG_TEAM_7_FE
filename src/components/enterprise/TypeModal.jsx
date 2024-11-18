// components/modal/TypeModal.jsx
import React from 'react';
import styles from '../../styles/enterprise/TypeModal.module.css';

function TypeModal({ isActive, handleClose, setSelectedType }) {
    return isActive ? (
        <div className={styles.typeModalContainer}>
            <div className={styles.typeModalBackground} onClick={handleClose}></div>
            <div className={styles.typeModalContent}>
                <div className={styles.typeModalHeader}>
                    <p className={styles.modalName}>유형 설정</p>
                    <p className={styles.modalMemo}>중복 선택 가능</p>
                </div>
                <div className={styles.typeBtn}>
                    <div className={styles.row}>
                        <button className={styles.education} onClick={() => setSelectedType('교육')}>
                            교육
                        </button>
                        <button className={styles.health} onClick={() => setSelectedType('보건')}>
                            보건
                        </button>
                        <button className={styles.socialWelfare} onClick={() => setSelectedType('사회복지')}>
                            사회복지
                        </button>
                        <button className={styles.environment} onClick={() => setSelectedType('환경')}>
                            환경
                        </button>    
                    </div>
                    <div className={styles.row}>
                        <button className={styles.cultureArt} onClick={() => setSelectedType('문화/예술')}>
                            문화/예술
                        </button>
                        <button className={styles.tourismSports} onClick={() => setSelectedType('관광/운동')}>
                            관광/운동
                        </button>
                        <button className={styles.childcare} onClick={() => setSelectedType('보육')}>
                            보육
                        </button>
                    </div>
                    <div className={styles.row}>
                        <button className={styles.forestConservationManagement} onClick={() => setSelectedType('산림 보전 및 관리')}>
                            산림 보전 및 관리
                        </button>
                        <button className={styles.housekeepingCare} onClick={() => setSelectedType('가사/간병')}>
                            가사/간병
                        </button>
                    </div>
                    <div className={styles.row}>
                        <button className={styles.culturalHeritageConservationUtilization} onClick={() => setSelectedType('문화재 보존 혹은 활용 관련 서비스')}>
                            문화재 보존 혹은 활용 관련 서비스
                        </button>
                    </div>
                    <div className={styles.row}>
                        <button className={styles.employmentServices} onClick={() => setSelectedType('고용 서비스')}>
                            고용 서비스
                        </button>
                        <button className={styles.facilityManagementCleaning} onClick={() => setSelectedType('청소 등 사업 시설 관리')}>
                            청소 등 사업 시설 관리
                        </button>
                    </div>
                    <div className={styles.row}>
                        <button className={styles.regionalDevelopment} onClick={() => setSelectedType('지역 개발')}>
                            지역 개발
                        </button>
                        <button className={styles.socialServiceProvision} onClick={() => setSelectedType('사회 서비스 제공형')}>
                            사회 서비스 제공형
                        </button>
                    </div>
                    <div className={styles.row}>
                        <button className={styles.informationTechnology} onClick={() => setSelectedType('정보 통신')}>
                            정보 통신
                        </button>
                        <button className={styles.manufacturing} onClick={() => setSelectedType('제조')}>
                            제조
                        </button>
                        <button className={styles.distribution} onClick={() => setSelectedType('유통')}>
                            유통
                        </button>
                    </div>
                    <div className={styles.row}>
                        <button className={styles.greenEnergy} onClick={() => setSelectedType('녹색 에너지')}>
                            녹색 에너지
                        </button>
                        <button className={styles.others} onClick={() => setSelectedType('기타')}>
                            기타
                        </button>
                        <button className={styles.all} onClick={() => setSelectedType('전체')}>
                            전체
                        </button>
                    </div>
                </div>
                <button className={styles.okay} onClick={handleClose}>확인</button>
            </div>
        </div>
    ) : null;
}

export default TypeModal;