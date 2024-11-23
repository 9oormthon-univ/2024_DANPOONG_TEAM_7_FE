import React from "react";
import KakaoLogin from '../../assets/images/login/kakao-login.svg';
import styles from '../../styles/login/KakaoLoginButton.module.css';
import Icon from '../../assets/images/login/Icon.svg';
import logoName from '../../assets/images/login/logo-name.svg';
import posterImg from '../../assets/images/login/post-img.svg';


const KakaoLoginButton = () => {
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    console.log('현재 기기:', isIOS ? 'iOS' : '다른 기기'); // 디버깅용

    const handleLogin = async (e) => {
        e.preventDefault();
        console.log('로그인 시도 시작'); // 디버깅용
        
        try {
            console.log('API 요청 시작'); // 디버깅용
            const response = await fetch('https://ssoenter.store/api/kakao/login', {
                method: 'GET',
                credentials: 'include',
                mode: 'cors',
                headers: {
                    'Accept': 'text/plain'
                }
            });

            console.log('응답 상태:', response.status); // 디버깅용
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const kakaoLoginUrl = await response.text();
            console.log('받은 URL:', kakaoLoginUrl); // 디버깅용

            // iOS Safari에서 쿠키/세션 관련 이슈를 피하기 위한 처리
            const finalUrl = new URL(kakaoLoginUrl);
            
            if (isIOS) {
                // iOS에서는 직접 링크 열기
                console.log('iOS에서 URL 열기 시도'); // 디버깅용
                
                // SameSite=None 이슈 해결을 위한 리다이렉트 처리
                const a = document.createElement('a');
                a.setAttribute('href', finalUrl.href);
                a.style.display = 'none';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
            } else {
                window.location.href = kakaoLoginUrl;
            }
        } catch (error) {
            console.error('에러 발생:', error); // 디버깅용
            console.error('에러 세부정보:', {
                name: error.name,
                message: error.message,
                stack: error.stack
            });
            alert("로그인 처리 중 오류가 발생했습니다. 다시 시도해주세요.");
        }
    };

    return (
        <div className={styles.container}>
            <img className={styles.logo} src={Icon} alt="icon" />
            <img className={styles.logoName} src={logoName} alt="logo name" />
            <div className={styles.content}>
                <img
                    className={styles.posterImg}
                    src={posterImg} alt="background" />
            </div>
            <div className={styles.content}>
            </div>
            <div 
                role="button"
                tabIndex={0}
                className={styles.loginBtn}
                onClick={handleLogin}
                onTouchStart={handleLogin}
                style={{
                    cursor: 'pointer',
                    WebkitTapHighlightColor: 'transparent',
                    WebkitTouchCallout: 'none',
                    WebkitUserSelect: 'none',
                    touchAction: 'manipulation'
                }}
            >
                <img
                    src={KakaoLogin}
                    alt='KakaoLogin'
                    style={{
                        pointerEvents: 'none',
                        WebkitTouchCallout: 'none',
                        WebkitUserSelect: 'none'
                    }}
                />
            </div>
        </div>
    );
};

export default KakaoLoginButton;