import React, { useState, useRef, useEffect } from 'react';
import styles from '../../styles/program/Program.module.css';
import TopBar from '../../components/layout/TopBar';
import search from '../../assets/images/program/search.svg';
import underArrow from '../../assets/images/program/underArrow.svg';
import minus from '../../assets/images/program/minus.svg';
import plus from '../../assets/images/program/plus.svg';
import check from '../../assets/images/program/check.svg';
import leftArrow from '../../assets/images/program/leftArrow.svg';
import LoadingSpinner from '../../components/layout/LoadingSpinner';

import entNews1 from '../../assets/images/magazine/entNews1.png';

const Program = () => {
    const contentRefs = useRef({});
    const [showModal, setShowModal] = useState(false);
    const [pages, setPages] = useState([]);
    const [showJobComponent, setShowJobComponent] = useState(false);
    const [loading, setLoading] = useState(true); // 로딩 상태 추가
    const [currentIndex, setCurrentIndex] = useState(0);
    const [startX, setStartX] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const [dragOffset, setDragOffset] = useState(0);
    const [expandedCards, setExpandedCards] = useState({});
    const [selectedCard, setSelectedCard] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredItems, setFilteredItems] = useState([]);

    const programImageMap = {
        entNews1,
        entNews1,
        entNews1,
        entNews1,
    };

    const jobImageMap = {
        entNews1,
        entNews1,
        entNews1,
        entNews1,
        entNews1,
    };

    // 데이터 가져오기
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('/dummyData/ProgramJobData.json');
                const jsonData = await response.json();

                // 이미지 매핑 추가
                const mappedData = jsonData.map((category) => ({
                    ...category,
                    items: category.items.map((item) => ({
                        ...item,
                        image:
                            item.type === "program"
                                ? programImageMap[item.image]
                                : jobImageMap[item.image],
                    })),
                }));
                setPages(mappedData);
            } catch (error) {
                console.error('Fetch error:', error);
                setPages([]); // 에러 발생 시 빈 배열 설정
            } finally {
                setLoading(false); // 로딩 상태 해제
            }
        };
        fetchData();
    }, []);

    // 검색 함수
    const handleSearch = (searchTerm, pageIndex) => {
        const currentPage = pages[pageIndex];

        if (!currentPage || !currentPage.items) {
            setFilteredItems([]);
            return;
        }

        if (!searchTerm.trim()) {
            setFilteredItems(currentPage.items);
            return;
        }

        const searchLower = searchTerm.toLowerCase();

        const filtered = currentPage.items.filter(item => {
            if (item.type === "program") {
                return (
                    item.programTitle.toLowerCase().includes(searchLower) ||
                    item.enterpriseName.toLowerCase().includes(searchLower) ||
                    item.place.toLowerCase().includes(searchLower)
                );
            } else if (item.type === "job") {
                return (
                    item.jobName.toLowerCase().includes(searchLower) ||
                    item.enterpriseName.toLowerCase().includes(searchLower) ||
                    item.place.toLowerCase().includes(searchLower)
                );
            }
            return false;
        });

        setFilteredItems(filtered);
    };

    // 페이지 변경 시 검색어 초기화 및 필터링
    useEffect(() => {
        if (pages.length > 0 && currentIndex < pages.length && pages[currentIndex]) {
            setSearchTerm('');
            setFilteredItems(pages[currentIndex].items || []);
        } else {
            setFilteredItems([]); 
        }
    }, [currentIndex, pages]);

    // 검색어 변경 시 필터링 실행
    useEffect(() => {
        handleSearch(searchTerm, currentIndex);
    }, [searchTerm, currentIndex]);

    // 로딩 상태 처리
    if (loading) {
        return <div><LoadingSpinner/></div>;
    }

    // 데이터가 없을 때 처리
    if (!pages || pages.length === 0) {
        return <div>No data available</div>;
    }

    // const handleTouchStart = (e) => {
    //     setStartX(e.touches[0].clientX);
    //     setIsDragging(true);
    // };

    // const handleMouseDown = (e) => {
    //     setStartX(e.clientX);
    //     setIsDragging(true);
    // };

    // const handleTouchMove = (e) => {
    //     if (!isDragging) return;
    //     const currentX = e.touches[0].clientX;
    //     const diff = currentX - startX;
    //     setDragOffset(diff);
    // };

    // const handleMouseMove = (e) => {
    //     if (!isDragging) return;
    //     e.preventDefault();
    //     const currentX = e.clientX;
    //     const diff = currentX - startX;
    //     setDragOffset(diff);
    // };

    // const handleEnd = () => {
    //     if (Math.abs(dragOffset) > 100) {
    //         if (dragOffset > 0 && currentIndex > 0) {
    //             setCurrentIndex(currentIndex - 1);
    //         } else if (dragOffset < 0 && currentIndex < pages.length - 1) {
    //             setCurrentIndex(currentIndex + 1);
    //         }
    //     }
    //     setIsDragging(false);
    //     setDragOffset(0);
    // };

    const handleTabClick = (index) => {
        setCurrentIndex(index);
    };

    const handleApplyClick = (card) => {
        setSelectedCard(card);
        setShowModal(true);
    };

    const handleJobApplyClick = (card) => {
        setSelectedCard(card);
        setShowJobComponent(true);
    };

    const containerStyle = {
        transform: `translateX(calc(${-currentIndex * 100}% + ${dragOffset}px))`,
        transition: isDragging ? 'none' : 'transform 0.3s ease-out',
    };

    const indicatorStyle = {
        transform: `translateX(${currentIndex * 100}%)`,
        transition: isDragging ? 'none' : 'transform 0.3s ease-out',
    };

    const toggleCard = (pageIdx, itemIdx) => {
        const cardId = `${pageIdx}-${itemIdx}`;
        setExpandedCards(prev => ({
            ...prev,
            [cardId]: !prev[cardId]
        }));
    };

    const Modal = ({ isOpen, onClose, card }) => {
        const [startY, setStartY] = useState(0);
        const [dragOffset, setDragOffset] = useState(0);
        const [isDragging, setIsDragging] = useState(false);
        const [count, setCount] = useState(1);
        const [showCompletionModal, setShowCompletionModal] = useState(false);

        const [name, setName] = useState('');
        const [phone, setPhone] = useState('');
        const [email, setEmail] = useState('');
        const [errors, setErrors] = useState({
            name: false,
            phone: false,
            email: false
        });

        const handleTouchStart = (e) => {
            setStartY(e.touches[0].clientY);
            setIsDragging(true);
        };

        const handleTouchMove = (e) => {
            if (!isDragging) return;
            const currentY = e.touches[0].clientY;
            const diff = currentY - startY;
            setDragOffset(diff > 0 ? diff : 0);
        };

        const handleTouchEnd = () => {
            if (dragOffset > 100) {
                onClose();
            }
            setDragOffset(0);
            setIsDragging(false);
        };

        const handleIncrease = () => {
            setCount(prev => prev + 1);
        };

        const handleDecrease = () => {
            if (count > 1) {
                setCount(prev => prev - 1);
            }
        };

        const validateForm = () => {
            const newErrors = {
                name: name.trim() === '',
                phone: phone.trim() === '',
                email: email.trim() === ''
            };

            setErrors(newErrors);

            return !Object.values(newErrors).some(error => error);
        };

        const handleSubmit = () => {
            if (validateForm()) {
                setShowCompletionModal(true);

                const timer = setTimeout(() => {
                    setShowCompletionModal(false);
                    onClose();
                }, 1500);

                return () => clearTimeout(timer);
            }
        };

        useEffect(() => {
            if (isOpen) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }

            return () => {
                document.body.style.overflow = '';
            };
        }, [isOpen]);

        if (!isOpen) return null;

        return (
            <>
                {/* 배경 (dimmed) */}
                <div
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        zIndex: 1000,
                        opacity: isDragging ? 0.8 : 1,
                        transition: 'opacity 0.3s ease',
                    }}
                    onClick={onClose}
                />
                {/* 모달 */}
                <div
                    style={{
                        position: 'fixed',
                        top: isDragging ? `calc(100% - ${700 - dragOffset}px)` : 'calc(100% - 700px)',
                        left: 0,
                        right: 0,
                        height: '80%',
                        backgroundColor: 'white',
                        borderTopLeftRadius: '27px',
                        borderTopRightRadius: '27px',
                        padding: '30px',
                        zIndex: 1001,
                        boxShadow: '0px -4px 10px rgba(0, 0, 0, 0.2)',
                        transition: isDragging ? 'none' : 'transform 0.3s ease-out, top 0.3s ease-out'
                    }}
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                >
                    <div
                        style={{
                            width: '50px',
                            height: '5px',
                            backgroundColor: '#ccc',
                            borderRadius: '2.5px',
                            margin: '0 auto 10px',
                        }}
                    />
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '10px',
                            height: '100%',
                            overflowY: 'auto',
                        }}
                    >
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'baseline',
                            margin: '0 1% 20px 1%',
                        }}>
                            <span style={{

                                fontSize: '20px',
                                fontWeight: 'bold',
                            }}>신청자 정보</span>
                            <span style={{
                                fontSize: '12px',
                                color: '#FF6C6A'
                            }}>· 필수입력</span>
                        </div>
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            border: '1px solid #D9D9D9',
                            borderRadius: '27px',
                            padding: '3% 4%',
                            margin: '0 1%',
                            gap: '10px',
                        }}>
                            <span style={{
                                fontSize: '15px',
                                whiteSpace: 'nowrap',
                                color: errors.name ? 'red' : 'black'
                            }}>· 신청자</span>
                            <input
                                type="text"
                                placeholder="신청자"
                                value={name}
                                onChange={(e) => {
                                    setName(e.target.value);
                                    setErrors(prev => ({ ...prev, name: false }));
                                }}
                                style={{
                                    fontSize: '15px',
                                    width: '100%',
                                    height: '100%',
                                    border: 'none',
                                    margin: '0',
                                    padding: '0',
                                    display: 'flex',
                                    alignItems: 'center',
                                }}
                                onFocus={(e) => {
                                    e.target.style.outline = 'none';
                                    e.target.style.boxShadow = 'none';
                                }}
                                onBlur={(e) => {
                                    e.target.style.outline = 'none';
                                    e.target.style.boxShadow = 'none';
                                }}
                            />
                        </div>
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            border: '1px solid #D9D9D9',
                            borderRadius: '27px',
                            padding: '3% 4%',
                            margin: '0 1%',
                            gap: '10px',
                        }}>
                            <span style={{
                                fontSize: '15px',
                                whiteSpace: 'nowrap',
                                color: errors.phone ? 'red' : 'black'
                            }}>· 연락처</span>
                            <input
                                type="text"
                                placeholder="연락처"
                                value={phone}
                                onChange={(e) => {
                                    setPhone(e.target.value);
                                    setErrors(prev => ({ ...prev, phone: false }));
                                }}
                                style={{
                                    fontSize: '15px',
                                    width: '100%',
                                    height: '100%',
                                    border: 'none',
                                    margin: '0',
                                    padding: '0',
                                    display: 'flex',
                                    alignItems: 'center',
                                }}
                                onFocus={(e) => {
                                    e.target.style.outline = 'none';
                                    e.target.style.boxShadow = 'none';
                                }}
                                onBlur={(e) => {
                                    e.target.style.outline = 'none';
                                    e.target.style.boxShadow = 'none';
                                }}
                            />
                        </div>
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            border: '1px solid #D9D9D9',
                            borderRadius: '27px',
                            padding: '3% 4%',
                            margin: '0 1%',
                            gap: '10px',
                        }}>
                            <span style={{
                                fontSize: '15px',
                                whiteSpace: 'nowrap',
                                color: errors.email ? 'red' : 'black'
                            }}>· 이메일</span>
                            <input
                                type="text"
                                placeholder="이메일"
                                value={email}
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                    setErrors(prev => ({ ...prev, email: false }));
                                }}
                                style={{
                                    fontSize: '15px',
                                    width: '100%',
                                    height: '100%',
                                    border: 'none',
                                    margin: '0',
                                    padding: '0',
                                    display: 'flex',
                                    alignItems: 'center',
                                }}
                                onFocus={(e) => {
                                    e.target.style.outline = 'none';
                                    e.target.style.boxShadow = 'none';
                                }}
                                onBlur={(e) => {
                                    e.target.style.outline = 'none';
                                    e.target.style.boxShadow = 'none';
                                }}
                            />
                        </div>
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            border: '1px solid #D9D9D9',
                            borderRadius: '27px',
                            padding: '3% 4%',
                            margin: '0 1%',
                        }}>
                            <div style={{
                                display: 'flex',
                                gap: '20px',
                                alignItems: 'center',
                            }}>
                                <span style={{
                                    fontSize: '15px',
                                    whiteSpace: 'nowrap'
                                }}>· 예약 인원</span>
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '10px'
                                }}>
                                    <img src={minus} alt='minus'
                                        onClick={handleDecrease}
                                        style={{
                                            width: '17px',
                                            height: '17px',
                                            cursor: 'pointer'
                                        }} />
                                    <span>{count} 명</span>
                                    <img src={plus} alt='plus'
                                        onClick={handleIncrease}
                                        style={{
                                            width: '17px',
                                            height: '17px',
                                            cursor: 'pointer'
                                        }} />
                                </div>
                            </div>
                            <span style={{
                                color: '#FF6C6A',
                                fontSize: '12px'
                            }}>인원을 확인해주세요</span>
                        </div>
                        <div style={{
                            display: 'flex',
                            justifyContent: 'start',
                            alignItems: 'baseline',
                            margin: '20px 1% 20px 1%',
                            gap: '20px'
                        }}>
                            <span style={{
                                fontSize: '20px',
                                fontWeight: 'bold',
                            }}>예약 정보</span>
                            <span style={{
                                fontSize: '12px',
                                fontWeight: 'bold',
                                color: '#5C5C5C'
                            }}>예약 정보를 다시 한번 확인해주세요!</span>
                        </div>
                        <div>
                            <div style={{
                                width: '100%',
                                margin: '0 3%',
                                textAlign: 'start',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '5px'
                            }}>
                                <div>
                                    <span style={{
                                        fontWeight: 'bold',
                                        marginRight: '10px',
                                    }}>프로그램 이름</span>
                                    <span>{card.programTitle}</span>
                                </div>
                                <div>
                                    <span style={{
                                        marginRight: '10px',
                                    }}>기업 이름</span>
                                    <span>{card.enterpriseName}</span>
                                </div>
                                <div>
                                    <span style={{
                                        marginRight: '10px',
                                    }}>분야</span>
                                    <span>{card.field}</span>
                                </div>
                                <div>
                                    <span style={{
                                        marginRight: '10px',
                                    }}>장소</span>
                                    <span>{card.place}</span>
                                </div>
                                <div>
                                    <span style={{
                                        marginRight: '10px',
                                    }}>시간</span>
                                    <span>{card.time}</span>
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={handleSubmit}
                            style={{
                                width: '100%',
                                padding: '20px',
                                backgroundColor: '#2DDDC3',
                                color: 'white',
                                border: 'none',
                                borderRadius: '27px',
                                fontSize: '20px',
                                marginTop: '20px',
                            }}
                        >
                            접수하기
                        </button>
                    </div>
                    {/* 완료 모달 */}
                    {showCompletionModal && (
                        <div
                            style={{
                                position: 'fixed',
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                                zIndex: 2000,
                            }}
                        >
                            <div
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '18px',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    backgroundColor: 'white',
                                    padding: '40px 60px',
                                    borderRadius: '31px',
                                    textAlign: 'center',
                                    // boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)',
                                }}
                            >
                                <img src={check} alt='check' style={{ width: '26px' }} />
                                <div
                                    style={{
                                        fontSize: '20px',
                                        fontWeight: 'bold',
                                    }}
                                >
                                    예약이 확정되었어요!
                                </div>
                                <div
                                    style={{
                                        fontSize: '15px',
                                        color: '#5C5C5C'
                                    }}
                                >
                                    늦지 않게 진행 장소에 도착해 주세요!
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </>
        );
    };

    const JobComponent = ({ card }) => {
        return (
            <div>
                <div style={{
                    width: '100%',
                    height: '250px',
                    backgroundImage: `url(${card.image})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                }}>
                    <div
                        onClick={() => setShowJobComponent(false)}
                        style={{
                            position: 'relative',
                            top: '20px',
                            left: '-135px',
                            display: 'flex',
                            justifyContent: 'center',
                            gap: '15px'
                        }}>
                        <img src={leftArrow} alt='leftArrow' />
                        <span style={{ color: '#5C5C5C', fontSize: '15px' }}>일자리 리스트</span>
                    </div>
                </div>
                <div style={{
                    width: '90%',
                    margin: '20px 5% 0 5%',
                }}>
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '10px'
                    }}>
                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            textAlign: 'start',
                            gap: '5px',
                            marginBottom: '5%',
                        }}>
                            <span style={{
                                fontSize: '24px',
                                fontWeight: 'bold',
                                paddingBottom: '9px',
                            }}>{card.jobName}</span>
                            <span>{card.field}</span>
                            <span>{card.job}</span>
                            <span>{card.time}</span>
                            <span>{card.city}</span>
                        </div>
                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            backgroundColor: 'white',
                            borderRadius: '29px',
                            border: '1px solid #D9D9D9',
                            padding: '5%',
                            marginBottom: '5%',
                            textAlign: 'start',
                            gap: '8px'
                        }}>
                            <span style={{
                                fontSize: '20px',
                                fontWeight: 'bold',
                                paddingBottom: '9px'
                            }}>근무조건</span>
                            <div style={{
                                display: 'flex'
                            }}>
                                <span style={{
                                    width: '30%',
                                }}>급여</span>
                                <span>{card.salary}</span>
                            </div>
                            <div style={{
                                display: 'flex'
                            }}>
                                <span style={{
                                    width: '30%',
                                }}>근무기간</span>
                                <span>{card.workingPeriod}</span>
                            </div>
                            <div style={{
                                display: 'flex'
                            }}>
                                <span style={{
                                    width: '30%',
                                }}>근무요일</span>
                                <span>{card.workDays}</span>
                            </div>
                            <div style={{
                                display: 'flex'
                            }}>
                                <span style={{
                                    width: '30%',
                                }}>근무시간</span>
                                <span>{card.workingHours}</span>
                            </div>
                            <div style={{
                                display: 'flex'
                            }}>
                                <span style={{
                                    width: '30%',
                                }}>업직종</span>
                                <span>{card.industryOccupation}</span>
                            </div>
                            <div style={{
                                display: 'flex'
                            }}>
                                <span style={{
                                    width: '30%',
                                }}>고용형태</span>
                                <span style={{
                                    width: '70%',
                                }}>{card.employmentType}</span>
                            </div>
                            <div style={{
                                display: 'flex',
                            }}>
                                <span style={{
                                    width: '30%',
                                }}>복리후생</span>
                                <span style={{
                                    width: '70%',
                                }}>{card.welfareBenefits}</span>
                            </div>
                        </div>
                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            backgroundColor: 'white',
                            borderRadius: '29px',
                            border: '1px solid #D9D9D9',
                            padding: '5%',
                            marginBottom: '5%',
                            textAlign: 'start',
                            gap: '8px'
                        }}>
                            <span style={{
                                fontSize: '20px',
                                fontWeight: 'bold',
                                paddingBottom: '9px'
                            }}>모집조건</span>
                            <div style={{
                                display: 'flex'
                            }}>
                                <span style={{
                                    width: '30%',
                                }}>모집마감</span>
                                <span>{card.recruitmentClosing}</span>
                                <span style={{
                                    marginLeft: '10%',
                                    color: '#FF6C6A'
                                }}>{card.day}</span>
                            </div>
                            <div style={{
                                display: 'flex'
                            }}>
                                <span style={{
                                    width: '30%',
                                }}>모집인원</span>
                                <span>{card.recruitmenPersonNumber}</span>
                            </div>
                            <div style={{
                                display: 'flex'
                            }}>
                                <span style={{
                                    width: '30%',
                                }}>학력</span>
                                <span>{card.education}</span>
                            </div>
                            <div style={{
                                display: 'flex'
                            }}>
                                <span style={{
                                    width: '30%',
                                    textAlign: 'start'
                                }}>우대사항</span>
                                <span>{card.preferentialTreatment}</span>
                            </div>
                        </div>
                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            backgroundColor: 'white',
                            borderRadius: '29px',
                            border: '1px solid #D9D9D9',
                            padding: '5%',
                            marginBottom: '5%',
                            textAlign: 'start',
                            gap: '8px'
                        }}>
                            <span style={{
                                fontSize: '20px',
                                fontWeight: 'bold',
                                paddingBottom: '9.3px'
                            }}>근무지역</span>
                            <div style={{
                                display: 'flex'
                            }}>
                                <span style={{
                                    width: '70%',
                                }}>{card.address}</span>
                            </div>
                        </div>
                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            backgroundColor: 'white',
                            borderRadius: '29px',
                            border: '1px solid #D9D9D9',
                            padding: '5%',
                            marginBottom: '5%',
                            textAlign: 'start',
                            gap: '8px'
                        }}>
                            <span style={{
                                fontSize: '20px',
                                fontWeight: 'bold',
                                paddingBottom: '9px'
                            }}>채용담당자 정보</span>
                            <div style={{
                                display: 'flex'
                            }}>
                                <span style={{
                                    width: '30%',
                                }}>담당자</span>
                                <span>{card.recruitmeRepresentative}</span>
                            </div>
                            <div style={{
                                display: 'flex'
                            }}>
                                <span style={{
                                    width: '30%',
                                }}>전화번호</span>
                                <span>{card.phone}</span>
                            </div>
                            <div style={{
                                display: 'flex'
                            }}>
                                <span style={{
                                    width: '30%',
                                }}>이메일</span>
                                <span>{card.email}</span>
                            </div>
                            <div style={{
                                display: 'flex'
                            }}>
                                <span style={{
                                    width: '30%',
                                    textAlign: 'start'
                                }}>홈페이지</span>
                                <span>{card.website}</span>
                            </div>
                        </div>
                    </div>
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '20px',
                        margin: '5% 0'
                    }}>
                        <div style={{
                            textAlign: 'center',
                            background: '#D5F8F3',
                            borderRadius: '27px',
                            height: '59px',
                            lineHeight: '59px',
                            fontSize: '20px',
                            color: '#747474'
                        }}>
                            기업 정보 보기
                        </div>
                        <div style={{
                            textAlign: 'center',
                            background: '#D9D9D9',
                            borderRadius: '27px',
                            height: '59px',
                            lineHeight: '59px',
                            fontSize: '20px',
                        }}>
                            <span style={{ color: '#FFFFFF' }}>서비스 준비중입니다</span>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className={styles.container}>
            <TopBar />
            <div style={{
                width: '100%',
                overflow: 'hidden',
                backgroundColor: 'white'
            }}>
                <div style={{
                    backgroundColor: 'white'
                }}>
                    <div style={{
                        width: '100%',
                        height: '3px',
                        backgroundColor: '#D5F8F3',
                        position: 'relative'
                    }}>
                        <div style={{
                            position: 'absolute',
                            height: '3px',
                            width: `${100 / pages.length}%`,
                            backgroundColor: '#113C35',
                            bottom: 0,
                            ...indicatorStyle
                        }} />
                    </div>

                    <div style={{
                        display: 'flex'
                    }}>
                        {pages.map((page, idx) => (
                            <div
                                key={idx}
                                style={{
                                    flex: 1,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    cursor: 'pointer'
                                }}
                                onClick={() => { handleTabClick(idx); setShowJobComponent(false); }}
                            >
                                <div style={{
                                    padding: '16px 0',
                                    textAlign: 'center',
                                    fontSize: '20px',
                                    fontWeight: currentIndex === idx ? 600 : 400,
                                }}>
                                    {page.title}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div style={{ overflow: 'hidden' }}>
                        <div style={{
                            display: 'flex',
                            ...containerStyle
                        }}>
                            {pages.map((page, idx) => (
                                <div key={idx} style={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    width: '100%',
                                    flexShrink: 0,
                                }}>
                                    {!showJobComponent &&
                                        <div style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            width: '90%',
                                            height: '43px',
                                            borderRadius: '21.5px',
                                            border: '1px solid #d1d5db',
                                            margin: '10px'
                                        }}>
                                            <input
                                                type="text"
                                                placeholder={page.searchPlaceholder}
                                                value={currentIndex === idx ? searchTerm : ''}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                                style={{
                                                    width: '100%',
                                                    border: 'none',
                                                    margin: '1% 0 1% 3%',
                                                }}
                                                onFocus={(e) => {
                                                    e.target.style.outline = 'none';
                                                    e.target.style.boxShadow = 'none';
                                                }}
                                                onBlur={(e) => {
                                                    e.target.style.outline = 'none';
                                                    e.target.style.boxShadow = 'none';
                                                }}
                                            />
                                            <img src={search} alt='search' style={{ width: '24px', marginRight: '3%' }} />
                                        </div>
                                    }
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {!showJobComponent &&
                    <div
                        style={{
                            height: '100%',
                        }}
                    // onTouchStart={handleTouchStart}
                    // onTouchMove={handleTouchMove}
                    // onTouchEnd={handleEnd}
                    // onMouseDown={handleMouseDown}
                    // onMouseMove={handleMouseMove}
                    // onMouseUp={handleEnd}
                    // onMouseLeave={handleEnd}
                    >
                        <div style={{
                            display: 'flex',
                            ...containerStyle
                        }}>
                            {pages.map((page, pageIdx) => (
                                <div key={pageIdx} style={{
                                    width: '90%',
                                    margin: '2% 5%',
                                    flexShrink: 0,
                                }}>
                                    {(pageIdx === currentIndex ? filteredItems : page.items).map((item, itemIdx) => {
                                        const cardId = `${pageIdx}-${itemIdx}`;
                                        const isExpanded = expandedCards[cardId];

                                        return (
                                            <div key={itemIdx} style={{
                                                backgroundColor: 'white',
                                                borderRadius: '29px',
                                                border: '1px solid #D9D9D9',
                                                padding: '5%',
                                                marginBottom: '5%',
                                                transition: 'all 0.3s ease-in-out',
                                                maxHeight: isExpanded ? '2000px' : '200px',
                                                overflow: 'hidden'
                                            }}>
                                                {item.type === "program" &&
                                                    <>
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
                                                            }}>{item.programTitle}</span>
                                                            <span style={{
                                                                width: '100%',
                                                                margin: '12px 0 0 0',
                                                                textAlign: 'start',
                                                                fontSize: '15px',
                                                            }}>{item.enterpriseName}</span>
                                                            {!isExpanded &&
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
                                                                    }}>{item.place}</span>
                                                                </div>
                                                            }
                                                            {isExpanded &&
                                                                <>
                                                                    <span style={{
                                                                        width: '100%',
                                                                        textAlign: 'start',
                                                                        fontSize: '15px',
                                                                    }}>{item.place}</span>
                                                                    <span style={{
                                                                        width: '100%',
                                                                        textAlign: 'start',
                                                                        fontSize: '15px',
                                                                    }}>{item.time}</span>
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
                                                                <div>
                                                                    <span style={{
                                                                        marginRight: '10px'
                                                                    }}>좋아요 수</span>
                                                                    <span style={{
                                                                        marginRight: '20px',
                                                                        color: '#FF6C6A'
                                                                    }}>{item.likes}</span>
                                                                    <span style={{
                                                                        marginRight: '10px'
                                                                    }}>리뷰 수</span>
                                                                    <span style={{
                                                                        marginRight: '10px'
                                                                    }}>{item.comments}</span>
                                                                </div>
                                                                <div
                                                                    onClick={() => handleApplyClick(item)}
                                                                    style={{
                                                                        display: 'flex',
                                                                        whiteSpace: 'nowrap',
                                                                        borderRadius: '19px',
                                                                        color: 'white',
                                                                        background: '#2DDDC3',
                                                                        padding: '2% 5%',
                                                                        fontSize: '15px'
                                                                    }}>신청하기</div>
                                                            </div>
                                                        </div>
                                                        <div
                                                            ref={el => contentRefs.current[cardId] = el}
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
                                                                background: 'gray',
                                                                backgroundImage: `url(${item.image})`,
                                                                backgroundSize: "cover",
                                                                backgroundPosition: "center",
                                                            }}>                                                                
                                                            </div>
                                                            <div style={{ padding: '20px 0' }}>
                                                                <p style={{
                                                                    textAlign: 'start',
                                                                    fontSize: '14px',
                                                                    lineHeight: '1.5',
                                                                    marginBottom: '15px',
                                                                    whiteSpace: 'pre-wrap'
                                                                }}>{item.description}</p>
                                                            </div>
                                                            <div style={{
                                                                opacity: isExpanded ? 1 : 0,
                                                                transform: isExpanded ? 'translateY(0)' : 'translateY(-20px)',
                                                                transition: 'all 0.5s ease-in-out',
                                                                height: isExpanded ? 'auto' : 0,
                                                                overflow: 'hidden'
                                                            }}>
                                                                <div style={{
                                                                    opacity: isExpanded ? 1 : 0,
                                                                    transform: isExpanded ? 'translateY(0)' : 'translateY(-20px)',
                                                                    transition: 'all 0.5s ease-in-out',
                                                                    height: isExpanded ? 'auto' : 0,
                                                                    overflow: 'hidden'
                                                                }}>
                                                                    <div style={{
                                                                        width: '100%',
                                                                        textAlign: 'start',
                                                                        fontSize: '15px',
                                                                    }}>
                                                                        <div>
                                                                            <span style={{
                                                                                marginRight: '10px'
                                                                            }}>좋아요 수</span>
                                                                            <span style={{
                                                                                marginRight: '20px',
                                                                                color: '#FF6C6A'
                                                                            }}>{item.likes}</span>
                                                                            <span style={{
                                                                                marginRight: '10px'
                                                                            }}>리뷰 수</span>
                                                                            <span style={{
                                                                                marginRight: '10px'
                                                                            }}>{item.comments}</span>
                                                                        </div>
                                                                    </div>
                                                                    <div
                                                                        onClick={() => handleApplyClick(item)}
                                                                        style={{
                                                                            width: '100%',
                                                                            color: 'white',
                                                                            fontSize: '20px',
                                                                            borderRadius: '27px',
                                                                            background: '#2DDDC3',
                                                                            margin: '10px 0 20px 0',
                                                                            padding: '10px 0'
                                                                        }}>
                                                                        신청하기
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div
                                                            onClick={() => toggleCard(pageIdx, itemIdx)}
                                                            style={{
                                                                width: '100%',
                                                                display: 'flex',
                                                                justifyContent: 'center',
                                                            }}
                                                        >
                                                            <img
                                                                src={underArrow}
                                                                alt='underArrow'
                                                                style={{
                                                                    width: '14px',
                                                                    transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                                                                    transition: 'transform 0.3s ease-in-out'
                                                                }}
                                                            />
                                                        </div>
                                                    </>
                                                }
                                                {item.type === "job" &&
                                                    <>
                                                        <div style={{
                                                            display: 'flex',
                                                            flexDirection: 'column',
                                                            gap: '4px',
                                                            margin: '3%'
                                                        }}>
                                                            <div style={{
                                                                display: 'flex',
                                                                justifyContent: 'start',
                                                                alignItems: 'baseline',
                                                                gap: '20px'
                                                            }}>
                                                                <span style={{
                                                                    textAlign: 'start',
                                                                    fontSize: '20px',
                                                                    fontWeight: 'bold',
                                                                }}>{item.jobName}</span>
                                                            </div>
                                                            <span style={{
                                                                width: '100%',
                                                                margin: '12px 0 0 0',
                                                                textAlign: 'start',
                                                                fontSize: '15px',
                                                            }}>{item.enterpriseName}</span>
                                                            <div style={{
                                                                display: 'flex',
                                                                justifyContent: 'start',
                                                                gap: '20px'
                                                            }}>
                                                                <span style={{
                                                                    whiteSpace: 'nowrap',
                                                                    textAlign: 'start',
                                                                    fontSize: '15px',
                                                                    // transition: 'max-height 0.5s ease-in-out',
                                                                }}>{item.place}</span>
                                                            </div>

                                                            <div style={{
                                                                display: 'flex',
                                                                justifyContent: 'space-between',
                                                                alignItems: 'center',
                                                                // transition: 'all 0.5s ease-in-out',
                                                                // opacity: isExpanded ? 0 : 1,
                                                                // height: isExpanded ? 0 : 'auto',
                                                                overflow: 'hidden',
                                                            }}>
                                                                <div>
                                                                    <span style={{
                                                                        fontSize: '15px',
                                                                        marginRight: '20px',
                                                                        color: '#FF6C6A'
                                                                    }}>{item.day}</span>
                                                                </div>
                                                                <div
                                                                    onClick={() => handleJobApplyClick(item)}
                                                                    style={{
                                                                        display: 'flex',
                                                                        whiteSpace: 'nowrap',
                                                                        borderRadius: '19px',
                                                                        color: 'white',
                                                                        background: '#2DDDC3',
                                                                        padding: '2% 5%',
                                                                        fontSize: '15px'
                                                                    }}>지원하기
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </>
                                                }
                                            </div>
                                        )
                                    })}
                                </div>
                            ))}
                        </div>
                    </div>
                }
                {showJobComponent && selectedCard &&
                    <JobComponent card={selectedCard} />
                }
            </div>
            <Modal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                card={selectedCard}
            />
        </div>
    );
};

export default Program;