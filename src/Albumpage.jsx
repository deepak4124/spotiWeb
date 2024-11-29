import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import NavBar from "./NavBar"; // Import NavBar
import Card from "./Card"; // Import Card

const CLIENT_ID = import.meta.env.VITE_CLIENT_ID;
const CLIENT_SECRET = import.meta.env.VITE_CLIENT_SECRET;

function Albumpage() {
    const location = useLocation();
    const artistName = location?.state?.artistName || ""; // Get artistName from location state
    const [searchInput, setSearchInput] = useState(artistName);
    const [accessToken, setAccessToken] = useState("");
    const [albums, setAlbums] = useState([]);
    const [relatedArtists, setRelatedArtists] = useState([]);
    const [loading, setLoading] = useState(false);

    // Fetch Spotify Access Token
    useEffect(() => {
        if (!accessToken) {
            fetchAccessToken();
        }
    }, [accessToken]);

    const fetchAccessToken = async () => {
        try {
            const response = await fetch("https://accounts.spotify.com/api/token", {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                body: `grant_type=client_credentials&client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}`,
            });

            if (!response.ok) {
                console.error("Failed to fetch access token:", response.status);
                return;
            }

            const data = await response.json();
            setAccessToken(data.access_token);
        } catch (error) {
            console.error("Error fetching access token:", error);
        }
    };

    // Search for albums and related artists
    const search = async () => {
        setLoading(true);

        try {
            const artistResponse = await fetch(
                `https://api.spotify.com/v1/search?q=${encodeURIComponent(searchInput)}&type=artist`,
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );

            if (!artistResponse.ok) {
                console.error("Error fetching artist data:", artistResponse.status);
                setLoading(false);
                return;
            }

            const artistData = await artistResponse.json();
            const artistID = artistData?.artists?.items[0]?.id;

            if (!artistID) {
                console.error("No artist found.");
                setLoading(false);
                return;
            }

            // Fetch albums
            const albumResponse = await fetch(
                `https://api.spotify.com/v1/artists/${artistID}/albums?include_groups=album&market=ES&limit=50`,
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );

            if (!albumResponse.ok) {
                console.error("Error fetching albums:", albumResponse.status);
                setLoading(false);
                return;
            }

            const albumData = await albumResponse.json();
            setAlbums(albumData.items);

            // Fetch related artists
            fetchRelatedArtists(artistID);
        } catch (error) {
            console.error("Error performing search:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchRelatedArtists = async (artistID) => {
        try {
            if (!artistID) {
                console.error("Invalid artist ID for related artists.");
                return;
            }

            const response = await fetch(
                `https://api.spotify.com/v1/artists/${artistID}/related-artists`,
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );

            if (!response.ok) {
                console.error("Error fetching related artists:", response.status);
                return;
            }

            const data = await response.json();
            setRelatedArtists(data.artists || []);
        } catch (error) {
            console.error("Error fetching related artists:", error);
        }
    };

    // Trigger search when searchInput or accessToken changes
    useEffect(() => {
        if (searchInput && accessToken) {
            search();
        }
    }, [searchInput, accessToken]);

    return (
        <div className="bg-stone-300 dark:bg-gray-900 dark:text-gray-200 min-h-screen">
            <NavBar />
            <div className="p-4 sm:p-5 lg:p-10">
                {/* Search Bar */}
                <form
                    className="shadow-md p-4 mb-5"
                    onSubmit={(e) => {
                        e.preventDefault();
                        search();
                    }}
                >
                    <label
                        htmlFor="default-search"
                        className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
                    >
                        Search
                    </label>
                    <div className="relative">
                        <input
                            type="search"
                            id="default-search"
                            className="block w-full p-4 pl-10 text-sm sm:text-base md:text-lg text-gray-900 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Search Artists"
                            value={searchInput}
                            onChange={(event) => setSearchInput(event.target.value)}
                        />
                        <button
                            type="submit"
                            className="text-white absolute right-2.5 bottom-2.5 bg-blue-700 hover:bg-stone-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-stone-600 dark:hover:bg-stone-700 dark:focus:ring-stone-800"
                        >
                            Search
                        </button>
                    </div>
                </form>

                {/* Albums Section */}
                {loading ? (
                    <div className="flex justify-center items-center mt-10">
                        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
                    </div>
                ) : (
                    <>
                        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">Albums</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {albums.map((album, i) => (
                                <Card key={i} album={album} accessToken={accessToken} />
                            ))}
                        </div>
                    </>
                )}

                {/* Related Artists Section */}
                {relatedArtists.length > 0 && (
                    <div className="mt-10">
                        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">Related Artists</h2>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                            {relatedArtists.map((artist) => (
                                <div
                                    key={artist.id}
                                    className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-4 flex flex-col items-center"
                                >
                                    <img
                                        src={artist.images[0]?.url}
                                        alt={artist.name}
                                        className="w-24 h-24 rounded-full object-cover mb-2"
                                    />
                                    <p className="text-lg font-semibold text-gray-800 dark:text-gray-200">{artist.name}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Albumpage;
