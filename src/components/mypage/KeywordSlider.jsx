// KeywordSlider.jsx
import React, { useState } from 'react';
import styles from '../../styles/mypage/KeywordSlider.module.css';
import keywordOn from '../../assets/images/mypage/review-keywordon.svg';

function KeywordSlider({ onKeywordsChange }) {
    const [hoveredCategory, setHoveredCategory] = useState(null);
    const [selectedKeywords, setSelectedKeywords] = useState(new Set());

    const keywords = {
        "사회적 가치": [
            "소외된 이웃들을 돕는 활동이 인상적이었어요",
            "취약계층을 위해 여러 지원 프로그램을 운영하고 있어요",
            "지역사회 문제를 해결하려는 모습이 좋아요"
        ],
        "서비스 품질": [
            "서비스 품질이 좋아요",
            "일관된 서비스로 만족도가 높아요"
        ],
        "접근성": [
            "대중교통으로 접근하기 편해요",
            "주차 공간이 넉넉해 편리합니다"
        ],
        "친환경 활동": [
            "친환경 포장으로 더 신뢰가 가요",
            "에너지 절약과 같은 친환경 실천이 눈에 띄어요"
        ],
        "기업 신뢰도": [
            "정직하게 운영되어 믿음이 갑니다",
            "고객 소리에 귀 기울여 신뢰가 가요",
            "투명한 운영으로 안심하고 이용했어요"
        ],
        "기타": [
            "직원분들이 친절해요",
            "가격이 합리적이라 만족합니다",
            "주변 사람들에게 추천하고 싶어요"
        ]
    };

    const handleKeywordClick = (keyword, category) => {
        const newSet = new Set(selectedKeywords);  // 기존 Set을 복사
        
        if (newSet.has(keyword)) {
            newSet.delete(keyword);
            setHoveredCategory(null);
        } else {
            newSet.add(keyword);
        }
        
        // 선택된 키워드와 카테고리 정보를 먼저 계산
        const selectedInfo = Array.from(newSet).map(k => {
            const foundCategory = Object.entries(keywords).find(([_, items]) => 
                items.includes(k)
            )[0];
            return { keyword: k, category: foundCategory };
        });
        
        // setState를 한 번에 처리
        setSelectedKeywords(newSet);
        
        // 부모 컴포넌트에 정보 전달
        onKeywordsChange(newSet, selectedInfo);
    };

    const handleMouseEnter = (category) => {
        setHoveredCategory(category);
    };

    const handleMouseLeave = () => {
        setHoveredCategory(null);
    };

    return (
        <div className={styles.sliderContainer}>
            {Object.entries(keywords).map(([category, items], index) => {
                const isAnySelected = items.some(item => selectedKeywords.has(item));
                return (
                    <div key={category} className={styles.categorySection}>
                        <p className={styles.categoryTitle}>{category}</p>
                        <div 
                            className={`${styles.slider} 
                                ${index % 2 === 0 ? styles.slideLeft : styles.slideRight}
                                ${isAnySelected ? styles.paused : ''}`}
                        >
                            <div 
                                className={styles.slideTrack}
                                onMouseEnter={() => handleMouseEnter(category)}
                                onMouseLeave={handleMouseLeave}
                            >
                                {[...items, ...items].map((item, itemIndex) => (
                                    <div 
                                        key={`${item}-${itemIndex}`}
                                        className={styles.keywordWrapper}
                                    >
                                        <button 
                                            className={`${styles.keyword} ${selectedKeywords.has(item) ? styles.selected : ''}`}
                                            onClick={() => handleKeywordClick(item, category)}
                                            onMouseEnter={(e) => e.stopPropagation()}
                                        >
                                            <span>{item}</span>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

export default KeywordSlider;