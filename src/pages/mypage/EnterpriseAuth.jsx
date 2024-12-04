import React, { useEffect }from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../../styles/mypage/EnterpriseAuth.module.css';
import Back from '../../components/layout/Back';
import BusinessRegistrationOCR from '../../components/mypage/BusinessRegistrationOCR';

//hooks
import { useProfile } from '../../hooks/useProfile';
import { useMyReviews } from '../../hooks/useMyReviews';

function EnterpriseAuth() {

    return (
        <div className={styles.container}>
            <div className={styles.topBar}></div>
            <div className={styles.header}>
                <Back/>
                <p>기업인증</p>
            </div>
            <div className={styles.content}>
                <BusinessRegistrationOCR />
            </div>
        </div>
    );
}

export default EnterpriseAuth;