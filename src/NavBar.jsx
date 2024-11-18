import React from "react";
import { useNavigate, Link } from "react-router-dom";

function NavBar() {
    const navigate = useNavigate();

    return (
        <nav className="bg-stone-700 text-white p-4 shadow-lg">
            <div className="container mx-auto flex justify-between items-center">
                {/* Previous Page Button */}
                <button
                    onClick={() => navigate(-1)}
                    className="text-white hover:text-stone-300 transition duration-200 flex items-center"
                >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
                    </svg>
                    Previous
                </button>

                {/* Home Link */}
                <Link to="/" className="text-2xl font-bold hover:text-stone-300 transition duration-200">
                    Home
                </Link>
            </div>
        </nav>
    );
}

export default NavBar;
