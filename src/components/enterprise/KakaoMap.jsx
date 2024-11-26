import React, { useState, useEffect, useCallback, useRef } from 'react';
import styles from '../../styles/enterprise/KakaoMap.module.css';
import { useEnterprise } from '../../contexts/EnterpriseContext';
import { useVisitBookmark } from '../../contexts/VisitBookmarkContext';
import { getFromLocalStorage, STORAGE_KEYS } from '../../utils/enterpriseStorage';

//utils
import { calculateDistance } from '../../utils/distanceUtils';

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

function KakaoMap() {
    // === State & Ref 관리 ===
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
    const displayMarker = useCallback((map, position, content, imageSrc) => {
        if (imageSrc === currentLocationMarker) {
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
                        <div class="${styles.message}">${content}</div>
                    </div>
                `,
                map: map
            });

            myLocationMarkerRef.current = customOverlay;
        } else {
            const imageSize = new kakao.maps.Size(35, 35);
            const imageOption = { offset: new kakao.maps.Point(17, 35) };
            const markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize, imageOption);
            
            const marker = new kakao.maps.Marker({
                position: position,
                image: markerImage,
                map: map
            });

            const infowindow = new kakao.maps.InfoWindow({
                content: content,
                removable: true
            });

            kakao.maps.event.addListener(marker, 'click', () => {
                infowindowsRef.current.forEach(iw => iw.close());
                infowindow.open(map, marker);
            });

            markersRef.current.push(marker);
            infowindowsRef.current.push(infowindow);
        }
    }, []);

    // 검색 결과 표시
    const displaySearchResults = useCallback((map, keyword, userLat, userLng) => {
        const ps = new kakao.maps.services.Places();
        
        ps.keywordSearch(keyword, (data, status) => {
            if (status === kakao.maps.services.Status.OK) {
                clearMarkers();
                
                data.forEach(place => {
                    const placePosition = new kakao.maps.LatLng(place.y, place.x);
                    const distance = calculateDistance(
                        userLat, userLng,
                        parseFloat(place.y),
                        parseFloat(place.x)
                    );

                    if (distance <= SEARCH_RADIUS) {
                        const markerToUse = SOCIAL_ENTERPRISE_KEYWORDS.some(
                            keyword => searchQuery.includes(keyword)
                        ) ? listMarker : searchMarker;

                        displayMarker(
                            map,
                            placePosition,
                            `<div style="padding:5px;font-size:12px;">
                                ${place.place_name}<br>
                                ${place.address_name}
                            </div>`,
                            markerToUse
                        );
                    }
                });

                moveMapToLocation(map, data[0].y, data[0].x, 3);
            }
        }, {
            location: new kakao.maps.LatLng(userLat, userLng),
            radius: SEARCH_RADIUS,
            sort: kakao.maps.services.SortBy.DISTANCE
        });
    }, [clearMarkers, displayMarker, moveMapToLocation, searchQuery]);

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

              displayMarker(
                  map,
                  position,
                  `<div style="padding:5px;font-size:12px;">
                      ${location.enterpriseName || location.name}<br>
                      ${location.district}
                  </div>`,
                  visitedMarker
              );
          }
      });

      if (locations[0]) {
          moveMapToLocation(
              map,
              locations[0].latitude,
              locations[0].longitude,
              3
          );
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

              displayMarker(
                  map,
                  position,
                  `<div style="padding:5px;font-size:12px;">
                      ${location.enterpriseName || location.name}<br>
                      ${location.district}
                  </div>`,
                  bookMarker
              );
          }
      });

      if (locations[0]) {
          moveMapToLocation(
              map,
              locations[0].latitude,
              locations[0].longitude,
              3
          );
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

                displayMarker(
                    map,
                    position,
                    `<div style="padding:5px;font-size:12px;">
                        ${enterprise.name}<br>
                        ${enterprise.district}
                    </div>`,
                    listMarker
                );
            }
        });

        if (enterprises[0]) {
            moveMapToLocation(
                map,
                enterprises[0].latitude,
                enterprises[0].longitude,
                ENTERPRISE_ZOOM_LEVEL
            );
        }
    }, [clearMarkers, displayMarker, moveMapToLocation]);

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