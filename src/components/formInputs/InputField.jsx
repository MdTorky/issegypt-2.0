// import React, { useState } from "react";
// import { motion } from "framer-motion";
// import { Icon } from "@iconify/react";

// const InputField = ({ placeholder, icon, iconValue, type, required, setValue, language, languageText, regex, value }) => {
//     const [changeType, setChangeType] = useState(type);
//     const [isFocused, setIsFocused] = useState(false);
//     const [hasValue, setHasValue] = useState(false);
//     const [customValue, setCustomValue] = useState()

//     const handleInputChange = (e) => {
//         const value = e.target.value;
//         setValue(value);
//         setCustomValue(value)
//         setHasValue(value.length > 0);
//     };
//     const InputChildVariants = {
//         hidden: { opacity: 0, y: -50 },
//         visible: {
//             opacity: 1, y: 0,
//             transition: {
//                 type: "spring",
//                 stiffness: 100,
//             }
//         },
//         exit: { opacity: 0, y: 50 }
//     };
//     return (
//         <motion.div

//             variants={InputChildVariants}

//             className={`flex text-[14px] w-full items-center bg-gradient-to-r from-whitetheme/50 to-whitetheme2/50 dark:from-darktheme2/50 dark:to-darktheme/50 border-3 border-gray-700 rounded-lg 
//                 ${isFocused ? "focus-within:ring-2 focus-within:ring-gray-700 dark:focus-within:ring-darktheme focus-within:ring-offset-2 focus-within:ring-offset-whitetheme dark:focus-within:ring-offset-darktheme2" : ""}
//                 ${hasValue ? "ring-2 ring-offset-2 ring-offset-whitetheme dark:ring-offset-black !ring-green-500" : ""}
//                 ${regex && customValue !== undefined && !regex.test(customValue) ? "!ring-redtheme" : ""}
//             `}>


//             <div className={` transition-all duration-300 group relative
//                 ${isFocused ? "text-green-500 scale-110" : "text-darktheme dark:text-whitetheme2"} 
//                 ${language === "en" ? "ml-4" : "mr-4"}
//                 ${regex && customValue !== undefined && !regex.test(customValue) ? "text-redtheme" : ""}
//                 `}>
//                 <Icon icon={`${(hasValue || isFocused) ? iconValue : icon}`} />

//                 <div className="inputIconText bg-darktheme2 !mb-5">{placeholder}</div>
//             </div>

//             <input
//                 className={`bg-transparent text-darktheme dark:text-whitetheme2 px-3 py-3 rounded-l-lg focus:outline-none w-full text-sm ${language === "en" ? "font-anton" : "font-modernpro"}`}
//                 id={placeholder}
//                 name={placeholder}
//                 type={changeType}
//                 placeholder={!value ? placeholder : ""}
//                 required={required}
//                 value={value || ""}
//                 onChange={handleInputChange}
//                 onFocus={() => setIsFocused(true)}
//                 onBlur={() => setIsFocused(false)}
//             />



//             {required && type !== "password" && (
//                 <div className={` transition-all duration-300 group relative text-darktheme dark:text-whitetheme2  ${isFocused && !hasValue ? "!text-red-500 scale-110" : ""} ${hasValue ? "!text-green-500 scale-110" : ""} ${language === "en" ? "mr-3" : "ml-3"}`}>
//                     <Icon icon="solar:info-circle-broken" />
//                     <div className="inputIconText bg-darktheme2">{languageText.Required}</div>
//                 </div>
//             )}

//             {type === "password" && (
//                 <div
//                     onClick={() => setChangeType(changeType === "password" ? "text" : "password")}
//                     className={`transition-all duration-300 group relative cursor-pointer text-darktheme dark:text-whitetheme2 ${isFocused ? " scale-110" : ""} ${language === "en" ? "mr-3" : "ml-3"}`}
//                 >
//                     <Icon icon={`${changeType === "password" ? "mingcute:eye-2-fill" : "mingcute:eye-close-fill"}`} />
//                     <div className="inputIconText bg-darktheme2 ">
//                         {changeType === "password" ? "Show Password" : "Hide Password"}
//                     </div>
//                 </div>
//             )}
//         </motion.div>
//     );
// };

