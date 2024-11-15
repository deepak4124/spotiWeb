import React, { useState } from "react";
import {useNavigate, Routes, Route} from 'react-router-dom';
import Albumpage from "./Albumpage";
// import { useState } from "react";

function Search(props){
    const [searchInput, setSearchInput] = useState("");
    const [ submitted, setSubmitted] = useState(false);
    const navitgate = useNavigate();
    const handleSubmit = (event) => {
        event.preventDefault(); 
        // console.log(searchInput); 
        setSubmitted(true);
        navitgate("/Albumpage", {state:{artistName:searchInput}});
    };
    return(
        <>
          
<div className='bg-stone-300 h-screen place-content-center flex-wrap sm:text-sm'>
        <div className='border border-slate-400 z-0 inset-0 text-center place-content-center w-[80%] ml-[10%] h-[40%] pb-[0%] bg-stone-100 rounded-md'>
          <div className='z-10'>
          <p className='z-20 text-5xl text-wrap place-content-center font-bold font-helvetica'>Experience Music Like Never Before - <br></br></p>
          <p className='z-20 text-3xl place-content-center font-helvetica'>Your Personalized Spotify Web Interface Awaits!</p>
          <div className='p-8 mb-0 '>
          <form className="max-w-md mx-auto" onSubmit={handleSubmit}>   
    <label className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
    <div className="relative">
        <div className="absolute inset-y-0 start-0 flex items-center ps-3 ">
            <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
            </svg>
        </div>  
        <input type="search" id="default-search" className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg" placeholder="Search Artists" required 
        onChange={(event) => setSearchInput(event.target.value)}/>
        <button type="submit" className="text-white absolute end-2.5 bottom-2.5 bg-blue-700 hover:bg-stone-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-stone-600 dark:hover:bg-stone-700 dark:focus:ring-stone-800"
        >Search</button>

    </div>

</form> 
          </div>
          </div>
       
        </div>
        
      </div>
</>
        
    )
}

export default Search;