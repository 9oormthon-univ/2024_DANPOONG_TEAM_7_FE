import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useSelector } from 'react-redux';
import styles from '../../styles/enterprise/KakaoMap.module.css';

//utils
import { calculateDistance } from '../../utils/distanceUtils';

//redux
import { 
  selectFilteredEnterprises, 
  selectShouldShowMarkers
} from '../../redux/slices/FilteredEnterpriseListSlice';

//marker img
import currentLocationMarker from '../../assets/images/map/mylocation.svg';
import visitedMarker from '../../assets/images/map/visited-marker.svg';
//import offlineMarker from '../../assets/images/map/list-marker.svg';
import bookMarker from '../../assets/images/map/bookmark-marker.svg';
import searchMarker from '../../assets/images/map/search-marker.svg';
import listMarker from '../../assets/images/testmarker.svg';

// 지도 기본 설정값
const DEFAULT_LAT = 37.3517089;
const DEFAULT_LNG = 127.0705171;
const DEFAULT_ZOOM_LEVEL = 5;
const ENTERPRISE_ZOOM_LEVEL = 9;
const SEARCH_RADIUS = 20000;

// 사회적 기업 관련 검색어
const SOCIAL_ENTERPRISE_KEYWORDS = ['사회적 기업', '사회적기업' , '사회적', '사회'];

// 디바운스 함수
const debounce = (func, wait) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

