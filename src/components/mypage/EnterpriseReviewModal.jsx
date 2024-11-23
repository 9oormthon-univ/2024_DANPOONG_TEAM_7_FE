import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useReview } from '../../contexts/ReviewContext';
import styles from '../../styles/mypage/review/EnterpriseReviewModal.module.css';

//utils
import { formatCompanyName, isCompanyNameOverflow } from '../../utils/companyNameUtils';

//img
import searchIcon from '../../assets/images/enterprise/company-search.svg';
import goReview from '../../assets/images/mypage/goreview.svg';

const EnterpriseReviewModal = ({ isOpen, onClose }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();
    const { setCurrentEnterprise } = useReview();
    const [isAnimating, setIsAnimating] = useState(false);
    
    const enterprises = useSelector(state => state.enterprise.socialEnterprises);

    useEffect(() => {
        if (isOpen) {
            setIsAnimating(true);
        } else {
            const timer = setTimeout(() => {
                setIsAnimating(false);
            }, 1000); // 애니메이션 시간과 동일하게 설정
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    const handleReviewClick = (enterprise) => {
        console.log('Modal: Selected enterprise:', enterprise);
        setCurrentEnterprise(enterprise);
        navigate('/mypage/review/keyword');
    };

    const handleSearch = (e) => {
        e.preventDefault(); // 폼 기본 동작 방지
        setSearchQuery(searchTerm);
    };

    const handleInputChange = (e) => {
        const newSearchTerm = e.target.value;
        setSearchTerm(newSearchTerm);
        setSearchQuery(newSearchTerm); // 실시간 검색을 유지
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            setSearchQuery(searchTerm);
        }
    };

    const filteredEnterprises = enterprises?.filter(enterprise =>
        enterprise.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (!isOpen && !isAnimating) return null;

    return (
        <div 
            className={`${styles.modalOverlay} ${isOpen ? styles.overlayVisible : styles.overlayHidden}`} 
            onClick={onClose}
        >
            <div 
                className={`${styles.modalContent} ${isOpen ? styles.modalVisible : styles.modalHidden}`} 
                onClick={e => e.stopPropagation()}
            >
                <form className={styles.searchContainer} onSubmit={handleSearch}>
                    <input
                        type="text"
                        placeholder="기업명 검색"
                        className={styles.searchInput}
                        value={searchTerm}
                        onChange={handleInputChange}
                        onKeyPress={handleKeyPress}
                    />
                    <button 
                        type="submit"
                        className={styles.searchBtn}
                    >
                        <img 
                            src={searchIcon} 
                            alt="search icon" 
                            className={styles.searchIcon} 
                        />
                    </button> 
                </form>
                <div className={styles.enterpriseList}>
                    {filteredEnterprises?.map((enterprise) => {
                        const { front, back } = formatCompanyName(enterprise.name);
                        const isOverflow = isCompanyNameOverflow(enterprise.name);

                        return (
                            <div key={enterprise.enterpriseId} className={styles.enterpriseItem}>
                                <div className={styles.enterpriseInfo}>
                                    <div className={styles.enterpriseName}>
                                        <p>{front}</p>
                                        {isOverflow && <p>{back}</p>}
                                    </div>
                                    <div className={styles.enterpriseDetails}>
                                        <span>{enterprise.socialPurpose}</span>
                                        <span>{enterprise.type}</span>
                                        <p>{enterprise.city}</p>
                                    </div>
                                </div>
                                <button
                                    className={styles.reviewButton}
                                    onClick={() => handleReviewClick(enterprise)}
                                >
                                    <span>리뷰쓰기</span>
                                    <img src={goReview} alt='go review' className={styles.goReview}/>
                                </button>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default EnterpriseReviewModal;