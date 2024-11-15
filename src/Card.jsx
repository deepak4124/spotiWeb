import React from "react";

function Card({album}){
    return (
        <div className="hover:scale-[110%] scale-100 relative flex flex-col my-6 bg-white shadow-sm border border-slate-200 rounded-lg w-96 shadow shadow-2xl hover:opacity-70 duration-300">
          <div className="relative h-70 m-5 overflow-hidden text-white rounded-md">
            <img src={album.images[0]?.url} alt={album.name} className="w-full h-full object-cover " />
          </div>
          <div className="p-4">
            <h6 className="mb-2 text-slate-800 text-xl font-semibold">
              {album.name}
            </h6>
          </div>
        </div>
      );
    }

export default Card
