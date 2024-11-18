import React from 'react';
import styles from '../../styles/enterprise/EnterpriseSearch.module.css';
import KakaoMap from '../../components/enterprise/KakaoMap';
import searchIcon from '../../assets/images/enterprise/search-icon.svg';

function EnterpriseSearch() {

    return (
        <div className={styles.container}>
            <p>기업찾기</p>
            <button className={styles.searchBtn}>
                <img src={searchIcon} alt={`searchIcon`} className={styles.searchIcon} />
            </button>
            <div className={styles.map}>
                <KakaoMap />
            </div>
        </div>
    );
}
export default EnterpriseSearch;