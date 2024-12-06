import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../../styles/enterprise/KakaoMap.module.css';
import { useEnterprise } from '../../contexts/EnterpriseContext';
import { useVisitBookmark } from '../../contexts/VisitBookmarkContext';
import { getFromLocalStorage, STORAGE_KEYS } from '../../utils/enterpriseStorage';

//utils
import { calculateDistance } from '../../utils/distanceUtils';
import { formatCompanyName } from '../../utils/companyNameUtils';

//marker img
import currentLocationMarker from '../../assets/images/map/mylocation.svg';
import visitedMarker from '../../assets/images/map/visited-marker.svg';
import bookMarker from '../../assets/images/map/bookmark-marker.svg';
import searchMarker from '../../assets/images/map/search-marker.svg';
import listMarker from '../../assets/images/testmarker.svg';

import LoadingSpinner from '../../components/layout/LoadingSpinner';

// 지도 기본 설정값
const DEFAULT_LAT = 37.3517089;
const DEFAULT_LNG = 127.0705171;
const DEFAULT_ZOOM_LEVEL = 5;
const ENTERPRISE_ZOOM_LEVEL = 9;
const SEARCH_RADIUS = 20000;

// 사회적 기업 관련 검색어
const SOCIAL_ENTERPRISE_KEYWORDS = ['사회적 기업', '사회적기업', '사회적', '사회'];

