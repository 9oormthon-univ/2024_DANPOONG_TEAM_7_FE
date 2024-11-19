export const handleExternalUrl = (url) => {
    if (!url) return;

    // URL 문자열 앞뒤 공백 제거
    let finalUrl = url.trim();

    // URL에 프로토콜이 없는 경우 처리
    if (!finalUrl.startsWith('http://') && !finalUrl.startsWith('https://')) {
        finalUrl = 'http://' + finalUrl;
    }

    // URL이 유효한지 확인
    try {
        new URL(finalUrl);
        console.log('Opening URL:', finalUrl);
        const newWindow = window.open(finalUrl, '_blank', 'noopener,noreferrer');
        if (newWindow) newWindow.opener = null;
    } catch (e) {
        console.error('Invalid URL:', url, e);
    }
};