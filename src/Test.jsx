import React from 'react'
import Search from './Search';
import Albumpage from './Albumpage';
import SongsPage from "./SongsPage";
import NavBar from './NavBar';
import { Routes, Route } from 'react-router-dom';

const CLIENT_ID = import.meta.env.VITE_CLIENT_ID;
const CLIENT_SECRET = import.meta.env.VITE_CLIENT_SECRET;

function Test() {

  return (
    <>   
                <Routes>
                <Route path="/" element={<Search />} />
                <Route path="/Albumpage" element={<Albumpage />} />
                <Route path="/SongsPage" element={<SongsPage />} />
                <Route path="/NavBar" element={<NavBar />} />
            </Routes>

            
    </>
  )
}

export default Test