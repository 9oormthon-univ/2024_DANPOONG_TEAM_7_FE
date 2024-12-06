import React from 'react';
import styles from '../../styles/home/TriangleRaderChart.module.css';

const TriangleRadarChart = ({ reviews = 0, program = 0, total = 0 }) => {
    const centerX = 252;
    const centerY = 280;
    const radius = 150;
    const angles = [0, 120, 240]; // 삼각형의 각 꼭지점 각도

    // 최대값 설정 (스케일링을 위해)
    const maxValue = 17; // 예: 최대 20개를 기준으로 스케일링

    // 각 값을 0~1 사이로 정규화
    const normalizedValues = [
        total / maxValue, // 왼쪽 (리뷰 수)
        program / maxValue, // 오른쪽 (프로그램 수)
        reviews / maxValue // 위쪽 (총합)
    ];

    // 기준선을 위한 내부 삼각형 값 (50% 지점)
    const innerValues = [0.5, 0.5, 0.5];

    const getPoint = (angle, ratio = 1) => {
        const radian = (angle - 90) * Math.PI / 180;
        return {
            x: centerX + radius * ratio * Math.cos(radian),
            y: centerY + radius * ratio * Math.sin(radian)
        };
    };

    // 데이터 포인트 계산
    const dataPoints = angles.map((angle, i) => getPoint(angle, normalizedValues[i]));
    const innerPoints = angles.map((angle, i) => getPoint(angle, innerValues[i]));

    return (
        <div className={styles.container}>
            <div className={styles.chartContainer}>
                <svg viewBox="0 0 500 500" className={styles.chart}>
                    {/* 기준선 삼각형 */}
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

                    {/* 데이터 삼각형 */}
                    <path
                        d={`M ${dataPoints[0].x} ${dataPoints[0].y} 
                            L ${dataPoints[1].x} ${dataPoints[1].y} 
                            L ${dataPoints[2].x} ${dataPoints[2].y} Z`}
                        fill="#40E0D0"
                        fillOpacity="0.8"
                    />
                </svg>
            </div>
        </div>
    );
};

export default TriangleRadarChart;