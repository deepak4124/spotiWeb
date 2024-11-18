import React from "react";

function Card({ album }) {
    return (
        <div className="hover:scale-105 scale-100 relative flex flex-col my-4 bg-white shadow-md border border-slate-200 rounded-lg w-full sm:w-60 md:w-64 lg:w-72 xl:w-80 hover:opacity-90 duration-300">
            <div className="relative h-48 sm:h-52 md:h-60 lg:h-64 xl:h-72 m-4 overflow-hidden text-white rounded-md">
                <img src={album.images[0]?.url} alt={album.name} className="w-full h-full object-cover" />
            </div>
            <div className="px-4 pb-4">
                <h6 className="mb-2 text-slate-800 text-base sm:text-lg md:text-xl font-semibold">
                    {album.name}
                </h6>
            </div>
        </div>
    );
}

export default Card;