function KakaoMap() {
  // ===== State & Ref 관리 =====
  const [isLoading, setIsLoading] = useState(true);
  const [userPosition, setUserPosition] = useState(null);
  const [isFirstRender, setIsFirstRender] = useState(true);
  const coordsCache = useRef({});
  const mapRef = useRef(null);
  const userPositionRef = useRef(null);
  const markersRef = useRef([]);
  const infowindowsRef = useRef([]);
  const myLocationMarkerRef = useRef(null);

  // ===== Redux Store Selectors =====
  const filteredEnterprises = useSelector(selectFilteredEnterprises);
  const shouldShowMarkers = useSelector(selectShouldShowMarkers);
  const { activeFilters } = useSelector(state => state.filteredEnterprise);
  const { searchQuery, lastUpdated: searchLastUpdated } = useSelector(state => state.search);
  const { lastUpdated: filterLastUpdated } = useSelector(state => state.filteredEnterprise);
  const { 
    visitedLocations,
    bookmarkLocations,
    activeMarkerType,
    lastUpdated: visitedBookmarkLastUpdated 
  } = useSelector(state => state.visitedBookmark);

  // ===== 유틸리티 함수들 =====
  const clearMarkers = useCallback(() => {
    // 내 위치 마커 제외한 모든 마커 제거
    markersRef.current.forEach(marker => {
      if (marker && marker.setMap) {
        marker.setMap(null);
      }
    });
    
    // 모든 인포윈도우 닫기
    infowindowsRef.current.forEach(infowindow => {
      if (infowindow && infowindow.close) {
        infowindow.close();
      }
    });

    // 배열 초기화
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

  // 주소 -> 좌표 변환 함수 (디바운스 적용)
  const addressToCoords = useCallback(
    debounce(async (address) => {
      if (coordsCache.current[address]) return coordsCache.current[address];
      
      return new Promise((resolve, reject) => {
        const geocoder = new kakao.maps.services.Geocoder();
        const baseAddress = address.split('(')[0].trim();
        
        geocoder.addressSearch(baseAddress, (result, status) => {
          if (status === kakao.maps.services.Status.OK) {
            const coords = { latitude: result[0].y, longitude: result[0].x };
            coordsCache.current[address] = coords;
            resolve(coords);
          } else {
            const simplifiedAddress = baseAddress.split(' ').slice(0, 3).join(' ');
            geocoder.addressSearch(simplifiedAddress, (result2, status2) => {
              if (status2 === kakao.maps.services.Status.OK) {
                const coords = { latitude: result2[0].y, longitude: result2[0].x };
                coordsCache.current[address] = coords;
                resolve(coords);
              } else {
                reject(new Error(`주소 변환 실패: ${address}`));
              }
            });
          }
        });
      });
    }, 100),
    []
  );

  // 현재 표시할 모드 설정
  const currentDisplayMode = useMemo(() => {
    if (isFirstRender) return 'initial';
    
    const timestamps = {
      search: searchLastUpdated,
      filtered: filterLastUpdated,
      visitedBookmark: visitedBookmarkLastUpdated
    };

    const validTimestamps = Object.values(timestamps).filter(Boolean);
    if (validTimestamps.length === 0) return 'initial';

    const latestTimestamp = Math.max(...validTimestamps);

    if (latestTimestamp === visitedBookmarkLastUpdated) {
      return activeMarkerType;
    } else if (latestTimestamp === searchLastUpdated) {
      return 'search';
    } else if (latestTimestamp === filterLastUpdated) {
      return 'enterprises';
    }

    return 'initial';
  }, [isFirstRender, searchLastUpdated, filterLastUpdated, visitedBookmarkLastUpdated, activeMarkerType]);

  // ===== 마커 표시 함수들 =====
  const displayMarker = useCallback((map, locPosition, message, imageSrc) => {
    
    if (imageSrc === currentLocationMarker) {
      // 기존 내 위치 마커가 있다면 제거
      if (myLocationMarkerRef.current) {
        myLocationMarkerRef.current.setMap(null);
      }

      const content = `
        <div class="${styles.markerWrapper}">
          <div class="${styles.markerContainer}">
            <div class="${styles.marker}"></div>
            <div class="${styles.ping}"></div>
            <div class="${styles.pulse}"></div>
          </div>
          <div class="${styles.message}">${message}</div>
        </div>
      `;

      const customOverlay = new kakao.maps.CustomOverlay({
        position: locPosition,
        content: content,
        map: map,
        zIndex: 99
      });

      myLocationMarkerRef.current = customOverlay;
    } else {
      const imageSize = new kakao.maps.Size(35, 35);
      
      const imageOption = { offset: new kakao.maps.Point(11, 34) };
      const markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize, imageOption);
      
      const marker = new kakao.maps.Marker({ 
        map: map, 
        position: locPosition, 
        image: markerImage 
      });
      
      const infowindow = new kakao.maps.InfoWindow({ 
        content: message, 
        removable: true 
      });

      markersRef.current.push(marker);
      infowindowsRef.current.push(infowindow);

      kakao.maps.event.addListener(marker, 'click', () => {
        infowindowsRef.current.forEach(iw => iw.close());
        infowindow.open(map, marker);
      });
    }
  }, []);

  // Batch processing for markers
  const processBatchMarkers = useCallback(async (locations, processFunction) => {
    const batchSize = 10;
    const batches = Math.ceil(locations.length / batchSize);
    let firstLocationCoords = null;

    for (let i = 0; i < batches; i++) {
      const start = i * batchSize;
      const end = Math.min(start + batchSize, locations.length);
      const batch = locations.slice(start, end);

      await Promise.all(batch.map(async (location, index) => {
        const coords = await processFunction(location);
        if (index === 0 && i === 0) {
          firstLocationCoords = coords;
        }
      }));

      // Add small delay between batches
      if (i < batches - 1) {
        await new Promise(resolve => setTimeout(resolve, 10));
      }
    }

    return firstLocationCoords;
  }, []);

  // Display List Markers with batch processing
  const displayListMarkers = useCallback(async (map, enterprises) => {
    if (!map || enterprises.length === 0) return;

    clearMarkers();
    
    const processEnterprise = async (enterprise) => {
        try {
            const coords = enterprise.latitude && enterprise.longitude 
                ? { latitude: enterprise.latitude, longitude: enterprise.longitude }
                : await addressToCoords(enterprise.district);

            const position = new kakao.maps.LatLng(coords.latitude, coords.longitude);
            
            displayMarker(
                map,
                position,
                `<div style="padding:5px;font-size:12px;">
                    ${enterprise.name}<br>
                    ${enterprise.district}<br>
                </div>`,
                listMarker
            );

            return coords;
        } catch (error) {
            console.error(`Failed to process enterprise ${enterprise.name}:`, error);
            return null;
        }
    };

    const firstCoords = await processBatchMarkers(enterprises, processEnterprise);

    if (firstCoords) {
        moveMapToLocation(map, firstCoords.latitude, firstCoords.longitude, ENTERPRISE_ZOOM_LEVEL);
    }
}, [clearMarkers, displayMarker, addressToCoords, moveMapToLocation]);

  // 리뷰 마커 표시 함수
  // KakaoMap.js의 displayVisitedMarkers 함수 수정
const displayVisitedMarkers = useCallback(async (map, locations) => {
  
  console.log('Marker image path:', visitedMarker);
  
    console.log('displayVisitedMarkers called with:', {
        mapExists: !!map,
        locationsLength: locations?.length,
        locations: locations
    });

  if (!map || !locations || locations.length === 0) {
      console.warn('No map instance or empty locations array', { 
          map: !!map, 
          locationsLength: locations?.length 
      });
      return;
  }

  clearMarkers();
  console.log('Markers cleared, proceeding with locations:', locations);
  
  const processVisited = async (location) => {

      console.log('Processing location:', location);
      try {
          const coords = location.latitude && location.longitude 
              ? { latitude: location.latitude, longitude: location.longitude }
              : await addressToCoords(location.address || location.district);

          console.log('Coordinates obtained:', coords);

          if (!coords) {
              console.warn('No coordinates found for location:', location);
              return null;
          }

          const position = new kakao.maps.LatLng(coords.latitude, coords.longitude);
          
          const content = `
              <div style="padding:5px;font-size:12px;">
                  ${location.enterpriseName}<br>
                  ${location.city} ${location.district}
              </div>
          `;

          displayMarker(
              map,
              position,
              content,
              visitedMarker
          );

          return coords;
      } catch (error) {
          console.error('Error processing location:', {
              location,
              error: error.message,
              stack: error.stack
          });
          return null;
      }
  };

  try {
      const firstCoords = await processBatchMarkers(locations, processVisited);
      console.log('First coordinates obtained:', firstCoords);

      if (firstCoords) {
          moveMapToLocation(map, firstCoords.latitude, firstCoords.longitude, 3);
      }
  } catch (error) {
      console.error('Error in displayVisitedMarkers:', error);
  }
}, [clearMarkers, displayMarker, addressToCoords, moveMapToLocation]);

  // 북마크 마커 표시 함수
  const displayBookmarkMarkers = useCallback(async (map, locations) => {
    if (!map || !locations || locations.length === 0) {
        console.log('No map instance or empty locations:', { map: !!map, locationCount: locations?.length });
        return;
    }

    clearMarkers();
    console.log('Processing bookmark locations:', locations);
    
    const processBookmark = async (location) => {
        try {
            // 필수 필드 확인
            if (!location.enterpriseId || !location.enterpriseName) {
                console.warn('Missing required fields:', location);
                return null;
            }

            // 좌표 사용
            const coords = {
                latitude: location.latitude,
                longitude: location.longitude
            };

            // 좌표가 없는 경우 주소로 변환 시도
            if (!coords.latitude || !coords.longitude) {
                const addressCoords = await addressToCoords(location.district || location.city);
                if (!addressCoords) {
                    console.warn('Could not get coordinates for location:', location);
                    return null;
                }
                coords.latitude = addressCoords.latitude;
                coords.longitude = addressCoords.longitude;
            }

            const position = new kakao.maps.LatLng(coords.latitude, coords.longitude);
            
            // 정보창 내용 구성
            const markerContent = `
                <div style="padding:5px;font-size:12px;">
                    ${location.enterpriseName}<br>
                    ${location.socialPurpose || ''}<br>
                    ${location.city} ${location.district || ''}<br>
                    ${location.website ? `<a href="${location.website}" target="_blank">웹사이트</a>` : ''}
                </div>
            `;

            displayMarker(
                map,
                position,
                markerContent,
                bookMarker
            );

            return coords;
        } catch (error) {
            console.error('Failed to process bookmark:', {
                location,
                error: error.message
            });
            return null;
        }
    };

    try {
        const firstCoords = await processBatchMarkers(locations, processBookmark);
        console.log('First coordinates:', firstCoords);

        if (firstCoords) {
            moveMapToLocation(map, firstCoords.latitude, firstCoords.longitude, 3);
        }
    } catch (error) {
        console.error('Error displaying bookmark markers:', error);
    }
}, [clearMarkers, displayMarker, addressToCoords, moveMapToLocation]);

  // ===== 지도 초기화 및 이벤트 처리 =====
  useEffect(() => {
    // map div의 마운트를 확인하기 위한 인터벌
    const waitForMap = setInterval(() => {
      const mapContainer = document.getElementById('map');
      if (mapContainer) {
        clearInterval(waitForMap);
        initializeKakaoMap(mapContainer);
      }
    }, 100);

    // 메인 초기화 함수
    const initializeKakaoMap = async (mapContainer) => {
      // Kakao Maps API 로드 확인
      if (!window.kakao?.maps) {
        console.error('Kakao Maps API가 로드되지 않았습니다');
        return;
      }

      let map = mapRef.current;
      let isComponentMounted = true;

      const setupMap = (initialLat, initialLng) => {
        const mapOption = {
          center: new window.kakao.maps.LatLng(initialLat, initialLng),
          level: 3
        };

        try {
          map = new window.kakao.maps.Map(mapContainer, mapOption);
          mapRef.current = map;
          if (isComponentMounted) {
            setIsLoading(false);
          }
          return map;
        } catch (error) {
          console.error('지도 초기화 중 오류 발생:', error);
          return null;
        }
      };

      try {
        const position = await new Promise((resolve, reject) => {
          if (!navigator.geolocation) {
            reject(new Error('Geolocation이 지원되지 않습니다'));
            return;
          }

          navigator.geolocation.getCurrentPosition(
            pos => resolve(pos),
            error => reject(error),
            {
              enableHighAccuracy: false,
              timeout: 10000,
              maximumAge: 30000
            }
          );
        });

        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        
        const mapInstance = setupMap(lat, lng);
        if (!mapInstance) {
          throw new Error('지도 초기화 실패');
        }

        userPositionRef.current = { lat, lng };
        setUserPosition(new kakao.maps.LatLng(lat, lng));
        
        displayMarker(
          mapInstance,
          new kakao.maps.LatLng(lat, lng),
          '<div style="padding:2px;">내 위치</div>',
          currentLocationMarker
        );

        switch (currentDisplayMode) {
          case 'initial':
            moveMapToLocation(mapInstance, lat, lng, 3);
            setIsFirstRender(false);
            break;
            case 'search':
              if (searchQuery) {
                const ps = new kakao.maps.services.Places();
                ps.keywordSearch(searchQuery, (data, status) => {
                  if (status === kakao.maps.services.Status.OK && data.length > 0) {
                    clearMarkers();
                    data.forEach(place => {
                      const placePosition = new kakao.maps.LatLng(place.y, place.x);
                      const distance = calculateDistance(
                        lat, lng, 
                        parseFloat(place.y),
                        parseFloat(place.x)
                      );
              
                      if (distance <= SEARCH_RADIUS) {
                        // 검색어가 사회적 기업 관련 키워드인 경우 listMarker 사용
                        const markerToUse = SOCIAL_ENTERPRISE_KEYWORDS.some(keyword => 
                          searchQuery.includes(keyword)) ? listMarker : searchMarker;
                        
                        displayMarker(
                          mapInstance,
                          placePosition,
                          `<div style="padding:5px;font-size:12px;">
                            ${place.place_name}<br>
                            ${place.address_name}
                          </div>`,
                          markerToUse
                        );
                      }
                    });
          
                    moveMapToLocation(mapInstance, data[0].y, data[0].x, 3);
                  }
                }, { 
                  location: new kakao.maps.LatLng(lat, lng), 
                  radius: SEARCH_RADIUS,
                  sort: kakao.maps.services.SortBy.DISTANCE
                });
              }
              break;
          case 'visited':
            if (visitedLocations.length > 0) {
              
              await displayVisitedMarkers(mapInstance, visitedLocations);
            }
            break;
          case 'bookmark':
            if (bookmarkLocations.length > 0) {
              await displayBookmarkMarkers(mapInstance, bookmarkLocations);
            }
            break;
          case 'enterprises':
            if (filteredEnterprises.length > 0 && shouldShowMarkers) {
              await displayListMarkers(mapInstance, filteredEnterprises);
            } else {
              clearMarkers();
              moveMapToLocation(mapInstance, lat, lng, 3);
            }
            break;
        }

      } catch (error) {
        console.warn("위치 정보 오류:", error);
        const defaultLat = 37.5666805;
        const defaultLng = 126.9784147;
        
        const mapInstance = setupMap(defaultLat, defaultLng);
        if (!mapInstance) {
          console.error('기본 위치로 지도 초기화 실패');
          return;
        }

        userPositionRef.current = { lat: defaultLat, lng: defaultLng };
        
        let errorMessage = 'HTTP 환경에서는 정확한 위치 표시가 제한될 수 있습니다.';
        if (error.code === error.TIMEOUT) {
          errorMessage = '위치 정보 요청 시간이 초과되었습니다.';
        }
        
        displayMarker(
          mapInstance,
          new kakao.maps.LatLng(defaultLat, defaultLng),
          `<div style="padding:5px;font-size:12px;">${errorMessage}</div>`,
          currentLocationMarker
        );
        
        moveMapToLocation(mapInstance, defaultLat, defaultLng, 3);
        setIsFirstRender(false);
      }
    };

    // 클린업 함수
    return () => {
      clearInterval(waitForMap);
      clearMarkers();
      if (myLocationMarkerRef.current) {
        myLocationMarkerRef.current.setMap(null);
      }
    };
  }, [
    searchQuery,
    filteredEnterprises,
    currentDisplayMode,
    isFirstRender,
    shouldShowMarkers,
    visitedLocations,
    bookmarkLocations,
    displayListMarkers,
    displayVisitedMarkers,
    displayBookmarkMarkers,
    clearMarkers,
    displayMarker,
    moveMapToLocation
  ]);

  // 로딩 상태에 따른 렌더링
  if (isLoading) {
    return (
      <div 
        id="map" 
        style={{ 
          width: '100%', 
          height: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        지도를 불러오는 중...
      </div>
    );
  }

  return (
    <div 
      id="map" 
      style={{ 
        width: '100%', 
        height: '100%' 
      }}
    />
  );
}

export default React.memo(KakaoMap);