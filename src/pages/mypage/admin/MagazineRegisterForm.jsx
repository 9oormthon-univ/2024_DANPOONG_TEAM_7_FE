import React, { useState } from 'react';
import leftArrow from '../../../assets/images/mypage/leftArrow.svg'
import TopBar from '../../../components/layout/TopBar';

const MagazineRegisterForm = ({ onClose }) => {
    const [previewUrl, setPreviewUrl] = useState(null);

    const [formData, setFormData] = useState({
        title: '',
        enterpriseName: '',
        field: '',
        time: '',
        region: '',
        image: null,
        content: ''
    });

    const isFormValid = () => {
        return (
            formData.title.trim() !== '' &&
            formData.enterpriseName.trim() !== '' &&
            formData.field.trim() !== '' &&
            formData.time.trim() !== '' &&
            formData.region.trim() !== '' &&
            formData.image !== null &&
            formData.content.trim() !== ''
        );
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // API 호출 로직
        console.log(formData);
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
                    }}>매거진 작성</span>
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
                    }}>기업 이름</span>
                    <input type="text"
                        placeholder="기업"
                        value={formData.enterpriseName}
                        onChange={(e) => setFormData({ ...formData, enterpriseName: e.target.value })}
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
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                }}>
                    <button
                        onClick={handleSubmit}
                        disabled={!isFormValid()}
                        style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            padding: '12px 0',
                            width: '85%',
                            marginBottom: '100px',
                            color: 'white',
                            borderRadius: '27px',
                            fontSize: '24px',
                            backgroundColor: isFormValid() ? '#2DDDC3' : '#D9D9D9',
                            border: 'none',
                            cursor: isFormValid() ? 'pointer' : 'default',
                            transition: 'background-color 0.3s ease'
                        }}>
                        작성하기
                    </button>
                </div>
            </div>
        </>
    );
};

export default MagazineRegisterForm;