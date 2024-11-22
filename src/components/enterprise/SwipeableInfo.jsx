import React, { useState, useRef, useEffect } from 'react';
import styles from '../../styles/enterprise/SwipeableInfo.module.css';

//hooks
import useEnterpriseDetailReviews from '../../hooks/useEnterpriseDetailReviews';

//utils
import { formatDateWithDots } from '../../utils/formatDate';

//enterpriseInfo image
import educationFox from '../../assets/images/fox/education-fox.svg';
import healthcareFox from '../../assets/images/fox/healthcare-fox.svg';
import tourFox from '../../assets/images/fox/tour-fox.svg';
import manufacturingFox from '../../assets/images/fox/manufacturing-fox.svg';
import distributionFox from '../../assets/images/fox/distribution-fox.svg'; 

//enterpriseMagazine image
import exited20sFox from '../../assets/images/home/card/excited-20sfox.svg';
import exited30sFox from '../../assets/images/home/card/excited-30sfox.svg';
import basicd20sFox from '../../assets/images/home/card/basic-20sfox.svg';
import questionFox from '../../assets/images/home/card/question-fox.svg';
const imageMap = {
    exited20sFox,
    exited30sFox,
    basicd20sFox,
    questionFox
};

const SwipeableInfo = ({ enterpriseData }) => {
    const [activeTab, setActiveTab] = useState('company');
    const [startX, setStartX] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const [dragOffset, setDragOffset] = useState(0);
    const containerRef = useRef(null);
    const [magazineData, setMagazineData] = useState([]);
    const { reviews, isLoading, error } = useEnterpriseDetailReviews();

    useEffect(() => {    
        const fetchData = async () => {
            try {
                const response = await fetch('/dummyData/magazineCardData.json');
                const data = await response.json();
                const mappedData = data.map(card => ({
                    ...card,
                    image: imageMap[card.image]
                }));
                setMagazineData(mappedData);
            } catch (error) {
                console.error('Error fetching cards:', error);
            }
        };
        fetchData();
    }, []);

    const tabs = [
        { id: 'company' },
        { id: 'review' },
        { id: 'magazine' }
    ];

    const getTabIndex = (tabId) => tabs.findIndex(tab => tab.id === tabId);
    const getCurrentIndex = () => getTabIndex(activeTab);

    // 드래그 핸들러들...
    const handleDragStart = (clientX) => {
        setStartX(clientX);
        setIsDragging(true);
    };

    const handleDragMove = (clientX) => {
        if (!isDragging || startX === null) return;
        
        const diff = startX - clientX;
        const containerWidth = containerRef.current?.offsetWidth || 0;
        const maxDrag = containerWidth;
        const boundedDiff = Math.max(Math.min(diff, maxDrag), -maxDrag);
        
        setDragOffset(boundedDiff);
    };

    const handleDragEnd = () => {
        if (!isDragging) return;

        const containerWidth = containerRef.current?.offsetWidth || 0;
        const dragThreshold = containerWidth * 0.2;
        const currentIndex = getCurrentIndex();

        if (Math.abs(dragOffset) > dragThreshold) {
            if (dragOffset > 0 && currentIndex < tabs.length - 1) {
                setActiveTab(tabs[currentIndex + 1].id);
            } else if (dragOffset < 0 && currentIndex > 0) {
                setActiveTab(tabs[currentIndex - 1].id);
            }
        }

        setIsDragging(false);
        setStartX(null);
        setDragOffset(0);
    };

    const transformSocialPurpose = (purpose) => {
        const purposeMap = {
            '사회서비스제공형': '사회 서비스',
            '일자리제공형': '일자리',
            '지역사회공헌형': '지역 사회',
            '기타(창의ㆍ혁신)형': '기타',
            '혼합형': '기타'
        };
        return purposeMap[purpose] || purpose;
    };

    // 기업 유형 변환 함수
    const transformType = (type) => {
        const typeMap = {
            '관광, 운동': '관광',
            '문화, 예술': '문화',
            '가사, 간병': '가사',
            '문화재 보존 혹은 활용 관련 서비스': '문화재',
            '산림 보전 및 관리': '산림',
            '지역개발': '지역',
            '사회 서비스 제공형': '서비스',
            '고용서비스': '고용',
            '청소 등 사업 시설 관리': '사업',
            '정보통신': '정보',
            '녹색 에너지': '에너지'
        };
        return typeMap[type] || type;
    };

    // Fox 이미지를 type에 따라 결정하는 함수
    const getFoxImage = (type) => {
        switch (type) {
        case '교육':
            return educationFox;
        case '보건':
            return healthcareFox;
        case '관광':
            return tourFox;
        case '제조':
            return manufacturingFox;
        case '유통':
            return distributionFox;
        default:
            return educationFox; // 기본값으로 education fox 반환
        }
    };

    const transformedType = transformType(enterpriseData.type);
    const transformedPurpose = transformSocialPurpose(enterpriseData.socialPurpose);
    const getDisplayValue = (value) => value || '-';

    const renderContent = () => {
        switch (activeTab) {
            case 'company':
                return (
                    <div className={styles.enterpriseInfoContainer}>
                        <div className={styles.sectionTitle}>기업 정보</div>
                        <div className={styles.section}>
                            <div className={styles.comment}>
                                <p>{getDisplayValue(enterpriseData.name)}은</p>
                                <span>{getDisplayValue(transformedType)} 분야의 {getDisplayValue(transformedPurpose)}</span>
                                <span>를 제공합니다</span>
                            </div>
                            <div className={styles.infoBox}>
                                <div className={styles.foxBox}>
                                    <img
                                        src={getFoxImage(enterpriseData.type)}
                                        alt="Fox character"
                                        className={styles.foxImage}
                                    />
                                </div>
                                <div className={styles.typeBox}>
                                    <div className={styles.typeCircle}>
                                        <p>{getDisplayValue(enterpriseData.type)}</p>
                                    </div>
                                </div>
                            </div>
                            <div className={styles.infoCard}>
                                <div className={styles.infoItemRow}>
                                    <div className={styles.column1}>
                                        <p>대표자명</p>
                                        <p>{getDisplayValue(enterpriseData.representativeName)}</p>
                                    </div>
                                    <div className={styles.column1}>
                                        <p>사회적 기업 형태</p>
                                        <p>{getDisplayValue(enterpriseData.socialPurpose)}</p>
                                    </div>
                                </div>
                                <div className={styles.infoItem}>
                                    <p className={styles.label}>인증 번호</p>
                                    <p className={styles.value}>{getDisplayValue(enterpriseData.certificationNumber)}</p>
                                </div>
                                <div className={styles.infoItem}>
                                    <span className={styles.label}>웹사이트</span>
                                    {enterpriseData.website ? (
                                        <a 
                                            href={enterpriseData.website.startsWith('http') ? 
                                            enterpriseData.website : 
                                            `http://${enterpriseData.website}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className={styles.link}
                                        >
                                            {enterpriseData.website}
                                        </a>
                                    ) : (
                                        <p className={styles.value}>-</p>
                                    )}
                                </div>
                                <div className={styles.infoItem}>
                                    <p className={styles.label}>지역</p>
                                    <p className={styles.value}>
                                        {enterpriseData.city || enterpriseData.district ? 
                                            `${getDisplayValue(enterpriseData.city)} ${getDisplayValue(enterpriseData.district)}`.trim() : 
                                            '-'}
                                    </p>
                                </div>
                                <div className={styles.infoItem}>
                                    <p className={styles.label}>연락처</p>
                                    <p className={styles.value}>{getDisplayValue(enterpriseData.representativePhone)}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case 'review':
                if (isLoading) return <div>로딩 중...</div>;
                if (error) return <div>리뷰를 불러오는데 실패했습니다: {error.message}</div>;

                return (
                    <div className={styles.reviewContainter}>
                        <div className={styles.reviewHeader}>
                            <div className={styles.reviewTitle}>
                                <p>이웃들의 리뷰</p>
                                <p>{reviews.length}개</p>
                            </div>
                            <button className={styles.alignment}>최신 순</button>
                        </div>
                        <div className={styles.reviewCardList}>
                        {reviews.map((review) => (
                            <div key={review.reviewId} className={styles.reviewCard}>
                                <div className={styles.reviewCardInfo}>
                                    <div className={styles.reviewCardProfile}>
                                        <div className={styles.reviewProfileImage}></div>
                                        <p>{review.userName}</p>
                                    </div>
                                    <span>{formatDateWithDots(review.createAt)}</span>
                                </div>
                                <div className={styles.reviewCardText}>
                                    <p>{review.content}</p>
                                </div>
                                <div className={styles.reviewCardTags}>

                                </div>
                            </div>
                            ))}

                        </div>
                    </div>
                );

            case 'magazine':
                return (
                    <div className={styles.magazineContainter}>
                        <div className={styles.magazineHeader}>
                            <div className={styles.magazineTitle}>
                                <p>기업 매거진</p>
                                <p>{magazineData.length}개</p>
                            </div>
                            <button className={styles.alignment}>최신 순</button>
                        </div>
                        <div className={styles.magazineCardList}>
                            {magazineData.map((magazine) => (
                            <button key={magazine.id} className={styles.magazineCard}>
                                <div className={styles.magazineCardImage}>
                                    <img 
                                        src={magazine.image} 
                                        alt={magazine.title}
                                        className={`${styles.magazineImage} ${styles.loaded}`}  // loaded 클래스 추가
                                        onLoad={(e) => {
                                            e.target.classList.add(styles.loaded);  // 이미지 로드 완료시 클래스 추가
                                        }}
                                    />
                                </div>
                                <div className={styles.magazineCardText}>
                                    <span>{magazine.title}</span>
                                    <span>{magazine.createdAt}</span>
                                    <p>{magazine.description}</p>
                                </div>
                            </button>
                            ))}
                        </div>
                    </div>
                );
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.tabList}>
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`${styles.tabButton} ${activeTab === tab.id ? styles.activeTab : ''}`}
                    >
                    </button>
                ))}
            </div>
            <div 
                ref={containerRef}
                className={styles.contentContainer}
                onTouchStart={(e) => handleDragStart(e.touches[0].clientX)}
                onTouchMove={(e) => handleDragMove(e.touches[0].clientX)}
                onTouchEnd={handleDragEnd}
                onMouseDown={(e) => handleDragStart(e.clientX)}
                onMouseMove={(e) => handleDragMove(e.clientX)}
                onMouseUp={handleDragEnd}
                onMouseLeave={handleDragEnd}
            >
                <div 
                    className={styles.slider}
                    style={{
                        transform: `translateX(${-(getCurrentIndex() * 100) - (dragOffset / (containerRef.current?.offsetWidth || 1) * 100)}%)`
                    }}
                >
                    {tabs.map(tab => (
                        <div key={tab.id} className={styles.slide}>
                            {activeTab === tab.id && renderContent()}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SwipeableInfo;