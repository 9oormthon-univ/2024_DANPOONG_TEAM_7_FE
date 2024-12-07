import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../../styles/login/SelectRegion.module.css';
import { saveToLocalStorage, STORAGE_KEYS } from '../../utils/enterpriseStorage';
import { useEnterprise } from '../../contexts/EnterpriseContext';
import TopBar from '../../components/layout/TopBar';
import LoadingSpinner from '../../components/layout/LoadingSpinner';

//img
import activeBtn from '../../assets/images/login/region-active.svg';

const REGIONS = ['서울', '경기', '강원', '충북', '충남', '전북', '전남', '광주', '경북', '경남', '제주'];

const CITY = [
   {'경기': ['전체','수원시','성남시','고양시','용인시','부천시','안산시','안양시','남양주시','화성시','평택시','의정부시',
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

function SelectRegion() {
   const navigate = useNavigate();
   const [selectedRegion, setSelectedRegion] = useState('경기');
   const [selectedCities, setSelectedCities] = useState(new Set());
   const [isLoading, setIsLoading] = useState(false);
   const { updateRegion, fetchEnterprises } = useEnterprise();

   const handleRegionSelect = (region) => {
    setSelectedRegion(region);
    setSelectedCities(new Set()); // 도시 선택 초기화
};

const handleCitySelect = (city) => {
    if (city === '전체') {
        setSelectedCities(new Set(['전체']));
    } else {
        const newSelectedCities = new Set([city]);
        setSelectedCities(newSelectedCities);
    }
    // localStorage 저장을 여기서 하지 않고 버튼 클릭 시에만 저장
};


   const getCitiesForRegion = (region) => {
       const regionData = CITY.find(item => Object.keys(item)[0] === region);
       return regionData ? regionData[region] : [];
   };

   const isRegionUpdating = (region) => {
       const cities = getCitiesForRegion(region);
       return cities.length === 1 && cities[0] === '업데이트 예정';
   };

   const isStartButtonEnabled = () => {
       return selectedRegion && selectedCities.size > 0;
   };

   const handleStartClick = async () => {
    if (isStartButtonEnabled()) {
        setIsLoading(true);
        try {
            const selectedCitiesArray = Array.from(selectedCities);
            await updateRegion({
                region: selectedRegion,
                cities: selectedCitiesArray
            });
            await new Promise(resolve => setTimeout(resolve, 500));
            navigate('/enterprise');
        } finally {
            setIsLoading(false);
        }
    }
};

   return (
       <div className={styles.container}>
           <TopBar/>
           <div className={styles.header}>
               <p>지역설정</p>
           </div>
           <div className={styles.content}>
                {isLoading && (
                    <div className={styles.loading}>
                        <LoadingSpinner />
                    </div>
                )}
               <div className={styles.regionContainer}>
                    {REGIONS.map(region => (
                        <button
                            key={region}
                            className={`${styles.regionButton} ${
                                selectedRegion === region ? styles.activeRegionButton : ''
                            }`}
                            style={{ paddingLeft: '20px' }}
                            onClick={() => handleRegionSelect(region)}
                        >
                            {region}
                        </button>
                    ))}
               </div>

               {selectedRegion && (
                   <div className={styles.cityContainer}>
                       {isRegionUpdating(selectedRegion) ? (
                           <div className={styles.cityGrid}>
                               <button
                                   className={styles.cityButton}
                                   style={{
                                       backgroundColor: 'transparent',
                                       color: '#D9D9D9',
                                       cursor: 'not-allowed'
                                   }}
                                   disabled={true}
                               >
                                   업데이트 예정
                               </button>
                           </div>
                       ) : (
                           <div className={styles.citiesGrid}>
                               {getCitiesForRegion(selectedRegion).map(city => (
                                   <button
                                       key={city}
                                       style={{
                                           backgroundColor: selectedCities.has(city) ? '#2DDDC3' : 'transparent',
                                           color: selectedCities.has(city) ? '#fff' : 'inherit'
                                       }}
                                       className={styles.cityButton}
                                       onClick={() => handleCitySelect(city)}
                                   >
                                       {city}
                                   </button>
                               ))}
                           </div>
                       )}
                   </div>
               )}
           </div>

           <button
               className={`${styles.startButton} ${!isStartButtonEnabled() ? styles.disabled : ''}`}
               onClick={handleStartClick}
               disabled={!isStartButtonEnabled()}
           >
               시작하기
           </button>
       </div>
   );
}

export default SelectRegion;