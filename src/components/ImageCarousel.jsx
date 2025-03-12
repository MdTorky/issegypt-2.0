import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Icon } from "@iconify/react";

const ImageCarousel = ({ images, language }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    // Function to go to the next slide
    const nextSlide = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === images.length - 1 ? 0 : prevIndex + 1
        );
    };

    // Function to go to the previous slide
    const prevSlide = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === 0 ? images.length - 1 : prevIndex - 1
        );
    };

    // const slide =(index)=>{
    // }

    return (

        <motion.div
            variants={{
                hidden: { y: -300, opacity: 0 },
                visible: { y: 0, opacity: 1, transition: { type: "spring" } },
            }}
            transition={{ duration: 0.5 }}
            className="flex flex-col justify-center items-center m-auto group cursor-pointer">

            {/* <h1 className="text-center text-4xl group-hover:text-redtheme duration-500 text-darktheme dark:text-whitetheme">{images[currentIndex]?.title}</h1> */}
            <div className="relative w-[300px] h-[300px] md:w-[500px] m-auto md:h-[500px] overflow-hidden shadow-[0_3px_10px_rgb(0,0,0,0.2)]  rounded-lg ring-4 ring-darktheme lg:ring-darktheme dark:ring-gray-500 duration-500 lg:group-hover:ring-redtheme flex justify-center items-center">
                {/* Slides */}
                <AnimatePresence >
                    <motion.div
                        key={images[currentIndex]?.id}
                        className="absolute inset-0 flex items-center justify-center shadow-[0_3px_10px_rgb(0,0,0,0.2)]  p-4 lg:group-hover:p-0 duration-500"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{
                            duration: 0.3,
                            ease: "easeInOut",
                        }}
                    >
                        <img
                            src={images[currentIndex]?.src}
                            alt={images[currentIndex]?.title}
                            className="w-full h-full object-cover rounded-lg shadow-[0_3px_10px_rgb(0,0,0,0.2)] "
                        />
                        {/* Shimmer Effect */}
                        <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/70 to-transparent z-10"
                            initial={{ x: "-100%", y: "0%" }}
                            whileHover={{ x: "100%", y: "0%" }}
                            exit={{ x: "-100%", y: "0%" }}
                            transition={{ duration: 1.5, ease: "linear" }}
                        />
                        <div className="absolute bottom-0 lg:opacity-0 lg:group-hover:opacity-100 transition-all duration-300 ease-in-out left-0 right-0 flex m-auto w-full h-100 bg-gradient-to-t from-darktheme2 via-darktheme2/80 to-transparent  rounded-lg " />
                    </motion.div>
                </AnimatePresence>

                {/* Navigation Arrows */}
                <motion.button
                    whileHover={{
                        scale: 1.1
                    }}
                    whileTap={{
                        scale: 0.8
                    }}
                    transition={{
                        duration: 0.5, ease: "linear", type: "spring"
                    }}
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 lg:bg-darktheme dark:bg-whitetheme lg:text-whitetheme dark:text-darktheme  lg:group-hover:bg-whitetheme bg-whitetheme text-redtheme lg:group-hover:text-redtheme rounded-full p-2 cursor-pointer ring-4 lg:ring-0 ring-darktheme lg:group-hover:ring-4 z-10"

                    onClick={language === "en" ? prevSlide : nextSlide}
                >
                    <Icon icon='solar:map-arrow-left-bold-duotone' />
                </motion.button>
                <motion.button
                    whileHover={{
                        scale: 1.1
                    }}
                    whileTap={{
                        scale: 0.8
                    }}
                    transition={{
                        duration: 0.5, ease: "linear", type: "spring"
                    }}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 lg:bg-darktheme dark:bg-whitetheme lg:text-whitetheme dark:text-darktheme  lg:group-hover:bg-whitetheme bg-whitetheme text-redtheme lg:group-hover:text-redtheme rounded-full p-2 cursor-pointer ring-4 lg:ring-0 ring-darktheme lg:group-hover:ring-4 z-10"
                    onClick={language === "en" ? nextSlide : prevSlide}

                >
                    <Icon icon='solar:map-arrow-right-bold-duotone' />
                </motion.button>

                {/* Dots Indicator */}
                <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
                    {images.map((_, index) => (
                        <motion.div
                            key={index}
                            className={`w-4 h-4 rounded-full ${index === currentIndex ? "scale-120 bg-redtheme" : "bg-darktheme group-hover:bg-whitetheme duration-300"
                                }`}
                            layoutId={`dot-${index}`}
                            onClick={() => setCurrentIndex(index)}
                        ></motion.div>
                    ))}
                </div>
                <h1 className={` absolute bottom-10 lg:opacity-0 lg:group-hover:opacity-100 text-4xl lg:text-6xl w-[60%] text-center lg:text-start group-hover:ring-0 md:lg:group-hover:text-whitetheme text-whitetheme z-20 ${language === "en" ? " lg:left-10" : " lg:right-10"}`}>{language === "en" ? images[currentIndex]?.title : images[currentIndex]?.aTitle}</h1>
            </div>

            <div className="absolute bottom-[17%] opacity-0 group-hover:opacity-100 transition-all duration-300 ease-in-out left-0 right-0 flex m-auto w-full h-100 bg-gradient-to-t from-darktheme2 via-darktheme2/90 to-transparent  rounded-lg " />

            {/* <div className="duration-500 -translate-y-35 relative m-auto w- lg:w-120 rounded-t-lg  text-whitetheme lg:text-darktheme lg:dark:text-whitetheme z-20"> */}



            {/* <p className=" px-5 lg:hidden absolute flex lg:group-hover:flex w-full font-light text-sm lg:text-lg bg-redtheme lg:group-hover:rounded-b-lg rounded-b-lg !text-gray-300 lg:group-hover:border-b-3 lg:group-hover:border-r-3 lg:group-hover:border-l-3 lg:border-0 border-b-3 border-r-3 border-l-3 border-slate-200 ">Lorem ipsum dolor, sit amet consectetur adipisicing elit. Atque quis vero molestias tempora provident placeat fuga alias aspernatur architecto repellat.</p> */}

            {/* </div> */}
            {/* <div className="duration-500 -translate-y-35 lg:translate-y-0 lg:group-hover:-translate-y-43 relative m-auto w-[95%] lg:w-120 rounded-t-lg lg:group-hover:text-whitetheme text-whitetheme lg:text-darktheme lg:dark:text-whitetheme lg:group-hover:bg-redtheme  bg-redtheme lg:bg-transparent">

                <h1 className="px-5 text-xl lg:text-3xl group-hover:ring-0 lg:group-hover:rounded-t-lg rounded-t-lg lg:border-0 border-t-3 border-r-3 border-l-3 lg:group-hover:border-t-3 lg:group-hover:border-r-3 lg:group-hover:border-l-3 border-slate-200 dark:text-whitetheme ">{language === "en" ? images[currentIndex]?.title : images[currentIndex]?.aTitle}</h1>

                <p className=" px-5 lg:hidden absolute flex lg:group-hover:flex w-full font-light text-sm lg:text-lg bg-redtheme lg:group-hover:rounded-b-lg rounded-b-lg !text-gray-300 lg:group-hover:border-b-3 lg:group-hover:border-r-3 lg:group-hover:border-l-3 lg:border-0 border-b-3 border-r-3 border-l-3 border-slate-200 ">Lorem ipsum dolor, sit amet consectetur adipisicing elit. Atque quis vero molestias tempora provident placeat fuga alias aspernatur architecto repellat.</p>

            </div> */}
        </motion.div>
    );
};

export default ImageCarousel;