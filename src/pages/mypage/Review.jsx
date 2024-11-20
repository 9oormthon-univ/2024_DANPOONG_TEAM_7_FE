// Review.jsx
import React from 'react';
import styles from '../../styles/mypage/Review.module.css';
import TopBar from '../../components/layout/TopBar';
import Back from '../../components/layout/Back';


function Review() {

    return (
        <div className={styles.container}>
            <TopBar/>
            <div className={styles.topBar}>
                <Back/>
                <p>나의 리뷰내역</p>
            </div>
            <div className={styles.content}>
            </div>
        </div>
    );
}

export default Review;