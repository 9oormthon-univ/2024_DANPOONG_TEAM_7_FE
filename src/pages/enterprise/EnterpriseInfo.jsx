// EnterpriseInfo.jsx
import React from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import styles from '../../styles/enterprise/EnterpriseInfo.module.css';
import SwipeableInfo from '../../components/enterprise/SwipeableInfo';
import TopBar from '../../components/layout/TopBar';
import Back from '../../components/layout/Back';

//img
import employIcon from '../../assets/images/enterprise-icons/employment-icon.svg';
import communityIcon from '../../assets/images/enterprise-icons/local-community-icon.svg';
import mixedIcon from '../../assets/images/enterprise-icons/mixed-type-icon.svg';
import otherIcon from '../../assets/images/enterprise-icons/other-creative-icon.svg';
import serviceIcon from '../../assets/images/enterprise-icons/service-icon.svg';

function EnterpriseInfo() {
    const { enterpriseId } = useParams();
    const { socialEnterprises } = useSelector(state => state.enterprise);
    
    const enterpriseData = socialEnterprises.find(
        enterprise => enterprise.enterpriseId === parseInt(enterpriseId)
    );

    if (!enterpriseData) return <div>기업 정보가 없습니다.</div>;
    
    console.log('전체 기업 데이터:', enterpriseData);
    console.log('Social Purpose 값:', enterpriseData.socialPurpose);

    const getTypeBackgroundStyle = (socialPurpose) => {
        console.log('받은 socialPurpose:', socialPurpose);
        
        let style = {};

        switch(socialPurpose) {
            case '사회서비스제공형':
                style = { backgroundColor: 'rgba(121, 185, 255, 0.1)' };
                break;
            case '일자리제공형':
                style = { backgroundColor: 'rgba(106, 218, 255, 0.1)' };
                break;
            case '지역사회공헌형':
                style = { backgroundColor: 'rgba(237, 255, 120, 0.1)' };
                break;
            case '혼합형':
                style = { backgroundColor: 'rgba(253, 167, 121, 0.1)' };
                break;
            case '기타(창의ㆍ혁신)형':
                style = { backgroundColor: 'rgba(185, 130, 242, 0.1)' };
                break;
            default:
                style = {};
                break;
        }
        
        console.log('선택된 스타일:', style);
        return style;
    };

    const typeBackgroundStyle = getTypeBackgroundStyle(enterpriseData.socialPurpose);
    console.log('최종 적용될 스타일:', typeBackgroundStyle);

    const getTypeIcon = (socialPurpose) => {
        switch(socialPurpose) {
            case '사회서비스제공형':
                return serviceIcon;
            case '일자리제공형':
                return employIcon;
            case '지역사회공헌형':
                return communityIcon;
            case '혼합형':
                return mixedIcon;
            case '기타(창의ㆍ혁신)형':
                return otherIcon;
            default:
                return serviceIcon; // 기본 아이콘
        }
    };

    return (
        <div className={styles.container}>
            <TopBar/>
            <Back/>
            <div 
                className={styles.header}
                style={typeBackgroundStyle}
            >
                <p className={styles.enterpriseName}>{enterpriseData.name}</p>
                <img 
                    src={getTypeIcon(enterpriseData.socialPurpose)}
                    alt={enterpriseData.socialPurpose}
                    className={styles.enterpriseIcon}
                />
                <div className={styles.enterpriseCategory}>
                    {enterpriseData.socialPurpose}
                </div>
            </div>
            <div className={styles.content}>
                <div className={styles.enterpriseInfo}>
                    <SwipeableInfo enterpriseData={enterpriseData} />
                </div>
            </div>
        </div>
    );
}

export default EnterpriseInfo;