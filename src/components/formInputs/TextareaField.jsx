import React, { useState } from "react";
import { motion } from "framer-motion";
import { Icon } from "@iconify/react";

const TextareaField = ({
    placeholder,
    icon,
    iconValue,
    required,
    setValue,
    language,
    languageText,
    regex,
    value,
    disabled,
    rows = 4 // default textarea rows
}) => {
    const [isFocused, setIsFocused] = useState(false);
    const [hasValue, setHasValue] = useState(!!value);

    const handleChange = (e) => {
        const newValue = e.target.value;
        setValue(newValue);
        setHasValue(newValue.length > 0);
    };

    const InputChildVariants = {
        hidden: { opacity: 0, y: -50 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                type: "spring",
                stiffness: 100,
            },
        },
        exit: { opacity: 0, y: 50 },
    };

    return (
        <motion.div
            variants={InputChildVariants}
            className={`flex text-[14px] w-full bg-gradient-to-r from-whitetheme/50 to-whitetheme2/50 dark:from-darktheme2/50 dark:to-darktheme/50 border-3 border-gray-700 rounded-lg 
            ${isFocused ? "focus-within:ring-2 focus-within:ring-gray-700 dark:focus-within:ring-darktheme focus-within:ring-offset-2 focus-within:ring-offset-whitetheme dark:focus-within:ring-offset-darktheme2" : ""}
            ${hasValue || value ? "ring-2 ring-offset-2 ring-offset-whitetheme dark:ring-offset-black !ring-green-500" : ""}
            ${regex && value !== undefined && !regex.test(value) ? "!ring-redtheme" : ""}
        `}
        >
            {/* Icon */}
            <div
                className={`transition-all duration-300 group relative flex items-center py-3
                ${isFocused ? "text-green-500 scale-110" : "text-darktheme dark:text-whitetheme2"} 
                ${language === "en" ? "ml-4" : "mr-4"}
                ${regex && value !== undefined && !regex.test(value) ? "text-redtheme" : ""}
            `}
            >
                <Icon icon={`${hasValue || isFocused ? iconValue : icon}`} />
                <div className="inputIconText bg-darktheme2 !mb-5">{placeholder}</div>
            </div>

            {/* Textarea */}
            <textarea
                className={`bg-transparent resize-none text-darktheme dark:text-whitetheme2 px-3 py-3 rounded-l-lg focus:outline-none w-full text-sm ${language === "en" ? "font-anton" : "font-modernpro"}`}
                id={placeholder}
                name={placeholder}
                placeholder={placeholder}
                required={required}
                value={value || ""}
                rows={rows}
                onChange={handleChange}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                disabled={disabled}
            />

            {/* Required Indicator */}
            {required && (
                <div
                    className={`transition-all duration-300 group relative flex items-center py-3 text-darktheme dark:text-whitetheme2 ${isFocused && !hasValue ? "!text-red-500 scale-110" : ""
                        } ${hasValue || value ? "!text-green-500 scale-110" : ""} ${language === "en" ? "mr-3" : "ml-3"}`}
                >
                    <Icon icon="solar:info-circle-broken" />
                    <div className="inputIconText bg-darktheme2">{languageText.Required}</div>
                </div>
            )}
        </motion.div>
    );
};

export default TextareaField;
