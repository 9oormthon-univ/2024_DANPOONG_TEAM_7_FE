import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { calculateDistance } from '../../utils/distanceUtils';
import { selectFilteredEnterprises } from '../../redux/slice/FilteredEnterpriseListSlice';
import currentLocationMarker from '../../assets/images/map/map-mylocation.svg';
import myplaceMarker from '../../assets/images/map/map-myplace.svg';
import offlineMarker from '../../assets/images/map/map-offline.svg';
import onlineMarker from '../../assets/images/map/map-online.svg';
import bookMarker from '../../assets/images/map/map-bookmark.svg';
import searchMarker from '../../assets/images/map/map-search.svg';

const DEFAULT_LAT = 37.3517089;
const DEFAULT_LNG = 127.0705171;
const DEFAULT_ZOOM_LEVEL = 5;
const SEARCH_RADIUS = 2000;

function KakaoMap() {
  const [userPosition, setUserPosition] = useState(null);  const [isFirstRender, setIsFirstRender] = useState(true);
  const coordsCache = useRef({});
  
  // Redux 상태 가져오기
  const filteredEnterprises = useSelector(selectFilteredEnterprises);
  const { 
    searchQuery, 
    lastUpdated: searchLastUpdated,
    displayMode,  // 추가: displayMode
    selectedLocation // 추가: selectedLocation
  } = useSelector(state => state.search);
  const { lastUpdated: filterLastUpdated } = useSelector(state => state.filteredEnterprise);

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

  // 타임스탬프를 비교해서 현재 표시할 모드를 결정하는 useMemo 추가
  const currentDisplayMode = useMemo(() => {
    if (isFirstRender) return 'initial';

    // 검색이 필터링보다 최신이면 search/mylocation/bookmark 모드
    if (searchLastUpdated && (!filterLastUpdated || searchLastUpdated > filterLastUpdated)) {
      return displayMode; // 'search', 'mylocation', 'bookmark' 중 하나
    } 
    // 필터링이 검색보다 최신이면 enterprises 모드
    else if (filterLastUpdated && (!searchLastUpdated || filterLastUpdated > searchLastUpdated)) {
      return 'enterprises';
    }
    
    return 'initial';
  }, [isFirstRender, searchLastUpdated, filterLastUpdated, displayMode]);

  const displayofflineMarkers = useCallback(
    async (map, enterprises, displayMarker, clearMarkers) => {
      clearMarkers();
      const markerPromises = enterprises.map(async (enterprise) => {
        try {
          let coords = enterprise.latitude && enterprise.longitude 
            ? { latitude: enterprise.latitude, longitude: enterprise.longitude }
            : await addressToCoords(enterprise.address);

          const position = new kakao.maps.LatLng(coords.latitude, coords.longitude);
          displayMarker(
            position,
            `<div style="padding:5px;font-size:12px;">
              ${enterprise.companyName}<br>
              ${enterprise.socialPurposeType}<br>
              ${enterprise.address}
            </div>`,
             offlineMarker
          );
        } catch (error) {
          console.error(`Failed to process enterprise ${enterprise.companyName}:`, error);
        }
      });
      await Promise.all(markerPromises);
    },
    [addressToCoords]
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

        let displayedMarkers = [];
        const clearMarkers = () => {
          displayedMarkers.forEach(marker => marker.setMap(null));
          displayedMarkers = [];
        };

        const moveMapToLocation = (latitude, longitude) => {
          const moveLatLon = new kakao.maps.LatLng(latitude, longitude);
          map.panTo(moveLatLon);
        };

        const displayMarker = (locPosition, message, imageSrc) => {
          let imageSize, imageOption;
        
          if (imageSrc === currentLocationMarker) {
            imageSize = new kakao.maps.Size(35, 35);
            imageOption = { offset: new kakao.maps.Point(15, 45) };
          } else {
            imageSize = new kakao.maps.Size(24, 24);
            imageOption = { offset: new kakao.maps.Point(11, 34) };
          }
        
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
        };

        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            position => {
              const locPosition = new kakao.maps.LatLng(position.coords.latitude, position.coords.longitude);
              setUserPosition(locPosition);
              clearMarkers();
              
              // 항상 내 위치 마커 표시
              displayMarker(locPosition, '<div style="padding:2px;">내 위치</div>', currentLocationMarker);

              switch (currentDisplayMode) {
                case 'initial':
                  moveMapToLocation(position.coords.latitude, position.coords.longitude);
                  setIsFirstRender(false);
                  break;

                case 'search':
                  if (searchQuery) {
                    const ps = new kakao.maps.services.Places();
                    ps.keywordSearch(searchQuery, (data, status) => {
                      if (status === kakao.maps.services.Status.OK) {
                        data.forEach(place => {
                          const placePosition = new kakao.maps.LatLng(place.y, place.x);
                          const distance = calculateDistance(
                            locPosition.getLat(), 
                            locPosition.getLng(), 
                            parseFloat(place.y), 
                            parseFloat(place.x)
                          );

                          if (distance <= SEARCH_RADIUS) {
                            displayMarker(placePosition, `
                              <div style="padding:5px;font-size:12px;">
                                ${place.place_name}<br>
                                ${place.address_name}
                              </div>
                            `, searchMarker);
                          }
                        });
                        if (data.length > 0) moveMapToLocation(data[0].y, data[0].x);
                      }
                    }, { location: locPosition, radius: SEARCH_RADIUS });
                  }
                  break;

                case 'enterprises':
                  if (filteredEnterprises.length > 0) {
                    displayofflineMarkers(map, filteredEnterprises, displayMarker, clearMarkers);
                    moveMapToLocation(position.coords.latitude, position.coords.longitude);
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
            },
            () => {
              const locPosition = new kakao.maps.LatLng(DEFAULT_LAT, DEFAULT_LNG);
              setUserPosition(locPosition);
              clearMarkers();
              displayMarker(locPosition, 'geolocation을 사용할 수 없어요..', currentLocationMarker);
              moveMapToLocation(DEFAULT_LAT, DEFAULT_LNG);
              setIsFirstRender(false);
            }
          );
        }
      } else {
        setTimeout(initializeMap, 100);
      }
    };

    initializeMap();
  }, [
    searchQuery, 
    filteredEnterprises, 
    currentDisplayMode,  // displayMode 대신 currentDisplayMode로 변경
    selectedLocation,
    isFirstRender, 
    displayofflineMarkers
  ]);

  return (
    <div 
      id="map" 
      style={{ 
        width: '100%', 
        height: '90vh' 
      }}
    />
  );
}

export default KakaoMap;