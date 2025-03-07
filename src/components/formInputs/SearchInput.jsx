import React, { useState } from 'react';
import { Icon } from "@iconify/react";

const SearchInput = ({ languageText, language, onSearch }) => {
    const [isFocused, setIsFocused] = useState(false);
    const [value, setValue] = useState(""); // State to control the input value

    const handleInputChange = (e) => {
        const inputValue = e.target.value;
        setValue(inputValue); // Update the input value
        onSearch(inputValue); // Pass the value to the parent component
    };

    const handleClear = () => {
        setValue(""); // Clear the input value
        onSearch(""); // Notify the parent component to clear the search
    };

    return (
        <div
            className={`flex text-[14px] items-center bg-gradient-to-r from-whitetheme/50 to-whitetheme2/50 dark:from-darktheme2/50 dark:to-darktheme/50 border-3 border-gray-700 rounded-lg shadow-xl
      ${isFocused ? "focus-within:ring-2 focus-within:ring-gray-700 dark:focus-within:ring-darktheme focus-within:ring-offset-2 focus-within:ring-offset-whitetheme dark:focus-within:ring-offset-darktheme2" : ""}
      ${value.length > 0 ? "ring-2 ring-offset-2 ring-offset-whitetheme dark:ring-offset-black !ring-green-500" : ""}
  `}
        >
            {/* Search Icon */}
            <div
                className={`transition-all duration-300 group relative
          ${isFocused ? "text-green-500 scale-110" : "text-darktheme dark:text-whitetheme2"} 
          ${language === "en" ? "ml-4" : "mr-4"}
        `}
            >
                <Icon icon={`${value.length > 0 || isFocused ? "oui:ws-search" : "oui:ws-search"}`} />
                <div className="inputIconText bg-darktheme2 !mb-5">{languageText.Search}</div>
            </div>

            {/* Input Field */}
            <input
                type="text"
                spellCheck="false"
                name="text"
                value={value} // Controlled input value
                className={`bg-transparent text-darktheme dark:text-whitetheme px-3 py-3 rounded-l-lg focus:outline-none w-30 text-sm focus:w-70 transition-all placeholder-gray-500 ${language === "en" ? "font-anton" : "font-modernpro "}`}
                placeholder={languageText.Search}
                onChange={handleInputChange}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
            />

            {/* Clear Button */}
            <button
                onClick={handleClear} // Clear the input value
                className={`transition-all duration-300 group relative text-darktheme dark:text-whitetheme2 cursor-pointer ${isFocused && value.length === 0 ? "!text-red-500 scale-110" : ""
                    } ${value.length > 0 ? "!text-green-500 scale-110" : ""} ${language === "en" ? "mr-3" : "ml-3"}`}
            >
                <Icon icon="solar:close-circle-broken" />
                <div className="inputIconText bg-darktheme2">{languageText.Clear}</div>
            </button>
        </div>
    );
};

export default SearchInput;