import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import styles from '../../styles/enterprise/EnterpriseInfo.module.css';

function EnterpriseInfo() {
    const { id } = useParams();  // URL에서 기업 ID 가져오기

    useEffect(() => {
        // id를 사용하여 해당 기업의 상세 정보를 가져오는 로직 추가
        // 예: API 호출 또는 Redux store에서 데이터 가져오기
    }, [id]);

    return (
        <div className={styles.container}>
            <div className={styles.topBar}>
                <div className={styles.topBarContent}>
                    <div className={styles.pageName}>기업 정보</div>
                </div>
            </div>
            <div className={styles.content}>
                <div className={styles.section1}>

                </div>
                <div className={styles.section2}>
                    
                </div>
                <div className={styles.section3}>
                    
                </div>
            </div>
        </div>
    );
}
export default EnterpriseInfo;