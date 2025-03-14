import React, { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import useFetchDataById from "../hooks/useFetchDataById";
import { useParams } from "react-router-dom";
import { useFormsContext } from '../hooks/useFormContext'
import { AnimatePresence, motion } from "framer-motion";
import { useScrollAnimations } from "../hooks/useScrollAnimations";
import SearchInput from "../components/formInputs/SearchInput";
import ScrollToTop from "../components/ScrollToTop";

const BankAccount = ({ languageText }) => {

    const {
        scaleDown,
        translateY,
        opacityDown,
        scaleBackground,
        fixedScaleDown,
        y
    } = useScrollAnimations();

    return (
        <div className="w-full flex flex-col items-center  gap-10">
            <div className="relative w-full h-[60vh] md:h-[80vh] flex items-center justify-center bg-cover bg-center">

                <motion.img
                    src="https://thedigitalbanker.com/wp-content/uploads/2020/07/cimb-1024x581.png"
                    className="absolute w-full h-300 m-auto left-0 right-0 object-cover brightness-30"
                    initial={{ scale: 1.1, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 1.1, opacity: 0 }}
                    transition={{ duration: 0.6 }}
                    layout
                    style={{
                        position: fixedScaleDown,
                        scale: scaleBackground,
                        opacity: opacityDown,
                        y: translateY,
                    }}
                />

                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-whitetheme/80 to-transparent z-10"></div>

                {/* Content */}
                <div className="relative z-20 text-center px-4">
                    <AnimatePresence>
                        <motion.p
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: 20, opacity: 0 }}
                            transition={{ duration: 0.8, type: "spring", stiffness: 200 }}

                            className="text-xl md:text-5xl text-redtheme">
                            All you need to know to open a Cimb bank account
                        </motion.p>
                        <motion.h1
                            initial={{ y: -20, scale: 0, opacity: 0 }}
                            animate={{ y: 0, scale: 1, opacity: 1 }}
                            exit={{ y: -20, opacity: 0 }}
                            transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
                            className="text-6xl md:text-9xl font-bold w-full mx-auto text-whitetheme">
                            Open a Bank Account
                        </motion.h1>
                    </AnimatePresence>
                </div>
            </div>

            <div className="mt-100 flex flex-col items-center  gap-10 px-10">
                <motion.h2
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ opacity: 0, scale: 0 }}
                    transition={{ duration: 0.9, delay: 0.1, type: "spring" }}
                    className="formTitle !text-5xl justify-center lg:!text-7xl !mb-0 flex flex-wrap m-auto gap-4"
                >
                    Open a Bank Account

                </motion.h2>

                <div className="flex items-center justify-center gap-10 w-full h-full px-5 py-2">
                    <div className="serviceContainer h-fit flex flex-col gap-4">
                        <h1 className="serviceContainerTitle !my-auto !text-9xl"><Icon icon="material-symbols:developer-guide-rounded" /></h1>
                    </div>
                    <div className="serviceContainer h-fit flex flex-col gap-4">
                        <h1 className="serviceContainerTitle">Guidelines</h1>
                        <div className="text-whitetheme text-start flex flex-col gap-1 text-2xl">
                            <p>1. The student must be <span className="text-red-700">over 18 years old</span></p>
                            <p>1. The student must be over 18 years old</p>
                            <p>1. The student must be over 18 years old</p>
                            <p>1. The student must be over 18 years old</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default BankAccount