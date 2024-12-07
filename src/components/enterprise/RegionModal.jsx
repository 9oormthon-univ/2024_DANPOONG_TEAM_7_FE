import React, { useState, useEffect } from 'react';
import { saveToLocalStorage, getFromLocalStorage, STORAGE_KEYS } from '../../utils/enterpriseStorage';
import { useEnterprise } from '../../contexts/EnterpriseContext';
import styles from '../../styles/enterprise/RegionModal.module.css';
import LoadingSpinner from '../layout/LoadingSpinner';
import activeBtn from '../../assets/images/login/region-active.svg';
import back from '../../assets/images/layout/back-button.svg';

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
    const { updateRegion } = useEnterprise(); 
    const [selectedRegion, setSelectedRegion] = useState('');
    const [selectedCity, setSelectedCity] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isExiting, setIsExiting] = useState(false);

    const handleClose = () => {
        setIsExiting(true);
        setTimeout(() => {
            setIsExiting(false);
            onClose();
        }, 300);
    };

    const getCitiesForRegion = (region) => {
        const regionData = CITY.find(item => item[region]);
        return regionData ? regionData[region] : [];
    };
   
    const handleRegionSelect = (region) => {
        setSelectedRegion(region);
        setSelectedCity('');
    };

    const handleCitySelect = (city) => {
        setSelectedCity(city);
    };

    const handleConfirm = async () => {
        if (!selectedRegion || !selectedCity) return;
        
        setIsLoading(true);
        try {
            await updateRegion({
                region: selectedRegion,
                cities: [selectedCity]
            });
            await new Promise(resolve => setTimeout(resolve, 500));
        } finally {
            setIsLoading(false);
            handleClose();
        }
    };

    useEffect(() => {
        if (isOpen) {
            const savedRegion = getFromLocalStorage(STORAGE_KEYS.REGION, '');
            const savedCities = getFromLocalStorage(STORAGE_KEYS.CITIES, []);
            setSelectedRegion(typeof savedRegion === 'object' ? savedRegion.region : savedRegion);
            setSelectedCity(savedCities.length > 0 ? savedCities[0] : '');
        }
    }, [isOpen]);

    const isRegionUpdating = (region) => {
        const cities = getCitiesForRegion(region);
        return cities.length === 1 && cities[0] === '업데이트 예정';
    };

    if (!isOpen) return null;

    return (
        <div className={`${styles.regionModalContainer} ${isExiting ? styles.slideOutLeft : ''}`}>
            {isLoading && (
                <div className={styles.loading}>
                    <LoadingSpinner />
                </div>
            )}
            <div className={styles.regionModalHeader}>
                <button className={styles.backBtn} onClick={handleClose}>
                    <img src={back} alt='close modal' className={styles.back} />
                </button>
                <p className={styles.modalName}>지역 설정</p>
            </div>
            <div className={styles.regionModalContent}>
                <div className={styles.regionGrid}>
                    {REGIONS.map(region => (
                        <button
                            key={region}
                            className={`${styles.regionButton} ${
                                selectedRegion === region ? styles.activeRegionButton : ''
                            }`}
                            onClick={() => handleRegionSelect(region)}
                        >
                            {region}
                        </button>
                    ))}
                </div>

                {selectedRegion && (
                    <div className={styles.cityGrid}>
                        {isRegionUpdating(selectedRegion) ? (
                            <button
                                className={styles.cityButton}
                                style={{ backgroundColor: 'transparent', color: '#D9D9D9' }}
                                disabled
                            >
                                업데이트 예정
                            </button>
                        ) : (
                            getCitiesForRegion(selectedRegion).map(city => (
                                <button
                                    key={city}
                                    className={`${styles.cityButton} ${selectedCity === city ? styles.selected : ''}`}
                                    onClick={() => handleCitySelect(city)}
                                >
                                    {city}
                                </button>
                            ))
                        )}
                    </div>
                )}
            </div>
            <button 
                className={styles.confirmButton} 
                onClick={handleConfirm}
                disabled={!selectedRegion || !selectedCity || isLoading}
            >
                적용하기
            </button>
        </div>
    );
}

export default RegionModal;