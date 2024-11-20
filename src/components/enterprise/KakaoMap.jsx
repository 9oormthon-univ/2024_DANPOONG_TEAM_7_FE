import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useSelector } from 'react-redux';
import styles from '../../styles/enterprise/KakaoMap.module.css';
import { calculateDistance } from '../../utils/distanceUtils';
import { 
  selectFilteredEnterprises, 
  selectShouldShowMarkers 
} from '../../redux/slice/FilteredEnterpriseListSlice';
import currentLocationMarker from '../../assets/images/map/map-mylocation.svg';
import myplaceMarker from '../../assets/images/map/map-myplace.svg';
import offlineMarker from '../../assets/images/map/map-offline.svg';
import onlineMarker from '../../assets/images/map/map-online.svg';
import bookMarker from '../../assets/images/map/map-bookmark.svg';
import searchMarker from '../../assets/images/map/map-search.svg';

const DEFAULT_LAT = 37.3517089;
const DEFAULT_LNG = 127.0705171;
const DEFAULT_ZOOM_LEVEL = 5;
const ENTERPRISE_ZOOM_LEVEL = 9;
const SEARCH_RADIUS = 2000;

function KakaoMap() {
  const [userPosition, setUserPosition] = useState(null);
  const [isFirstRender, setIsFirstRender] = useState(true);
  const coordsCache = useRef({});
  const mapRef = useRef(null);
  const userPositionRef = useRef(null); // 사용자 위치를 ref로 저장
  
  const filteredEnterprises = useSelector(selectFilteredEnterprises);
  const shouldShowMarkers = useSelector(selectShouldShowMarkers);
  const { activeFilters } = useSelector(state => state.filteredEnterprise);
  const { 
    searchQuery, 
    lastUpdated: searchLastUpdated,
    displayMode,
    selectedLocation
  } = useSelector(state => state.search);
  const { lastUpdated: filterLastUpdated } = useSelector(state => state.filteredEnterprise);

  const moveMapToLocation = (latitude, longitude, level = 3) => {
    const moveLatLon = new kakao.maps.LatLng(latitude, longitude);
    map.setLevel(level); // 지도 레벨을 파라미터로 받아서 설정
    map.panTo(moveLatLon);
  };

  const addressToCoords = useCallback(
    async (address) => {
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
    },
    []
  );

  const currentDisplayMode = useMemo(() => {
    if (isFirstRender) return 'initial';
    if (searchLastUpdated && (!filterLastUpdated || searchLastUpdated > filterLastUpdated)) {
      return displayMode;
    } 
    else if (filterLastUpdated && (!searchLastUpdated || filterLastUpdated > searchLastUpdated)) {
      return 'enterprises';
    }
    return 'initial';
  }, [isFirstRender, searchLastUpdated, filterLastUpdated, displayMode]);

  const displayofflineMarkers = useCallback(
    async (map, enterprises, displayMarker, clearMarkers, moveMapToLocation) => {
      clearMarkers();
      
      let firstEnterpriseCoords = null;

      const markerPromises = enterprises.map(async (enterprise, index) => {
        try {
          let coords = enterprise.latitude && enterprise.longitude 
            ? { latitude: enterprise.latitude, longitude: enterprise.longitude }
            : await addressToCoords(enterprise.address);

          if (index === 0) {
            firstEnterpriseCoords = coords;
          }
  
          const position = new kakao.maps.LatLng(coords.latitude, coords.longitude);
          
          let markerImage = offlineMarker;
          
          if (activeFilters.onoffStore && activeFilters.onoffStore.length > 0) {
            if (activeFilters.onoffStore.includes('온라인') && 
                !activeFilters.onoffStore.includes('오프라인')) {
              markerImage = onlineMarker;
            }
            else {
              markerImage = enterprise.storeType === '온라인' ? onlineMarker : offlineMarker;
            }
          }
  
          displayMarker(
            position,
            `<div style="padding:5px;font-size:12px;">
              ${enterprise.companyName}<br>
              ${enterprise.address}<br>
            </div>`,
            markerImage
          );
        } catch (error) {
          console.error(`Failed to process enterprise ${enterprise.companyName}:`, error);
        }
      });

      await Promise.all(markerPromises);

      if (firstEnterpriseCoords) {
        const moveLatLon = new kakao.maps.LatLng(
          firstEnterpriseCoords.latitude, 
          firstEnterpriseCoords.longitude
        );
        map.setLevel(ENTERPRISE_ZOOM_LEVEL);
        map.panTo(moveLatLon);
      }
    },
    [addressToCoords, activeFilters]
  );

  useEffect(() => {
    const initializeMap = () => {
      if (window.kakao && window.kakao.maps) {
        const mapContainer = document.getElementById('map');
        const mapOption = { 
          center: new window.kakao.maps.LatLng(DEFAULT_LAT, DEFAULT_LNG), 
          level: DEFAULT_ZOOM_LEVEL 
        };
        const map = new window.kakao.maps.Map(mapContainer, mapOption);
        mapRef.current = map; // 지도 인스턴스 저장

        // myLocationMarker 변수 추가
        let myLocationMarker = null;
        let displayedMarkers = [];
        
        const clearMarkers = () => {
          displayedMarkers.forEach(marker => {
            if (marker !== myLocationMarker) {
              marker.setMap(null);
            }
          });
          displayedMarkers = displayedMarkers.filter(marker => marker === myLocationMarker);
        };

        const moveMapToLocation = (latitude, longitude, level = 3) => {
          const moveLatLon = new kakao.maps.LatLng(latitude, longitude);
          map.setLevel(level);
          map.panTo(moveLatLon);
        };

        const displayMarker = (locPosition, message, imageSrc) => {
          if (imageSrc === currentLocationMarker) {
            // 기존 내 위치 마커가 있다면 제거
            if (myLocationMarker) {
              myLocationMarker.setMap(null);
              displayedMarkers = displayedMarkers.filter(marker => marker !== myLocationMarker);
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
              zIndex: 99 // 다른 마커들보다 위에 표시
            });

            myLocationMarker = customOverlay; // 내 위치 마커 저장
            displayedMarkers.push(customOverlay);

          } else {
            const imageSize = new kakao.maps.Size(24, 24);
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
            
            displayedMarkers.push(marker);
            
            kakao.maps.event.addListener(marker, 'click', () => infowindow.open(map, marker));
          }
        };

        if (navigator.geolocation) {
          const options = {
            enableHighAccuracy: false,
            timeout: 10000,
            maximumAge: 30000
          };

          const getPosition = () => new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, options);
          });

          getPosition()
            .then(position => {
              console.log("Geolocation success:", position);
              const lat = position.coords.latitude;
              const lng = position.coords.longitude;
              
              // ref에 현재 위치 저장
              userPositionRef.current = { lat, lng };
              
              const locPosition = new kakao.maps.LatLng(lat, lng);
              setUserPosition(locPosition);
              clearMarkers();
              
              displayMarker(
                locPosition, 
                '<div style="padding:2px;">내 위치</div>', 
                currentLocationMarker
              );

              switch (currentDisplayMode) {
                case 'initial':
                  moveMapToLocation(lat, lng);
                  setIsFirstRender(false);
                  break;
                
                case 'search':
                  if (searchQuery) {  
                    const ps = new kakao.maps.services.Places();
                    ps.keywordSearch(searchQuery, (data, status) => {
                      if (status === kakao.maps.services.Status.OK) {
                        clearMarkers(); // 내 위치 마커는 유지됨
                        
                        // 현재 위치 마커 다시 표시 (이미 clearMarkers에서 유지됨)
                        data.forEach(place => {
                          const placePosition = new kakao.maps.LatLng(place.y, place.x);
                          const distance = calculateDistance(
                            locPosition.getLat(), 
                            locPosition.getLng(), 
                            parseFloat(place.y), 
                            parseFloat(place.x)
                          );

                          if (distance <= SEARCH_RADIUS) {
                            displayMarker(
                              placePosition,
                              `<div style="padding:5px;font-size:12px;">
                                ${place.place_name}<br>
                                ${place.address_name}
                              </div>`,
                              searchMarker
                            );
                          }
                        });

                        if (data.length > 0) {
                          moveMapToLocation(data[0].y, data[0].x);
                        }
                      }
                    }, { 
                      location: locPosition, 
                      radius: SEARCH_RADIUS,
                      sort: kakao.maps.services.SortBy.DISTANCE
                    });
                  }
                  break;

                case 'enterprises':
                  if (filteredEnterprises.length > 0 && shouldShowMarkers) {
                    displayofflineMarkers(map, filteredEnterprises, displayMarker, clearMarkers, moveMapToLocation);
                  } else {
                    clearMarkers(); // 내 위치 마커는 유지됨
                    moveMapToLocation(lat, lng);
                  }
                  break;

                case 'mylocation':
                case 'bookmark':
                  if (selectedLocation) {
                    const displaySelectedLocation = async () => {
                      try {
                        let coords = selectedLocation.latitude && selectedLocation.longitude 
                          ? { latitude: selectedLocation.latitude, longitude: selectedLocation.longitude }
                          : await addressToCoords(selectedLocation.address);

                        const position = new kakao.maps.LatLng(coords.latitude, coords.longitude);
                        
                        displayMarker(
                          position,
                          `<div style="padding:5px;font-size:12px;">
                            ${selectedLocation.companyName}<br>
                            ${selectedLocation.socialPurposeType}<br>
                            ${selectedLocation.address}
                          </div>`,
                          displayMode === 'mylocation' ? myplaceMarker : bookMarker
                        );

                        moveMapToLocation(coords.latitude, coords.longitude);
                      } catch (error) {
                        console.error('Failed to display selected location:', error);
                      }
                    };

                    displaySelectedLocation();
                  }
                  break;
              }
            })
            .catch(error => {
              console.warn("Geolocation error:", error);
              const defaultLat = 37.5666805;
              const defaultLng = 126.9784147;
              
              userPositionRef.current = { lat: defaultLat, lng: defaultLng };
              
              const locPosition = new kakao.maps.LatLng(defaultLat, defaultLng);
              setUserPosition(locPosition);
              clearMarkers();
              
              let errorMessage = 'HTTP 환경에서는 정확한 위치 표시가 제한될 수 있습니다.';
              if (error.code === error.TIMEOUT) {
                errorMessage = '위치 정보 요청 시간이 초과되었습니다.';
              }
              
              displayMarker(
                locPosition, 
                `<div style="padding:5px;font-size:12px;">${errorMessage}</div>`, 
                currentLocationMarker
              );
              
              moveMapToLocation(defaultLat, defaultLng);
              setIsFirstRender(false);
            });
        } else {
          const locPosition = new kakao.maps.LatLng(DEFAULT_LAT, DEFAULT_LNG);
          userPositionRef.current = { lat: DEFAULT_LAT, lng: DEFAULT_LNG };
          setUserPosition(locPosition);
          displayMarker(
            locPosition, 
            `<div style="padding:5px;font-size:12px;">
              위치 서비스를 지원하지 않는 브라우저입니다.
            </div>`, 
            currentLocationMarker
          );
        }
      } else {
        setTimeout(initializeMap, 100);
      }
    };

    initializeMap();
  }, [searchQuery, filteredEnterprises, currentDisplayMode, selectedLocation, isFirstRender, displayofflineMarkers, shouldShowMarkers]);

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

export default KakaoMap;