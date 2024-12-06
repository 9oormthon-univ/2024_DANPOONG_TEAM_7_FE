import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../../styles/magazine/Magazine.module.css';

//img
import card1 from '../../assets/images/magazine/card1.png';
import card2 from '../../assets/images/magazine/card2.png';
import card2Back from '../../assets/images/magazine/card2Back.png';
import card3 from '../../assets/images/magazine/card3.png';
import card3Back from '../../assets/images/magazine/card3Back.png';
import card4 from '../../assets/images/magazine/card4.png';
import card5 from '../../assets/images/magazine/card5.jpeg';
import crown from '../../assets/images/magazine/crown.svg';
import Subtract from '../../assets/images/magazine/Subtract.svg';

import ent1 from '../../assets/images/magazine/ent1.png';
import ent2 from '../../assets/images/magazine/ent2.png';
import ent3 from '../../assets/images/magazine/ent3.png';
import ent4 from '../../assets/images/magazine/ent4.png';
import ent5 from '../../assets/images/magazine/ent5.png';
import ent6 from '../../assets/images/magazine/ent6.png';
import ent7 from '../../assets/images/magazine/ent7.png';
import ent8 from '../../assets/images/magazine/ent8.png';
import ent9 from '../../assets/images/magazine/ent9.png';
import ent10 from '../../assets/images/magazine/ent10.png';

import entNews1 from '../../assets/images/magazine/entNews1.png';
import entNews2 from '../../assets/images/magazine/entNews2.png';
import entNews3 from '../../assets/images/magazine/entNews3.png';
import entNews4 from '../../assets/images/magazine/entNews4.png';
import entNews5 from '../../assets/images/magazine/entNews5.png';

const imageMap = {
    card1,
    card2,
    card3,
    card4,
    card5,
};

const imageMap2 = {
    card1,
    card2Back,
    card3Back,
    card4,
    card5,
};

const enterpriseMap = {
    ent1,
    ent2,
    ent3,
    ent4,
    ent5,
    ent6,
    ent7,
    ent8,
    ent9,
    ent10,
};

const enterpriseNewsMap = {
    entNews1,
    entNews2,
    entNews3,
    entNews4,
    entNews5,
};

