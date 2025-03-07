import React, { useEffect } from 'react'
import { Icon } from "@iconify/react";
import { AnimatePresence, motion } from "framer-motion";
import languageData from '../../data/language.json';
import { useLanguage } from '../../contexts/languageContext';

const SuccessMessage = ({ text, setValue }) => {
    const { language } = useLanguage();
    const languageText = languageData[language];

    useEffect(() => {
        // Close on Escape key press
        const handleKeyDown = (event) => {
            if (event.key === "Escape") {
                setValue(null);
            }
        };

        // Add event listener
        window.addEventListener("keydown", handleKeyDown);

        // Cleanup listener on unmount
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [setValue]);

    return (
        <motion.div
            initial={{ y: 1000, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 1000, opacity: 0 }}  // Ensures exit animation works
            transition={{ duration: 1.5, type: "spring", stiffness: 80 }}
            className={`fixed z-50 flex left-0 right-0 m-auto w-3/4 bottom-50 overflow-hidden bg-whitetheme max-w-96 rounded-xl shadow-xl dark:bg-gradient-to-r from-darktheme2 to-darktheme
                ${language === "ar" ? "flex-row-reverse text-right font-modernpro" : "flex-row text-left font-tanker"}
                `
            }
        >

            <svg width="16" height="96" transform={language === "ar" ? "rotate(180)" : ""} xmlns="http://www.w3.org/2000/svg">
                <path
                    d="M 8 0 
   Q 4 4.8, 8 9.6 
   T 8 19.2 
   Q 4 24, 8 28.8 
   T 8 38.4 
   Q 4 43.2, 8 48 
   T 8 57.6 
   Q 4 62.4, 8 67.2 
   T 8 76.8 
   Q 4 81.6, 8 86.4 
   T 8 96 
   L 0 96 
   L 0 0 
   Z"
                    fill="var(--redtheme)"
                    stroke="var(--redtheme)"
                    strokeWidth="2"
                    strokeLinecap="round"
                ></path>
            </svg>
            <div className="mx-2.5 overflow-hidden w-full">
                <p className="mt-1.5 text-xl font-bold text-redtheme leading-8 overflow-hidden text-ellipsis whitespace-nowrap">
                    {languageText.Success}
                </p>
                <p className="overflow-hidden leading-5 break-all text-zinc-400 max-h-10">
                    {text}
                </p>
            </div>
            <button
                onClick={() => setValue(null)}
                className="w-16 flex items-center justify-center cursor-pointer focus:outline-none text-2xl text-redtheme hover:scale-120 transition duration-300">
                <Icon icon="solar:close-circle-broken" />
            </button>
        </motion.div>
    );
}

export default SuccessMessage;
