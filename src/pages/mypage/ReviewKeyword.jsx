//ReviewKeyword.jsx
import React, { useState, useEffect, useRef } from 'react';
import styles from '../../styles/mypage/ReviewKeyword.module.css';
import KeywordSlider from '../../components/mypage/KeywordSlider';
import reviewBackground from '../../assets/images/mypage/review-background.svg';

function ReviewKeyword() {
    return (
        <div className={styles.container}>
            <div className={styles.headerBar}></div>
            <div className={styles.headerBackground}>
                <img 
                    src={reviewBackground} 
                    alt='review background' 
                    className={styles.reviewBackground}
                />
                <div className={styles.headerSection}>
                    <div className={styles.enterpriseIcon}></div>
                </div>
            </div>
            <div className={styles.engagementsSection}>
                <KeywordSlider/>
            </div>
            <div className={styles.mylistSection}>
            </div>
            
        </div>
    );
}
export default ReviewKeyword;