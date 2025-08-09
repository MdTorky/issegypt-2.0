import { useEffect, useState } from "react";
import eGPT from '../assets/img/eGPT logo 2.png'
import { Icon } from "@iconify/react"
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";


export default function FeaturePopup() {
    const [isVisible, setIsVisible] = useState(false); // Always visible for testing

    // Disable this whole useEffect block temporarily
    useEffect(() => {
        const hasSeenPopup = localStorage.getItem("hasSeenFeaturePopup");

        if (!hasSeenPopup) {
            setIsVisible(true);
            localStorage.setItem("hasSeenFeaturePopup", "true");
        }
    }, []);

    useEffect(() => {
        if (isVisible) {
            confetti({
                particleCount: 500,
                spread: 500,
                origin: { y: 0.5 },
            });
        }
    }, [isVisible]);

    const closePopup = () => {
        setIsVisible(false);
    };

    if (!isVisible) return null;

    return (
        <>
            {/* Arrow to chat button */}
            <div className="fixed bottom-20 md:bottom-25 right-0 md:right-2 z-110 flex flex-col items-center animate-bounce">
                <span className="bg-yellow-600 text-whitetheme text-md rounded px-2 py-1 mt-1 shadow">
                    Try E-GPT Beta!
                </span>
                <Icon icon="pepicons-print:arrow-down" className="text-yellow-600 text-7xl" />

            </div>

            <AnimatePresence>

                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">


                    <motion.div
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8, y: 50 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                        className="[--shadow:rgba(60,64,67,0.3)_0_1px_2px_0,rgba(60,64,67,0.15)_0_2px_6px_2px] w-4/5 xl:w-2/5 2xl:w-1/3 h-auto rounded-2xl bg-white/80 [box-shadow:var(--shadow)]"
                    >
                        <div
                            className="flex flex-col items-center justify-between pt-9 px-6 pb-6 relative"
                        >
                            <span className="relative mx-auto -mt-40 mb-5">
                                <img src={eGPT} className="w-50" />
                            </span>

                            <h5 className="flex items-center gap-3 text-3xl text-center font-semibold mb-2 text-yellow-600">
                                Meet E-GPT!
                                {/* <Icon icon="fluent:bot-sparkle-16-filled" /> */}
                            </h5>

                            <p className="w-full mb-4 text-lg text-justify">
                                Your smart virtual assistant, powered by the latest GPT models, is here to help you with everything on our gateway — from answering questions and offering guidance, to helping you navigate UTM & ISS Egypt with ease. <span className="text-yellow-600 font-bold">(It's still BETA)</span>
                            </p>
                            <button
                                className=" font-semibold right-6 bottom-6 cursor-pointer py-2 px-8 w-max break-keep text-sm rounded-lg transition-colors text-whitetheme hover:text-whitetheme2 bg-yellow-600 hover:bg-yellow-700 duration-300"
                                type="button"
                                onClick={closePopup}
                            >
                                Try It
                            </button>
                        </div>
                    </motion.div>
                </div>
            </AnimatePresence>
        </>
    );
}
