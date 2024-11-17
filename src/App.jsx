import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import EnterpriseSearch from './pages/enterprise/EnterpriseSearch';
import Magazine from './pages/magazine/Magazine';
import Home from './pages/home/Home';
import Program from './pages/program/Program';
import Mypage from './pages/mypage/Mypage';
import Layout from './components/layout/Layout';

function App() {
  return (
    <BrowserRouter>
        <Routes>
            <Route element={<Layout/>}>
                <Route path="/" element={<Home />} />
                <Route path="/magazine" element={<Magazine />}/>
                <Route path="/enterprise" element={<EnterpriseSearch />}/>
                <Route path="/program" element={<Program />}/>
                <Route path="/mypage" element={<Mypage />}/>
                <Route path="*" element={<div>페이지를 찾을 수 없습니다.</div>} />
            </Route> 
        </Routes>
    </BrowserRouter>
  );
}

export default App;