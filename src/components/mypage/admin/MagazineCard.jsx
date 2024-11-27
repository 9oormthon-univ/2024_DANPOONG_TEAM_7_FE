import React from 'react';

const MagazineCard = ({ enterpriseName, region, title, field, date, img, detail }) => {
    return (
        <div>
            <div style={{
                width: '100%',
                height: '200px',
                backgroundColor: '#D9D9D9',
                borderRadius: '27px',
                marginBottom: '10px'
            }} />
            <div style={{display: 'flex', flexDirection: 'column'}}>
                <div style={{display: 'flex', justifyContent: 'space-between', margin: '0 2% 2% 2%'}}>
                    <div style={{display: 'flex', gap: '10px', alignItems: 'end'}}>
                        <span style={{fontSize: '20px', color: '#5C5C5C'}}>{title}</span>
                        <span style={{fontSize: '12px', color: '#5C5C5C'}}>{date}</span>
                    </div>
                    <span style={{
                        fontSize: '24px',
                        color: '#5C5C5C',
                        transform: 'rotate(90deg)',
                        display: 'inline-block'
                    }}>⋯
                    </span>
                </div>
                <span style={{fontSize: '15px', color: '#5C5C5C', margin: '0 2% 2% 2%'}}>{enterpriseName}</span>                
                <span style={{fontSize: '15px', color: '#5C5C5C', margin: '0 2% 8% 2%'}}>{region}</span>
            </div>        
        </div>
    );
};

export default MagazineCard;