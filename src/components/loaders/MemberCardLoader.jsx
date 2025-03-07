// src/components/MemberCardLoader.js
import React from "react";
import { motion } from "framer-motion";

const MemberCardLoader = () => {
  return (
    <motion.div
      className="relative w-[300px] h-[450px] bg-white cursor-pointer overflow-hidden rounded-lg shadow-[4.0px_8.0px_8.0px_rgba(0,0,0,0.38)] hidden md:flex "
      initial={{ scale: 1 }}
      animate={{ scale: 1.05 }}
      transition={{ duration: 0.4 }}
      style={{ perspective: 1000 }}
    >
      {/* Overlay Effect */}
      <motion.div
        className="absolute top-0 left-full w-full h-full bg-white/20 skew-x-[45deg]"
        initial={{ left: "170%" }}
        animate={{ left: "-170%" }}
        transition={{ duration: 0.8, delay: 1.1 }}
      />

      {/* Image Placeholder with Shimmer Effect */}
      <div className="relative w-full h-full overflow-hidden">
        <motion.div
          className="w-full h-full bg-gray-300"
          initial={{ filter: "grayscale(100%)", scale: 1 }}
          animate={{ filter: "grayscale(0%)", scale: 1.2 }}
          transition={{ duration: 2 }}
        />
        {/* Shimmer Overlay */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/70 to-transparent z-10"
          initial={{ x: "-100%", y: "0%" }}
          animate={{ x: "100%", y: "0%" }}
          transition={{ duration: 1.5, ease: "linear", repeat: Infinity }}
        />
      </div>

      {/* Name Placeholder (Falling Paper Effect) */}
      <motion.div
        className="absolute bottom-0 w-full text-center text-xl bg-whitetheme p-2 m-0 text-darktheme"
        initial={{ opacity: 0, rotateX: 90, y: -100 }}
        animate={{ opacity: 1, rotateX: 0, y: 0 }}
        transition={{ duration: 1 }}
      >
        <div className="h-6 w-3/4 bg-gray-300 rounded  m-auto mb-2"></div>
        <div className="h-4 w-1/2 bg-gray-300 rounded m-auto"></div>
      </motion.div>

      {/* Social Media Icons Placeholder (Slide In From Left) */}
    </motion.div>
  );
};

export default MemberCardLoader;