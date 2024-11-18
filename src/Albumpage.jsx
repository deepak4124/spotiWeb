import React from "react";
import { useState, useEffect } from 'react';
import Card from "./Card";
import { Form, useLocation } from "react-router-dom";

console.log("Environment Variables:", import.meta.env);
const CLIENT_ID = import.meta.env.VITE_CLIENT_ID;
const CLIENT_SECRET = import.meta.env.VITE_CLIENT_SECRET;

console.log("Client ID:", CLIENT_ID); // For testing purposes only; remove in production.

function Albumpage() {
    const [searchInput, setSearchInput] = useState("");
    const [accessToken, setAccessToken] = useState("");
    const [albums, setAlbums] = useState([]);
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
            body: 'grant_type=client_credentials&client_id=' + CLIENT_ID + '&client_secret=' + CLIENT_SECRET
        };
        fetch('https://accounts.spotify.com/api/token', authParameters)
            .then(result => result.json())
            .then(data => setAccessToken(data.access_token));
    }, []);

    const handleSubmit = (event) => {
        event.preventDefault();
        artistName = searchInput;
        search();
    };

    async function search() {
        console.log("Searching for " + artistName);

        var artistParameters = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + accessToken
            }
        };
        var artistID = await fetch('https://api.spotify.com/v1/search?q=' + artistName + '&type=artist', artistParameters)
            .then(result => result.json())
            .then(data => { return (data.artists.items[0].id); });
        console.log(artistID);

        var returnedAlbums = await fetch('https://api.spotify.com/v1/artists/' + artistID + '/albums?include_groups=album&market=ES&limit=50', artistParameters)
            .then(response => response.json())
            .then(data => { setAlbums(data.items); });
        console.log(albums);
    }

    useEffect(() => {
        if (albums) {
            console.log("Albums updated:", albums);
        }
    }, [albums]);

    return (
        <div className="bg-stone-300 p-4 sm:p-5 lg:p-10 scroll-auto">
            <form className="shadow-md p-4 mb-5" onSubmit={handleSubmit}>
                <label className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                        <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                        </svg>
                    </div>
                    <input type="search" id="default-search" className="block w-full p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 sm:text-base md:text-lg"
                        placeholder="Search Artists" required
                        onChange={(event) => setSearchInput(event.target.value)} />
                    <button type="submit" className="text-white absolute right-2.5 bottom-2.5 bg-blue-700 hover:bg-stone-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-stone-600 dark:hover:bg-stone-700 dark:focus:ring-stone-800 sm:text-base md:text-lg">
                        Search
                    </button>
                </div>
            </form>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 m-5">
                {albums.map((album, i) => (
                    <Card key={i} album={album} />
                ))}
            </div>
        </div>
    );
}

export default Albumpage;
