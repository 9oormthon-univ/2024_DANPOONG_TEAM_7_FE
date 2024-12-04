import React from "react";
import { useNavigate } from "react-router-dom";
import rightArrow from "../../../assets/images/mypage/rightArrow.svg"

const AdminComponent = ({ enterpriseProfile, profile }) => {

    const navigate = useNavigate();

    const navigateAdminPage = () => {
        navigate('/mypage/management');
    }

    // 평균 추천 그래프 높이 계산
    const calculateGraphHeight = (reviewCount) => {
        const MAX_HEIGHT = 100;
        const MAX_REVIEWS = 30;
        return Math.min((reviewCount / MAX_REVIEWS) * 100, MAX_HEIGHT);
    };

    return (
        <>
            {(enterpriseProfile) && (enterpriseProfile.userRole == 'ENTERPRISE') &&
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: '90%',
                    flexShrink: '0',
                    borderRadius: '27px',
                    background: '#FFF',
                    border: 'solid 1px #BEBEBE',
                    overflow: 'hidden',                                  
                }}>
                    <div style={{display: 'flex', width: '90%', justifyContent: 'space-between', alignItems: 'center', margin: '8% 8% 5% 0'}}>
                        <span style={{width: '30%', fontSize: '15px', fontWeight: '500', color: '#113C35'}}>기업 자산</span>
                        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '70%'}}>
                            <span style={{color: '#113C35', fontWeight: '500', fontSize: '20px'}}>총 {enterpriseProfile.programCount + enterpriseProfile.jobCount}개</span>
                            <img src={rightArrow} alt="rightArrow" onClick={navigateAdminPage} />
                        </div>
                    </div>
                    <div style={{display: 'flex', width: '90%', justifyContent: 'space-between', alignItems: 'center', margin: '0 10% 5% 0'}}>
                        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', width: '30%', gap: '5px' }}>
                            <span style={{fontSize: '20px', color: '#5C5C5C', fontWeight: '500'}}>{enterpriseProfile.reviewCount}</span>
                            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'center', position: 'relative', width: '18px', height: '67px', borderRadius: '8px 8px 0 0', backgroundColor: '#2DDDC320', overflow: 'hidden' }}>
                                <div style={{ height: `${calculateGraphHeight(10)}%`, position: 'absolute', bottom: '0', left: '0', width: '100%', borderRadius: '8px 8px 0 0', backgroundColor: '#2DDDC3', transition: 'height 0.3s ease' }}
                                />
                            </div>
                            <span style={{ fontSize: '12px', fontWeight: '500',color: '#5C5C5C' }}>평균 추천</span>
                        </div>
                        <div style={{width: '70%'}}>
                            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#5C5C5C', fontSize: '15px', fontWeight: '500', marginBottom: '10px'}}>
                                <span>창출한 일자리</span>
                                <span>{enterpriseProfile.jobCount}개</span>
                            </div>
                            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#5C5C5C', fontSize: '15px', fontWeight: '500'}}>
                                <span>개설한 프로그램</span>
                                <span>{enterpriseProfile.programCount}개</span>
                            </div>
                        </div>
                    </div>
                </div >
            }
            {(profile.userRole != 'ENTERPRISE') &&
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    width: '90%',
                    borderRadius: '27px',
                    background: '#F0F0F0CC',
                }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        fontSize: '15px',
                        gap: '20px',
                        height: '76px'
                    }}>                        
                        <span style={{ color: '#5C5C5C' }}>기업 인증 후 사용 가능합니다.</span>
                        <img src={rightArrow} alt="rightArrow" />
                    </div>
                </div>
            }            
        </>
    )
}

export default AdminComponent;