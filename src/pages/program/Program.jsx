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
import rightArrow from '../../assets/images/program/rightArrow.svg';

import entNews1 from '../../assets/images/magazine/entNews1.png';
import axiosInstance from '../../api/axiosInstance';
import { useNavigate } from 'react-router-dom';

const Program = () => {
    const contentRefs = useRef({});
    const [showModal, setShowModal] = useState(false);
    const [programItems, setProgramItems] = useState([]);
    const [jobItems, setJobItems] = useState([]);
    const [showJobComponent, setShowJobComponent] = useState(false);
    const [loading, setLoading] = useState(true);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [startX, setStartX] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const [dragOffset, setDragOffset] = useState(0);
    const [expandedCards, setExpandedCards] = useState({});
    const [selectedCard, setSelectedCard] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredItems, setFilteredItems] = useState([]);

    const tabs = [
        { title: "프로그램 참여", searchPlaceholder: "장소 또는 프로그램 유형" },
        { title: "일자리 소개", searchPlaceholder: "일자리 유형이나 장소" }
    ];

    useEffect(() => {
        const fetchData = async () => {
            try {
                const programResponse = await axiosInstance('/api/programs');
                const programData = programResponse.result

                const jobResponse = await axiosInstance('/api/jobs');
                const jobData = jobResponse.result

                const mappedProgramData = programData.map(item => ({
                    ...item,
                    type: "program"
                }));

                // job 데이터에 type 추가
                const mappedJobData = jobData.map(item => ({
                    ...item,
                    type: "job"
                }));

                setProgramItems(mappedProgramData);
                setJobItems(mappedJobData);
                setFilteredItems(currentIndex === 0 ? mappedProgramData : mappedJobData);
            } catch (error) {
                console.error('Fetch error:', error);
                setProgramItems([]);
                setJobItems([]);
                setFilteredItems([]);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleSearch = (searchTerm) => {
        const currentItems = currentIndex === 0 ? programItems : jobItems;

        if (!searchTerm.trim()) {
            setFilteredItems(currentItems);
            return;
        }

        const searchLower = searchTerm.toLowerCase();
        const filtered = currentItems.filter(item => {
            if (item.type === "program") {
                return (
                    item.title.toLowerCase().includes(searchLower) ||
                    item.enterpriseName.toLowerCase().includes(searchLower) ||
                    item.region.toLowerCase().includes(searchLower)
                );
            } else if (item.type === "job") {
                return (
                    item.title.toLowerCase().includes(searchLower) ||
                    item.enterpriseName.toLowerCase().includes(searchLower) ||
                    item.region.toLowerCase().includes(searchLower)
                );
            }
            return false;
        });

        setFilteredItems(filtered);
    };

    // 탭 변경 시 필터링된 아이템 업데이트
    useEffect(() => {
        console.log('Tab changed to:', currentIndex); // 여기 추가
        setSearchTerm('');
        const newItems = currentIndex === 0 ? programItems : jobItems;
        console.log('New filtered items:', newItems); // 여기 추가
        setFilteredItems(newItems);
    }, [currentIndex, programItems, jobItems]);

    // 검색어 변경 시 필터링 실행
    useEffect(() => {
        handleSearch(searchTerm);
    }, [searchTerm]);

    // 로딩 상태 처리
    if (loading) {
        return <div><LoadingSpinner /></div>;
    }

    // 데이터 체크
    if ((!programItems || programItems.length === 0) && (!jobItems || jobItems.length === 0)) {
        return <div>No data available</div>;
    }

    const handleTabClick = (index) => {
        setCurrentIndex(index);
        setShowJobComponent(false);
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

    const toggleCard = (itemIdx) => {
        const cardId = `${currentIndex}-${itemIdx}`;
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
                                    <span>{card.title}</span>
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
                                    <span>{card.region}</span>
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
        const navigate = useNavigate();

        function handleClickEnterpriseInfo(enterpriseId) {
            navigate(`/enterprise/info/${enterpriseId}`)
        }

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
                            }}>{card.title}</span>
                            <span>{card.field}</span>
                            <span>{card.duty}</span>
                            {/* <span>{card.time}</span> */}
                            <span>{card.region}</span>
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
                                <span>{card.requiredPeriod}</span>
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
                                <span>{card.workHours}</span>
                            </div>
                            <div style={{
                                display: 'flex'
                            }}>
                                <span style={{
                                    width: '30%',
                                }}>업직종</span>
                                <span>{card.jobType}</span>
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
                                }}>{card.benefits}</span>
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
                                <span>{card.deadline}</span>                                
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
                                <span>{card.preference}</span>
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
                                }}>{card.detailAddress}</span>
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
                                <span>{card.manager}</span>
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
                        <div
                            onClick={() => handleClickEnterpriseInfo(card.enterpriseId)} 
                            style={{
                            textAlign: 'center',
                            background: '#2DDDC3',
                            borderRadius: '27px',
                            height: '59px',
                            lineHeight: '59px',
                            fontSize: '24px',
                            color: 'white',
                            fontWeight: '500'
                        }}>
                            기업 정보 보기
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
                    {/* 탭 인디케이터 */}
                    <div style={{
                        width: '100%',
                        height: '3px',
                        backgroundColor: '#D5F8F3',
                        position: 'relative'
                    }}>
                        <div style={{
                            position: 'absolute',
                            height: '3px',
                            width: `${100 / tabs.length}%`,
                            backgroundColor: '#113C35',
                            bottom: 0,
                            ...indicatorStyle
                        }} />
                    </div>

                    {/* 탭 버튼들 */}
                    <div style={{
                        display: 'flex'
                    }}>
                        {tabs.map((tab, idx) => (
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
                                    padding: '14px 0',
                                    textAlign: 'center',
                                    fontSize: '15px',
                                    fontWeight: '500',
                                    color: currentIndex === idx ? '#113C35' : '#BEBEBE',
                                }}>
                                    {tab.title}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* 검색창 */}
                    {!showJobComponent && (
                        <div style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            padding: '10px 0'
                        }}>
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                width: '90%',
                                height: '43px',
                                borderRadius: '21.5px',
                                border: '1px solid #d1d5db',
                            }}>
                                <input
                                    type="text"
                                    placeholder={tabs[currentIndex].searchPlaceholder}
                                    value={searchTerm}
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
                        </div>
                    )}

                    {/* 컨텐츠 영역 */}
                    {!showJobComponent ? (
                        <div style={{
                            width: '90%',
                            margin: '2% 5%',
                        }}>
                            {filteredItems.map((item, itemIdx) => {
                                const cardId = `${currentIndex}-${itemIdx}`;
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
                                                    }}>{item.title}</span>
                                                    <span style={{
                                                        width: '100%',
                                                        margin: '12px 0 0 0',
                                                        textAlign: 'start',
                                                        fontSize: '15px',
                                                    }}>{item.enterpriseName}</span>
                                                    {!isExpanded &&
                                                        <div style={{
                                                            display: 'flex',
                                                            justifyContent: 'space-between',
                                                            alignItems: 'end'
                                                        }}>
                                                            <div>
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
                                                                    }}>{item.field}</span>
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
                                                                    }}>{item.region}</span>
                                                                </div>
                                                            </div>
                                                            <div
                                                                onClick={() => handleApplyClick(item)}
                                                                style={{
                                                                    display: 'flex',
                                                                    justifyContent: 'center',
                                                                    alignItems: 'center',
                                                                    transition: 'all 0.5s ease-in-out',
                                                                    width: '65px',
                                                                    height: '20px',
                                                                    whiteSpace: 'nowrap',
                                                                    borderRadius: '19px',
                                                                    color: 'white',
                                                                    background: '#2DDDC3',
                                                                    padding: '2% 5%',
                                                                    fontSize: '15px'
                                                                }}>신청하기</div>
                                                        </div>
                                                    }
                                                    {isExpanded &&
                                                        <>
                                                            <span style={{
                                                                width: '100%',
                                                                textAlign: 'start',
                                                                fontSize: '15px',
                                                            }}>{item.field}</span>
                                                            <span style={{
                                                                width: '100%',
                                                                textAlign: 'start',
                                                                fontSize: '15px',
                                                            }}>{item.region}</span>
                                                        </>
                                                    }
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
                                                        }}>{item.content}</p>
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
                                                            <div
                                                                onClick={() => handleApplyClick(item)}
                                                                style={{
                                                                    width: '100%',
                                                                    color: 'white',
                                                                    fontSize: '20px',
                                                                    borderRadius: '27px',
                                                                    background: '#2DDDC3',
                                                                    margin: '0 0 20px 0',
                                                                    padding: '10px 0'
                                                                }}>
                                                                신청하기
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div
                                                    onClick={() => toggleCard(itemIdx)}
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
                                                        width: '100%',
                                                        display: 'flex',
                                                        justifyContent: 'space-between',
                                                        alignItems: 'baseline',
                                                        gap: '20px'
                                                    }}>
                                                        <span style={{
                                                            textAlign: 'start',
                                                            fontSize: '20px',
                                                            fontWeight: 'bold',
                                                        }}>{item.title}</span>
                                                        <img src={rightArrow} alt='rightArrow' onClick={() => handleJobApplyClick(item)}/>
                                                    </div>
                                                    <span style={{
                                                        width: '100%',
                                                        margin: '12px 0 0 0',
                                                        textAlign: 'start',
                                                        fontSize: '15px',
                                                    }}>{item.enterpriseName}</span>
                                                    <div style={{
                                                        display: 'flex',
                                                        justifyContent: 'space-between',
                                                        alignItems: 'end'
                                                    }}>
                                                        <div style={{
                                                            display: 'flex',
                                                            flexDirection: 'column',
                                                        }}>
                                                            <span style={{
                                                                whiteSpace: 'nowrap',
                                                                textAlign: 'start',
                                                                fontSize: '15px',
                                                            }}>{item.field}</span>
                                                            <span style={{
                                                                whiteSpace: 'nowrap',
                                                                textAlign: 'start',
                                                                fontSize: '15px',
                                                            }}>{item.region}</span>
                                                        </div>
                                                        <div
                                                            onClick={() => handleJobApplyClick(item)}
                                                            style={{
                                                                display: 'flex',
                                                                whiteSpace: 'nowrap',
                                                                borderRadius: '19px',
                                                                justifyContent: 'center',
                                                                alignItems: 'center',
                                                                width: '65px',
                                                                height: '20px',
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
                                );
                            })}
                        </div>
                    ) : (
                        <JobComponent card={selectedCard} />
                    )}
                </div>
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


