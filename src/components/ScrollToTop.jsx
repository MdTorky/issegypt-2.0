import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Icon } from "@iconify/react/dist/iconify.js";

const ScrollToTop = ({ languageText }) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const toggleVisibility = () => {
            setIsVisible(window.scrollY > 300); // Show when scrolled 300px down
        };

        window.addEventListener("scroll", toggleVisibility);
        return () => window.removeEventListener("scroll", toggleVisibility);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        isVisible && (
            <motion.div
                whileHover={{ scale: 1.3 }}
                whileTap={{ scale: 0.4 }}
                transition={{ duration: 0.6, ease: "easeInOut" }}

                onClick={scrollToTop}
                className="fixed bottom-6 right-9 bg-radial from-redtheme/70 to-redtheme2/90 text-white p-3 rounded-full ring-4 ring-redtheme/70 border-3 border-whitetheme dark:border-darktheme2 cursor-pointer shadow-lg group  z-100"
            >
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

            </motion.div>
        )
    );
};

export default ScrollToTop;
