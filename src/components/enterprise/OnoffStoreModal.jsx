import React, { useState } from 'react';
import styles from '../../styles/enterprise/OnoffStoreModal.module.css';
import { useEnterprise } from '../../contexts/EnterpriseContext';

const ONOFFSTORE = ['온라인', '오프라인'];

function OnoffStoreModal({ isOpen, handleClose }) {
    const { activeFilters, updateFilters } = useEnterprise();
    const [localOnoffStore, setLocalOnoffStore] = useState(
        activeFilters.onoffStore?.[0] || ''
    );

    const toggleOnoffStore = (onoffStore) => {
        setLocalOnoffStore(prev => prev === onoffStore ? '' : onoffStore);
    };

    const handleConfirm = () => {
        updateFilters({
            onoffStore: localOnoffStore ? [localOnoffStore] : []
        });
        handleClose();
    };

    if (!isOpen) return null;

    return (
        <div className={styles.onoffStoreModalContainer}>
            <div className={styles.onoffStoreModalBackground} onClick={handleClose} />
            <div className={styles.onoffStoreModalContent}>
                <div className={styles.onoffStoreModalHeader}>
                    <p className={styles.modalName}>온/오프라인</p>
                    <p className={styles.modalMemo}>하나만 선택 가능</p>
                </div>
                <div className={styles.onoffStoreBtn}>
                    {ONOFFSTORE.map(onoffStore => (
                        <button 
                            key={onoffStore} 
                            className={`${styles.onoffStore} ${
                                localOnoffStore === onoffStore ? 
                                styles.selectedOnoffStore : ''
                            }`}
                            onClick={() => toggleOnoffStore(onoffStore)}
                        >
                            {onoffStore}
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