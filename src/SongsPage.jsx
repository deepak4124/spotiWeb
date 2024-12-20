import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import NavBar from "./NavBar"; // Import NavBar

function SongsPage() {
    const [songs, setSongs] = useState([]);
    const [albumDetails, setAlbumDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const location = useLocation();
    const { albumId, accessToken } = location.state || {};

    useEffect(() => {
        const fetchAlbumDetails = async () => {
            if (!albumId || !accessToken) {
                setError("Missing album ID or access token.");
                setLoading(false);
                return;
            }

            try {
                // Fetch album details
                const albumResponse = await fetch(`https://api.spotify.com/v1/albums/${albumId}`, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                });

                if (!albumResponse.ok) {
                    throw new Error(`Failed to fetch album details. Status: ${albumResponse.status}`);
                }

                const albumData = await albumResponse.json();
                setAlbumDetails(albumData);

                // Fetch the songs in the album
                const tracksResponse = await fetch(`https://api.spotify.com/v1/albums/${albumId}/tracks`, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                });

                if (!tracksResponse.ok) {
                    throw new Error(`Failed to fetch album tracks. Status: ${tracksResponse.status}`);
                }

                const tracksData = await tracksResponse.json();
                setSongs(tracksData.items);
            } catch (error) {
                console.error("Error fetching album details or songs:", error);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchAlbumDetails();
    }, [albumId, accessToken]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center h-screen">
                <p className="text-red-500 text-lg">{error}</p>
            </div>
        );
    }

    if (!albumDetails) {
        return (
            <div className="flex justify-center items-center h-screen">
                <p className="text-gray-700 text-lg">No album details found.</p>
            </div>
        );
    }

    return (
        <div className="bg-gradient-to-b from-gray-100 to-stone-300 min-h-screen">
            <NavBar />
            <div className="p-6 md:p-12">
                <div className="mb-8 flex items-center bg-white shadow-lg rounded-lg p-4 md:p-6">
                    <img
                        src={albumDetails?.images?.[0]?.url}
                        alt={albumDetails?.name}
                        className="w-24 h-24 md:w-32 md:h-32 mr-4 rounded-lg"
                    />
                    <div>
                        <h1 className="text-2xl md:text-4xl font-bold text-gray-800">{albumDetails?.name}</h1>
                        <p className="text-lg text-gray-600 mt-1">{albumDetails?.artists?.[0]?.name}</p>
                    </div>
                </div>
                <ul className="space-y-4">
                    {songs.map((song, index) => (
                        <li
                            key={index}
                            className="p-4 bg-white shadow-md rounded-md flex flex-col md:flex-row items-center hover:bg-blue-50 transition duration-200"
                        >
                            <div className="flex-1">
                                <p className="font-semibold text-lg md:text-xl text-gray-800">{song.name}</p>
                                <p className="text-sm text-gray-500 mt-1">Track {index + 1}</p>
                            </div>
                            {song.preview_url ? (
                                <audio controls className="mt-2 md:mt-0 md:ml-4 w-full md:w-auto">
                                    <source src={song.preview_url} type="audio/mpeg" />
                                    Your browser does not support the audio element.
                                </audio>
                            ) : (
                                <p className="text-sm text-gray-500 mt-2 md:mt-0 md:ml-4">No preview available</p>
                            )}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default SongsPage;
