import React from 'react'
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";

const ErrorContainer = ({ error, setError }) => {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{
                opacity: 1, scale: 1,
                transition: {
                    type: "spring",
                    stiffness: 100,
                    duration: 1
                }
            }}
            exit={{
                opacity: 0, scale: 0, transition: {
                    type: "spring",
                    stiffness: 100,
                    duration: 0.5
                }
            }}
            className="flex flex-col gap-2 w-80 lg:w-90 md:text-[10px] !text-sm z-0 ring-3 rounded-xl ring-darktheme">
            <div
                className=" cursor-default flex items-center justify-between w-full h-12 sm:h-14 rounded-lg bg-darktheme2 px-[10px] py-8">
                <div className="flex gap-2 items-center ">
                    <div className="text-whitetheme text-xl bg-redtheme backdrop-blur-xl p-2 rounded-lg">
                        <Icon icon="material-symbols:nearby-error-rounded" />
                    </div>
                    <div>
                        <p className="text-whitetheme lg:text-lg">{error}</p>
                    </div>
                </div>
                {setError && <button onClick={(e) => { e.preventDefault(); setError('') }}
                    className="text-gray-300 text-xl cursor-pointer hover:bg-white/10 p-1 rounded-md transition-colors ease-linear">
                    <Icon icon="solar:close-circle-broken" />
                </button>}
            </div>
        </motion.div>
    )
}

export default ErrorContainer