function Magazine() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [startX, setStartX] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const [dragOffset, setDragOffset] = useState(0);
    const [cards, setCards] = useState([]);
    const [companies, setCompanies] = useState([]);
    const [enterpirseNews, setEnterpriseNews] = useState([]);

    useEffect(() => {
        fetch('/dummyData/magazineEnterpriseData.json')
            .then((response) => response.json())
            .then((data) => {
                // 이미지 맵핑
                const mappedData = data.map(entData => ({
                    ...entData,
                    image: enterpriseMap[entData.image],
                }));
                setCompanies(mappedData);
            })
            .catch((error) => console.error('Error fetching companies:', error));

        fetch('/dummyData/magazineEnterpriseNewsData.json')
            .then((response) => response.json())
            .then((data) => {
                // 이미지 맵핑
                const mappedData = data.map(entNewsData => ({
                    ...entNewsData,
                    image: enterpriseNewsMap[entNewsData.image],
                }));
                setEnterpriseNews(mappedData);
            })
            .catch((error) => console.error('Error fetching company news:', error));

        fetch('/dummyData/magazineCardData.json')
            .then((response) => response.json())
            .then((data) => {
                // 이미지 맵핑
                const mappedData = data.map(card => ({
                    ...card,
                    image: imageMap[card.image],
                    image2: imageMap2[card.image2]
                }));
                setCards(mappedData);
            })
            .catch((error) => console.error('Error fetching cards:', error));
    }, []);

    const handleTouchStart = (e) => {
        setStartX(e.touches[0].clientX);
        setIsDragging(true);
    };

    const handleMouseDown = (e) => {
        setStartX(e.clientX);
        setIsDragging(true);
    };

    const handleTouchMove = (e) => {
        if (!isDragging) return;
        const currentX = e.touches[0].clientX;
        const diff = currentX - startX;
        setDragOffset(diff);
    };

    const handleMouseMove = (e) => {
        if (!isDragging) return;
        e.preventDefault();
        const currentX = e.clientX;
        const diff = currentX - startX;
        setDragOffset(diff);
    };

    const handleEnd = () => {
        if (Math.abs(dragOffset) > 50) {
            if (dragOffset > 0) {
                setCurrentIndex((prev) => (prev === 0 ? cards.length - 1 : prev - 1));
            } else {
                setCurrentIndex((prev) => (prev === cards.length - 1 ? 0 : prev + 1));
            }
        }
        setIsDragging(false);
        setDragOffset(0);
    };

    const getContainerStyle = () => {
        const translateX = -currentIndex * 80;
        return {
            display: 'flex',
            transition: isDragging ? 'none' : 'transform 0.3s ease-out',
            transform: `translateX(calc(${translateX}% + ${dragOffset / 5}px + 10%))`,
        };
    };

    const navigate = useNavigate();

    const handleCardClick = (id) => {
        navigate(`/magazine/${id}`);
    };

    return (
        <div style={{ width: '100vw', minHeight: '100vh' }}>
            {cards[currentIndex] && (
                <div
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        height: '350px',
                        backgroundImage: `url(${cards[currentIndex].image})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        filter: 'blur(15px)',
                        zIndex: -1,
                        opacity: 0.6
                    }}
                />
            )}
            <div className={styles.container} style={{ display: 'flex', alignItems: 'center', width: '100%', overflowX: 'hidden' }}>
                {/* TopBar 대체 */}
                <div style={{
                    width: '100%',
                    height: '62px',
                }}></div>
                <div style={{ width: '100%' }}>
                    <p style={{
                        fontSize: '20px',
                        color: '#5C5C5C',
                        width: '80%',
                        margin: '0 11% 10px 11%',
                        textAlign: 'start',
                    }}>11월, 용인시의 소식</p>
                    <div
                        onTouchStart={handleTouchStart}
                        onTouchMove={handleTouchMove}
                        onTouchEnd={handleEnd}
                        onMouseDown={handleMouseDown}
                        onMouseMove={handleMouseMove}
                        onMouseUp={handleEnd}
                        onMouseLeave={handleEnd}
                        style={getContainerStyle()}
                    >
                        {cards.map((card, index) => (
                            <div
                                key={card.id}
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    flex: '0 0 80%',
                                    opacity: index === currentIndex ? 1 : 0.5,
                                    transition: 'transform 0.3s ease-out, opacity 0.3s ease-out',
                                    transform: index === currentIndex ? 'scale(1)' : 'scale(0.9)',
                                }}
                            >
                                <div style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    width: '100%',
                                    height: '405px',
                                    justifyContent: 'end',
                                    backgroundImage: card.image ? `url(${card.image})` : 'none',
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                    backgroundRepeat: 'no-repeat',
                                    borderRadius: '25px',
                                    boxSizing: 'border-box',
                                    position: 'relative',
                                    padding: '5%',
                                    marginBottom: '15px',
                                    filter: 'drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25))'
                                }}>
                                    <div style={{
                                        position: 'absolute',
                                        top: '20px',
                                        right: '20px'
                                    }}>
                                        <div style={{
                                            padding: '0 15px',
                                            backgroundColor: '#89857F',
                                            color: 'white',
                                            borderRadius: '23px',
                                            opacity: '0.8'
                                        }}>
                                            {currentIndex + 1} | {cards.length}
                                        </div>
                                    </div>

                                    {/* 그라데이션 오버레이 - 흰색으로 변경 */}
                                    <div style={{
                                        position: 'absolute',
                                        bottom: 0,
                                        left: 0,
                                        right: 0,
                                        height: '30%',
                                        background: 'linear-gradient(to top, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0.6) 20%, rgba(255,255,255,0.4) 35%, rgba(255,255,255,0.2) 50%, rgba(255,255,255,0) 60%)',
                                        borderBottomLeftRadius: '25px',
                                        borderBottomRightRadius: '25px',
                                        zIndex: 1
                                    }} />

                                    {/* 컨텐츠 */}
                                    <div style={{
                                        position: 'relative',
                                        zIndex: 2,
                                        color: 'white'
                                    }}>
                                        <div style={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            textAlign: 'center',
                                        }}>
                                            <span style={{
                                                fontWeight: 'bold',
                                                fontSize: '20px'
                                            }}>{card.title}</span>
                                            <span style={{
                                                fontWeight: '500',
                                                fontSize: '15px'
                                            }}>{card.description}</span>
                                            <div
                                                onClick={() => handleCardClick(card.id)}
                                                style={{
                                                    display: 'inline-flex',
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                    width: '70px',
                                                    height: '30px',
                                                    padding: '0 5%',
                                                    margin: '5% 0 2% 0',
                                                    borderRadius: '23px',
                                                    color: '#ffffff',
                                                    backgroundColor: '#89857F',
                                                    fontSize: '12px',
                                                    fontWeight: '500',                                                    
                                                }}>
                                                보러가기
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
            <h2 style={{ fontWeight: 'bold', padding: '10px 20px 0 20px' }}>11월에 가장 사랑받은 기업은?</h2>
            <div className={styles.container}>
                <div style={{
                    width: '100%',
                    maxWidth: '1200px',
                    boxSizing: 'border-box'
                }}>
                    <div style={{
                        display: 'flex',
                        gap: '20px',
                        overflowX: 'auto',
                        WebkitOverflowScrolling: 'touch', // iOS 스크롤 부드럽게
                        scrollbarWidth: 'none',  // Firefox 스크롤바 숨기기
                        msOverflowStyle: 'none', // IE 스크롤바 숨기기
                        '&::WebkitScrollbar': { // Chrome 스크롤바 숨기기
                            display: 'none'
                        }
                    }}>
                        {companies.map((company, index) => (
                            <div
                                key={company.id}
                                onClick={() => window.location.href = `/enterprise/info/${company.enterpriseId}`} 
                            >
                                <div
                                    style={{
                                        width: '146px',
                                        height: '146px',
                                        backgroundImage: company.image ? `url(${company.image})` : 'none',
                                        backgroundSize: 'cover', // 이미지 비율 유지하면서 영역에 꽉 채움
                                        backgroundPosition: 'center', // 이미지 중앙 정렬
                                        backgroundRepeat: 'no-repeat', // 이미지 반복 방지                                                       
                                        padding: '20px',
                                        position: 'relative',
                                        textAlign: 'center',
                                        ...(index === 0 && { marginLeft: '20px' }),
                                        ...(index === companies.length - 1 && { marginRight: '20px' }),
                                    }}
                                >
                                    {index === 0 &&
                                        <img style={{
                                            position: 'absolute',
                                            top: '5px',
                                            left: '16px',
                                        }} src={crown} alt='crown' />
                                    }
                                    <div
                                        style={{
                                            position: 'absolute',
                                            top: '15px',
                                            left: '15px',
                                            backgroundColor: '#333',
                                            color: 'white',
                                            borderRadius: '50%',
                                            width: '24px',
                                            height: '24px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                        }}
                                    >
                                        {index + 1}
                                    </div>
                                </div>
                                <div style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    ...(index === 0 && { marginLeft: '20px' }),
                                    ...(index === companies.length - 1 && { marginRight: '20px' }),
                                    justifyContent: 'space-between',
                                    alignItems: 'baseline',
                                    padding: '10px 5px 0 5px'
                                }}>
                                    <span style={{
                                        fontSize: '15px',
                                        fontWeight: 'bold',
                                    }}>
                                        {company.name}
                                    </span>
                                    <span style={{
                                        fontSize: '12px',
                                    }}>
                                        {company.location}
                                    </span>
                                </div>
                                <div style={{
                                    display: 'flex',
                                    ...(index === 0 && { marginLeft: '20px' }),
                                    ...(index === companies.length - 1 && { marginRight: '20px' }),
                                    padding: '5px',
                                    gap: '5px'
                                }}>
                                    <img src={Subtract} alt='Subtract' />
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }}>
                                        <span style={{ fontSize: '9px', color: '#333' }}>{company.likes.toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <h2 style={{ fontWeight: 'bold', padding: '10px 20px 0 20px' }}>새로운 기업의 소식</h2>
            <div className={styles.container} style={{ paddingBottom: '100px' }}>
                <div style={{
                    width: '100%',
                    maxWidth: '1200px',
                    boxSizing: 'border-box'
                }}>
                    <div style={{
                        display: 'flex',
                        gap: '20px',
                        overflowX: 'auto',
                        WebkitOverflowScrolling: 'touch', // iOS 스크롤 부드럽게
                        scrollbarWidth: 'none',  // Firefox 스크롤바 숨기기
                        msOverflowStyle: 'none', // IE 스크롤바 숨기기
                        '&::-webkit-scrollbar': { // Chrome 스크롤바 숨기기
                            display: 'none'
                        }
                    }}>
                        {enterpirseNews.map((singleEnterpirseNews, index) => (
                            <div
                                key={singleEnterpirseNews.id}
                                onClick={() => window.location.href = `/enterprise/info/${singleEnterpirseNews.enterpriseId}`}
                            >
                                <div
                                    style={{
                                        width: '244px',
                                        height: '146px',
                                        backgroundImage: singleEnterpirseNews.image ? `url(${singleEnterpirseNews.image})` : 'none',
                                        backgroundSize: 'cover', // 이미지 비율 유지하면서 영역에 꽉 채움
                                        backgroundPosition: 'center', // 이미지 중앙 정렬
                                        backgroundRepeat: 'no-repeat', // 이미지 반복 방지               
                                        // borderRadius: '15px',
                                        padding: '20px',
                                        position: 'relative',
                                        textAlign: 'center',
                                        ...(index === 0 && { marginLeft: '20px' }),
                                        ...(index === enterpirseNews.length - 1 && { marginRight: '20px' }),
                                    }}
                                >
                                </div>
                                <div style={{
                                    display: 'flex',
                                    ...(index === 0 && { marginLeft: '20px' }),
                                    ...(index === enterpirseNews.length - 1 && { marginRight: '20px' }),
                                    justifyContent: 'space-between',
                                    padding: '10px 5px 0 5px'
                                }}>
                                    <span style={{
                                        fontSize: '15px',
                                        fontWeight: 'bold',
                                    }}>
                                        {singleEnterpirseNews.title}
                                    </span>
                                    <span style={{
                                        fontSize: '9px',
                                    }}>
                                        {singleEnterpirseNews.enterpriseName}
                                    </span>
                                </div>
                                <div style={{
                                    display: 'flex',
                                    ...(index === 0 && { marginLeft: '20px' }),
                                    ...(index === singleEnterpirseNews.length - 1 && { marginRight: '20px' }),
                                    padding: '5px',
                                    gap: '5px'
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }}>
                                        <span style={{ fontSize: '9px', color: '#333', textAlign: 'left' }}>{singleEnterpirseNews.content}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Magazine;