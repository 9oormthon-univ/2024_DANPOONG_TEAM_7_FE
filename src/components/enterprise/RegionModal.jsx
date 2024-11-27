// src/components/enterprise/RegionModal.jsx
import React, { useState } from 'react';
import { saveToLocalStorage, getFromLocalStorage, STORAGE_KEYS } from '../../utils/enterpriseStorage';
import styles from '../../styles/enterprise/RegionModal.module.css';

const REGIONS = ['서울', '경기', '인천', '강원', '충북', '충남', '대전', '세종', '전북', '전남', '광주', '경북', '경남', '대구', '울산', '부산', '제주'];

const CITY = [
    {'경기': ['수원시','성남시','고양시','용인시','부천시','안산시','안양시','남양주시','화성시','평택시','의정부시',
        '파주시','시흥시','김포시','광명시','광주시','군포시','하남시','오산시','양주시','구리시','안성시','포천시',
        '의왕시','여주시','양평군','동두천시','과천시','가평군','연천군']},
    {'서울': ['업데이트 예정']}, 
    {'인천': ['업데이트 예정']}, 
    {'강원': ['업데이트 예정']}, 
    {'충북': ['업데이트 예정']}, 
    {'충남': ['업데이트 예정']}, 
    {'대전': ['업데이트 예정']}, 
    {'세종': ['업데이트 예정']}, 
    {'전북': ['업데이트 예정']}, 
    {'전남': ['업데이트 예정']}, 
    {'광주': ['업데이트 예정']}, 
    {'경북': ['업데이트 예정']}, 
    {'경남': ['업데이트 예정']}, 
    {'대구': ['업데이트 예정']}, 
    {'울산': ['업데이트 예정']}, 
    {'부산': ['업데이트 예정']}, 
    {'제주': ['업데이트 예정']}
];

function RegionModal({ isOpen, onClose, onRegionChange }) {
    const [selectedRegion, setSelectedRegion] = useState(getFromLocalStorage(STORAGE_KEYS.REGION, ''));
    const [selectedCities, setSelectedCities] = useState([]);

    // 도시 데이터를 해당 지역에 맞게 가져오는 함수
    const getCitiesForRegion = (region) => {
        const regionData = CITY.find(item => item[region]);
        return regionData ? regionData[region] : [];
    };

    const handleRegionSelect = (region) => {
        setSelectedRegion(region);
        const cities = getCitiesForRegion(region);
        setSelectedCities(cities);
    };

    const handleCitySelect = (city) => {
        // 도시에 대한 선택 처리를 여기에 추가할 수 있음
        console.log(`선택된 도시: ${city}`);
    };

    const handleConfirm = () => {
        saveToLocalStorage(STORAGE_KEYS.REGION, selectedRegion);
        onRegionChange(selectedRegion);
        onClose();
    };

    const isCityAvailable = (city) => {
        return city !== '업데이트 예정';
    };

    if (!isOpen) return null;

    return (
        <div className={styles.regionModalContainer}>
            <div className={styles.regionModalHeader}>
                <p className={styles.modalName}>지역 설정</p>
            </div>
            <div className={styles.regionModalContent}>
                
                <div className={styles.regionGrid}>
                    {REGIONS.map(region => (
                        <button
                            key={region}
                            className={`${styles.regionButton} ${selectedRegion === region ? styles.selected : ''}`}
                            onClick={() => handleRegionSelect(region)}
                        >
                            {region}
                        </button>
                    ))}
                </div>

                {/* 선택된 지역에 해당하는 도시들 표시 */}
                {selectedRegion && (
                    <div className={styles.cityGrid}>
                        
                        {selectedCities.length > 0 ? (
                            selectedCities.map(city => (
                                <button
                                    key={city}
                                    className={`${styles.cityButton} ${!isCityAvailable(city) ? styles.disabled : ''}`}
                                    onClick={() => isCityAvailable(city) && handleCitySelect(city)}
                                    disabled={!isCityAvailable(city)}
                                >
                                    {city}
                                </button>
                            ))
                        ) : (
                            <p className={styles.noCities}>도시 정보가 없습니다.</p>
                        )}
                    </div>
                )}

                
            </div>
            <button className={styles.confirmButton} onClick={handleConfirm}>
                확인
            </button>
        </div>
    );
}

export default RegionModal;
