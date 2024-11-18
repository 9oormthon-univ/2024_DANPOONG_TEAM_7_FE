import React, { useEffect, useState } from 'react';
import storeMarker from '../../assets/images/map/map-store.svg';
import programMarker from '../../assets/images/map/map-program.svg';
import bookMarker from '../../assets/images/map/map-bookmark.svg';

function KakaoMap() {
  const [markers, setMarkers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/dummyData/kakaoMapMarkers.json'); // 서버의 URL을 사용하거나, 로컬 개발 환경에서의 접근 경로
        const data = await response.json();
        setMarkers(data);
      } catch (error) {
        console.error('Failed to load data:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const initializeMap = () => {
      if (window.kakao && window.kakao.maps) {
        const mapContainer = document.getElementById('map');
        const mapOption = {
          center: new window.kakao.maps.LatLng(33.450701, 126.570667),
          level: 5
        };

        const map = new window.kakao.maps.Map(mapContainer, mapOption);

        function displayMarker(locPosition, message, imageSrc) {
          const imageSize = new kakao.maps.Size(24, 24);
          const imageOption = { offset: new kakao.maps.Point(11, 34) };
          const markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize, imageOption);

          const marker = new window.kakao.maps.Marker({
            map: map,
            position: locPosition,
            image: markerImage
          });

          const infowindow = new window.kakao.maps.InfoWindow({
            content: message,
            removable: true
          });

          infowindow.open(map, marker);
        }

        markers.forEach(marker => {
          const position = new window.kakao.maps.LatLng(marker.lat, marker.lng);
          const imageSrc = marker.description === "스토어 기업" ? storeMarker :
                           marker.description === "프로그램 기업" ? programMarker : bookMarker;
          displayMarker(position, marker.title, imageSrc);
        });

        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(position => {
            const locPosition = new window.kakao.maps.LatLng(position.coords.latitude, position.coords.longitude);
            const message = '<div style="padding:2px;">내 위치</div>';
            displayMarker(locPosition, message, bookMarker);
            map.setCenter(locPosition);
          }, () => {
            const locPosition = new window.kakao.maps.LatLng(37.3517089,127.0705171);
            const message = 'geolocation을 사용할수 없어요..';
            displayMarker(locPosition, message, bookMarker);
            map.setCenter(locPosition);
          });
        }
      } else {
        setTimeout(initializeMap, 100);
      }
    };

    initializeMap();
  }, [markers]); // markers를 의존성 배열에 추가하여 마커 데이터가 로드된 후 지도를 초기화하도록 함

  return <div id="map" style={{ width: '100%', height: '90vh' }}></div>;
}

export default KakaoMap;