import React, { useState } from 'react';
import leftArrow from '../../../assets/images/mypage/leftArrow.svg'
import TopBar from '../../../components/layout/TopBar';
import axiosInstance from '../../../api/axiosInstance';

const ProgramRegisterForm = ({ onClose }) => {
    const [previewUrl, setPreviewUrl] = useState(null);
    const [showCompletionModal, setShowCompletionModal] = useState(false);

    const [formData, setFormData] = useState({
        title: '',
        field: '',
        time: '',
        region: '',
        image: null,
        content: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        const formDataToSend = new FormData();
        formDataToSend.append('title', formData.title);
        formDataToSend.append('field', formData.field);
        formDataToSend.append('time', formData.time);
        formDataToSend.append('region', formData.region);
        formDataToSend.append('content', formData.content);
        
        if (formData.image) {  // image가 있을 때만 append
            formDataToSend.append('image', formData.image);
        }
    
        try {
            const response = await axiosInstance.post('/api/programs/admin', formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            console.log(response)
            
            setShowCompletionModal(true);
    
            setTimeout(() => {
                setShowCompletionModal(false);
                window.location.href = '/mypage/management';
            }, 1500);
        } catch (err) {
            console.log('프로그램 등록 실패:', err)
        }
    };

    // 이미지 업로드 핸들러
    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            console.log("Selected file:", file);  // 파일 로그 확인
            setFormData({ ...formData, image: file });

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
                    }}>프로그램 개설</span>
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
                    }}>시간</span>
                    <input type="text"
                        placeholder="시간"
                        value={formData.time}
                        onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                        style={{
                            width: '60%',
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
                            fontSize: '16px'
                        }} />
                </div>

                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: '100%'
                }}>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        border: '1px solid #BEBEBE',
                        borderRadius: '13px',
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
                    margin: '15px 0'
                }}>
                    <textarea
                        placeholder="내용을 입력하세요"
                        value={formData.content}
                        onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                        style={{
                            width: '80%',
                            height: '500px',
                            padding: '12px',
                            border: '1px solid #BEBEBE',
                            borderRadius: '13px',
                            fontSize: '16px',
                            resize: 'none',
                            wordBreak: 'break-all',
                            whiteSpace: 'pre-wrap'
                        }}
                    />
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
                        개설하기
                    </div>
                </div>
            </div>

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
                            // boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)',
                        }}
                    >
                        {/* <img src={modalHeart} alt='modalHeart' style={{ width: '26px' }} /> */}
                        <div
                            style={{
                                fontSize: '20px',
                                fontWeight: 'bold',
                            }}
                        >
                            프로그램이 등록되었어요!
                        </div>
                        {/* <div
                            style={{
                                fontSize: '15px',
                                color: '#5C5C5C',
                                whiteSpace: 'pre-line'
                            }}
                        >
                            {"서현님의 소중한 리뷰는 이웃들의 결정에\n많은 도움이 될 거에요!"}
                        </div> */}
                    </div>
                </div>
            }
        </>
    );
};

export default ProgramRegisterForm;