import React from 'react';
import styles from '../../styles/home/TriangleRaderChart.module.css';

const TriangleRadarChart = () => {
    const centerX = 252;
    const centerY = 280;
    const radius = 200;  // 더 큰 삼각형을 위해 반지름 증가
    const angles = [0, 120, 240];
    const values = [1.2, 0.4, 0.7];
    const innerValues = [0.5, 0.5, 0.5];

    const getPoint = (angle, ratio = 1) => {
        const radian = (angle - 90) * Math.PI / 180;
        return {
            x: centerX + radius * ratio * Math.cos(radian),
            y: centerY + radius * ratio * Math.sin(radian)
        };
    };

    const dataPoints = angles.map((angle, i) => getPoint(angle, values[i]));
    const innerPoints = angles.map((angle, i) => getPoint(angle, innerValues[i]));

    return (
        <div className={styles.container}>
        <div className={styles.chartContainer}>
            <svg viewBox="0 0 500 500" className={styles.chart}>
                {/* 데이터 삼각형 */}
                <path
                    d={`M ${dataPoints[0].x} ${dataPoints[0].y} 
                        L ${dataPoints[1].x} ${dataPoints[1].y} 
                        L ${dataPoints[2].x} ${dataPoints[2].y} Z`}
                    fill="#40E0D0"
                    fillOpacity="0.8"
                />

                {/* 내부 점선 삼각형 */}
                <path
                    d={`M ${innerPoints[0].x} ${innerPoints[0].y} 
                        L ${innerPoints[1].x} ${innerPoints[1].y} 
                        L ${innerPoints[2].x} ${innerPoints[2].y} Z`}
                    fill="none"
                    stroke="#000000"
                    strokeWidth="2.0"
                    strokeDasharray="5,5"
                    strokeOpacity="1.0"
                />
            </svg>
        </div>
    </div>
    );
};

export default TriangleRadarChart;