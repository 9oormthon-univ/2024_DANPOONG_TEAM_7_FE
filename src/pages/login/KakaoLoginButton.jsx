import React, { useState, useEffect } from "react";
import WaveOverlay from "../../components/login/WaveOverlay";

//img
import KakaoLogin from '../../assets/images/login/kakao-login.svg';
import Icon from '../../assets/images/login/Icon.svg';
import logoName from '../../assets/images/login/logo-name.svg';
import styles from '../../styles/login/KakaoLoginButton.module.css';

//building img
import load1 from '../../assets/images/login/building/load-1.svg';
import load2 from '../../assets/images/login/building/load-2.svg';
import WhiteBuilding1 from '../../assets/images/login/building/white-building-1.svg';
import WhiteBuilding2 from '../../assets/images/login/building/white-building-2.svg';
import mintBuilding1 from '../../assets/images/login/building/mint-building-1.svg';
import mintBuilding2 from '../../assets/images/login/building/mint-building-2.svg';
import redBuilding from '../../assets/images/login/building/red-building.svg';

const KakaoLoginButton = () => {
    const [showContent, setShowContent] = useState(false);
    const [showLogoAndButton, setShowLogoAndButton] = useState(false);
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);

    useEffect(() => {
        // 컨텐츠 먼저 표시
        setShowContent(true);
        
        // 마지막 건물 애니메이션이 끝난 후(1.8초) 로고와 버튼 애니메이션 시작
        const timer = setTimeout(() => {
            setShowLogoAndButton(true);
        }, 2400); // 0.8초(마지막 딜레이) + 1초(애니메이션 시간) = 1.8초
        
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
            <div className={`${styles.logoGroup} ${showLogoAndButton ? styles.logoAnimateEnd : styles.logoAnimateStart}`}>
                <img className={styles.logo} src={Icon} alt="icon" />
                <img className={styles.logoName} src={logoName} alt="logo name" />
            </div>
            
            <div className={`${styles.contentWrapper} ${showContent ? styles.showContent : ''}`}>
                <div className={styles.content}>
                    <img src={load1} alt='load 1' className={styles.load1}/>
                    <img src={load2} alt='load 2' className={styles.load2}/>
                    <img src={WhiteBuilding1} alt='white building 1' className={styles.WhiteBuilding1}/>
                    <img src={WhiteBuilding2} alt='white building 2' className={styles.WhiteBuilding2}/>
                    <img src={mintBuilding1} alt='mint building 1' className={styles.mintBuilding1}/>
                    <img src={mintBuilding2} alt='mint building 2' className={styles.mintBuilding2}/>
                    <div className={styles.redBuildingGroup}>
                        <img src={redBuilding} alt='red building' className={styles.redBuilding}/>
                        <WaveOverlay/>
                    </div>
                </div>
                <div 
                    className={`${styles.loginBtn} ${showLogoAndButton ? styles.showLoginBtn : ''}`}
                    role="button"
                    tabIndex={0}
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