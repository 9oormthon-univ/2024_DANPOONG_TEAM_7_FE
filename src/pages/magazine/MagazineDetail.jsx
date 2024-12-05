import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from '../../styles/magazine/Magazine.module.css';

//img
import leftArrow from '../../assets/images/magazine/leftArrow.svg';
import card1 from '../../assets/images/magazine/card1.png';
import card2 from '../../assets/images/magazine/card2.png';
import card2Back from '../../assets/images/magazine/card2Back.png';
import card3 from '../../assets/images/magazine/card3.png';
import card3Back from '../../assets/images/magazine/card3Back.png';
import card4 from '../../assets/images/magazine/card4.png';
import card5 from '../../assets/images/magazine/card5.jpeg';

import shop from '../../assets/images/magazine/shop.svg';
import rightArrow from '../../assets/images/magazine/rightArrow.svg';

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

function MagazineDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [cardDetail, setCardDetail] = useState(null);    

    function handleNavigateEnterprise(enterpriseId) {
        navigate(`/enterprise/info/${enterpriseId}`);
    }

    useEffect(() => {
        fetch('/dummyData/magazineCardData.json')
            .then((response) => response.json())
            .then((data) => {
                const card = data.find((item) => item.id === parseInt(id));
                setCardDetail({
                    ...card,
                    image: imageMap[card.image],
                    image2: imageMap2[card.image2]
                });
            })
            .catch((error) => console.error('Error fetching card detail:', error));
    }, [id]);

    if (!cardDetail) {
        return <p>Loading...</p>;
    }

    return (
        <div className={styles.newsDetailContainer}>
            <div style={{
                display: 'flex',
                width: '100%',
                height: '116px',
                // backgroundColor: '#2DDDC3',
                justifyContent: 'left',
                alignItems: 'end',
            }}>
                <div
                    onClick={() => navigate(-1)}
                    style={{
                        display: 'flex',
                        gap: '15px',
                        paddingLeft: '20px',
                        color: 'white',
                    }}>
                    <img src={leftArrow} alt='leftArrow' />
                    <p style={{ fontSize: '20px', fontWeight: 'bold', color: '#5C5C5C' }}>소식 정보</p>
                </div>
            </div>
            <img
                src={cardDetail.image2}
                alt={cardDetail.title}
                style={{
                    width: '100%',
                    height: '240px',
                    objectFit: 'cover',
                    objectPosition: 'center'
                }}
            />
            <div style={{
                display: 'flex',
                width: '100%',
                justifyContent: 'space-between',
                alignItems: 'baseline',
                padding: '30px 0 5px 0'
            }}>
                <span
                    style={{
                        marginLeft: '20px',
                        fontSize: '16px',
                        fontWeight: 'bold',
                    }}>{cardDetail.title}</span>
                <span
                    style={{
                        fontSize: '12px',
                        color: '#BEBEBE',
                        marginRight: '20px'
                    }}>{cardDetail.createdAt}</span>
            </div>
            <div style={{
                display: 'flex',
                width: '100%',
                justifyContent: 'space-between',
                alignItems: 'baseline',
            }}>
                <span
                    style={{
                        fontSize: '15px',
                        fontWeight: 'bold',
                        margin: '0 20px',
                        textAlign: 'left',
                    }}>{cardDetail.description}
                </span>
                <span
                    style={{
                        fontSize: '12px',
                        color: '#BEBEBE',
                        marginRight: '20px'
                    }}>조회수 {cardDetail.views}</span>
            </div>
            <div style={{
                display: 'flex',
                width: '100%',
                padding: '40px 0'
            }}>
                <span style={{
                    fontSize: '13px',
                    // fontWeight: 'bold',
                    margin: '0 20px',
                    textAlign: 'start',
                    tabSize: '2',
                    whiteSpace: 'pre-wrap'
                }}>
                    {cardDetail.details}
                </span>
            </div>
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                width: '100%'
            }}>
                <div style={{
                    display: 'flex',
                    gap: '10px',
                    paddingLeft: '20px',
                }}>
                    <img src={shop} alt='shop' />
                    <span>{cardDetail.enterpriseName}</span>
                </div>
                <img
                    onClick={() => handleNavigateEnterprise(cardDetail.enterpriseId)}
                    src={rightArrow} alt='rightArrow'
                    style={{
                        paddingRight: '40px'
                    }} />
            </div>            
        </div>
    );
}

export default MagazineDetail;