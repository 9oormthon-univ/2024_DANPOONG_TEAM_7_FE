import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedOnoffStore, setOnoffModalOpen } from '../../redux/slices/OnoffStoreSlice';
import { updateActiveFilters, setFilteredEnterprises } from '../../redux/slices/FilteredEnterpriseListSlice';
import styles from '../../styles/enterprise/OnoffStoreModal.module.css';
import checkIcon from '../../assets/images/enterprise/type-check.svg'

const ONOFFSTORE = ['온라인', '오프라인'];

function OnoffStoreModal({ handleClose }) {
    const dispatch = useDispatch();
    const { selectedOnoffStore, isOnoffModalOpen } = useSelector(state => state.onoffStore);
    const { socialEnterprises } = useSelector(state => state.enterprise);

    const [localOnoffStore, setLocalOnoffStore] = useState(
        selectedOnoffStore.length > 0 ? selectedOnoffStore[0] : ''
    );

    const toggleOnoffStore = (onoffStore) => {
        if (localOnoffStore === onoffStore) {
            setLocalOnoffStore('');
        } else {
            setLocalOnoffStore(onoffStore);
        }
    };

    const filterEnterprises = (enterprises, storeType) => {
        if (!storeType) return enterprises;
        
        return enterprises.filter(enterprise => {
            const hasWebsite = enterprise.website !== null && 
                             enterprise.website !== undefined && 
                             enterprise.website !== '';
            
            return storeType === '온라인' ? hasWebsite : !hasWebsite;
        });
    };

    const handleConfirm = () => {
        const onoffStoreArray = localOnoffStore ? [localOnoffStore] : [];
        
        // 필터 상태 업데이트
        dispatch(setSelectedOnoffStore(onoffStoreArray));
        dispatch(updateActiveFilters({
            onoffStore: onoffStoreArray
        }));

        // 필터링된 결과 업데이트
        const filteredResults = filterEnterprises(socialEnterprises, localOnoffStore);
        dispatch(setFilteredEnterprises(filteredResults));

        dispatch(setOnoffModalOpen(false));
        handleClose();
    };

    if (!isOnoffModalOpen) return null;

    return (
        <div className={styles.onoffStoreModalContainer}>
            <div className={styles.onoffStoreModalBackground} onClick={handleClose}></div>
            <div className={styles.onoffStoreModalContent}>
                <div className={styles.onoffStoreModalHeader}>
                    <p className={styles.modalName}>온/오프라인</p>
                    <p className={styles.modalMemo}>하나만 선택 가능</p>
                </div>
                <div className={styles.onoffStoreBtn}>
                    {ONOFFSTORE.map(onoffStore => (
                        <button 
                            key={onoffStore} 
                            className={`${styles.onoffStore} ${localOnoffStore === onoffStore ? styles.selectedOnoffStore : ''}`}
                            onClick={() => toggleOnoffStore(onoffStore)}
                        >
                            {onoffStore}
                            {localOnoffStore === onoffStore && 
                                <img src={checkIcon} alt="selected" className={styles.checkIcon} />
                            }
                        </button>
                    ))}
                </div>
                <div className={styles.buttonContainer}>
                    <button 
                        className={styles.okay} 
                        onClick={handleConfirm}
                    >
                        확인
                    </button>
                </div>
            </div>
        </div>
    );
}

export default OnoffStoreModal;