import React, { useEffect } from 'react'
import { usePopup } from "../../contexts/PopupContext";

const PopUpCard = ({ title, atitle, desc, language }) => {
    const { hidePopup } = usePopup(); // 
    return (
        <div className='fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-[9999]'>
            <div
                className="cursor-pointer group p-5 duration-1000 hover:duration-1000 w-64 h-64 bg-neutral-800 rounded-xl absolute top-0 bottom-0 flex m-auto left-0 right-0 z-[9999]"
            >
                {/* <div
                    className="group-hover:-top-3 bg-transparent -top-12 -left-12 absolute shadow-yellow-800 shadow-inner rounded-xl transition-all ease-in-out group-hover:duration-1000 duration-1000 w-24 h-24"
                ></div>
                <div
                    className="group-hover:top-60 bg-transparent top-44 left-14 absolute shadow-red-800 shadow-inner rounded-xl transition-all ease-in-out group-hover:duration-1000 duration-1000 w-24 h-24"
                ></div>
                <div
                    className="group-hover:-left-12 bg-transparent top-24 left-56 absolute shadow-sky-800 shadow-inner rounded-xl transition-all ease-in-out group-hover:duration-1000 duration-1000 w-24 h-24"
                ></div>
                <div
                    className="group-hover:-top-44 bg-transparent top-12 left-12 absolute shadow-red-800 shadow-inner rounded-xl transition-all ease-in-out group-hover:duration-1000 duration-1000 w-12 h-12"
                ></div>
                <div
                    className="group-hover:left-44 bg-transparent top-12 left-12 absolute shadow-green-800 shadow-inner rounded-xl transition-all ease-in-out group-hover:duration-1000 duration-1000 w-44 h-44"
                ></div>
                <div
                    className="group-hover:-left-2 bg-transparent -top-24 -left-12 absolute shadow-sky-800 shadow-inner rounded-xl transition-all ease-in-out group-hover:duration-1000 duration-1000 w-64 h-64"
                ></div>
                <div
                    className="group-hover:top-44 bg-transparent top-24 left-12 absolute shadow-sky-500 shadow-inner rounded-xl transition-all ease-in-out group-hover:duration-1000 duration-1000 w-4 h-4"
                ></div> */}
                <div
                    className="w-full h-full shadow-xl shadow-neutral-900 p-3 bg-neutral-600 opacity-50 rounded-xl flex-col gap-2 flex justify-center"
                >
                    {/* <span className="text-neutral-50 font-bold text-xl italic">{language === "en" ? title : atitle}</span> */}
                    <p className="text-whitetheme">
                        {desc}
                    </p>
                    <button
                        onClick={hidePopup}
                        className="absolute top-2 right-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center font-bold shadow-md hover:bg-red-700 transition cursor-pointer"
                    >
                        ✖
                    </button>
                </div>
            </div>
        </div>

    )

    //     return (
    //   <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-[9999]">
    //     <div className="relative group overflow-hidden p-5 w-64 h-64 bg-neutral-800 rounded-xl shadow-xl shadow-neutral-900 flex flex-col gap-2 justify-center">
    //       <button
    //         onClick={hidePopup}
    //         className="absolute top-2 right-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center font-bold shadow-md hover:bg-red-700 transition"
    //       >
    //         ✖
    //       </button>
    //       <span className="text-neutral-50 font-bold text-xl italic">
    //         {language === "en" ? title : atitle}
    //       </span>
    //       <p className="text-neutral-300">{desc}</p>
    //     </div>
    //   </div>
    // );
}

export default PopUpCard