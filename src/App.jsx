import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import EnterpriseSearch from './pages/enterprise/EnterpriseSearch';
import Magazine from './pages/magazine/Magazine';
import MagazineDetail from './pages/magazine/MagazineDetail';
import Home from './pages/home/Home';
import Program from './pages/program/Program';
import Mypage from './pages/mypage/Mypage';
import EnterpriseInfo from './pages/enterprise/EnterpriseInfo';
import ReviewKeyword from './pages/mypage/ReviewKeyword';
import ReviewWrite from './pages/mypage/ReviewWrite';
import Review from './pages/mypage/Review';
import EditKeyword from './pages/mypage/EditKeyword';
import EditWrite from './pages/mypage/EditWrite';

//Layout
import BackLayout from './components/layout/BackLayout';
import Layout from './components/layout/Layout';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/magazine/:id" element={<MagazineDetail />} />
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/magazine" element={<Magazine />} />
          <Route path="/enterprise" element={<EnterpriseSearch />} />
          <Route path="/program" element={<Program />} />
          <Route path="/mypage" element={<Mypage />} />
          <Route path="/enterprise/info/:id" element={<EnterpriseInfo />} />
          <Route path="*" element={<div>페이지를 찾을 수 없습니다.</div>} />
        </Route>
        <Route element={<BackLayout />}>
          <Route path='/mypage/review/write' element={<ReviewWrite />} />
          <Route path='/mypage/review/editwrite' element={<EditWrite />} />
          <Route path='/mypage/review' element={<Review />} />
        </Route>
        <Route path='/mypage/review/keyword' element={<ReviewKeyword />} />
        <Route path='/mypage/review/editkeyword' element={<EditKeyword />} />
      </Routes>


    </BrowserRouter>
  );
}

export default App;