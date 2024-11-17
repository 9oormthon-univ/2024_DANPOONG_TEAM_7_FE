import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom'; // useLocation 추가
import styles from '../../styles/layout/Bar.module.css';
import enterpriseOn from '../../assets/images/bar/enterprise-on.svg';
import magazineOn from '../../assets/images/bar/magazine-on.svg';
import homeOn from '../../assets/images/bar/home-on.svg';
import programOn from '../../assets/images/bar/program-on.svg';
import mypageOn from '../../assets/images/bar/mypage-on.svg';
import enterpriseOff from '../../assets/images/bar/enterprise-off.svg';
import magazineOff from '../../assets/images/bar/magazine-off.svg';
import homeOff from '../../assets/images/bar/home-off.svg';
import programOff from '../../assets/images/bar/program-off.svg';
import mypageOff from '../../assets/images/bar/mypage-off.svg';

const Bar = () => {
  const navigate = useNavigate();
  const location = useLocation(); // 현재 경로 가져오기

  // 각 버튼 클릭 시 해당 경로로 이동
  const handleEnterpriseClick = () => {
    navigate('/enterprise');
  };

  const handleHomeClick = () => {
    navigate('/');
  };

  const handleMagazineClick = () => {
    navigate('/magazine');
  };

  const handleProgramClick = () => {
    navigate('/program');
  };

  const handleMypageClick = () => {
    navigate('/mypage');
  };

  return (
    <div className={styles.Bar}>
      <button 
        className={styles.enterpriseBtn} 
        onClick={handleEnterpriseClick}
      >
        <img
          src={location.pathname === '/enterprise' ? enterpriseOn : enterpriseOff}  // 현재 경로에 따라 on/off 이미지 설정
          alt="Enterprise Button"
          className={styles.enterprise}
        />
        기업 찾기
      </button>
      <button 
        className={styles.magazineBtn} 
        onClick={handleMagazineClick}
      >
        <img
          src={location.pathname === '/magazine' ? magazineOn : magazineOff}  // 현재 경로에 따라 on/off 이미지 설정
          alt="Magazine Button"
          className={styles.magazine}
        />
        매거진
      </button>
      <button 
        className={styles.homeBtn} 
        onClick={handleHomeClick}
      >
        <img
          src={location.pathname === '/' ? homeOn : homeOff}  // 현재 경로에 따라 on/off 이미지 설정
          alt="Home Button"
          className={styles.home}
        />
        홈
      </button>
      <button 
        className={styles.programBtn} 
        onClick={handleProgramClick}
      >
        <img
          src={location.pathname === '/program' ? programOn : programOff}  // 현재 경로에 따라 on/off 이미지 설정
          alt="Program Button"
          className={styles.program}
        />
        프로그램
      </button>
      <button 
        className={styles.mypageBtn} 
        onClick={handleMypageClick}
      >
        <img
          src={location.pathname === '/mypage' ? mypageOn : mypageOff}  // 현재 경로에 따라 on/off 이미지 설정
          alt="Mypage Button"
          className={styles.mypage}
        />
        마이페이지
      </button>
    </div>
  );
};

export default Bar;
