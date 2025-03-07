import React, { useState, useRef } from 'react';
import logo from '../assets/img/logo.png'
import { Icon } from "@iconify/react";
import { motion, AnimatePresence } from "motion/react"
import { Link, useLocation } from 'react-router-dom';
import buttonVariant from "../components/animations/ButtonVariant";
import { useAuthContext } from '../hooks/useAuthContext';

const BottomNavbar = ({ languageText, language }) => {
    const location = useLocation();
    const { user } = useAuthContext();


    const [isOpen, setIsOpen] = useState(true);
    const toggleNavbar = () => {
        setIsOpen(!isOpen);
    };

    const navVariant = {
        hidden: {
            scale: 0,
            opacity: 0,
        },
        visible: {
            scale: 1,
            opacity: 1,

            transition: {
                type: 'spring',
                duration: 1,
                ease: "easeInOut",
                when: "beforeChildren",
                staggerChildren: 0.1
            }
        },
        exit: {
            scale: 0,
            opacity: 0,
            transition: {
                ease: "linear",
                duration: 0.3,
            }
        },

    }



    const childVariant = {
        hidden: {
            opacity: 0,
            y: -50,
        },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 1,
                type: "spring",
                stiffness: 120,
            }
        },

        hover: {

        }

    }



    return (
        (
            <div className="relative">
                <motion.button
                    variants={buttonVariant}
                    initial='hidden'
                    animate="visible"
                    whileTap="tap"
                    whileHover="hover"
                    drag
                    onClick={toggleNavbar}
                    className={`generalButton group !bg-gradient-to-r !from-darktheme !to-darktheme2 bottom-17 fixed m-auto w-fit !right-0 !left-0 z-100 ${isOpen ? 'hidden' : ''}`}
                >
                    <Icon icon="solar:menu-dots-circle-broken" />

                    <div className="generalButtonText bg-darktheme ">{languageText.Open}</div>

                </motion.button>
                <AnimatePresence>
                    {isOpen && (
                        <div className="relative cursor-move">


                            <motion.div drag
                                variants={navVariant}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                                className="flex justify-center gap-4 items-center px-4 py-2 bg-gradient-to-r from-darktheme/60 to-darktheme2/60 rounded-[10px] fixed bottom-16 left-0 right-0 m-auto w-fit text-4xl ring-2 ring-whitetheme z-100"
                            >



                                <Link to="/">
                                    <motion.div variants={childVariant}
                                        whileHover={{
                                            scale: 1.05,
                                            background: "var(--whitetheme)",
                                            color: "var(--darktheme)",
                                            transition: {
                                                type: "spring",
                                                duration: 0.8
                                            }
                                        }}
                                        whileTap={{
                                            scale: 0.5,
                                            transition: {
                                                type: "spring",
                                                duration: 0.8
                                            }
                                        }}
                                        className={`bottomNavBar group ${location.pathname === '/' ? ' active ' : ''}`}
                                    >
                                        <Icon icon={`${location.pathname === '/' ? 'solar:home-2-bold' : 'solar:home-2-outline'}`} />
                                        <div className="bottomNavBarLink">{languageText.Home}</div>
                                    </motion.div>
                                </Link>


                                <Link to="/services">
                                    <motion.div variants={childVariant}
                                        whileHover={{
                                            scale: 1.05,
                                            background: "var(--whitetheme)",
                                            color: "var(--darktheme)",
                                            transition: {
                                                type: "spring",
                                                duration: 0.8
                                            }
                                        }}
                                        whileTap={{
                                            scale: 0.5,
                                            transition: {
                                                type: "spring",
                                                duration: 0.8
                                            }
                                        }}
                                        className={`bottomNavBar group ${language === 'ar' ? "ml-10" : "mr-10"} ${location.pathname === '/services' ? '' : ''}`}
                                    >
                                        <Icon icon={location.pathname === '/services' ? 'ri:service-fill' : 'ri:service-line'} />
                                        <div className="bottomNavBarLink z-15">{languageText.HelpingHand}</div>
                                    </motion.div>
                                </Link>



                                <motion.img variants={childVariant} src={logo} alt="Logo" className=" w-[35%] absolute bottom-0 m-auto left-0 right-0 z-10" />
                                {/* {user && <Link to='/adminDashboard'><motion.img variants={childVariant} src={logo} alt="Logo" className=" w-[35%] absolute bottom-0 m-auto left-0 right-0 z-10" />  </Link>} */}

                                <Link to="/about">
                                    <motion.div variants={childVariant}
                                        whileHover={{
                                            scale: 1.05,
                                            background: "var(--whitetheme)",
                                            color: "var(--darktheme)",
                                            transition: {
                                                type: "spring",
                                                duration: 0.8
                                            }
                                        }}
                                        whileTap={{
                                            scale: 0.5,
                                            transition: {
                                                type: "spring",
                                                duration: 0.8
                                            }
                                        }}
                                        className={`bottomNavBar group ${language === 'ar' ? "mr-10" : "ml-10"} ${location.pathname === '/about' ? '' : ''}`}
                                    >
                                        <Icon icon={location.pathname === '/about' ? 'fluent:people-20-filled' : 'fluent:people-20-regular'} />
                                        <div className="bottomNavBarLink">{languageText.AboutUs}</div>
                                    </motion.div>
                                </Link>
                                <Link to="/gallery">

                                    <motion.div variants={childVariant}
                                        whileHover={{
                                            scale: 1.05,
                                            background: "var(--whitetheme)",
                                            color: "var(--darktheme)",
                                            transition: {
                                                type: "spring",
                                                duration: 0.8
                                            }
                                        }}
                                        whileTap={{
                                            scale: 0.5,
                                            transition: {
                                                type: "spring",
                                                duration: 0.8
                                            }
                                        }}
                                        className={`bottomNavBar group ${location.pathname === '/gallery' ? '' : ''}`}
                                    >
                                        <Icon icon={location.pathname === '/gallery' ? "solar:gallery-wide-bold" : 'solar:gallery-wide-outline'} />
                                        <div className="bottomNavBarLink">{languageText.Gallery}</div>
                                    </motion.div>
                                </Link>
                                <motion.div
                                    className={`activeIndicator top-[0px] rotate-180 !-z-0 ${['/', '/services', '/about', '/gallery'].includes(location.pathname) ? '' : 'hidden'}`}
                                    animate={{
                                        x:
                                            location.pathname === '/' ? (language === "en" ? 142 : -142) :
                                                location.pathname === '/services' ? (language === "en" ? 75 : -75) :
                                                    location.pathname === '/about' ? (language === "en" ? -75 : 75) :
                                                        location.pathname === '/gallery' ? (language === "en" ? -142 : 142) :
                                                            0,
                                    }}
                                    transition={{ type: "spring", stiffness: 200, damping: 20 }}
                                />

                                <motion.div
                                    className={`activeIndicator bottom-[0px] ${['/', '/services', '/about', '/gallery'].includes(location.pathname) ? '' : 'hidden'}`}
                                    animate={{
                                        x:
                                            location.pathname === '/' ? (language === "en" ? -142 : 142) :
                                                location.pathname === '/services' ? (language === "en" ? -75 : 75) :
                                                    location.pathname === '/about' ? (language === "en" ? 75 : -75) :
                                                        location.pathname === '/gallery' ? (language === "en" ? 142 : -142) :
                                                            0,
                                    }}
                                    transition={{ type: "spring", stiffness: 200, damping: 20 }}
                                />



                            </motion.div>

                            {/* <div className="fixed right-175 bottom-17 z-100"> */}
                            <div className="fixed right-0 w-fit left-0 m-auto bottom-10  z-100">

                                <motion.button
                                    onClick={toggleNavbar}
                                    initial='hidden'
                                    animate="visible"
                                    exit="exit"
                                    transition="transition"
                                    whileHover="hover"
                                    whileTap="tap"
                                    variants={buttonVariant}
                                    className="menuButton group"
                                >
                                    <Icon icon="solar:close-circle-broken" />
                                    <div
                                        className="generalButtonText bg-redtheme"
                                    >
                                        {languageText.Close}
                                    </div>
                                </motion.button>
                            </div>

                        </div>
                    )}
                </AnimatePresence>
            </div>
        )
    );
};

export default BottomNavbar;