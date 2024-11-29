import React, { useState, useEffect } from 'react';
import TopBar from '../../../components/layout/TopBar';
import JobCard from '../../../components/mypage/admin/JobCard';
import ProgramCard from '../../../components/mypage/admin/ProgramCard';
import ProgramRegisterForm from './ProgramRegisterForm';
import JobRegisterForm from './JobRegisterForm';

const AdminManagement = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [programs, setPrograms] = useState([]);
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);

    const [showJobRegisterForm, setShowJobRegisterForm] = useState(false);
    const [showProgramRegisterForm, setShowProgramRegisterForm] = useState(false);

    // 버튼 핸들러 수정
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

    const pages = [
        { title: '프로그램 관리', type: 'program' },
        { title: '일자리 관리', type: 'job' }
    ];

    useEffect(() => {
        const fetchPrograms = async () => {
            try {
                const response = await fetch('/api/admin/programs');
                const data = await response.json();
                setPrograms(data);
            } catch (error) {
                console.error('프로그램 데이터 로딩 실패:', error);
            }
        };

        const fetchJobs = async () => {
            try {
                const response = await fetch('/api/admin/jobs');
                const data = await response.json();
                setJobs(data);
            } catch (error) {
                console.error('일자리 데이터 로딩 실패:', error);
            }
        };

        Promise.all([fetchPrograms(), fetchJobs()])
            .finally(() => setLoading(false));
    }, []);

    return (
        <>
            {!showJobRegisterForm && !showProgramRegisterForm &&
                <div style={{
                    height: '100vh',
                }}>
                    <TopBar />
                    <div style={{
                        width: '100%',
                        backgroundColor: 'white'
                    }}>
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
                                    width: `${100 / pages.length}%`,
                                    transform: `translateX(${currentIndex * 100}%)`,
                                    transition: 'transform 0.3s ease-out'
                                }} />
                            </div>
                            <div style={{ display: 'flex' }}>
                                {pages.map((page, idx) => (
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
                                            {page.title}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* 컨텐츠 영역 */}
                        <div style={{ padding: '24px' }}>
                            {loading ? (
                                <div style={{ textAlign: 'center' }}>로딩중...</div>
                            ) : (
                                <div>
                                    {currentIndex === 0 && (
                                        <div style={{ marginBottom: '80px' }}>
                                            {programs.map((program, index) => (
                                                <div key={index} style={{
                                                    backgroundColor: 'white',
                                                    borderRadius: '16px',
                                                    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
                                                    padding: '16px',
                                                    marginBottom: '16px'
                                                }}>
                                                    <h3 style={{
                                                        fontSize: '20px',
                                                        fontWeight: 'bold'
                                                    }}>{program.programTitle}</h3>
                                                    <p style={{
                                                        color: '#666',
                                                        marginTop: '8px'
                                                    }}>{program.enterpriseName}</p>
                                                    <p style={{
                                                        fontSize: '14px',
                                                        color: '#888',
                                                        marginTop: '4px'
                                                    }}>{program.place}</p>
                                                </div>
                                            ))}
                                            <ProgramCard
                                                enterpriseName={"기업 이름"}
                                                title={"title"}
                                                field={"분야"}
                                                date={"2020.20.02"}
                                                img={"url"}
                                                detail={"내용내용내용내용내용내용내용내용내용내용"} />
                                            <button
                                                onClick={() => handleRegisterClick('program')}
                                                style={{
                                                    width: '100%',
                                                    backgroundColor: '#2DDDC3',
                                                    color: 'white',
                                                    padding: '16px',
                                                    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.15)',
                                                    border: 'none',
                                                    cursor: 'pointer'
                                                }}
                                            >
                                                프로그램 등록
                                            </button>
                                        </div>
                                    )}
                                    {currentIndex === 1 && (
                                        <div style={{ marginBottom: '80px' }}>
                                            {jobs.map((job, index) => (
                                                <div key={index} style={{
                                                    backgroundColor: 'white',
                                                    borderRadius: '16px',
                                                    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
                                                    padding: '16px',
                                                    marginBottom: '16px'
                                                }}>
                                                    <h3 style={{
                                                        fontSize: '20px',
                                                        fontWeight: 'bold'
                                                    }}>{job.jobName}</h3>
                                                    <p style={{
                                                        color: '#666',
                                                        marginTop: '8px'
                                                    }}>{job.enterpriseName}</p>
                                                    <p style={{
                                                        fontSize: '14px',
                                                        color: '#888',
                                                        marginTop: '4px'
                                                    }}>{job.place}</p>
                                                    <p style={{
                                                        color: '#FF6C6A',
                                                        marginTop: '8px'
                                                    }}>{job.day}</p>
                                                </div>
                                            ))}
                                            <JobCard
                                                enterpriseName={"기업 이름"}
                                                title={"title"}
                                                field={"분야"}
                                                date={"2020.20.02"}
                                                img={"url"}
                                                detail={"내용내용내용내용내용내용내용내용내용내용"} />
                                            <button
                                                onClick={() => handleRegisterClick('job')}
                                                style={{
                                                    width: '100%',
                                                    backgroundColor: '#2DDDC3',
                                                    color: 'white',
                                                    padding: '16px',
                                                    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.15)',
                                                    border: 'none',
                                                    cursor: 'pointer'
                                                }}
                                            >
                                                일자리 등록
                                            </button>
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
        </>
    );
};

export default AdminManagement;