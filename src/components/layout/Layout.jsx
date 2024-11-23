import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import TopBar from './TopBar';
import Bar from './Bar';

export default function Layout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('accessToken');
      const userId = localStorage.getItem('userId');
      
      if (!token || !userId) {
        console.log('인증 정보 없음');
        setIsAuthenticated(false);
        if (location.pathname !== '/api/kakao/callback') { // 콜백 페이지는 제외
          navigate('/', { replace: true });
        }
        return;
      }
  
      setIsAuthenticated(true);
    };
  
    if (location.pathname !== '/' && location.pathname !== '/api/kakao/callback') {
      checkAuth();
    }
  }, [navigate, location.pathname]);

  // 로그인 페이지에서는 Layout을 렌더링하지 않음
  if (location.pathname === '/') {
    return <Outlet />;
  }

  // 인증되지 않은 상태면 아무것도 렌더링하지 않음
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="layout-container">
      <main>
        <Outlet />
      </main>
      <footer>
        <Bar />
      </footer>
    </div>
  );
}