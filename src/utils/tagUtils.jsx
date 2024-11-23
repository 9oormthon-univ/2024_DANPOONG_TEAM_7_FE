// utils/tagUtils.js

// 태그 카테고리와 키워드 매핑 정보
export const TAG_MAPPING = {
    '사회적 가치': [
      { id: 1, text: '취약계층을 위해 여러 지원 프로그램을 운영하고 있어요' },
      { id: 2, text: '지역사회 문제를 해결하려는 모습이 좋아요' },
      { id: 3, text: '소외된 이웃들을 돕는 활동이 인상적이었어요' }
    ],
    '서비스 품질': [
      { id: 4, text: '서비스 품질이 좋아요' },
      { id: 5, text: '일관된 서비스로 만족도가 높아요' }
    ],
    '접근성': [
      { id: 6, text: '주차 공간이 넉넉해 편리합니다' },
      { id: 7, text: '대중교통으로 접근하기 편해요' }
    ],
    '친환경 활동': [
      { id: 8, text: '에너지 절약과 같은 친환경 실천이 눈에 띄어요' },
      { id: 9, text: '친환경 포장으로 더 신뢰가 가요' }
    ],
    '기업 신뢰도': [
      { id: 10, text: '정직하게 운영되어 믿음이 갑니다' },
      { id: 11, text: '고객 소리에 귀 기울여 신뢰가 가요' },
      { id: 12, text: '투명한 운영으로 안심하고 이용했어요' }
    ],
    '기타': [
      { id: 13, text: '가격이 합리적이라 만족합니다' },
      { id: 14, text: '직원분들이 친절해요' },
      { id: 15, text: '주변 사람들에게 추천하고 싶어요' }
    ]
  };
  
  // 태그 번호를 카테고리와 키워드 정보로 변환
  export const convertTagNumbersToKeywords = (tagNumbers) => {
    const result = [];
    
    for (const category in TAG_MAPPING) {
      const categoryTags = TAG_MAPPING[category];
      const matchingTags = categoryTags.filter(tag => tagNumbers.includes(tag.id));
      
      if (matchingTags.length > 0) {
        matchingTags.forEach(tag => {
          result.push({
            category,
            keyword: tag.text
          });
        });
      }
    }
    
    return result;
  };
  
  // 키워드 정보를 태그 번호로 변환
  export const convertKeywordsToTagNumbers = (keywords) => {
    return keywords.map(keywordInfo => {
      const category = TAG_MAPPING[keywordInfo.category];
      const tag = category?.find(t => t.text === keywordInfo.keyword);
      return tag?.id;
    }).filter(id => id !== undefined);
  };
  
  // 전체 태그 정보 가져오기
  export const getAllTags = () => {
    return Object.entries(TAG_MAPPING).map(([category, tags]) => ({
      category,
      tags: tags.map(tag => ({
        id: tag.id,
        text: tag.text
      }))
    }));
  };