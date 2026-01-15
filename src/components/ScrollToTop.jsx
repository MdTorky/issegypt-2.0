import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Icon } from "@iconify/react";

const ScrollToTop = ({ languageText }) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const toggleVisibility = () => {
            setIsVisible(window.scrollY > 300);
        };

        window.addEventListener("scroll", toggleVisibility);
        return () => window.removeEventListener("scroll", toggleVisibility);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.button
                    initial={{ opacity: 0, scale: 0.5, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.5, y: 20 }}
                    whileHover={{ scale: 1.1, y: -5 }}
                    whileTap={{ scale: 0.9 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    onClick={scrollToTop}
                    className="fixed bottom-6 left-6 md:bottom-8 md:left-8 z-50 p-3 md:p-4 rounded-full 
                             bg-redtheme/80 dark:bg-redtheme/70 text-whitetheme 
                             backdrop-blur-md shadow-lg shadow-redtheme/30
                             border border-whitetheme/20 dark:border-whitetheme/10
                             flex items-center justify-center group cursor-pointer"
                    aria-label="Scroll to top"
                >
                    {/* <Icon
                        icon="heroicons:arrow-up-20-solid"
                        className="w-6 h-6 md:w-7 md:h-7 transition-transform duration-300 group-hover:-translate-y-0.5"
                    /> */}

                    <motion.div
                        initial={{ y: 0 }}
                        animate={{ y: [0, -5, 0] }}
                        transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }}
                    >

                        <Icon icon="pajamas:scroll-up" />
                    </motion.div>
                    <div className="inputIconText !bg-radial from-redtheme to-redtheme !text-whitetheme">
                        {languageText.ToTop}
                    </div>
                </motion.button>
            )}
        </AnimatePresence>
    );
};

export default ScrollToTop;
