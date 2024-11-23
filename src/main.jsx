import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import './index.css';
import App from './App.jsx';
import { registerSW } from 'virtual:pwa-register'

// 서비스 워커 등록
if ('serviceWorker' in navigator) {
  registerSW({
    onNeedRefresh() {
      console.log('새로운 콘텐츠가 사용 가능합니다. 새로고침 해주세요.');
    },
    onOfflineReady() {
      console.log('앱이 오프라인에서도 실행될 준비가 되었습니다.');
    },
  })
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>
);