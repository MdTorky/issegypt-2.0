import React, { useState } from 'react';
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";

const SelectField = ({ options, placeholder, iconValue, icon, required, setValue, language }) => {
    const [isFocused, setIsFocused] = useState(false);
    const [selectedValue, setSelectedValue] = useState("");

    const handleInputChange = (e) => {
        const value = e.target.value;
        setSelectedValue(value);
        setValue(value)
    };
    const InputChildVariants = {
        hidden: { opacity: 0, y: -50 },
        visible: {
            opacity: 1, y: 0,
            transition: {
                type: "spring",
                stiffness: 100,
                // damping: 20
            }
        },
        exit: { opacity: 0, y: 50 }
    };

    return (
        <motion.div
            variants={InputChildVariants}

            className={`flex text-[14px] text-whitetheme w-full md:w-[70%] items-center bg-darktheme2 border-3 border-gray-700 rounded-lg
        ${isFocused ? "focus-within:ring-2 focus-within:ring-gray-700 dark:focus-within:ring-darktheme focus-within:ring-offset-2 focus-within:ring-offset-whitetheme dark:focus-within:ring-offset-darktheme2" : ""}
       ${selectedValue ? "ring-2 ring-offset-2 ring-offset-whitetheme dark:ring-offset-black !ring-green-500" : ""}`}
        >
            <div className={`transition-all duration-300 group relative ${isFocused ? "text-green-500 scale-110" : ""} ${language === "en" ? "ml-2" : "mr-2"}`}>
                <Icon icon={`${(selectedValue || isFocused) ? iconValue : icon}`} />
                <div className="inputIconText bg-darktheme2 !mb-5">{placeholder}</div>
            </div>

            <select
                id="countries"
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                className={`bg-darktheme2 text-whitetheme px-3 py-3 rounded-lg focus:outline-none w-full uppercase ${language === "en" ? "font-anton" : "font-modernpro"} `}
                onChange={handleInputChange}
            >
                <option value="" selected disabled>{placeholder}</option>
                {options?.map((option, index) => (
                    <option key={index} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>

            {required && (
                <div className={`transition-all duration-300 group relative  ${isFocused ? "text-red-500 scale-110" : ""} ${selectedValue ? "!text-green-500 scale-110" : ""} ${language === "en" ? "mr-2" : "ml-2"}`}>
                    <Icon icon="solar:info-circle-broken" />
                    <div className="inputIconText bg-darktheme2">required</div>
                </div>
            )}
        </motion.div>
    );
};

export default SelectField;