function KakaoMap(props) {
    const navigate = useNavigate();
    // === State & Ref 관리 ===
    const { focusOnMyLocation, setFocusOnMyLocation } = props;
    const [isLoading, setIsLoading] = useState(true);
    const [userPosition, setUserPosition] = useState(null);
    const [isMapInitialized, setIsMapInitialized] = useState(false);
    const mapRef = useRef(null);
    const markersRef = useRef([]);
    const infowindowsRef = useRef([]);
    const myLocationMarkerRef = useRef(null);
    

    const { 
      filteredEnterprises,
      shouldShowMarkers,
      searchQuery,
      lastAction
  } = useEnterprise();

    const {
      visitedLocations,
      bookmarkLocations
  } = useVisitBookmark();

    // === 유틸리티 함수들 ===
    const clearMarkers = useCallback(() => {
        markersRef.current.forEach(marker => {
            if (marker?.setMap) marker.setMap(null);
        });
        
        infowindowsRef.current.forEach(infowindow => {
            if (infowindow?.close) infowindow.close();
        });

        markersRef.current = [];
        infowindowsRef.current = [];
    }, []);

    const moveMapToLocation = useCallback((map, latitude, longitude, level = 3) => {
        if (map) {
            const moveLatLon = new kakao.maps.LatLng(latitude, longitude);
            map.setLevel(level);
            map.panTo(moveLatLon);
        }
    }, []);

    // 마커 표시 함수
    const displayMarker = useCallback((map, position, data, markerType) => {
        if (markerType === currentLocationMarker) {
            if (myLocationMarkerRef.current) {
                myLocationMarkerRef.current.setMap(null);
            }
     
            const customOverlay = new kakao.maps.CustomOverlay({
                position: position,
                content: `
                    <div class="${styles.markerWrapper}">
                        <div class="${styles.markerContainer}">
                            <div class="${styles.marker}"></div>
                            <div class="${styles.ping}"></div>
                        </div>
                    </div>
                `,
                map: map,
            });
     
            myLocationMarkerRef.current = customOverlay;
        } else {
            // 마커 이미지 매핑
            const markerImageMap = {
                'search': searchMarker,
                'visited': visitedMarker,
                'bookmark': bookMarker,
                'enterprises': listMarker
            };
     
            // 오버레이 스타일 매핑
            const overlayContents = {
                'search': (data) => `
                    <div style="
                        display: flex;
                        flex-direction: column;
                        justify-content: center;
                        align-items: center;
                        position: absolute;
                        top: 50%;
                        left: 50%;
                        transform: translate(-50%, 0%);
                        background: white;
                        padding: 8px;
                        border-radius: 8px;
                        border: 1px solid #007AFF;
                        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                        font-size: 12px;
                        white-space: nowrap;
                    ">
                        <div style="font-weight: bold">${data.place_name}</div>
                    </div>
                `,
                'visited': (data) => `
                    <div style="
                        display: flex;
                        flex-direction: column;
                        justify-content: center;
                        align-items: center;
                        position: absolute;
                        top: 50%;
                        left: 50%;
                        transform: translate(-50%, 0%);
                        background: white;
                        padding: 8px;
                        border-radius: 8px;
                        border: 1px solid #6E4AFF;
                        font-size: 12px;
                        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                        cursor: pointer;
                        " onclick="window.location.href='/mypage/review'"
                    ">
                        <div style="font-weight: 500">
                            <p style="margin:0;">${formatCompanyName(data.enterpriseName).front}</p>
                            ${formatCompanyName(data.enterpriseName).middle ? `<p style="margin:0;">${formatCompanyName(data.enterpriseName).middle}</p>` : ''}
                            ${formatCompanyName(data.enterpriseName).back ? `<p style="margin:0;">${formatCompanyName(data.enterpriseName).back}</p>` : ''}
                        </div>
                    </div>
                `,
                'bookmark': (data) => `
                    <div style="
                        display: flex;
                        flex-direction: column;
                        justify-content: center;
                        align-items: center;
                        position: absolute;
                        top: 50%;
                        left: 50%;
                        transform: translate(-50%, 0%);
                        background: white;
                        padding: 8px;
                        border-radius: 8px;
                        border: 1px solid #FF6C6A;
                        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                        font-size: 12px;
                        white-space: nowrap;
                        cursor: pointer;
                        " onclick="window.location.href='/mypage'"
                    ">
                        <div style="font-weight: 500">
                            <p style="margin:0;">${formatCompanyName(data.enterpriseName).front}</p>
                            ${formatCompanyName(data.enterpriseName).middle ? `<p style="margin:0;">${formatCompanyName(data.enterpriseName).middle}</p>` : ''}
                            ${formatCompanyName(data.enterpriseName).back ? `<p style="margin:0;">${formatCompanyName(data.enterpriseName).back}</p>` : ''}
                        </div>
                    </div>
                `,

                'enterprises': (data) => `
                    <div style="
                        display: flex;
                        flex-direction: column;
                        justify-content: center;
                        align-items: center;
                        position: absolute;
                        top: 50%;
                        left: 50%;
                        transform: translate(-50%, 0%);
                        background: white;
                        padding: 8px;
                        border-radius: 8px;
                        border: 1px solid #2DDDC3;
                        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                        font-size: 12px;
                        white-space: nowrap;
                        cursor: pointer;
                        " onclick="window.location.href='/enterprise/info/${data.enterpriseId}'"
                    >
                        <div style="font-weight: 500">
                            <p style="margin:0;">${formatCompanyName(data.name).front}</p>
                            ${formatCompanyName(data.name).middle ? `<p style="margin:0;">${formatCompanyName(data.name).middle}</p>` : ''}
                            ${formatCompanyName(data.name).back ? `<p style="margin:0;">${formatCompanyName(data.name).back}</p>` : ''}
                        </div>
                    </div>
                `,
                
             };
     
            const imageSize = new kakao.maps.Size(35, 35);
            const imageOption = { offset: new kakao.maps.Point(17, 35) };
            const markerImage = new kakao.maps.MarkerImage(
                markerImageMap[markerType] || markerType,
                imageSize,
                imageOption
            );
            
            const marker = new kakao.maps.Marker({
                position: position,
                image: markerImage,
                map: map
            });
     
            const overlay = new kakao.maps.CustomOverlay({
                position: position,
                content: overlayContents[markerType](data),
                map: null,
                clickable: true,
            });
     
            kakao.maps.event.addListener(marker, 'click', () => {
                console.log("Marker clicked!");
                infowindowsRef.current.forEach(iw => {
                    if (iw.setMap) iw.setMap(null);
                });
                overlay.setMap(map);
            });

            kakao.maps.event.addListener(map, 'click', () => {
                infowindowsRef.current.forEach(iw => {
                    if (iw.setMap) iw.setMap(null);
                });
            });
            
            markersRef.current.push(marker);
            infowindowsRef.current.push(overlay);
     
            markersRef.current.push(marker);
            infowindowsRef.current.push(overlay);
        }
     }, [navigate]);

    // 검색 결과 표시
    const displaySearchResults = useCallback((map, keyword, userLat, userLng) => {
        const ps = new kakao.maps.services.Places();
        
        ps.keywordSearch(keyword, (data, status) => {
            if (status === kakao.maps.services.Status.OK) {
                clearMarkers();
                
                // 검색어에 사회적 기업 키워드가 포함되어 있는지 체크
                const isSocialEnterprise = SOCIAL_ENTERPRISE_KEYWORDS.some(
                    keyword => searchQuery.toLowerCase().includes(keyword)
                );
                
                data.forEach(place => {
                    const placePosition = new kakao.maps.LatLng(place.y, place.x);
                    const distance = calculateDistance(
                        userLat, userLng,
                        parseFloat(place.y),
                        parseFloat(place.x)
                    );

                    if (distance <= SEARCH_RADIUS) {
                        // 사회적 기업 키워드가 있으면 enterprises 마커 이미지 사용
                        const markerImage = isSocialEnterprise ? 'enterprises' : 'search';
                        
                        // 마커 이미지와 데이터 매핑
                        const markerImageMap = {
                            'search': searchMarker,
                            'visited': visitedMarker,
                            'bookmark': bookMarker,
                            'enterprises': listMarker
                        };
                        
                        const imageSize = new kakao.maps.Size(35, 35);
                        const imageOption = { offset: new kakao.maps.Point(17, 35) };
                        const customMarkerImage = new kakao.maps.MarkerImage(
                            markerImageMap[markerImage],
                            imageSize,
                            imageOption
                        );
                        
                        // 마커 생성
                        const marker = new kakao.maps.Marker({
                            position: placePosition,
                            image: customMarkerImage,
                            map: map
                        });
                        
                        // search 스타일의 오버레이 생성 (border 색상 조건부 적용)
                        const overlay = new kakao.maps.CustomOverlay({
                            position: placePosition,
                            content: `
                                <div style="
                                    display: flex;
                                    flex-direction: column;
                                    justify-content: center;
                                    align-items: center;
                                    position: absolute;
                                    top: 50%;
                                    left: 50%;
                                    transform: translate(-50%, 0%);
                                    background: white;
                                    padding: 8px;
                                    border-radius: 8px;
                                    border: 1px solid ${isSocialEnterprise ? '#2DDDC3' : '#007AFF'};
                                    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                                    font-size: 12px;
                                    white-space: nowrap;
                                ">
                                    <div style="font-weight: bold">${place.place_name}</div>
                                </div>
                            `,
                            map: null,
                            clickable: true,
                        });
                        
                        // 클릭 이벤트 추가
                        kakao.maps.event.addListener(marker, 'click', () => {
                            console.log("Marker clicked!");
                            infowindowsRef.current.forEach(iw => {
                                if (iw.setMap) iw.setMap(null);
                            });
                            overlay.setMap(map);
                        });
                        
                        markersRef.current.push(marker);
                        infowindowsRef.current.push(overlay);
                    }
                });

                moveMapToLocation(map, data[0].y, data[0].x, 3);
            }
        }, {
            location: new kakao.maps.LatLng(userLat, userLng),
            radius: SEARCH_RADIUS,
            sort: kakao.maps.services.SortBy.DISTANCE
        });
    }, [clearMarkers, moveMapToLocation, searchQuery]);

    const fitBoundsToMarkers = useCallback((map, locations) => {
        if (!locations?.length) return;
    
        const bounds = new kakao.maps.LatLngBounds();
        locations.forEach(location => {
            if (location.latitude && location.longitude) {
                bounds.extend(new kakao.maps.LatLng(location.latitude, location.longitude));
            }
        });
        map.setBounds(bounds);
    }, []);

    // 방문 장소 마커 표시
    const displayVisitedMarkers = useCallback(async (map, locations) => {
        if (!map || !locations?.length) return;
        
        clearMarkers();
        locations.forEach(location => {
            if (location.latitude && location.longitude) {
                const position = new kakao.maps.LatLng(
                    location.latitude,
                    location.longitude
                );

                displayMarker(map, position, location, 'visited');
            }
        });

        if (locations[0]) {
            fitBoundsToMarkers(map, locations);
        }
    }, [clearMarkers, displayMarker, moveMapToLocation]);

    // 북마크 마커 표시
    const displayBookmarkMarkers = useCallback(async (map, locations) => {
        if (!map || !locations?.length) return;
        
        clearMarkers();
        locations.forEach(location => {
            if (location.latitude && location.longitude) {
                const position = new kakao.maps.LatLng(
                    location.latitude,
                    location.longitude
                );

                displayMarker(map, position, location, 'bookmark');
            }
        });

        if (locations[0]) {
            fitBoundsToMarkers(map, locations);
        }
    }, [clearMarkers, displayMarker, moveMapToLocation]);

    // 필터링된 기업 마커 표시
    const displayFilteredMarkers = useCallback(async (map, enterprises) => {
        if (!map || !enterprises?.length) return;
        
        clearMarkers();
        enterprises.forEach(enterprise => {
            if (enterprise.latitude && enterprise.longitude) {
                const position = new kakao.maps.LatLng(
                    enterprise.latitude,
                    enterprise.longitude
                );
    
                displayMarker(map, position, enterprise, 'enterprises');
            }
        });
    
        if (enterprises[0]) {
            fitBoundsToMarkers(map, enterprises);
        }
    }, [clearMarkers, displayMarker, fitBoundsToMarkers]);

    useEffect(() => {
        if (!isMapInitialized || !userPosition || !mapRef.current) return;

        if (focusOnMyLocation) {
            clearMarkers();
            displayMarker(mapRef.current, userPosition, '내 위치', currentLocationMarker);
            moveMapToLocation(mapRef.current, userPosition.getLat(), userPosition.getLng(), 3);
            setFocusOnMyLocation(false); // 위치 이동 후 상태 초기화
        }
    }, [focusOnMyLocation, userPosition, isMapInitialized, clearMarkers, displayMarker, moveMapToLocation]);
    
      // 지도 초기화 및 마커 표시
      useEffect(() => {
        const initializeMap = async () => {
            const mapContainer = document.getElementById('map');
            if (!mapContainer || !window.kakao?.maps) return;
    
            // 먼저 기본 위치로 지도 초기화
            const initialMap = new kakao.maps.Map(mapContainer, {
                center: new kakao.maps.LatLng(DEFAULT_LAT, DEFAULT_LNG),
                level: DEFAULT_ZOOM_LEVEL
            });
            mapRef.current = initialMap;
            setIsMapInitialized(true);
            setIsLoading(false);
    
            // 그 다음 사용자 위치 가져오기
            try {
                const position = await new Promise((resolve, reject) => {
                    navigator.geolocation.getCurrentPosition(
                        pos => resolve(pos),
                        error => reject(error),
                        { enableHighAccuracy: false, timeout: 10000, maximumAge: 30000 }
                    );
                });
    
                const lat = position.coords.latitude;
                const lng = position.coords.longitude;
    
                // 지도 중심 이동
                const userLatLng = new kakao.maps.LatLng(lat, lng);
                initialMap.setCenter(userLatLng);
                initialMap.setLevel(3);
                setUserPosition(userLatLng);
    
                // 내 위치 마커 표시
                displayMarker(
                    initialMap,
                    userLatLng,
                    '내 위치',
                    currentLocationMarker
                );
    
            } catch (error) {
                console.error('사용자 위치 가져오기 실패:', error);
                // 기본 위치를 사용자 위치로 설정
                setUserPosition(new kakao.maps.LatLng(DEFAULT_LAT, DEFAULT_LNG));
            }
        };
    
        initializeMap();
    
        return () => {
            clearMarkers();
            if (myLocationMarkerRef.current) {
                myLocationMarkerRef.current.setMap(null);
            }
        };
    }, []); // 최초 1회만 실행
    
    // 마커 업데이트 useEffect는 동일하게 유지
    useEffect(() => {
        if (!isMapInitialized || !mapRef.current || !userPosition) return;
    
        const map = mapRef.current;
        infowindowsRef.current.forEach(overlay => {
            if (overlay && overlay.setMap) {
                overlay.setMap(null);
            }
        });
        infowindowsRef.current = [];
        clearMarkers();
    
        // 내 위치 마커 다시 표시
        displayMarker(
            map,
            userPosition,
            '내 위치',
            currentLocationMarker
        );
    
        // 활성화된 마커 타입에 따라 마커 표시
        if (lastAction) {
            switch (lastAction.type) {
                case 'search':
                    if (searchQuery) {
                        displaySearchResults(map, searchQuery, userPosition.getLat(), userPosition.getLng());
                    }
                    break;
                case 'visited':
                    if (visitedLocations?.length) {
                        displayVisitedMarkers(map, visitedLocations);
                    }
                    break;
                case 'bookmark':
                    if (bookmarkLocations?.length) {
                        displayBookmarkMarkers(map, bookmarkLocations);
                    }
                    break;
                case 'enterprises':
                    if (shouldShowMarkers && filteredEnterprises?.length) {
                        displayFilteredMarkers(map, filteredEnterprises);
                    }
                    break;
            }
        } else {
            // 초기 상태일 때는 내 위치 마커만 표시
        }
    }, [
        isMapInitialized,
        userPosition,
        lastAction,  // lastAction 의존성 추가
        searchQuery,
        visitedLocations,
        bookmarkLocations,
        shouldShowMarkers,
        filteredEnterprises
    ]);

    
    if (isLoading) {
        return (
            <div id="map" style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <LoadingSpinner/>
            </div>
        );
    }

    return (
        <div id="map" style={{ width: '100%', height: '100%' }} />
    );
}

export default React.memo(KakaoMap);