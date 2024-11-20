import React from 'react';
import { Outlet } from 'react-router-dom';
import Bar from './Bar'; // Bar 컴포넌트 import
import TopBar from './TopBar';
import Back from './Back';

export default function BackLayout() {
  return (
    <div className="layout-container">
        <header>
            <Back/>
        </header>
        <main>
            <Outlet /> {/* 각 페이지의 콘텐츠가 여기에 들어감 */}
        </main>
    </div>
  );
}