// export default InputField;




import React, { useState } from "react";
import { motion } from "framer-motion";
import { Icon } from "@iconify/react";

const InputField = ({
    placeholder,
    icon,
    iconValue,
    type,
    required,
    setValue,
    language,
    languageText,
    regex,
    value, // This is the value passed from the parent component
}) => {
    const [changeType, setChangeType] = useState(type);
    const [isFocused, setIsFocused] = useState(false);
    const [hasValue, setHasValue] = useState(!!value); // Check if `value` exists initially

    const handleInputChange = (e) => {
        const inputValue = e.target.value;
        setValue(inputValue); // Update the parent state
        setHasValue(inputValue.length > 0); // Update local state for whether the input has a value
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
            className={`flex text-[14px] w-full items-center bg-gradient-to-r from-whitetheme/50 to-whitetheme2/50 dark:from-darktheme2/50 dark:to-darktheme/50 border-3 border-gray-700 rounded-lg 
          ${isFocused ? "focus-within:ring-2 focus-within:ring-gray-700 dark:focus-within:ring-darktheme focus-within:ring-offset-2 focus-within:ring-offset-whitetheme dark:focus-within:ring-offset-darktheme2" : ""}
          ${hasValue || value ? "ring-2 ring-offset-2 ring-offset-whitetheme dark:ring-offset-black !ring-green-500" : ""}
          ${regex && value !== undefined && !regex.test(value) ? "!ring-redtheme" : ""}
      `}
        >
            {/* Icon */}
            <div
                className={`transition-all duration-300 group relative
          ${isFocused ? "text-green-500 scale-110" : "text-darktheme dark:text-whitetheme2"} 
          ${language === "en" ? "ml-4" : "mr-4"}
          ${regex && value !== undefined && !regex.test(value) ? "text-redtheme" : ""}
        `}
            >
                <Icon icon={`${hasValue || isFocused ? iconValue : icon}`} />
                <div className="inputIconText bg-darktheme2 !mb-5">{placeholder}</div>
            </div>

            {/* Input Field */}
            <input
                className={`bg-transparent text-darktheme dark:text-whitetheme2 px-3 py-3 rounded-l-lg focus:outline-none w-full text-sm ${language === "en" ? "font-anton" : "font-modernpro"}`}
                id={placeholder}
                name={placeholder}
                type={changeType}
                placeholder={placeholder} // Show placeholder only if `value` is empty
                required={required}
                value={value} // Ensure `value` is always defined (fallback to empty string)
                onChange={handleInputChange}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
            />

            {/* Required Indicator */}
            {required && type !== "password" && (
                <div
                    className={`transition-all duration-300 group relative text-darktheme dark:text-whitetheme2 ${isFocused && !hasValue ? "!text-red-500 scale-110" : ""
                        } ${hasValue || value ? "!text-green-500 scale-110" : ""} ${language === "en" ? "mr-3" : "ml-3"}`}
                >
                    <Icon icon="solar:info-circle-broken" />
                    <div className="inputIconText bg-darktheme2">{languageText.Required}</div>
                </div>
            )}

            {/* Password Visibility Toggle */}
            {type === "password" && (
                <div
                    onClick={() => setChangeType(changeType === "password" ? "text" : "password")}
                    className={`transition-all duration-300 group relative cursor-pointer text-darktheme dark:text-whitetheme2 ${isFocused ? "scale-110" : ""
                        } ${language === "en" ? "mr-3" : "ml-3"}`}
                >
                    <Icon icon={`${changeType === "password" ? "mingcute:eye-2-fill" : "mingcute:eye-close-fill"}`} />
                    <div className="inputIconText bg-darktheme2">
                        {changeType === "password" ? "Show Password" : "Hide Password"}
                    </div>
                </div>
            )}
        </motion.div>
    );
};

export default InputField;
