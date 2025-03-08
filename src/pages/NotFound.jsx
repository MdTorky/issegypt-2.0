import React from 'react'

const NotFound = ({ languageText }) => {
    return (
        <div className='h-screen flex justify-center items-center'>
            <div className='flex flex-col leading-none text-center'>
                <h1 className='text-center md:text-[350px] text-8xl  m-0 text-darktheme dark:text-whitetheme flex items-center gap-2 !font-tanker' >4 <span className=' text-redtheme md:text-[550px] text-9xl'>0</span> 4</h1>
                <p className='text-center text-lg md:text-3xl text-darktheme dark:text-whitetheme'><span className='text-redtheme'>{languageText.WhatHere} </span>{languageText.NothingHere}</p>
            </div>
        </div>
    )
}

export default NotFound