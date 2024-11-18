import React, { useState, useEffect } from 'react';
import KakaoMap from '../../components/enterprise/KakaoMap';
import styles from '../../styles/enterprise/EnterpriseSearch.module.css';
import searchIcon from '../../assets/images/enterprise/search-icon.svg';
import searchBack from '../../assets/images/enterprise/enterprise-back.svg';
import searchLine from '../../assets/images/enterprise/searchline.svg';
import searchDelete from '../../assets/images/enterprise/searchdelete.svg';


function EnterpriseSearch() {
    const [isSearchModal, setIsSearchModal] = useState(false); //searchModal
    const [searchHistory, setSearchHistory] = useState([]); // dummyData
    const [socialEnterprise, setSocialEnterprise] = useState([]); // dummyData
    const [activeSearchSection, setActiveSearchSection] = useState('');
    const [activeList, setActiveList] = useState('');
    const [isListModal, setIsListModal] = useState(false); //ListModal
    const [isAnimating, setAnimating] = useState(false);
    const [isCategoryModal, setIsCategoryModal] = useState(false); //categoryModal
    const [selectedCategory, setSelectedCategory] = useState('');
    const [isTypeModal, setIsTypeModal] = useState(false); //typeModal
    const [selectedType, setSelectedType] = useState('');
    
    //검색 아이콘을 누를 시에 뜨는 Modal
    const openSearchModal = () => {
        console.log('Modal open');
        setIsSearchModal(true);
    };

    const closeSearchModal = () => {
        console.log('Modal close');
        setIsSearchModal(false);
        setActiveSearchSection ('');
    };
    
    //검색 Modal 내부 버튼
    const handleSectionClick = (section) => {
        setActiveSearchSection(section);
    };

    //목록보기를 누를 시에 뜨는 Modal
    const openListModal = () => {
        console.log('Modal open');
        setIsListModal(true);
    };

    const closeListModal = () => {
        console.log('Modal close');
        setIsListModal(false);
    };

    //목록 Modal 내부 버튼


    //목록 카테고리 분류 Modal
    const openCategoryModal = (category) => {
        setIsCategoryModal(true);
        setSelectedCategory(category);
    };

    const closeCategoryModal = () => {
        setIsCategoryModal(false);
        setSelectedCategory('');
    };

    //목록 유형 분류 Modal
    const openTypeModal = (type) => {
        setIsTypeModal(true);
        setSelectedType(type);
    };

    const closeTypeModal = () => {
        setIsTypeModal(false);
        setSelectedType('');
    };

    //dummyData 호출
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('/public/dummyData/enterpriseSearchData.json');
                const data = await response.json();
                setSearchHistory(data); // 올바른 상태 업데이트 함수명 사용
            } catch (error) {
                console.error('Failed to load data:', error);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await fetch('/public/dummyData/SocialEnterprises.json'); // 서버의 URL을 사용하거나, 로컬 개발 환경에서의 접근 경로
          const data = await response.json();
          setSocialEnterprise(data);
        } catch (error) {
          console.error('Failed to load data:', error);
        }
      };
  
      fetchData();
    }, []);

    return (
        <div className={styles.container}>
            <div className={styles.topBar}>
                <p className={styles.pageName}>기업 찾기</p>
                <button className={styles.searchBtn} onClick={openSearchModal}>
                    <img src={searchIcon} alt="search icon" className={styles.searchIcon} />
                </button>
            </div>
            <div className={styles.map}>
                <div className={styles.mapView}>
                    <KakaoMap />
                </div>
                <button className={styles.listDetailBtn} onClick={()=>{openListModal();}}>
                    <div className={styles.listSquare}></div>
                    <p className={styles.listDetail}>목록보기</p>
                </button>
            </div>
            

            {isSearchModal && (
                <div className={styles.searchModalContainer}>
                    <div className={styles.searchModalHeader}>
                        <button className={styles.back} onClick={closeSearchModal}>
                            <img src={searchBack} alt="search back" className={styles.searchBack} />
                        </button>
                    </div>
                    <img src={searchLine} alt="search line" className={styles.searchLine} />
                    <div className={styles.searchSection}>
                        <button className={styles.searchSectionBtn} onClick={() => handleSectionClick('최근검색')}>최근검색</button>
                        <button className={styles.searchSectionBtn} onClick={() => handleSectionClick('내장소')}>내장소</button>
                        <button className={styles.searchSectionBtn} onClick={() => handleSectionClick('즐겨찾기')}>즐겨찾기</button>
                    </div>
                    <img src={searchLine} alt="search line" className={styles.searchLine} />
                    {activeSearchSection === '최근검색' && (
                        searchHistory && searchHistory.length > 0 ? (
                            searchHistory.map((history, index) => (
                                <div key={history.searchId} className={styles.searchHistory}>
                                    <p className={styles.query}>{history.query}</p>
                                    <p className={styles.searchTime}>{history.searchTime}</p>
                                    <button className={styles.delete}>
                                        <img src={searchDelete} alt="search delete" className={styles.searchDelete} />
                                    </button>
                                </div>
                            ))
                        ) : (
                            <p>No subscriptions found.</p>
                        )
                    )}
                </div>
            )}
            {isListModal && (
                <div className={styles.listModalContainer}>
                    <div className={styles.listModalBackground} onClick={closeListModal}></div>
                    <div className={styles.listModalContent}>
                        <div className={styles.listModalHeader}>
                            <button className={styles.alignmentBtn} onClick={openCategoryModal}>
                                <p>카테고리별</p>
                                {/*아이콘 추가예정 (이미지 사용..?)*/}
                            </button>
                            <button className={styles.alignmentBtn} onClick={openTypeModal}>
                                <p>유형별</p>
                                {/*아이콘 추가예정 (이미지 사용..?)*/}
                            </button>
                            <button className={styles.alignmentBtn}>
                                <p>온 오프</p>
                                {/*아이콘 추가예정 (이미지 사용..?)*/}
                            </button>
                        </div>
                        <div className={styles.companySorting}>
                            <button className={styles.sortingReviewBtn}>리뷰 순</button>
                            <button className={styles.sortingRecommendationBtn}>높은 추천 순</button>
                        </div>
                        <div className={styles.companyList}>
                            {/*목록 받아오는 부분 지도랑 연결해야될듯..?*/}
                            {socialEnterprise && socialEnterprise.length > 0 ? (
                                socialEnterprise.map((list, index) => (
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
                                <p>No subscriptions found.</p>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {isTypeModal && (
                <div className={styles.typeModalContainer}>
                    <div className={styles.typeModalBackground}></div>
                    <div className={styles.typeModalContent}>
                        <div className={styles.typeModalHeader}>
                            <p className={styles.modalName}>유형 설정</p>
                            <p className={styles.modalMemo}>중복 선택 가능</p>
                        </div>
                        <div className={styles.typeBtn}>
                            <div className={styles.row}>
                                <button className={styles.education}>교육</button>
                                <button className={styles.health}>보건</button>
                                <button className={styles.socialWelfare}>사회복지</button>
                                <button className={styles.environment}>환경</button>
                            </div>
                            <div className={styles.row}>
                                <button className={styles.cultureArt}>문화/예술</button>
                                <button className={styles.tourismSports}>관광/운동</button>
                                <button className={styles.childcare}>보육</button>
                            </div>
                            <div className={styles.row}>
                                <button className={styles.forestConservationManagement}>산림 보전 및 관리</button>
                                <button className={styles.housekeepingCare}>가사/간병</button>
                            </div>
                            <div className={styles.row}>
                                <button className={styles.culturalHeritageConservationUtilization}>문화재 보존 혹은 활용 관련 서비스</button>
                            </div>
                            <div className={styles.row}>
                                <button className={styles.employmentServices}>고용 서비스</button>
                                <button className={styles.facilityManagementCleaning}>청소 등 사업 시설 관리</button>
                            </div>
                            <div className={styles.row}>
                                <button className={styles.regionalDevelopment}>지역 개발</button>
                                <button className={styles.socialServiceProvision}>사회 서비스 제공형</button>
                            </div>
                            <div className={styles.row}>
                                <button className={styles.informationTechnology}>정보 통신</button>
                                <button className={styles.manufacturing}>제조</button>
                                <button className={styles.distribution}>유통</button>
                            </div>
                            <div className={styles.row}>
                                <button className={styles.greenEnergy}>녹색 에너지</button>
                                <button className={styles.others}>기타</button>
                                <button className={styles.all}>전체</button>
                            </div>
                        </div>
                        <button className={styles.okay} onClick={closeTypeModal}>확인</button>
                    </div>
                </div>
            )}
            {isCategoryModal && (
                <div className={styles.categoryModalContainer}>
                    <div className={styles.categoryModalBackground}></div>
                    <div className={styles.categoryModalContent}>
                        <div className={styles.categoryModalHeader}>
                            <p className={styles.modalName}>카테고리 설정</p>
                            <p className={styles.modalMemo}>중복 선택 가능</p>
                        </div>
                        <div className={styles.categoryBtn}>
                            <button className={styles.category}>전체</button>
                            <button className={styles.category}>사회 서비스 제공형</button>
                            <button className={styles.category}>일자리 제공형</button>
                            <button className={styles.category}>지역 사회 공헌형</button>
                            <button className={styles.category}>혼합형</button>
                            <button className={styles.category}>기타(창의. 혁신)형</button>
                        </div>
                        <button className={styles.okay} onClick={closeCategoryModal}>확인</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default EnterpriseSearch;