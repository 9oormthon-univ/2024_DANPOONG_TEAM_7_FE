import React, { useState } from 'react';
import underArrow from "../../../assets/images/program/underArrow.svg"

const ProgramCard = ({ enterpriseName, title, field, date, img, detail, region }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <div style={{
            borderRadius: '29px',
            padding: '5%',
            marginBottom: '5%',
            border: 'solid 1px #D9D9D9',
            transition: 'all 0.3s ease-in-out',
            maxHeight: isExpanded ? '2000px' : '200px',
            overflow: 'hidden'
        }}>
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '4px',
                margin: '3%'
            }}>
                <span style={{
                    width: '100%',
                    textAlign: 'start',
                    fontSize: '20px',
                    fontWeight: 'bold',
                }}>{title}</span>
                <span style={{
                    width: '100%',
                    margin: '12px 0 0 0',
                    textAlign: 'start',
                    fontSize: '15px',
                }}>{enterpriseName}</span>
                {!isExpanded &&
                    <>
                        <div style={{
                            display: 'flex',
                            justifyContent: 'start',
                            gap: '20px'
                        }}>
                            <span style={{
                                whiteSpace: 'nowrap',
                                textAlign: 'start',
                                fontSize: '15px',
                                transition: 'max-height 0.5s ease-in-out',
                            }}>{field}</span>
                        </div>
                        <div style={{
                            display: 'flex',
                            justifyContent: 'start',
                            gap: '20px'
                        }}>
                            <span style={{
                                whiteSpace: 'nowrap',
                                textAlign: 'start',
                                fontSize: '15px',
                                transition: 'max-height 0.5s ease-in-out',
                            }}>{region}</span>
                        </div>
                    </>
                }
                {isExpanded &&
                    <>
                        <span style={{
                            width: '100%',
                            textAlign: 'start',
                            fontSize: '15px',
                        }}>{field}</span>
                        <span style={{
                            width: '100%',
                            textAlign: 'start',
                            fontSize: '15px',
                        }}>{region}</span>
                        <span style={{
                            width: '100%',
                            textAlign: 'start',
                            fontSize: '15px',
                        }}>{date}</span>
                    </>
                }
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    transition: 'all 0.5s ease-in-out',
                    opacity: isExpanded ? 0 : 1,
                    height: isExpanded ? 0 : 'auto',
                    overflow: 'hidden',
                    fontSize: '15px'
                }}>
                </div>
            </div>
            <div
                style={{
                    maxHeight: isExpanded ? '1000px' : '0',
                    overflow: 'hidden',
                    transition: 'max-height 0.3s ease-in-out',
                    opacity: isExpanded ? 1 : 0,
                    transform: isExpanded ? 'translateY(0)' : 'translateY(-20px)',
                    margin: '20px 3% 0 3%'
                }}
            >
                <div style={{
                    width: '100%',
                    height: '200px',
                    backgroundImage: `url(${img})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                }} />
                <div style={{ padding: '20px 0' }}>
                    <p style={{
                        textAlign: 'start',
                        fontSize: '14px',
                        lineHeight: '1.5',
                        marginBottom: '15px',
                        whiteSpace: 'pre-wrap'
                    }}>{detail}</p>
                </div>
                <div style={{
                    width: '100%',
                    textAlign: 'start',
                    fontSize: '15px',
                }}>
                </div>
            </div>
            <div
                onClick={() => setIsExpanded(!isExpanded)}
                style={{
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                    cursor: 'pointer'
                }}
            >
                <img
                    src={underArrow}
                    alt='더보기'
                    style={{
                        width: '14px',
                        transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                        transition: 'transform 0.3s ease-in-out'
                    }}
                />
            </div>
        </div>
    );
};

export default ProgramCard;