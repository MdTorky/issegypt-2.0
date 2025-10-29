import React from 'react';
import { Icon } from "@iconify/react";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate } from 'react-router-dom';
const CircularButton = ({ icon, text, type, aText, link, language, operation }) => {
    const InputChildVariants = {
        hidden: { opacity: 0, y: -50 },
        visible: {
            opacity: 1, y: 0,
            transition: {
                type: "spring",
                stiffness: 100,
                staggerChildren: 0.3
            }
        },
        exit: { opacity: 0, y: 50 }
    };

    const navigate = useNavigate();

    const handleClick = () => {
        if (type === "Website" || type === "YouTube" || type === "Instagram" || type === "Download" || type === "Link" || type === "IOS" || type === "Android" || type === "ImageLink") {
            window.open(link, "_blank");
        } else if (type === "Location") {
            window.open(`${link}`, "_blank");
        } else if (type === "Email") {
            window.location.href = `mailto:${link}`;
        } else if (type === "Phone Number") {
            window.location.href = `tel:${link}`;
        } else if (type === "WhatsApp") {
            window.open(`https://wa.me/${link}`, "_blank");
        } else if (type === "Description" || type === "Bus" || type === "Operation") {
            if (operation && typeof operation === "function") {
                operation(); // Open popup
            }
        } else if (type === "WebsiteRoute") {
            navigate(link); // Navigate within the app
        }
    };

    return (
        <AnimatePresence>
            <motion.div
                variants={InputChildVariants}
                whileHover={{
                    scale: 1.2,
                    transition: {
                        duration: 0.8,
                        type: "spring"
                    }
                }}
                onClick={handleClick}
                className="flex items-center group relative text-whitetheme scale-110 cursor-pointer bg-radial from-darktheme2 to-redtheme2 dark:from-whitetheme2 dark:to-whitetheme dark:text-darktheme p-0.5 rounded-2xl !ring-2 ring-darktheme dark:ring-whitetheme border-2 border-whitetheme dark:border-darktheme">
                <Icon icon={icon} />
                <div className="inputIconText !bg-radial from-darktheme to-darktheme2 dark:from-whitetheme dark:to-whitetheme2 dark:!text-darktheme2 dark:!ring-whitetheme">
                    {aText ? language === "en" ? text : aText : text}
                </div>
            </motion.div>
        </AnimatePresence>
    );
};

export default CircularButton;
