import React from "react";
import { useNavigate } from "react-router-dom";
import rightArrow from "../../../assets/images/mypage/rightArrow.svg"

const AdminComponent = ({ isAdmin }) => {
    
    const navigate = useNavigate();

    const navigateAdminPage = () => {
        navigate('/admin/management');
    }

    return (
        <>
            {isAdmin &&
                <div style={{
                    // marginTop: '34px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: '90%',
                    flexShrink: '0',
                    borderRadius: '27px',
                    background: '#FFF',
                    border: 'solid 1px #BEBEBE',
                    overflow: 'hidden',
                    gap: '5%',
                }}>
                    <div style={{
                        width: '30%',
                        height: '100%',
                        margin: '23px 0',                        
                    }}>
                        <span style={{fontSize: '15px', color: '#113C35'}}>기업 자산</span>
                    </div>
                    <div style={{
                        width: '50%',
                        height: '100%',
                        margin: '23px 0 26px 0',                        
                    }}>
                        <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '20px'}}>
                            <span style={{fontSize: '20px', color: '#113C35'}}>총 800</span>
                            <img src={rightArrow} alt="rightArrow" style={{width: '10px'}} onClick={navigateAdminPage}/>
                        </div>
                        <div style={{display: 'flex', flexDirection: 'column', fontSize: '15px', color: '#5C5C5C'}}>
                            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                                <span>작성한 매거진</span>
                                <span>200개</span>
                            </div>
                            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                                <span>창출한 일자리</span>
                                <span>200개</span>
                            </div>
                            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                                <span>개설한 프로그램</span>
                                <span>200개</span>
                            </div>
                        </div>
                    </div>
                </div >
            }
            {
                !isAdmin &&
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
                        <span style={{ color: '#113C35' }}>내 자산</span>
                        <span style={{ color: '#5C5C5C' }}>기업 인증 후 사용 가능합니다.</span>
                        <img src={rightArrow} alt="rightArrow" />
                    </div>
                </div>
            }
        </>
    )
}

export default AdminComponent;