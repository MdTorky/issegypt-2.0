import React from "react";
import { motion } from "framer-motion";

const HandCardLoader = () => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="lg:w-120 w-100 p-4 rounded-lg border-[1px] border-slate-300 dark:border-gray-700 relative overflow-hidden bg-whitetheme dark:bg-darktheme2 shadow-[0px_0px_0px_1px_rgba(0,0,0,0.06),0px_1px_1px_-0.5px_rgba(0,0,0,0.06),0px_3px_3px_-1.5px_rgba(0,0,0,0.06),_0px_6px_6px_-3px_rgba(0,0,0,0.06),0px_12px_12px_-6px_rgba(0,0,0,0.06),0px_24px_24px_-12px_rgba(0,0,0,0.06)]"
        >
            {/* Shimmer Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-300 to-transparent animate-shimmer" />

            {/* Placeholder for Icon */}
            <div className="mb-2 w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-700" />

            {/* Placeholder for Title */}
            <div className="h-6 w-1/2 bg-gray-300 dark:bg-gray-700 rounded mb-2" />

            {/* Placeholder for Description */}
            <div className="h-4 w-3/4 bg-gray-300 dark:bg-gray-700 rounded" />
        </motion.div>
    );
};

export default HandCardLoader;