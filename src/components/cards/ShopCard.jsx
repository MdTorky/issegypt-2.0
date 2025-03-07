import React from 'react'
import { Icon } from "@iconify/react";
import shirt from "../../assets/img/Front.png"
import { Link } from 'react-router-dom';


const ShopCard = ({ product, language, languageText }) => {


    const handleShare = async (e) => {
        e.stopPropagation();
        e.preventDefault();
        if (navigator.share) {
            try {
                await navigator.share({
                    title: "Check this ISS EGYPT Product Out!",
                    text: "Have a look at this amazing product!",
                    url: window.location.href, // Current page URL
                });
                console.log("Content shared successfully!");
            } catch (error) {
                console.error("Error sharing content:", error);
            }
        } else {
            alert("Web Share API not supported in your browser.");
        }
    };

    return (
        <Link to={`/product/${product._id}`} className='bg-whitetheme/40 dark:bg-darktheme/50 shadow-2xl flex flex-col gap-5  p-3 rounded-2xl !rounded-tr-4xl !rounded-bl-4xl ring-4 ring-whitetheme/40 dark:ring-darktheme/80 hover:scale-105 transition-all duration-500 ease-in-out hover:ring-redtheme group/item'>
            <div className='size-70 bg-redtheme2/0 rounded-full flex relative items-center m-auto'>
                <img src={product.pFrontImage} alt="" className='absolute flex w-50 m-auto bottom-0 left-0 right-0 group-hover/item:scale-130 group-hover/item:-translate-y-10 transition-all duration-500 ease-in-out' />
            </div>
            <div className='text-start px-2 flex flex-col '>
                <h1 className='text-darktheme dark:text-whitetheme2 text-2xl '>{language === "en" ? product.pTitle : product.pArabicTitle}</h1>
                <p className='text-gray-500 text-sm font-light '>{language === "en" ? product.pDescription : product.pArabicDescription}</p>
            </div>

            <div className='flex justify-between items-center px-2'>
                <p className='text-redtheme text-3xl'>{product.pPrice} {languageText.RM}</p>

                <div className='flex gap-4'>
                    <button onClick={(e) => { e.stopPropagation(); e.preventDefault(); window.open(product.pModel, "_blank") }} className='bg-whitetheme2 dark:bg-darktheme2 dark:text-whitetheme p-3 shadow-[0px_4px_16px_rgba(17,17,26,0.1),_0px_8px_24px_rgba(17,17,26,0.1),_0px_16px_56px_rgba(17,17,26,0.1)] rounded-full ring-5 ring-whitetheme dark:ring-darktheme cursor-pointer text-lg hover:scale-80 transition-all duration-500 ease-in-out group relative'>
                        <Icon icon="material-symbols:3d-rotation-rounded" />
                        <div className="inputIconText  bg-whitetheme2 dark:bg-darktheme2 !text-darktheme2 dark:!text-whitetheme ">
                            {languageText.DModel}
                        </div>
                    </button>
                    <button onClick={(e) => handleShare(e)} className='bg-whitetheme2 dark:bg-darktheme2 dark:text-whitetheme p-3 shadow-[0px_4px_16px_rgba(17,17,26,0.1),_0px_8px_24px_rgba(17,17,26,0.1),_0px_16px_56px_rgba(17,17,26,0.1)] rounded-full ring-5 ring-whitetheme dark:ring-darktheme cursor-pointer text-lg hover:scale-80 transition-all duration-500 ease-in-out group relative'>
                        <Icon icon="fluent:share-16-filled" />
                        <div className="inputIconText bg-whitetheme2 dark:bg-darktheme2 !text-darktheme2 dark:!text-whitetheme ">
                            {languageText.Share}

                        </div>
                    </button>
                </div>
            </div>

        </Link>
    )
}

export default ShopCard