// KakaoLoginButton.jsx
import React, { useState, useEffect } from "react";
import WaveOverlay from "../../components/login/WaveOverlay";

//img
import KakaoLogin from '../../assets/images/login/kakao-login.svg';
import Icon from '../../assets/images/login/Icon.svg';
import logoName from '../../assets/images/login/logo-name.svg';
import posterImg from '../../assets/images/login/post-img.svg';
import styles from '../../styles/login/KakaoLoginButton.module.css';

const KakaoLoginButton = () => {
    const [showContent, setShowContent] = useState(false);
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);

    useEffect(() => {
        // 로고 애니메이션 후 컨텐츠 표시
        const timer = setTimeout(() => {
            setShowContent(true);
        }, 1000);
        
        return () => clearTimeout(timer);
    }, []);

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('https://ssoenter.store/api/kakao/login', {
                method: 'GET',
                credentials: 'include',
                mode: 'cors',
                headers: {
                    'Accept': 'text/plain'
                }
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const kakaoLoginUrl = await response.text();
            const finalUrl = new URL(kakaoLoginUrl);
            
            if (isIOS) {
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
            console.error('에러 발생:', error);
            alert("로그인 처리 중 오류가 발생했습니다. 다시 시도해주세요.");
        }
    };

    return (
        <div className={styles.container}>
            <div className={`${styles.logoGroup} ${showContent ? styles.logoAnimateEnd : styles.logoAnimateStart}`}>
                <img className={styles.logo} src={Icon} alt="icon" />
                <img className={styles.logoName} src={logoName} alt="logo name" />
            </div>
            
            <div className={`${styles.contentWrapper} ${showContent ? styles.showContent : ''}`}>
                <div className={styles.content}>
                    <img
                        className={styles.posterImg}
                        src={posterImg} 
                        alt="background" 
                    />
                    <WaveOverlay/>
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
        </div>
    );
};

export default KakaoLoginButton;