import React from 'react';
import rightArrow from "../../../assets/images/mypage/rightArrow.svg"

const JobCard = ({ enterpriseName, title, field, date, img, detail }) => {
    return (
        <div style={{
            border: 'solid 1px #D9D9D9',
            borderRadius: '27px',
            padding: '5%',
            marginBottom: '7%'
        }}>
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '4px',
                margin: '3%'
            }}>
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '20px'
                }}>
                    <span style={{
                        textAlign: 'start',
                        fontSize: '20px',
                        fontWeight: 'bold',
                    }}>{title}</span>
                    <img src={rightArrow} alt='rightArrow' />
                </div>
                <span style={{
                    width: '100%',
                    margin: '12px 0 0 0',
                    textAlign: 'start',
                    fontSize: '15px',
                }}>{enterpriseName}</span>
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'start',                    
                }}>
                    <span style={{
                        whiteSpace: 'nowrap',
                        textAlign: 'start',
                        fontSize: '15px',                        
                    }}>{field}</span>
                    <span style={{
                        whiteSpace: 'nowrap',
                        textAlign: 'start',
                        fontSize: '15px',                        
                    }}>{date}</span>
                </div>                
            </div>
        </div>
    );
};

export default JobCard;