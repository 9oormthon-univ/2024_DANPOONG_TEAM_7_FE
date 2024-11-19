import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateEnterpriseCoords } from '../../redux/slice/EnterpriseSlice';
import { selectFilteredEnterprises } from '../../redux/slice/FilteredEnterpriseListSlice';
import { setSearchQuery } from '../../redux/slice/SearchSlice';
import enterpriseMarker from '../../assets/images/map/map-store.svg';
import offlineMarker from '../../assets/images/map/map-program.svg';
import bookMarker from '../../assets/images/map/map-bookmark.svg';

const DEFAULT_LAT = 37.3517089;
const DEFAULT_LNG = 127.0705171;
const DEFAULT_ZOOM_LEVEL = 5;
const SEARCH_RADIUS = 2000;

function KakaoMap() {
  const dispatch = useDispatch();
  const [userPosition, setUserPosition] = useState(null);
  const [currentDisplayMode, setCurrentDisplayMode] = useState('initial'); // 초기 상태를 'initial'로 설정
  const [isFirstRender, setIsFirstRender] = useState(true); //첫 렌더링 체크
  
  const filteredEnterprises = useSelector(selectFilteredEnterprises);
  const { searchQuery } = useSelector(state => state.search);
  const coordsCache = useRef({}); // 캐시를 useRef로 변경하여 렌더링과 분리

  const addressToCoords = useCallback(
    async (address) => {
      // 캐시에 존재하면 캐시 값 사용
      if (coordsCache.current[address]) return coordsCache.current[address];
      
      // 비동기 주소 변환 로직
      return new Promise((resolve, reject) => {
        const geocoder = new kakao.maps.services.Geocoder();
        const baseAddress = address.split('(')[0].trim();
        
        geocoder.addressSearch(baseAddress, (result, status) => {
          if (status === kakao.maps.services.Status.OK) {
            const coords = { latitude: result[0].y, longitude: result[0].x };
            coordsCache.current[address] = coords; // 캐시에 저장
            resolve(coords);
          } else {
            // 주소 변환이 실패한 경우 간소화된 주소로 재시도
            const simplifiedAddress = baseAddress.split(' ').slice(0, 3).join(' ');
            geocoder.addressSearch(simplifiedAddress, (result2, status2) => {
              if (status2 === kakao.maps.services.Status.OK) {
                const coords = { latitude: result2[0].y, longitude: result2[0].x };
                coordsCache.current[address] = coords; // 캐시에 저장
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

  const displayofflineMarkers = useCallback(
    async (map, enterprises, displayMarker, clearMarkers) => {
      clearMarkers();
      const markerPromises = enterprises.map(async (enterprise) => {
        try {
          let coords = enterprise.latitude && enterprise.longitude 
            ? { latitude: enterprise.latitude, longitude: enterprise.longitude }
            : await addressToCoords(enterprise.address);

          if (!enterprise.latitude || !enterprise.longitude) {
            dispatch(updateEnterpriseCoords({ companyName: enterprise.companyName, coords }));
          }
          const position = new kakao.maps.LatLng(coords.latitude, coords.longitude);
          displayMarker(
            position,
            `<div style="padding:5px;font-size:12px;">
              ${enterprise.companyName}<br>
              ${enterprise.socialPurposeType}<br>
              ${enterprise.address}
            </div>`,
            enterpriseMarker
          );
        } catch (error) {
          console.error(`Failed to process enterprise ${enterprise.companyName}:`, error);
        }
      });
      await Promise.all(markerPromises);
    },
    [addressToCoords, dispatch]
  );

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371e3;
    const toRadians = angle => (angle * Math.PI) / 180;
    const φ1 = toRadians(lat1);
    const φ2 = toRadians(lat2);
    const Δφ = toRadians(lat2 - lat1);
    const Δλ = toRadians(lon2 - lon1);

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
              Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  };

  useEffect(() => {
    if (isFirstRender) {
        return; // 첫 렌더링시에는 모드 변경하지 않음
    }
    
    // 검색어가 있고 필터가 선택되지 않았을 때 검색 모드로
    if (searchQuery) {
        setCurrentDisplayMode('search');
    }
    // filteredEnterprises가 업데이트되면 enterprises 모드로
    else if (filteredEnterprises.length > 0) {
        setCurrentDisplayMode('enterprises');
    }
  }, [searchQuery, filteredEnterprises, isFirstRender]);

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
        };

        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            position => {
              const locPosition = new kakao.maps.LatLng(position.coords.latitude, position.coords.longitude);
              setUserPosition(locPosition);
              clearMarkers(); // 모든 마커 초기화
              
              // 첫 렌더링이거나 초기 상태일 때는 내 위치만 표시
              if (isFirstRender || currentDisplayMode === 'initial') {
                displayMarker(locPosition, '<div style="padding:2px;">내 위치</div>', bookMarker);
                moveMapToLocation(position.coords.latitude, position.coords.longitude);
                setIsFirstRender(false);
              }
              // 검색 모드일 때
              else if (currentDisplayMode === 'search' && searchQuery) {
                displayMarker(locPosition, '<div style="padding:2px;">내 위치</div>', bookMarker);
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
                        `, bookMarker);
                      }
                    });
                    if (data.length > 0) moveMapToLocation(data[0].y, data[0].x);
                  }
                }, { location: locPosition, radius: SEARCH_RADIUS });
              }
              // enterprises 모드이고 필터링된 데이터가 있을 때
              else if (currentDisplayMode === 'enterprises' && filteredEnterprises.length > 0) {
                displayMarker(locPosition, '<div style="padding:2px;">내 위치</div>', bookMarker);
                displayofflineMarkers(map, filteredEnterprises, displayMarker, clearMarkers)
                  .then(() => console.log('All filtered enterprise markers displayed successfully'))
                  .catch(error => console.error('Error displaying enterprise markers:', error));
                moveMapToLocation(position.coords.latitude, position.coords.longitude);
              }
            },
            () => {
              const locPosition = new kakao.maps.LatLng(DEFAULT_LAT, DEFAULT_LNG);
              setUserPosition(locPosition);
              if (isFirstRender || currentDisplayMode === 'initial') {
                clearMarkers();
                displayMarker(locPosition, 'geolocation을 사용할 수 없어요..', bookMarker);
                moveMapToLocation(DEFAULT_LAT, DEFAULT_LNG);
                setIsFirstRender(false);
              }
            }
          );
        }
      } else {
        setTimeout(initializeMap, 100);
      }
    };

    initializeMap();
  }, [searchQuery, filteredEnterprises, currentDisplayMode, isFirstRender, dispatch, addressToCoords, displayofflineMarkers]);
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