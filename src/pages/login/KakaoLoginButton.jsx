import React from "react";
import KakaoLogin from '../../assets/images/login/kakao-login.svg';
import styles from '../../styles/login/KakaoLoginButton.module.css';

const KakaoLoginButton = () => {
    const handleLogin = async () => {
        try {
            const response = await fetch("https://api.ssoenter.store/api/kakao/login");
            const kakaoLoginUrl = await response.text(); // 로그인 URL 가져오기
            window.location.href = kakaoLoginUrl; // 카카오 로그인 페이지로 이동
        } catch (error) {
            console.error("카카오 로그인 URL 요청 실패:", error);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.logo}>

            </div>
            <div className={styles.comment}>
                <p>나와 사회를 잇는</p>
                <p>소비와 참여,</p>
                <p>우리 모두의 성장을 이끈다!</p>
            </div>
            <div className={styles.content}>

            </div>
            <button 
                className={styles.loginBtn}
                onClick={handleLogin}
            >
                <img
                src={KakaoLogin}
                alt='KakaoLogin'  
                />
            </button>
        </div>
    
    );
};

export default KakaoLoginButton;