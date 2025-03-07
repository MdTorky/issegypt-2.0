import React from 'react'
// import logo from '../../assets/img/logo.png'
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";

const Loader = ({ text }) => {
    return (
        /* From Uiverse.io by devAaus */
        <div className="flex-col gap-4 w-full flex items-center justify-center">
            <div
                className="w-40 h-40 border-7 border-transparent text-darktheme text-4xl animate-spin flex items-center justify-center border-t-redtheme rounded-full">
                <div
                    className="w-32 h-32 border-7 border-transparent text-yellow-600 text-6xl animate-spin flex items-center justify-center dark:border-t-whitetheme border-t-darktheme rounded-full"
                ><Icon icon="icomoon-free:spinner9" /></div>
            </div>
            {text && (
                <motion.div
                    className='text-redtheme text-2xl'
                    animate={{ scale: [1, 1.3, 1] }} // Scale up and down
                    transition={{ duration: 1, repeat: Infinity, ease: "easeInOut", }} // Loop forever
                >
                    {text}...
                </motion.div>
            )}

        </div>

    )
}

export default Loader