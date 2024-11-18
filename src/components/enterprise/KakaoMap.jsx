// KakaoMap.jsx
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateEnterpriseCoords } from '../../redux/slice/EnterpriseSlice';
import SearchModal from '../enterprise/SearchModal';
import storeMarker from '../../assets/images/map/map-store.svg';
import programMarker from '../../assets/images/map/map-program.svg';
import bookMarker from '../../assets/images/map/map-bookmark.svg';

function KakaoMap() {
  const dispatch = useDispatch();
  const [searchData, setSearchData] = useState('');
  const [userPosition, setUserPosition] = useState(null);
  const [coordsCache, setCoordsCache] = useState({});
  const searchRadius = 2000;

  // Redux에서 기업 데이터와 선택된 카테고리 가져오기
  const { socialEnterprises, filteredEnterprises, selectedCategories } = useSelector(state => state.enterprise);

  console.log('KakaoMap - Received Enterprises:', {
    totalEnterprises: socialEnterprises.length,
    filteredCount: filteredEnterprises.length,
    categories: selectedCategories
  });

  const handleSendData = (inputValue) => {
    console.log("Data received from SearchModal:", inputValue);
    setSearchData(inputValue);
  };

  // 주소-좌표 변환 함수
  const addressToCoords = async (address) => {
    // 이미 캐시에 있는 주소라면 캐시된 결과 반환
    if (coordsCache[address]) {
      console.log('Using cached coordinates for:', address);
      return coordsCache[address];
    }

    return new Promise((resolve, reject) => {
      const geocoder = new kakao.maps.services.Geocoder();
      const baseAddress = address.split('(')[0].trim();
      
      console.log('Converting address to coordinates:', baseAddress);
      
      geocoder.addressSearch(baseAddress, (result, status) => {
        if (status === kakao.maps.services.Status.OK) {
          const coords = {
            latitude: result[0].y,
            longitude: result[0].x
          };
          
          // 결과를 캐시에 저장
          setCoordsCache(prev => ({
            ...prev,
            [address]: coords
          }));

          console.log('Address conversion successful:', {
            address: baseAddress,
            coords: coords
          });
          
          resolve(coords);
        } else {
          // 기본 주소로 실패하면 더 단순화된 주소로 다시 시도
          const simplifiedAddress = baseAddress.split(' ').slice(0, 3).join(' ');
          console.log('Retrying with simplified address:', simplifiedAddress);
          
          geocoder.addressSearch(simplifiedAddress, (result2, status2) => {
            if (status2 === kakao.maps.services.Status.OK) {
              const coords = {
                latitude: result2[0].y,
                longitude: result2[0].x
              };
              
              setCoordsCache(prev => ({
                ...prev,
                [address]: coords
              }));

              console.log('Address conversion successful with simplified address:', {
                address: simplifiedAddress,
                coords: coords
              });
              
              resolve(coords);
            } else {
              reject(new Error(`주소 변환 실패: ${address}`));
            }
          });
        }
      });
    });
  };

// 마커 표시를 위한 함수들
const displayEnterpriseMarkers = async (map, enterprises, displayMarker, clearMarkers) => {
  // 기존 마커 제거
  clearMarkers();

  // 모든 기업의 주소를 한 번에 변환
  const markerPromises = enterprises.map(async (enterprise) => {
    try {
      let coords;
      if (enterprise.latitude && enterprise.longitude) {
        coords = {
          latitude: enterprise.latitude,
          longitude: enterprise.longitude
        };
      } else {
        coords = await addressToCoords(enterprise.address);
        // Redux store 업데이트
        dispatch(updateEnterpriseCoords({
          companyName: enterprise.companyName,
          coords
        }));
      }

      const position = new kakao.maps.LatLng(coords.latitude, coords.longitude);
      const imageSrc = storeMarker;
      
      displayMarker(
        position, 
        `<div style="padding:5px;font-size:12px;">
          ${enterprise.companyName}<br>
          ${enterprise.socialPurposeType}<br>
          ${enterprise.address}
        </div>`,
        imageSrc
      );
    } catch (error) {
      console.error(`Failed to process enterprise ${enterprise.companyName}:`, error);
    }
  });

  // 모든 마커 처리가 완료될 때까지 대기
  await Promise.all(markerPromises);
};

const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371e3;
  const toRadians = angle => (angle * Math.PI) / 180;

  const φ1 = toRadians(lat1);
  const φ2 = toRadians(lat2);
  const Δφ = toRadians(lat2 - lat1);
  const Δλ = toRadians(lon2 - lon1);

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
};
useEffect(() => {
  const initializeMap = () => {
    console.log('KakaoMap - Initializing Map');
    
    if (window.kakao && window.kakao.maps) {
      const mapContainer = document.getElementById('map');
      const mapOption = {
        center: new window.kakao.maps.LatLng(37.5665, 126.9780), // 서울 중심좌표
        level: 5
      };

      const map = new window.kakao.maps.Map(mapContainer, mapOption);
      const ps = new kakao.maps.services.Places();

      let displayedMarkers = [];
      
      function clearMarkers() {
        displayedMarkers.forEach(marker => marker.setMap(null));
        displayedMarkers = [];
      }

      function displaySearchMarker(place) {
        const marker = new kakao.maps.Marker({
          map: map,
          position: new kakao.maps.LatLng(place.y, place.x)
        });

        const infowindow = new kakao.maps.InfoWindow({
          content: `
            <div style="padding:5px;font-size:12px;">
              ${place.place_name}<br>
              ${place.address_name}
            </div>
          `,
          zIndex: 1
        });

        kakao.maps.event.addListener(marker, 'click', function() {
          infowindow.open(map, marker);
        });

        displayedMarkers.push(marker);
      }

      function displayMarker(locPosition, message, imageSrc) {
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
        
        kakao.maps.event.addListener(marker, 'click', function() {
          infowindow.open(map, marker);
        });
      }

      function placesSearchCB(data, status) {
        if (status === kakao.maps.services.Status.OK && userPosition) {
          clearMarkers();

          data.forEach(place => {
            const placePosition = new kakao.maps.LatLng(place.y, place.x);
            const distance = calculateDistance(
              userPosition.getLat(),
              userPosition.getLng(),
              parseFloat(place.y),
              parseFloat(place.x)
            );

            if (distance <= searchRadius) {
              displaySearchMarker(place);
            }
          });

          const circle = new kakao.maps.Circle({
            center: userPosition,
            radius: searchRadius,
            strokeWeight: 1,
            strokeColor: '#75B8FA',
            strokeOpacity: 1,
            strokeStyle: 'solid',
            fillColor: '#CFE7FF',
            fillOpacity: 0.2
          });
          circle.setMap(map);

          map.setCenter(userPosition);
          map.setLevel(7);
        }
      }
      // 표시할 기업 데이터 결정 및 마커 표시
      const enterprisesToDisplay = selectedCategories.includes('전체') || selectedCategories.length === 0 
      ? socialEnterprises 
      : filteredEnterprises;

    // 비동기로 기업 마커 표시
    displayEnterpriseMarkers(map, enterprisesToDisplay, displayMarker, clearMarkers)
      .then(() => {
        console.log('All enterprise markers displayed successfully');
      })
      .catch(error => {
        console.error('Error displaying enterprise markers:', error);
      });

    // 사용자 위치 가져오기
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          const locPosition = new kakao.maps.LatLng(
            position.coords.latitude,
            position.coords.longitude
          );
          setUserPosition(locPosition);
          displayMarker(
            locPosition,
            '<div style="padding:2px;">내 위치</div>',
            bookMarker
          );
          
          map.setCenter(locPosition);
          map.setLevel(7);

          // 검색 반경 표시
          const circle = new kakao.maps.Circle({
            center: locPosition,
            radius: searchRadius,
            strokeWeight: 1,
            strokeColor: '#75B8FA',
            strokeOpacity: 1,
            strokeStyle: 'solid',
            fillColor: '#CFE7FF',
            fillOpacity: 0.2
          });
          circle.setMap(map);

          if (searchData) {
            ps.keywordSearch(searchData, placesSearchCB, {
              location: locPosition,
              radius: searchRadius
            });
          } else {
            ps.keywordSearch('사회적', placesSearchCB, {
              location: locPosition,
              radius: searchRadius
            });
          }
        },
        () => {
          const locPosition = new kakao.maps.LatLng(37.3517089, 127.0705171);
          setUserPosition(locPosition);
          displayMarker(
            locPosition,
            'geolocation을 사용할수 없어요..',
            bookMarker
          );
          
          map.setCenter(locPosition);
          map.setLevel(7);

          if (searchData) {
            ps.keywordSearch(searchData, placesSearchCB, {
              location: locPosition,
              radius: searchRadius
            });
          } else {
            ps.keywordSearch('사회적', placesSearchCB, {
              location: locPosition,
              radius: searchRadius
            });
          }
        }
      );
    }
  } else {
    setTimeout(initializeMap, 100);
  }
};

initializeMap();
}, [searchData, filteredEnterprises, selectedCategories, socialEnterprises, dispatch, coordsCache]);
// 지도를 표시할 div와 스타일 반환
return (
  <div 
    id="map" 
    style={{ 
      width: '100%', 
      height: '90vh' 
    }}
    ref={el => {
      if (el && !document.getElementById('map')) {
        el.id = 'map';
      }
    }}
  />
);
}

export default KakaoMap;