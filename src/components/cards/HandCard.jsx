import React from 'react'
import { Icon } from "@iconify/react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const HandCard = ({ index, service, language }) => {

    return (
        <AnimatePresence>
            <motion.div
                key={index}
                variants={{
                    hidden: { opacity: 0, y: -150 },
                    visible: { opacity: 1, y: 0, transition: { type: "spring" } },
                    exit: { opacity: 0, y: 50 }
                }}
                transition={{ duration: 0.5 }}
                whileHover={{
                    scale: 1.1,
                    y: -20,

                }}
                className="lg:w-120 w-90 p-4 rounded-lg border-[1px] border-slate-300 dark:border-gray-700 relative overflow-hidden group bg-whitetheme dark:bg-darktheme2 shadow-[0px_0px_0px_1px_rgba(0,0,0,0.06),0px_1px_1px_-0.5px_rgba(0,0,0,0.06),0px_3px_3px_-1.5px_rgba(0,0,0,0.06),_0px_6px_6px_-3px_rgba(0,0,0,0.06),0px_12px_12px_-6px_rgba(0,0,0,0.06),0px_24px_24px_-12px_rgba(0,0,0,0.06)]">
                <Link to={`${service.link ? `/services/${service.link}` : `${service.url}`}`}>
                    <div className={`absolute inset-0 bg-gradient-to-r  translate-y-[100%] group-hover:translate-y-[0%] transition-transform duration-300 ${language === "en" ? "from-redtheme to-redtheme2" : "from-redtheme2 to-redtheme"}`} />

                    <Icon icon={service.icon} className={`absolute z-10 -top-12 text-9xl text-gray-400 group-hover:text-redtheme transition-transform duration-300 ${language === "en" ? "-right-12 group-hover:rotate-12" : "-left-12  group-hover:rotate-12"}`} />
                    <Icon icon={service.icon} className="mb-2 text-2xl text-redtheme group-hover:text-white transition-colors relative z-10 duration-300" />
                    <h3 className="font-medium text-lg text-darktheme2 dark:text-whitetheme group-hover:text-white relative z-10 duration-300">
                        {language === "en" ? service.name : service.aName}
                    </h3>
                    <p className="text-slate-400 group-hover:text-red-400 relative z-10 duration-300">
                        {language === "en" ? service.description : service.aDescription}

                    </p>
                </Link>
            </motion.div>
        </AnimatePresence>
    )
}

export default HandCard