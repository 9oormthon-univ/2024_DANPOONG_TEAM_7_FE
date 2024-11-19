import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useSelector } from 'react-redux';
import { calculateDistance } from '../../utils/distanceUtils';
import { selectFilteredEnterprises } from '../../redux/slice/FilteredEnterpriseListSlice';
import mylocationMarker from '../../assets/images/map/map-mylocation.svg';
import myplaceMarker from '../../assets/images/map/map-myplace.svg';
import offlineMarker from '../../assets/images/map/map-offline.svg';
import onlineMarker from '../../assets/images/map/map-online.svg';
import bookMarker from '../../assets/images/map/map-bookmark.svg';

const DEFAULT_LAT = 37.3517089;
const DEFAULT_LNG = 127.0705171;
const DEFAULT_ZOOM_LEVEL = 5;
const SEARCH_RADIUS = 2000;

function KakaoMap() {
  const [userPosition, setUserPosition] = useState(null);
  const [currentDisplayMode, setCurrentDisplayMode] = useState('initial');
  const [isFirstRender, setIsFirstRender] = useState(true);
  const coordsCache = useRef({});
  
  const filteredEnterprises = useSelector(selectFilteredEnterprises);
  const { searchQuery, lastUpdated: searchLastUpdated } = useSelector(state => state.search);
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

  // 타임스탬프에 따른 디스플레이 모드 업데이트
  useEffect(() => {
    if (isFirstRender) {
        return;
    }

    // 검색이 필터링보다 최신이면 검색 모드로
    if (searchLastUpdated && (!filterLastUpdated || searchLastUpdated > filterLastUpdated)) {
        setCurrentDisplayMode('search');
    }
    // 필터링이 검색보다 최신이면 enterprises 모드로
    else if (filterLastUpdated && (!searchLastUpdated || filterLastUpdated > searchLastUpdated)) {
        setCurrentDisplayMode('enterprises');
    }
  }, [searchLastUpdated, filterLastUpdated, isFirstRender]);

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
        
          if (imageSrc === mylocationMarker) {
            imageSize = new kakao.maps.Size(35, 35); // mylocationMarker의 크기를 30x30으로 조정
            imageOption = { offset: new kakao.maps.Point(15, 45) }; // 오프셋도 조정
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
              
              // 첫 렌더링이거나 초기 상태일 때는 내 위치만 표시
              if (isFirstRender || currentDisplayMode === 'initial') {
                displayMarker(locPosition, '<div style="padding:2px;">내 위치</div>', mylocationMarker);
                moveMapToLocation(position.coords.latitude, position.coords.longitude);
                setIsFirstRender(false);
              }
              // 검색 모드일 때
              else if (currentDisplayMode === 'search' && searchQuery) {
                displayMarker(locPosition, '<div style="padding:2px;">내 위치</div>', mylocationMarker);
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
                        `, myplaceMarker);
                      }
                    });
                    if (data.length > 0) moveMapToLocation(data[0].y, data[0].x);
                  }
                }, { location: locPosition, radius: SEARCH_RADIUS });
              }
              // enterprises 모드이고 필터링된 데이터가 있을 때
              else if (currentDisplayMode === 'enterprises' && filteredEnterprises.length > 0) {
                displayMarker(locPosition, '<div style="padding:2px;">내 위치</div>', mylocationMarker);
                displayofflineMarkers(map, filteredEnterprises, displayMarker, clearMarkers);
                moveMapToLocation(position.coords.latitude, position.coords.longitude);
              }
            },
            () => {
              const locPosition = new kakao.maps.LatLng(DEFAULT_LAT, DEFAULT_LNG);
              setUserPosition(locPosition);
              if (isFirstRender || currentDisplayMode === 'initial') {
                clearMarkers();
                displayMarker(locPosition, 'geolocation을 사용할 수 없어요..', mylocationMarker);
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
  }, [searchQuery, filteredEnterprises, currentDisplayMode, isFirstRender, displayofflineMarkers]);

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