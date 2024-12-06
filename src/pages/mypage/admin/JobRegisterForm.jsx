import React, { useState } from 'react';
import leftArrow from '../../../assets/images/mypage/leftArrow.svg'
import TopBar from '../../../components/layout/TopBar';
import axiosInstance from '../../../api/axiosInstance';
import programModal from '../../../assets/images/program/programModal.svg'

const InputField = ({ label, value, onChange, placeholder }) => {
    return (
        <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingTop: '10px'
        }}>
            <span style={{
                width: '20%',
                fontSize: '15px',
                color: '#5C5C5C',
                textAlign: 'start',
                marginRight: '20px'
            }}>{label}</span>
            <input
                type="text"
                placeholder={placeholder || label}
                value={value}
                onChange={onChange}
                style={{
                    width: '70%',
                    padding: '12px',
                    border: '1px solid #BEBEBE',
                    borderRadius: '13px',
                    fontSize: '15px'
                }}
            />
        </div>
    );
};

const JobRegisterForm = ({ onClose }) => {
    const [previewUrl, setPreviewUrl] = useState(null);
    const [showCompletionModal, setShowCompletionModal] = useState(false);

    const [formData, setFormData] = useState({
        // 기본 정보
        title: '',              // 제목        
        field: '',             // 분야
        duty: '',              // 직무
        region: '',            // 지역
        image: null,           // 사진

        // 근무조건
        salary: '',            // 급여
        workPeriod: '',        // 근무기간
        workDays: '',          // 근무요일
        workHours: '',         // 근무시간
        jobType: '',           // 업직종
        employmentType: '',    // 고용형태
        benefits: '',          // 복리후생

        // 모집조건
        deadline: '',          // 모집마감
        requiredPeriod: '',    // 근무기간
        education: '',         // 학력
        preference: '',        // 우대사항

        // 근무지역
        detailAddress: '',     // 상세주소

        // 채용담당자 정보
        manager: '',           // 담당자
        phone: '',            // 전화번호
        email: '',            // 이메일
        website: ''           // 홈페이지
    });

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formDataToSend = new FormData();
        formDataToSend.append('title', formData.title);
        formDataToSend.append('field', formData.field);
        formDataToSend.append('duty', formData.duty);
        formDataToSend.append('region', formData.region);
        formDataToSend.append('salary', formData.salary);
        formDataToSend.append('workPeriod', formData.workPeriod);
        formDataToSend.append('workDays', formData.workDays);
        formDataToSend.append('workHours', formData.workHours);
        formDataToSend.append('jobType', formData.jobType);
        formDataToSend.append('employmentType', formData.employmentType);
        formDataToSend.append('benefits', formData.benefits);
        formDataToSend.append('deadline', formData.deadline);
        formDataToSend.append('requiredPeriod', formData.requiredPeriod);
        formDataToSend.append('education', formData.education);
        formDataToSend.append('preference', formData.preference);
        formDataToSend.append('detailAddress', formData.detailAddress);
        formDataToSend.append('manager', formData.manager);
        formDataToSend.append('phone', formData.phone);
        formDataToSend.append('email', formData.email);
        formDataToSend.append('website', formData.website);

        if (formData.image) {
            formDataToSend.append('image', formData.image);
        }

        try {
            console.log(formDataToSend)
            const response = await axiosInstance.post('/api/jobs/admin', formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            console.log(response);

            setShowCompletionModal(true);

            setTimeout(() => {
                setShowCompletionModal(false);
                window.location.href = '/mypage/management';
            }, 1500);
        } catch (err) {
            console.log('일자리 등록 실패:', err);
        }
    };

    // 이미지 업로드 핸들러
    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData({ ...formData, image: file });
            // 이미지 미리보기 URL 생성
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrl(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <>
            <TopBar />
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                width: '100vw',
                backgroundColor: 'white',
            }}>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '16px',
                    borderTop: '1px solid #EFEFEF'
                }}>
                    <img
                        src={leftArrow}
                        alt="뒤로가기"
                        onClick={onClose}
                        style={{
                            width: '24px',
                            height: '24px',
                            cursor: 'pointer'
                        }}
                    />
                    <span style={{
                        marginLeft: '16px',
                        fontSize: '16px',
                        fontWeight: '500'
                    }}>일자리 창출</span>
                </div>

                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    margin: '15px 0'
                }}>
                    <input type="text"
                        placeholder="제목을 입력하세요"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        style={{
                            width: '80%',
                            padding: '12px',
                            border: '1px solid #BEBEBE',
                            borderRadius: '13px',
                            fontSize: '16px'
                        }} />
                </div>
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    margin: '0 0 15px 10px'
                }}>
                    <span style={{
                        width: '20%',
                        fontSize: '15px',
                        color: '#5C5C5C',
                    }}>분야</span>
                    <input type="text"
                        placeholder="분야"
                        value={formData.field}
                        onChange={(e) => setFormData({ ...formData, field: e.target.value })}
                        style={{
                            width: '60%',
                            padding: '12px',
                            border: '1px solid #BEBEBE',
                            borderRadius: '13px',
                            fontSize: '15px'
                        }} />
                </div>
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    margin: '0 0 15px 10px'
                }}>
                    <span style={{
                        width: '20%',
                        fontSize: '15px',
                        color: '#5C5C5C',
                    }}>직무</span>
                    <input type="text"
                        placeholder="직무"
                        value={formData.duty}
                        onChange={(e) => setFormData({ ...formData, duty: e.target.value })}
                        style={{
                            width: '60%',
                            padding: '12px',
                            border: '1px solid #BEBEBE',
                            borderRadius: '13px',
                            fontSize: '15px'
                        }} />
                </div>
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    margin: '0 0 15px 10px'
                }}>
                    <span style={{
                        width: '20%',
                        fontSize: '15px',
                        color: '#5C5C5C',
                    }}>지역</span>
                    <input type="text"
                        placeholder="지역"
                        value={formData.region}
                        onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                        style={{
                            width: '60%',
                            padding: '12px',
                            border: '1px solid #BEBEBE',
                            borderRadius: '13px',
                            fontSize: '15px'
                        }} />
                </div>

                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: '100%',
                    margin: '20px 0 10px 0'
                }}>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        border: '1px solid #BEBEBE',
                        borderRadius: '16px',
                        height: '200px',
                        width: '85%',
                        position: 'relative',
                        overflow: 'hidden'
                    }}>
                        {previewUrl ? (
                            <img
                                src={previewUrl}
                                alt="미리보기"
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover'
                                }}
                            />
                        ) : (
                            <>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    style={{
                                        display: 'none',
                                    }}
                                    id="imageUpload"
                                />
                                <label htmlFor="imageUpload" style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    cursor: 'pointer'
                                }}>
                                    <span style={{
                                        fontSize: '24px',
                                        color: '#999'
                                    }}>+</span>
                                    <span style={{
                                        color: '#999',
                                        fontSize: '14px'
                                    }}>사진을 등록하세요</span>
                                </label>
                            </>
                        )}
                    </div>
                </div>
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: '100%',
                    margin: '10px 0 10px 0',
                }}>
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        border: '1px solid #BEBEBE',
                        borderRadius: '13px',
                        width: '85%',
                        position: 'relative',
                        overflow: 'hidden',
                    }}>
                        <div style={{ margin: '5%' }}>
                            <span style={{ fontSize: '15px', fontWeight: 'bold' }}>근무 조건</span>
                            <InputField
                                label="급여"
                                value={formData.salary}
                                onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                            />
                            <InputField
                                label="근무기간"
                                value={formData.workPeriod}
                                onChange={(e) => setFormData({ ...formData, workPeriod: e.target.value })}
                            />
                            <InputField
                                label="근무요일"
                                value={formData.workDays}
                                onChange={(e) => setFormData({ ...formData, workDays: e.target.value })}
                            />
                            <InputField
                                label="근무시간"
                                value={formData.workHours}
                                onChange={(e) => setFormData({ ...formData, workHours: e.target.value })}
                            />
                            <InputField
                                label="업직종"
                                value={formData.jobType}
                                onChange={(e) => setFormData({ ...formData, jobType: e.target.value })}
                            />
                            <InputField
                                label="고용형태"
                                value={formData.employmentType}
                                onChange={(e) => setFormData({ ...formData, employmentType: e.target.value })}
                            />
                            <InputField
                                label="복리후생"
                                value={formData.benefits}
                                onChange={(e) => setFormData({ ...formData, benefits: e.target.value })}
                            />
                        </div>
                    </div>
                </div>
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: '100%',
                    margin: '10px 0 10px 0',
                }}>
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        border: '1px solid #BEBEBE',
                        borderRadius: '13px',
                        width: '85%',
                        position: 'relative',
                        overflow: 'hidden',
                    }}>
                        <div style={{ margin: '5%' }}>
                            <span style={{ fontSize: '15px', fontWeight: 'bold' }}>모집 조건</span>
                            <InputField
                                label="모집마감"
                                value={formData.deadline}
                                onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                            />
                            <InputField
                                label="근무기간"
                                value={formData.requiredPeriod}
                                onChange={(e) => setFormData({ ...formData, requiredPeriod: e.target.value })}
                            />
                            <InputField
                                label="학력"
                                value={formData.education}
                                onChange={(e) => setFormData({ ...formData, education: e.target.value })}
                            />
                            <InputField
                                label="우대사항"
                                value={formData.preference}
                                onChange={(e) => setFormData({ ...formData, preference: e.target.value })}
                            />
                        </div>
                    </div>
                </div>
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: '100%',
                    margin: '10px 0 10px 0',
                }}>
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        border: '1px solid #BEBEBE',
                        borderRadius: '13px',
                        width: '85%',
                        position: 'relative',
                        overflow: 'hidden',
                    }}>
                        <div style={{ margin: '5%' }}>
                            <span style={{ fontSize: '15px', fontWeight: 'bold' }}>근무 지역</span>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', paddingTop: '10px' }}>
                                <span style={{
                                    width: '20%',
                                    fontSize: '15px',
                                    color: '#5C5C5C',
                                    textAlign: 'start',
                                    paddingTop: '12px',
                                    marginRight: '20px'
                                }}>상세주소</span>
                                <textarea
                                    placeholder="상세주소"
                                    value={formData.detailAddress}
                                    onChange={(e) => setFormData({ ...formData, detailAddress: e.target.value })}
                                    style={{
                                        width: '70%',
                                        height: '80px',
                                        padding: '12px',
                                        border: '1px solid #BEBEBE',
                                        borderRadius: '13px',
                                        fontSize: '15px',
                                        resize: 'none',
                                        fontFamily: 'inherit'
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: '100%',
                    margin: '10px 0 20px 0',
                }}>
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        border: '1px solid #BEBEBE',
                        borderRadius: '13px',
                        width: '85%',
                        position: 'relative',
                        overflow: 'hidden',
                    }}>
                        <div style={{ margin: '5%' }}>
                            <span style={{ fontSize: '15px', fontWeight: 'bold' }}>채용담당자 정보</span>
                            <InputField
                                label="담당자"
                                value={formData.manager}
                                onChange={(e) => setFormData({ ...formData, manager: e.target.value })}
                            />
                            <InputField
                                label="전화번호"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            />
                            <InputField
                                label="이메일"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                            <InputField
                                label="홈페이지"
                                value={formData.website}
                                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                            />
                        </div>
                    </div>
                </div>
                <div
                    onClick={handleSubmit}
                    style={{
                        display: 'flex',
                        justifyContent: 'center',
                    }}>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        padding: '12px 0',
                        width: '85%',
                        marginBottom: '100px',
                        color: 'white',
                        borderRadius: '27px',
                        fontSize: '24px',
                        backgroundColor: '#2DDDC3'
                    }}>
                        창출하기
                    </div>
                </div>
            </div>
            {/* 완료 모달 추가 */}
            {showCompletionModal &&
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
                        }}
                    >
                        <img src={programModal} alt='programModal' style={{width: '23px', height: '23px'}}/>
                        <span style={{
                            fontSize: '20px',
                            fontWeight: '500',
                            color: '#5C5C5C'
                        }}>일자리 정보가 등록되었어요.</span>
                        <span style={{
                            fontSize: '15px',
                            fontWeight: '500',
                            color: '#5C5C5C',                            
                        }}>많은 주민들에게 유익한 기회가 될 거예요!</span>
                    </div>
                </div>
            }
        </>
    );
};

export default JobRegisterForm;