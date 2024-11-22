import React from 'react';
import { Outlet } from 'react-router-dom';
import TopBar from './TopBar';
import Bar from './Bar'; // Bar 컴포넌트 import

export default function Layout() {
  return (
    <div className="layout-container">
      <main>
        <Outlet /> {/* 각 페이지의 콘텐츠가 여기에 들어감 */}
      </main>
      <footer>
        <Bar /> {/* 페이지 하단에 Bar 추가 */}
      </footer>
    </div>
  );
}