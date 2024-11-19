/**
 * 회사명을 front와 back 부분으로 분리하는 유틸리티 함수
 * @param {string} name - 처리할 회사명
 * @param {number} [maxLength=14] - 분리할 최대 길이 (기본값: 14)
 * @returns {{front: string, back: string}} - 분리된 회사명 객체
 */
export const formatCompanyName = (name, maxLength = 14) => {
    if (!name || name.length <= maxLength) return { front: name, back: '' };

    // 괄호가 있는 경우
    const bracketIndex = name.indexOf('(');
    if (bracketIndex !== -1) {
        return {
            front: name.substring(0, bracketIndex).trim(),
            back: name.substring(bracketIndex).trim()
        };
    }

    // 띄어쓰기가 있는 경우
    const firstSpaceIndex = name.indexOf(' ');
    if (firstSpaceIndex !== -1) {
        return {
            front: name.substring(0, firstSpaceIndex).trim(),
            back: name.substring(firstSpaceIndex).trim()
        };
    }

    // 띄어쓰기와 괄호가 모두 없는 경우
    return {
        front: name.substring(0, maxLength - 1),
        back: name.substring(maxLength - 1)
    };
};

/**
 * 회사명이 최대 길이를 초과하는지 확인
 * @param {string} name - 확인할 회사명
 * @param {number} [maxLength=14] - 최대 길이 (기본값: 14)
 * @returns {boolean} - 초과 여부
 */
export const isCompanyNameOverflow = (name, maxLength = 14) => {
    return name ? name.length > maxLength : false;
};