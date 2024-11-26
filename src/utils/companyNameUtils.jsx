/**
 * 회사명을 분리하는 유틸리티 함수
 * @param {string} name - 처리할 회사명
 * @param {number} [maxLength=14] - 분리할 최대 길이 (기본값: 14)
 * @returns {{front: string, middle: string, back: string}} - 분리된 회사명 객체
 */
export const formatCompanyName = (name, maxLength = 14) => {
    if (!name) return { front: '', middle: '', back: '' };

    // 문자열을 분리하는 내부 함수
    const splitText = (text, withPrefix = '') => {
        if (text.length <= maxLength) {
            return { front: withPrefix + text, middle: '', back: '' };
        }

        // 특정 키워드로 분리
        const keywords = ['사회적협동조합', '협동조합'];
        for (const keyword of keywords) {
            const keywordIndex = text.indexOf(keyword);
            if (keywordIndex > 0) {
                return {
                    front: withPrefix + text.substring(0, keywordIndex).trim(),
                    middle: text.substring(keywordIndex).trim(),
                    back: ''
                };
            }
        }

        // 괄호가 있는 경우
        const bracketIndex = text.indexOf('(');
        if (bracketIndex !== -1) {
            return {
                front: withPrefix + text.substring(0, bracketIndex).trim(),
                middle: text.substring(bracketIndex).trim(),
                back: ''
            };
        }

        // 띄어쓰기가 있는 경우
        const firstSpaceIndex = text.indexOf(' ');
        if (firstSpaceIndex !== -1) {
            return {
                front: withPrefix + text.substring(0, firstSpaceIndex).trim(),
                middle: text.substring(firstSpaceIndex).trim(),
                back: ''
            };
        }

        // 띄어쓰기와 괄호가 모두 없는 경우
        const halfLength = Math.floor(text.length / 2);
        return {
            front: withPrefix + text.substring(0, halfLength),
            middle: text.substring(halfLength),
            back: ''
        };
    };

    let result;

    // "(주)" 로 시작하는 경우
    if (name.startsWith('(주)')) {
        const nameWithoutJu = name.substring(3); // "(주)" 제외한 나머지 부분
        
        if (nameWithoutJu.length <= maxLength) {
            return { front: name, middle: '', back: '' };
        }

        result = splitText(nameWithoutJu, '(주)');
    } else {
        result = splitText(name);
    }

    // middle 부분이 maxLength를 초과하는 경우 다시 분리
    if (result.middle && result.middle.length > maxLength) {
        const secondSplit = splitText(result.middle);
        return {
            front: result.front,
            middle: secondSplit.front,
            back: secondSplit.middle || secondSplit.back
        };
    }

    return result;
};

/**
 * 회사명이 최대 길이를 초과하는지 확인
 * @param {string} name - 확인할 회사명
 * @param {number} [maxLength=14] - 최대 길이 (기본값: 14)
 * @returns {boolean} - 초과 여부
 */
export const isCompanyNameOverflow = (name, maxLength = 14) => {
    if (!name) return false;
    
    // "(주)"로 시작하는 경우 "(주)" 제외하고 길이 체크
    if (name.startsWith('(주)')) {
        return name.substring(3).length > maxLength;
    }
    
    return name.length > maxLength;
};