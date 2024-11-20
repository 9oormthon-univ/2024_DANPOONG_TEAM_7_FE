/**
 * 회사명을 front와 back 부분으로 분리하는 유틸리티 함수
 * @param {string} name - 처리할 회사명
 * @param {number} [maxLength=10] - 분리할 최대 길이 (기본값: 10)
 * @returns {{front: string, back: string}} - 분리된 회사명 객체
 */
export const formatCompanyName = (name, maxLength = 10) => {
    if (!name) return { front: '', back: '' };

    // "(주)" 로 시작하는 경우
    if (name.startsWith('(주)')) {
        const nameWithoutJu = name.substring(3); // "(주)" 제외한 나머지 부분
        
        if (nameWithoutJu.length <= maxLength) {
            return { front: name, back: '' };
        }

        // 나머지 부분에 대해 분리 로직 적용
        const remainingName = nameWithoutJu;

        // 특정 키워드로 분리
        const keywords = ['사회적협동조합', '협동조합'];
        for (const keyword of keywords) {
            const keywordIndex = remainingName.indexOf(keyword);
            if (keywordIndex > 0) {
                return {
                    front: '(주)' + remainingName.substring(0, keywordIndex).trim(),
                    back: remainingName.substring(keywordIndex).trim()
                };
            }
        }

        // 괄호가 있는 경우
        const bracketIndex = remainingName.indexOf('(');
        if (bracketIndex !== -1) {
            return {
                front: '(주)' + remainingName.substring(0, bracketIndex).trim(),
                back: remainingName.substring(bracketIndex).trim()
            };
        }

        // 띄어쓰기가 있는 경우
        const firstSpaceIndex = remainingName.indexOf(' ');
        if (firstSpaceIndex !== -1) {
            return {
                front: '(주)' + remainingName.substring(0, firstSpaceIndex).trim(),
                back: remainingName.substring(firstSpaceIndex).trim()
            };
        }

        // 띄어쓰기와 괄호가 모두 없는 경우
        const halfLength = Math.floor(remainingName.length / 2);
        return {
            front: '(주)' + remainingName.substring(0, halfLength),
            back: remainingName.substring(halfLength)
        };
    }

    // "(주)"로 시작하지 않는 경우 기존 로직 유지
    if (name.length <= maxLength) return { front: name, back: '' };

    const keywords = ['사회적협동조합', '협동조합'];
    for (const keyword of keywords) {
        const keywordIndex = name.indexOf(keyword);
        if (keywordIndex > 0) {
            return {
                front: name.substring(0, keywordIndex).trim(),
                back: name.substring(keywordIndex).trim()
            };
        }
    }

    const bracketIndex = name.indexOf('(');
    if (bracketIndex !== -1) {
        return {
            front: name.substring(0, bracketIndex).trim(),
            back: name.substring(bracketIndex).trim()
        };
    }

    const firstSpaceIndex = name.indexOf(' ');
    if (firstSpaceIndex !== -1) {
        return {
            front: name.substring(0, firstSpaceIndex).trim(),
            back: name.substring(firstSpaceIndex).trim()
        };
    }

    const halfLength = Math.floor(name.length / 2);
    return {
        front: name.substring(0, halfLength),
        back: name.substring(halfLength)
    };
};

/**
 * 회사명이 최대 길이를 초과하는지 확인
 * @param {string} name - 확인할 회사명
 * @param {number} [maxLength=10] - 최대 길이 (기본값: 10)
 * @returns {boolean} - 초과 여부
 */
export const isCompanyNameOverflow = (name, maxLength = 10) => {
    if (!name) return false;
    
    // "(주)"로 시작하는 경우 "(주)" 제외하고 길이 체크
    if (name.startsWith('(주)')) {
        return name.substring(3).length > maxLength;
    }
    
    return name.length > maxLength;
};