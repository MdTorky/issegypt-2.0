import React, { useState, useRef, useEffect } from "react";
import { Icon } from "@iconify/react";
import { motion, AnimatePresence } from "framer-motion";

const MultiSelectField = ({
    options,
    placeholder,
    iconValue,
    icon,
    required,
    setValue,
    language,
    languageText,
    value: externalValues, // External values for controlled components
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState("");
    const [selectedValues, setSelectedValues] = useState(externalValues || []); // Use externalValues if provided
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    useEffect(() => {
        // Sync internal state with external values if they change
        if (Array.isArray(externalValues)) {
            setSelectedValues(externalValues);
        }
    }, [externalValues]);

    const handleSelect = (option) => {
        let updatedValues;
        if (selectedValues.includes(option.value)) {
            updatedValues = selectedValues.filter((val) => val !== option.value);
        } else {
            updatedValues = [...selectedValues, option.value];
        }

        setSelectedValues(updatedValues);
        setValue(updatedValues); // Pass the updated state
        setSearch("");
    };

    const selectedOptions = options?.filter((option) => selectedValues.includes(option.value));
    const remainingOptions = options?.filter((option) => !selectedValues.includes(option.value));

    const filteredOptions = [...selectedOptions, ...remainingOptions].filter((option) =>
        option.label.toLowerCase().includes(search.toLowerCase())
    );

    const dropdownVariants = {
        hidden: { opacity: 0, y: -10, scale: 0.95 },
        visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.2 } },
        exit: { opacity: 0, y: -10, scale: 0.95, transition: { duration: 0.15 } },
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
        <motion.div variants={InputChildVariants} ref={dropdownRef} className="relative w-full text-whitetheme">
            {/* Dropdown Trigger */}
            <div
                onClick={() => setIsOpen(!isOpen)}
                className={`flex items-center justify-between py-3 px-2 gap-2 bg-gradient-to-r from-whitetheme/50 to-whitetheme2/50 dark:from-darktheme2/50 dark:to-darktheme/50 border-3 border-gray-700 rounded-lg cursor-pointer w-full
          ${isOpen ? "ring-2 ring-offset-2 ring-green-500 ring-offset-whitetheme dark:ring-offset-darktheme" : ""}
          ${selectedValues.length > 0 ? "ring-2 ring-offset-2 ring-green-500 ring-offset-whitetheme dark:ring-offset-darktheme" : ""}
        `}
            >
                <div className="flex items-center gap-3 w-fit">
                    <div
                        className={`transition-all duration-300 group relative flex items-center gap-2 ${isOpen ? "text-green-500 scale-110" : "text-darktheme dark:text-whitetheme2"
                            } ${language === "en" ? "ml-2" : "mr-2"}`}
                    >
                        <Icon icon={selectedValues.length > 0 || isOpen ? iconValue : icon} />
                        <div className="inputIconText bg-darktheme2 !mb-5">{placeholder}</div>
                    </div>
                    <div
                        className={`text-sm lg:text-[14px] lg:w-full overflow-hidden    text-darktheme dark:text-whitetheme2 ${!selectedValues.length && "text-gray-400 dark:!text-gray-400"
                            }`}
                    >
                        {selectedValues.map((value) => {
                            const option = options.find((opt) => opt.value === value);
                            return option ? option.label : null;
                        }).join(", ") || placeholder}
                    </div>
                </div>
                <div className="flex items-center gap-1">
                    <Icon
                        icon="solar:alt-arrow-down-bold-duotone"
                        className={`transition-transform duration-300 text-darktheme dark:text-whitetheme2 ${isOpen ? "rotate-180" : ""}`}
                    />
                    {required && (
                        <div
                            className={`transition-all flex items-center duration-300 group relative ${isOpen && !selectedValues.length ? "!text-red-500 scale-110" : ""
                                } ${selectedValues.length > 0 ? "!text-green-500 scale-110" : "text-darktheme dark:text-whitetheme2"}`}
                        >
                            <Icon icon="solar:info-circle-broken" />
                            <div className="inputIconText bg-darktheme2">{languageText.Required}</div>
                        </div>
                    )}
                </div>
            </div>

            {/* Dropdown Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        variants={dropdownVariants}
                        className="absolute left-0 right-0 mt-2 bg-darktheme2 border border-gray-700 rounded-lg shadow-lg z-50 max-h-64 overflow-hidden"
                    >
                        {/* Search Bar */}
                        <div className="text-center pt-2">{languageText.ChooseOneMore}</div>

                        <div className="p-2">
                            <input
                                type="text"
                                placeholder={languageText.Search}
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full px-3 py-2 rounded-md bg-darktheme text-whitetheme focus:ring-3 ring-whitetheme"
                            />
                        </div>
                        {/* Options List */}
                        <div className="max-h-48 overflow-y-auto z-30">
                            {selectedValues.length > 0 && (
                                <div
                                    onClick={() => {
                                        setSelectedValues([]);
                                        setValue([]);
                                        setSearch("");
                                    }}
                                    className={`flex justify-between items-center px-4 py-2 hover:bg-darktheme cursor-pointer text-[14px]`}
                                >
                                    <div className="flex items-center gap-2">
                                        <Icon icon="solar:close-circle-broken" />
                                        <span>{languageText.ClearSelection}</span>
                                    </div>

                                </div>
                            )}
                            {filteredOptions.length > 0 ? (
                                filteredOptions.map((option, index) => (
                                    <div
                                        key={index}
                                        onClick={() => handleSelect(option)}
                                        className={`flex justify-between items-center px-4 py-2 hover:bg-darktheme cursor-pointer text-[14px] ${selectedValues.includes(option.value) ? "bg-redtheme" : ""
                                            }`}
                                    >
                                        <div className="flex items-center gap-2">
                                            <Icon icon={option?.icon} />
                                            <span>{option.label}</span>
                                        </div>
                                        {selectedValues.includes(option.value) && (
                                            <Icon icon="solar:check-read-linear" className="text-whitetheme text-lg" />
                                        )}
                                    </div>
                                ))
                            ) : (
                                <div className="px-4 py-2 text-gray-400 text-center">{languageText.NoOptions}</div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default MultiSelectField;