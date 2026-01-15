import { Icon } from "@iconify/react";
import { AnimatePresence, motion } from "motion/react";
import { useAuthContext } from '../hooks/useAuthContext';
import { useLogout } from '../hooks/useLogout';
import { Link } from "react-router-dom";
import { useState, useEffect } from 'react';

const Navbar = ({ toggleDarkMode, darkMode, toggleLanguage, language, languageText }) => {
    const { user } = useAuthContext();
    const [scrolled, setScrolled] = useState(false);

    // Handle scroll effect for glassmorphism intensity
    useEffect(() => {
        const handleScroll = () => {
            const isScrolled = window.scrollY > 20;
            setScrolled(isScrolled);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navVariant = {
        hidden: { y: -100, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { type: "spring", stiffness: 100, damping: 20, mass: 1 }
        }
    };

    const logoVariant = {
        hover: { scale: 1.05, transition: { type: "spring", stiffness: 400 } },
        tap: { scale: 0.95 }
    };

    return (
        <motion.nav
            variants={navVariant}
            initial="hidden"
            animate="visible"
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 pointer-events-none flex justify-center pt-4 md:pt-6`}
        >
            <div className={`
                pointer-events-auto
                relative flex items-center justify-between 
                w-[95%] md:w-[90%] max-w-7xl
                py-3 px-4 md:px-6 rounded-2xl
                transition-all duration-500
                ${scrolled
                    ? 'bg-whitetheme/70 dark:bg-darktheme/70 backdrop-blur-xl shadow-lg border border-whitetheme2/50 dark:border-darktheme2/50'
                    : 'bg-transparent backdrop-blur-sm'
                }
            `}>
                {/* Logo Section */}
                <motion.div
                    variants={logoVariant}
                    whileHover="hover"
                    whileTap="tap"
                    className="flex items-center gap-2 cursor-pointer"
                >
                    <h1 className="text-3xl md:text-5xl transition-colors duration-300">
                        <span className="font-tanker text-darktheme dark:text-whitetheme">{languageText.ISS}</span>
                        <span className="font-tanker text-redtheme"> {languageText.EGYPT}</span>
                    </h1>
                </motion.div>

                {/* Controls Section */}
                <div className="flex items-center gap-3 md:gap-4">

                    {/* Admin Dashboard Link */}
                    <AnimatePresence>
                        {user && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                            >
                                <Link to="/adminDashboard">
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 bg-redtheme text-whitetheme rounded-xl text-sm md:text-base font-medium shadow-md hover:shadow-redtheme/20 transition-all"
                                    >
                                        <Icon icon="eos-icons:admin" className="text-lg" />
                                        <span className="hidden md:block font-tanker tracking-wide">{languageText.Admin}</span>
                                    </motion.button>
                                </Link>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Separator */}
                    <div className="h-6 w-[1px] bg-gray-300 dark:bg-gray-700 mx-1 md:mx-2" />

                    {/* Language Switch */}
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={toggleLanguage}
                        className="relative p-2 rounded-full bg-whitetheme/50 dark:bg-darktheme2/50 hover:bg-whitetheme dark:hover:bg-darktheme2 transition-colors border border-gray-200 dark:border-gray-700 shadow-sm"
                        aria-label="Toggle Language"
                    >
                        <AnimatePresence mode="wait" initial={false}>
                            <motion.div
                                key={language}
                                initial={{ y: -20, opacity: 0, rotate: -90 }}
                                animate={{ y: 0, opacity: 1, rotate: 0 }}
                                exit={{ y: 20, opacity: 0, rotate: 90 }}
                                transition={{ duration: 0.2 }}
                            >
                                {language === "ar" ? (
                                    <Icon icon="circle-flags:ps" className="w-6 h-6 md:w-7 md:h-7" />
                                ) : (
                                    <Icon icon="circle-flags:uk" className="w-6 h-6 md:w-7 md:h-7" />
                                )}
                            </motion.div>
                        </AnimatePresence>
                    </motion.button>

                    {/* Dark Mode Switch */}
                    <motion.button
                        whileHover={{ scale: 1.1, rotate: 15 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={toggleDarkMode}
                        className="relative p-2 rounded-full bg-whitetheme/50 dark:bg-darktheme2/50 hover:bg-whitetheme dark:hover:bg-darktheme2 transition-colors border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden"
                        aria-label="Toggle Dark Mode"
                    >
                        <AnimatePresence mode="wait" initial={false}>
                            <motion.div
                                key={darkMode ? "dark" : "light"}
                                initial={{ y: -20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                exit={{ y: 20, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                            >
                                {darkMode ? (
                                    <Icon icon="mingcute:moon-fog-fill" className="w-6 h-6 md:w-7 md:h-7 text-whitetheme" />
                                ) : (
                                    <Icon icon="mingcute:sun-fog-fill" className="w-6 h-6 md:w-7 md:h-7 text-orange-400" />
                                )}
                            </motion.div>
                        </AnimatePresence>
                    </motion.button>
                </div>
            </div>
        </motion.nav>
    );
};

export default Navbar;
