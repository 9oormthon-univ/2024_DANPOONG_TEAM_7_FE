import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useReview } from '../../contexts/ReviewContext';
import { useEnterprise } from '../../contexts/EnterpriseContext';
import styles from '../../styles/mypage/review/EnterpriseReviewModal.module.css';

//utils
import { formatCompanyName, isCompanyNameOverflow } from '../../utils/companyNameUtils';

//img
import searchIcon from '../../assets/images/enterprise/company-search.svg';
import goReview from '../../assets/images/mypage/goreview.svg';

const EnterpriseReviewModal = ({ isOpen, onClose }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [isAnimating, setIsAnimating] = useState(false);
    const navigate = useNavigate();
    const { setCurrentEnterprise } = useReview();
    const { 
        reviewEnterprises, 
        isLoading, 
        error 
    } = useEnterprise();
    
    useEffect(() => {
        if (isOpen) {
            setIsAnimating(true);
        } else {
            const timer = setTimeout(() => {
                setIsAnimating(false);
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    const handleReviewClick = (enterprise) => {
        setCurrentEnterprise(enterprise);
        navigate('/mypage/review/keyword');
    };

    const handleSearch = (e) => {
        e.preventDefault();
        setSearchQuery(searchTerm);
    };

    const handleInputChange = (e) => {
        const newSearchTerm = e.target.value;
        setSearchTerm(newSearchTerm);
        setSearchQuery(newSearchTerm);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            setSearchQuery(searchTerm);
        }
    };

    const searchedEnterprises = reviewEnterprises?.filter(enterprise =>
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
                    {reviewEnterprises?.map((enterprise) => {
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