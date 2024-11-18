import React, { useEffect } from 'react';
import storeMarker from '../../assets/images/map/map-store.svg';
import programMarker from '../../assets/images/map/map-program.svg';
import bookMarker from '../../assets/images/map/map-bookmark.svg';

function KakaoMap() {

  const markers = [
    {
      id: 1,
      lat: 37.6011276,
      lng: 126.9350396,
      title: "어딘가..(s)",
      description: "스토어 기업"
    },
    {
      id: 2,
      lat: 37.6081815,
      lng: 126.9316775,
      title: "파리바게트(p)",
      description: "프로그램 기업"
    },
    {
      id: 3,
      lat: 37.6034431,
      lng: 126.9353557,
      title: "스타벅스(b)",
      description: "즐겨찾기 기업"
    }
  ];
  
  useEffect(() => {
    // kakao 객체가 로드될 때까지 대기
    const initializeMap = () => {
      if (window.kakao && window.kakao.maps) {
        var mapContainer = document.getElementById('map'); // 지도를 표시할 div 
        var mapOption = {
          center: new window.kakao.maps.LatLng(33.450701, 126.570667), // 지도의 중심좌표
          level: 5 // 지도의 확대 레벨
        };

        var map = new window.kakao.maps.Map(mapContainer, mapOption); // 지도를 생성

        // HTML5의 geolocation으로 사용할 수 있는지 확인
        if (navigator.geolocation) {
          // GeoLocation을 이용해서 접속 위치를 얻어옴
          navigator.geolocation.getCurrentPosition(function(position) {
            var lat = position.coords.latitude; // 위도
            var lon = position.coords.longitude; // 경도
            var accuracy = position.coords.accuracy; // 위치 정확도 확인
            console.log('Accuracy: ' + accuracy + ' meters');

            var locPosition = new window.kakao.maps.LatLng(lat, lon); // 마커 위치 설정
            var message = '<div style="padding:2px;">내 위치</div>';

            displayMyMarker(locPosition, message);
          });
        } else {
          // GeoLocation을 사용할 수 없을 때
          var locPosition = new window.kakao.maps.LatLng(37.3517089,127.0705171);
          var message = 'geolocation을 사용할수 없어요..';

          displayMyMarker(locPosition, message);
        }

        // 지도에 마커와 인포윈도우를 표시하는 함수
        function displayMyMarker(locPosition, message) {
          var myMarker = new window.kakao.maps.Marker({
            map: map,
            position: locPosition
          });

          var myInfowindow = new window.kakao.maps.InfoWindow({
            content: message,
            removable: true
          });

          myInfowindow.open(map, myMarker);
          map.setCenter(locPosition); // 지도 중심을 접속 위치로
        }

        // 스토어 기업 표시 마커 설정 함수
        function displayStoreMarker(locPosition, message) {
          var imageSize = new kakao.maps.Size(24, 24), // 마커이미지의 크기
              imageOption = {offset: new kakao.maps.Point(27, 69)};

          var markerImage = new kakao.maps.MarkerImage(storeMarker, imageSize, imageOption)

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

        // 마커 데이터 배열에서 '스토어 기업'인 항목만 필터링하여 마커와 인포윈도우 생성
        markers.filter(marker => marker.description === "스토어 기업").forEach(marker => {
          const position = new window.kakao.maps.LatLng(marker.lat, marker.lng);
          displayStoreMarker(position, marker.title);
        });

        // 프로그램 기업 표시 마커 설정 함수
        function displayProgramMarker(locPosition, message) {
          var imageSize = new kakao.maps.Size(24, 24), // 마커이미지의 크기
              imageOption = {offset: new kakao.maps.Point(27, 69)};

          var markerImage = new kakao.maps.MarkerImage(programMarker, imageSize, imageOption)

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

        // 마커 데이터 배열에서 '프로그램 기업'인 항목만 필터링하여 마커와 인포윈도우 생성
        markers.filter(marker => marker.description === "프로그램 기업").forEach(marker => {
          const position = new window.kakao.maps.LatLng(marker.lat, marker.lng);
          displayProgramMarker(position, marker.title);
        });

        // 즐겨찾기 기업 표시 마커 설정 함수
        function displayBookMarker(locPosition, message) {
          var imageSize = new kakao.maps.Size(24, 24), // 마커이미지의 크기
              imageOption = {offset: new kakao.maps.Point(27, 69)};

          var markerImage = new kakao.maps.MarkerImage(bookMarker, imageSize, imageOption)

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

        // 마커 데이터 배열에서 '즐겨찾기 기업'인 항목만 필터링하여 마커와 인포윈도우 생성
        markers.filter(marker => marker.description === "즐겨찾기 기업").forEach(marker => {
          const position = new window.kakao.maps.LatLng(marker.lat, marker.lng);
          displayBookMarker(position, marker.title);
        });

      } else {
        // 스크립트 로드가 완료될 때까지 기다리기
        setTimeout(initializeMap, 100);
      }
    };

    initializeMap(); // 지도 초기화 함수 호출
  }, []);

  return <div id="map" style={{ width: '100vh', height: '90vh' }}></div>;
}

export default KakaoMap;