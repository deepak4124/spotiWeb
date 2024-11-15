import React from "react";
import {useState, useEffect} from 'react';
import Card from "./Card";
import { Form, useLocation } from "react-router-dom";

const CLIENT_ID = "be640d924ce3433284076ee2b3e3b3e3";
const CLIENT_SECRET="950e5939859c4828bea796a4f5da9df6";


function Albumpage(){

    const [searchInput, setSearchInput] = useState("");
    const[accessToken, setAccessToken] = useState("");
    const[albums, setAlbums] = useState([])
    const location = useLocation();
    var artistName = location.state.artistName;
    useEffect(() => {
        if (artistName && accessToken) {
          search();
        }
      }, [accessToken]); 
    useEffect(() => {
        var authParameters = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: 'grant_type=client_credentials&client_id=' +  CLIENT_ID + '&client_secret=' + CLIENT_SECRET
        }
        fetch('https://accounts.spotify.com/api/token', authParameters)
        .then(result => result.json())
        .then(data => setAccessToken(data.access_token))
    },[])



    const handleSubmit = (event) => {
        event.preventDefault(); 
        artistName = searchInput;
        search();
    };


    //search
    async function search(){
        console.log("seaching for " + artistName);

        //artist id
        var artistParameters = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + accessToken
            }


        }
        var artistID = await fetch('https://api.spotify.com/v1/search?q='+ artistName + '&type=artist', artistParameters)
        .then(result => result.json())
        .then(data => {return(data.artists.items[0].id)});
        console.log(artistID)
        //grab albums
        var returnedAlbums = await fetch('https://api.spotify.com/v1/artists/'+ artistID + '/albums?include_groups=album&market=ES&limit=50', artistParameters)
        .then(response => response.json())
        .then(data => {setAlbums(data.items);
        });
        console.log(albums);
    }
    useEffect(() => {
        if (albums) {
          console.log("Albums updated:", albums);
        }
      }, [albums]);

    
    return(
        <div className="bg-stone-300 pl-5 mb-0 scroll-auto">
            <form className="shadow shadow-md pt-5 mr-5" onSubmit={handleSubmit}>   
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
        {/* <h1>Album Page</h1> */}
        <div className="grid grid-cols-3 m-20 mb-0 pb-[10%] scroll-smooth">
             {albums.map((album, i) => (
                <Card key={i} album={album} />
                ))}
            </div>
        </div>

    )
}

export default Albumpage;