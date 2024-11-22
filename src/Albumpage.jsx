import React, { useState, useEffect } from "react";
import Card from "./Card";
import { useLocation } from "react-router-dom";
import NavBar from "./NavBar"; // Import NavBar

const CLIENT_ID = import.meta.env.VITE_CLIENT_ID;
const CLIENT_SECRET = import.meta.env.VITE_CLIENT_SECRET;

function Albumpage() {
    const [searchInput, setSearchInput] = useState("");
    const [accessToken, setAccessToken] = useState("");
    const [albums, setAlbums] = useState([]);
    const [loading, setLoading] = useState(false);
    const location = useLocation();
    const artistName = location?.state?.artistName || "";

    useEffect(() => {
        if (accessToken) {
            console.log("Access token set successfully:", accessToken);
        } else {
            console.log("No access token found. Fetching a new token...");
        }
    }, [accessToken]);

    useEffect(() => {
        const fetchAccessToken = async () => {
            try {
                const authParameters = {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                    },
                    body: `grant_type=client_credentials&client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}`,
                };

                const response = await fetch(
                    "https://accounts.spotify.com/api/token",
                    authParameters
                );

                if (!response.ok) {
                    console.error("Failed to fetch access token:", response.status);
                    throw new Error("Failed to fetch access token");
                }

                const data = await response.json();
                setAccessToken(data.access_token);
            } catch (error) {
                console.error("Error fetching access token:", error);
            }
        };

        fetchAccessToken();
    }, []);

    const handleSubmit = (event) => {
        event.preventDefault();
        if (!accessToken) {
            console.error("Access token is missing. Cannot perform search.");
            return;
        }
        setLoading(true); // Start loading animation
        setAlbums([]); // Clear previous albums
        search(searchInput);
    };

    const search = async (artistName) => {
        console.log("Searching for:", artistName);

        const artistParameters = {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
        };

        try {
            const artistResponse = await fetch(
                `https://api.spotify.com/v1/search?q=${encodeURIComponent(
                    artistName
                )}&type=artist`,
                artistParameters
            );

            if (!artistResponse.ok) {
                console.error("Error fetching artist data:", artistResponse.status);
                throw new Error("Failed to fetch artist data");
            }

            const artistData = await artistResponse.json();

            if (!artistData?.artists?.items?.length) {
                console.error("No artists found for the search query");
                setLoading(false);
                return;
            }

            const artistID = artistData.artists.items[0].id;

            const albumResponse = await fetch(
                `https://api.spotify.com/v1/artists/${artistID}/albums?include_groups=album&market=ES&limit=50`,
                artistParameters
            );

            if (!albumResponse.ok) {
                console.error("Error fetching albums:", albumResponse.status);
                throw new Error("Failed to fetch albums");
            }

            const albumData = await albumResponse.json();
            setAlbums(albumData.items);
        } catch (error) {
            console.error("Error performing search:", error);
        } finally {
            setLoading(false); // Stop loading animation
        }
    };

    return (
        <div className="bg-stone-300 min-h-screen">
            <NavBar /> {/* Add NavBar here */}
            <div className="p-4 sm:p-5 lg:p-10 scroll-auto">
                <form className="shadow-md p-4 mb-5" onSubmit={handleSubmit}>
                    <label
                        htmlFor="default-search"
                        className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
                    >
                        Search
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                            <svg
                                className="w-4 h-4 text-gray-500 dark:text-gray-400"
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 20 20"
                            >
                                <path
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                                />
                            </svg>
                        </div>
                        <input
                            type="search"
                            id="default-search"
                            className="block w-full p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 sm:text-base md:text-lg"
                            placeholder="Search Artists"
                            required
                            onChange={(event) => setSearchInput(event.target.value)}
                        />
                        <button
                            type="submit"
                            className="text-white absolute right-2.5 bottom-2.5 bg-blue-700 hover:bg-stone-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-stone-600 dark:hover:bg-stone-700 dark:focus:ring-stone-800 sm:text-base md:text-lg"
                        >
                            Search
                        </button>
                    </div>
                </form>
                {loading ? (
                    <div className="flex justify-center items-center mt-10">
                        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-solid"></div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 m-5">
                        {albums.map((album, i) => (
                            <Card key={i} album={album} accessToken={accessToken} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Albumpage;
