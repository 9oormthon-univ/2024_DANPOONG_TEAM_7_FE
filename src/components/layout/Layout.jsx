import React from 'react';
import { Outlet } from 'react-router-dom';
import Bar from './Bar';

export default function Layout() {
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