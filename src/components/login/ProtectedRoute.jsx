// src/components/ProtectedRoute.jsx
import { useNavigate,  Outlet, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';

const ProtectedRoute = () => {
    const navigate = useNavigate();
    const location = useLocation();
    
    useEffect(() => {
      const token = localStorage.getItem("accessToken");
      
      if (!token) {
        // 로그인 페이지로 리다이렉트하면서 원래 가려던 페이지 정보를 state로 전달
        navigate('/login', { state: { from: location.pathname } });
      }
    }, [navigate, location]);
  
    // 토큰이 있으면 자식 컴포넌트 렌더링
    return <Outlet />;
  };
  
  export default ProtectedRoute;