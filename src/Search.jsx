import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Search() {
    const [searchInput, setSearchInput] = useState("");
    const navigate = useNavigate();

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log("Search Input:", searchInput); // Debugging
        navigate("/Albumpage", { state: { artistName: searchInput } });
    };

    return (
        <div className='bg-stone-300 min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-10'>
            <div className='border border-slate-400 w-full max-w-4xl text-center bg-stone-100 rounded-md p-6 sm:p-10 lg:p-12'>
                <div>
                    <p className='text-3xl sm:text-4xl lg:text-5xl font-bold font-helvetica mb-4'>
                        Experience Music Like Never Before -
                    </p>
                    <p className='text-lg sm:text-xl lg:text-2xl font-helvetica mb-8'>
                        Your Personalized Spotify Web Interface Awaits!
                    </p>
                    <form className="w-full max-w-md mx-auto" onSubmit={handleSubmit}>
                        <label
                            htmlFor="default-search"
                            className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
                        >
                            Search
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                                <svg
                                    className="w-5 h-5 text-gray-500 dark:text-gray-400"
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
                                className="block w-full p-4 pl-10 text-sm sm:text-base md:text-lg text-gray-900 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Search Artists"
                                required
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
                </div>
            </div>
        </div>
    );
}

export default Search;
