import React, { useState } from 'react';
import { saveToLocalStorage, getFromLocalStorage, STORAGE_KEYS } from '../../utils/enterpriseStorage';
import styles from '../../styles/enterprise/RegionModal.module.css';

//img
import activeBtn from '../../assets/images/login/region-active.svg';

const REGIONS = ['서울', '경기', '강원', '충북', '충남', '전북', '전남', '광주', '경북', '경남', '제주'];

const CITY = [
    {'경기': ['전체', '수원시','성남시','고양시','용인시','부천시','안산시','안양시','남양주시','화성시','평택시','의정부시',
        '파주시','시흥시','김포시','광명시','광주시','군포시','하남시','오산시','양주시','구리시','안성시','포천시',
        '의왕시','여주시','양평군','동두천시','과천시','가평군','연천군']},
    {'서울': ['업데이트 예정']},
    {'강원': ['업데이트 예정']},
    {'충북': ['업데이트 예정']},
    {'충남': ['업데이트 예정']},
    {'전북': ['업데이트 예정']},
    {'전남': ['업데이트 예정']},
    {'광주': ['업데이트 예정']},
    {'경북': ['업데이트 예정']},
    {'경남': ['업데이트 예정']},
    {'제주': ['업데이트 예정']}
];

function RegionModal({ isOpen, onClose, onRegionChange }) {
    const [selectedRegion, setSelectedRegion] = useState(() => {
        const savedRegion = getFromLocalStorage(STORAGE_KEYS.REGION, '');
        // 이전에 객체 형태로 저장된 경우를 처리
        return typeof savedRegion === 'object' ? savedRegion.region : savedRegion;
    });

    const [selectedCities, setSelectedCities] = useState([]);
    const [selectedCity, setSelectedCity] = useState('');

    const getCitiesForRegion = (region) => {
        const regionData = CITY.find(item => item[region]);
        if (!regionData) return [];
        
        const cities = regionData[region];
        if (cities[0] === '업데이트 예정') {
            return cities;
        }
        
        return cities;
    };
    
    const handleRegionSelect = (region) => {
        setSelectedRegion(region);
        setSelectedCity('');
        const cities = getCitiesForRegion(region);
        setSelectedCities(cities);
    };

    const handleCitySelect = (city) => {
        setSelectedCity(city);
        if (city === '전체') {
            console.log(`${selectedRegion} 전체 도시 선택됨`);
        } else {
            console.log(`선택된 도시: ${city}`);
        }
    };

    /*
    const handleConfirm = () => {
        const finalRegion = {
            region: selectedRegion,
            city: selectedCity || '전체' // 도시가 선택되지 않았을 경우 '전체'로 설정
        };
        saveToLocalStorage(STORAGE_KEYS.REGION, finalRegion);
        onRegionChange(finalRegion);
        onClose();
    };
    */

    const handleConfirm = () => {
        saveToLocalStorage(STORAGE_KEYS.REGION, selectedRegion);
        onRegionChange(selectedRegion);
        onClose();
    };

    const isCityAvailable = (city) => {
        return city === '전체' || city !== '업데이트 예정';
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
                            style={{
                                backgroundImage: selectedRegion === region ? `url(${activeBtn})` : 'none'
                            }}
                            className={`${styles.regionButton} ${selectedRegion === region ? styles.selectedRegion : ''}`}
                            onClick={() => handleRegionSelect(region)}
                        >
                            {region}
                        </button>
                    ))}
                </div>

                {selectedRegion && (
                    <div className={styles.cityGrid}>
                        {selectedCities.length > 0 ? (
                            selectedCities.map(city => (
                                <button
                                    key={city}
                                    className={`${styles.cityButton} ${
                                        selectedCity === city ? styles.selected : ''
                                    } ${!isCityAvailable(city) ? styles.disabled : ''}`}
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
            <button 
                className={styles.confirmButton} 
                onClick={handleConfirm}
                disabled={!selectedRegion} // 지역만 선택되어 있으면 버튼 활성화
            >
                적용하기
            </button>
        </div>
    );
}

export default RegionModal;