// src/components/login/SelectRegion.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../../styles/login/SelectRegion.module.css';
import { saveToLocalStorage, STORAGE_KEYS } from '../../utils/enterpriseStorage';

const REGIONS = ['서울', '경기', '인천', '강원', '충북', '충남', '대전', '세종', '전북', '전남', '광주', '경북', '경남', '대구', '울산', '부산', '제주'];

function SelectRegion() {
    const navigate = useNavigate();
    const [selectedRegion, setSelectedRegion] = useState('');

    const handleRegionSelect = (region) => {
        setSelectedRegion(region);
        saveToLocalStorage(STORAGE_KEYS.REGION, region);
    };

    const handleStartClick = () => {
        if (selectedRegion) {
            navigate('/home');
        } else {
            alert('지역을 선택해주세요.');
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.regionGrid}>
                {REGIONS.map(region => (
                    <div
                        key={region}
                        className={`${styles.regionButton} ${selectedRegion === region ? styles.selected : ''}`}
                        onClick={() => handleRegionSelect(region)}
                    >
                        {region}
                    </div>
                ))}
                <button 
                    className={`${styles.regionButton} ${selectedRegion === '경기' ? styles.selected : ''}`}
                    onClick={() => handleRegionSelect('경기')}
                >
                    경기
                </button>
            </div>
            <div className={styles.content}>
                {selectedRegion && <p>{selectedRegion} 지역이 선택되었습니다.</p>}
            </div>
            <button 
                className={styles.startBtn}
                onClick={handleStartClick}
                disabled={!selectedRegion}
            >
                <p>시작하기</p>
            </button>
        </div>
    );
}

export default SelectRegion;