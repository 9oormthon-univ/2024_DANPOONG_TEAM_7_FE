import React, { useState, useEffect } from 'react';
import TopBar from '../../../components/layout/TopBar';
import JobCard from '../../../components/mypage/admin/JobCard';
import ProgramCard from '../../../components/mypage/admin/ProgramCard';
import ProgramRegisterForm from './ProgramRegisterForm';
import JobRegisterForm from './JobRegisterForm';
import axiosInstance from '../../../api/axiosInstance';
import search from '../../../assets/images/program/search.svg';
import leftArrow from '../../../assets/images/program/leftArrow.svg';

const AdminManagement = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [programs, setPrograms] = useState([]);
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredItems, setFilteredItems] = useState([]);

    const [showJobRegisterForm, setShowJobRegisterForm] = useState(false);
    const [showProgramRegisterForm, setShowProgramRegisterForm] = useState(false);
    const [showJobComponent, setShowJobComponent] = useState(false);
    const [selectedJob, setSelectedJob] = useState(null);

    const tabs = [
        { title: "프로그램 관리", searchPlaceholder: "장소 또는 프로그램 유형" },
        { title: "일자리 관리", searchPlaceholder: "일자리 유형이나 장소" }
    ];

    const handleSearch = (searchTerm) => {
        const currentItems = currentIndex === 0 ? programs : jobs;

        if (!searchTerm.trim()) {
            setFilteredItems(currentItems);
            return;
        }

        const searchLower = searchTerm.toLowerCase();
        const filtered = currentItems.filter(item => {
            if (currentIndex === 0) { // 프로그램 검색
                return (
                    item.title?.toLowerCase().includes(searchLower) ||
                    item.enterpriseName?.toLowerCase().includes(searchLower) ||
                    item.field?.toLowerCase().includes(searchLower) ||
                    item.region?.toLowerCase().includes(searchLower)
                );
            } else { // 일자리 검색
                return (
                    item.title?.toLowerCase().includes(searchLower) ||
                    item.enterpriseName?.toLowerCase().includes(searchLower) ||
                    item.field?.toLowerCase().includes(searchLower) ||
                    item.region?.toLowerCase().includes(searchLower)
                );
            }
        });

        setFilteredItems(filtered);
    };

    useEffect(() => {
        setSearchTerm('');
        const newItems = currentIndex === 0 ? programs : jobs;
        setFilteredItems(newItems);
    }, [currentIndex, programs, jobs]);

    useEffect(() => {
        handleSearch(searchTerm);
    }, [searchTerm]);

    useEffect(() => {
        const fetchPrograms = async () => {
            try {
                const response = await axiosInstance.get('/api/programs/admin')
                setPrograms(response.result.programs);
            } catch (error) {
                console.error('프로그램 데이터 로딩 실패:', error);
            }
        };

        const fetchJobs = async () => {
            try {
                const response = await axiosInstance.get('/api/jobs/admin');
                setJobs(response.result.jobs);
            } catch (error) {
                console.error('일자리 데이터 로딩 실패:', error);
            }
        };

        Promise.all([fetchPrograms(), fetchJobs()])
            .finally(() => setLoading(false));
    }, []);

    const handleRegisterClick = (type) => {
        switch (type) {
            case 'program':
                setShowProgramRegisterForm(true);
                break;
            case 'job':
                setShowJobRegisterForm(true);
                break;
            default:
                break;
        }
    };

    const JobComponent = ({ job }) => {
        return (
            <div style={{ paddingBottom: '50px' }}>
                <TopBar />
                <div style={{
                    width: '100%',
                    height: '250px',
                    backgroundImage: `url(${job.image})`,
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
                        <span style={{ color: 'white', fontSize: '15px' }}>일자리 리스트</span>
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
                            }}>{job.title}</span>
                            <span>{job.field}</span>
                            <span>{job.duty}</span>
                            <span>{job.workPeriod}</span>
                            <span>{job.region}</span>
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
                            <div style={{ display: 'flex' }}>
                                <span style={{ width: '30%' }}>급여</span>
                                <span>{job.salary}</span>
                            </div>
                            <div style={{ display: 'flex' }}>
                                <span style={{ width: '30%' }}>근무기간</span>
                                <span>{job.workPeriod}</span>
                            </div>
                            <div style={{ display: 'flex' }}>
                                <span style={{ width: '30%' }}>근무요일</span>
                                <span>{job.workDays}</span>
                            </div>
                            <div style={{ display: 'flex' }}>
                                <span style={{ width: '30%' }}>근무시간</span>
                                <span>{job.workHours}</span>
                            </div>
                            <div style={{ display: 'flex' }}>
                                <span style={{ width: '30%' }}>업직종</span>
                                <span>{job.jobType}</span>
                            </div>
                            <div style={{ display: 'flex' }}>
                                <span style={{ width: '30%' }}>고용형태</span>
                                <span style={{ width: '70%' }}>{job.employmentType}</span>
                            </div>
                            <div style={{ display: 'flex' }}>
                                <span style={{ width: '30%' }}>복리후생</span>
                                <span style={{ width: '70%' }}>{job.benefits}</span>
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
                            <div style={{ display: 'flex' }}>
                                <span style={{ width: '30%' }}>모집마감</span>
                                <span>{job.deadline}</span>
                                <span style={{
                                    marginLeft: '10%',
                                    color: '#FF6C6A'
                                }}>{job.day}</span>
                            </div>
                            <div style={{ display: 'flex' }}>
                                <span style={{ width: '30%' }}>근무기간</span>
                                <span>{job.requiredPeriod}</span>
                            </div>
                            <div style={{ display: 'flex' }}>
                                <span style={{ width: '30%' }}>학력</span>
                                <span>{job.education}</span>
                            </div>
                            <div style={{ display: 'flex' }}>
                                <span style={{
                                    width: '30%',
                                    textAlign: 'start'
                                }}>우대사항</span>
                                <span>{job.preference}</span>
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
                            <div style={{ display: 'flex' }}>
                                <span style={{ width: '70%' }}>{job.detailAddress}</span>
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
                            <div style={{ display: 'flex' }}>
                                <span style={{ width: '30%' }}>담당자</span>
                                <span>{job.manager}</span>
                            </div>
                            <div style={{ display: 'flex' }}>
                                <span style={{ width: '30%' }}>전화번호</span>
                                <span>{job.phone}</span>
                            </div>
                            <div style={{ display: 'flex' }}>
                                <span style={{ width: '30%' }}>이메일</span>
                                <span>{job.email}</span>
                            </div>
                            <div style={{ display: 'flex' }}>
                                <span style={{
                                    width: '30%',
                                    textAlign: 'start'
                                }}>홈페이지</span>
                                <span>{job.website}</span>
                            </div>
                        </div>
                    </div>
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '20px',
                        margin: '5% 0'
                    }}>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <>
            {!showJobRegisterForm && !showProgramRegisterForm && !showJobComponent &&
                <div style={{ height: '100vh' }}>
                    <TopBar />
                    <div style={{ width: '100%', backgroundColor: 'white' }}>
                        {/* 탭 메뉴 */}
                        <div style={{ position: 'relative' }}>
                            <div style={{
                                height: '3px',
                                backgroundColor: '#D5F8F3',
                                width: '100%'
                            }}>
                                <div style={{
                                    position: 'absolute',
                                    height: '3px',
                                    backgroundColor: '#113C35',
                                    width: `${100 / 2}%`,
                                    transform: `translateX(${currentIndex * 100}%)`,
                                    transition: 'transform 0.3s ease-out'
                                }} />
                            </div>
                            <div style={{ display: 'flex' }}>
                                {tabs.map((tab, idx) => (
                                    <div
                                        key={idx}
                                        style={{
                                            flex: 1,
                                            cursor: 'pointer'
                                        }}
                                        onClick={() => setCurrentIndex(idx)}
                                    >
                                        <div style={{
                                            padding: '16px 0',
                                            textAlign: 'center',
                                            fontSize: '15px',
                                            fontWeight: currentIndex === idx ? 600 : 400
                                        }}>
                                            {tab.title}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* 전체 개수 표시 */}
                        <div style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',  
                            padding: '10px 0 0 0',    
                            margin: '10px 0 10px 0'
                        }}>
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                width: '90%',                                
                            }}>
                                <span style={{
                                    fontSize: '20px',
                                    fontWeight: '500',
                                    color: '#113C35',
                                    marginLeft: '20px'
                                }}>전체</span>
                                <span style={{
                                    fontSize: '20px',
                                    fontWeight: '500',
                                    color: '#113C35',
                                    marginRight: '20px'
                                }}>{currentIndex === 0 ? programs.length : jobs.length}개</span>
                            </div>
                        </div>

                        {/* 검색창 추가 */}
                        <div style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            padding: '10px 0 0 0'
                        }}>
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                width: '87%',
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
                                        width: '90%',
                                        border: 'none',
                                        margin: '1% 0 1% 6%',
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

                        {/* 컨텐츠 영역 */}
                        <div style={{ padding: '20px 24px 24px 24px' }}>
                            {loading ? (
                                <div style={{ textAlign: 'center' }}>로딩중...</div>
                            ) : (
                                <div>
                                    {currentIndex === 0 && (
                                        <div style={{ marginBottom: '80px' }}>
                                            {filteredItems.map((program, index) => (
                                                <ProgramCard
                                                    key={index}
                                                    enterpriseName={program.enterpriseName}
                                                    title={program.title}
                                                    field={program.field}
                                                    date={program.time}
                                                    img={program.image}
                                                    detail={program.content}
                                                    region={program.region} />
                                            ))}
                                            <div
                                                onClick={() => handleRegisterClick('program')}
                                                style={{
                                                    width: '90%',
                                                    textAlign: 'center',
                                                    backgroundColor: '#2DDDC3',
                                                    color: 'white',
                                                    fontWeight: '500',
                                                    fontSize: '20px',
                                                    padding: '8px 16px',
                                                    border: 'none',
                                                    cursor: 'pointer',
                                                    borderRadius: '27px'
                                                }}
                                            >
                                                프로그램 등록
                                            </div>
                                        </div>
                                    )}
                                    {currentIndex === 1 && (
                                        <div style={{ marginBottom: '80px' }}>
                                            {filteredItems.map((job, index) => (
                                                <JobCard
                                                    key={index}
                                                    job={job}
                                                    onClick={() => {
                                                        setSelectedJob(job);
                                                        setShowJobComponent(true);
                                                    }}
                                                />
                                            ))}
                                            <div
                                                onClick={() => handleRegisterClick('job')}
                                                style={{
                                                    width: '90%',
                                                    textAlign: 'center',
                                                    backgroundColor: '#2DDDC3',
                                                    color: 'white',
                                                    fontWeight: '500',
                                                    fontSize: '20px',
                                                    padding: '8px 16px',
                                                    border: 'none',
                                                    cursor: 'pointer',
                                                    borderRadius: '27px'
                                                }}
                                            >
                                                일자리 등록
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            }

            {showJobRegisterForm && (
                <JobRegisterForm
                    onClose={() => setShowJobRegisterForm(false)}
                />
            )}

            {showProgramRegisterForm && (
                <ProgramRegisterForm
                    onClose={() => setShowProgramRegisterForm(false)}
                />
            )}

            {showJobComponent && (
                <JobComponent
                    job={selectedJob}
                    onClose={() => setShowJobComponent(false)}
                />
            )}
        </>
    );
};

export default AdminManagement;