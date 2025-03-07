import React, { useState } from "react";
import { motion } from "framer-motion";
import { Icon } from "@iconify/react";
import { useDropzone } from 'react-dropzone';


const ImageUploadField = ({
    placeholder,
    icon,
    iconValue,
    required,
    setValue,
    value,
    language,
    languageText,
}) => {
    const [isFocused, setIsFocused] = useState(false);
    const [hasValue, setHasValue] = useState(false);
    const [previewImage, setPreviewImage] = useState(null);


    const onDrop = (acceptedFiles) => {
        if (acceptedFiles.length > 0) {
            const file = acceptedFiles[0];
            const reader = new FileReader();
            reader.onload = () => {
                setPreviewImage(reader.result);
                setValue(file); // Update the parent state with the selected file
                setHasValue(true);
            };
            reader.readAsDataURL(file);
        }
    };



    const { getRootProps, getInputProps } = useDropzone({ onDrop });

    const handleClear = () => {
        setPreviewImage(null);
        setValue(null); // Clear the value in the parent state
        setHasValue(false);
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
            className={`flex text-[14px] w-full items-center bg-gradient-to-r from-whitetheme/50 to-whitetheme2/50 dark:from-darktheme2/50 dark:to-darktheme/50 border-3 border-gray-700 rounded-lg cursor-pointer
                  ${isFocused ? "focus-within:ring-2 focus-within:ring-gray-700 dark:focus-within:ring-darktheme focus-within:ring-offset-2 focus-within:ring-offset-whitetheme dark:focus-within:ring-offset-darktheme2" : ""}
                  ${hasValue || value ? "ring-2 ring-offset-2 ring-offset-whitetheme dark:ring-offset-black !ring-green-500" : ""}
                  `}
        //   ${regex && value !== undefined && !regex.test(value) ? "!ring-redtheme" : ""}
        >
            {/* Icon */}
            <div
                className={`transition-all duration-300 group relative
          ${isFocused ? "text-green-500 scale-110" : "text-darktheme dark:text-whitetheme2"} 
          ${language === "en" ? "ml-4" : "mr-4"}
          ${hasValue ? "text-green-500" : ""}
                `}>
                <Icon icon={`${hasValue ? iconValue : icon}`} />
                <div className="inputIconText bg-darktheme2">{placeholder}</div>
            </div>

            {/* Drag and Drop Area */}
            <div {...getRootProps()} className="flex-grow flex items-center">
                <input {...getInputProps()} required={value ? false : required} />
                {!previewImage && !value && <p className="text-gray-400  px-3 py-3 rounded-l-lg">{placeholder}</p>}
                {previewImage && <img src={previewImage} alt="Preview" className="max-h-64 max-w-1/2 object-cover rounded m-auto" />}
                {!previewImage && value && <img src={value} className="max-h-64 max-w-1/2 object-cover rounded m-auto" />}
            </div>

            {/* Required Indicator */}
            {!hasValue && (
                <button className={`transition-all duration-300 group relative cursor-pointer text-darktheme dark:text-whitetheme2 ${language === "en" ? "mr-3" : "ml-3"}`}>
                    <Icon icon="mingcute:upload-3-fill" />
                    <div className="inputIconText bg-darktheme2">{languageText.Upload}</div>
                </button>
            )}

            {(hasValue || value) && (
                <button onClick={handleClear} className={`transition-all duration-300 group relative cursor-pointer text-darktheme dark:text-whitetheme2 ${language === "en" ? "mr-3" : "ml-3"}`}>
                    <Icon icon="solar:close-circle-broken" />
                    <div className="inputIconText bg-darktheme2">{languageText.Clear}</div>
                </button>
            )}

            {required && (
                <div
                    className={`transition-all duration-300 group relative text-darktheme dark:text-whitetheme2 ${isFocused && !hasValue ? "!text-red-500 scale-110" : ""
                        } ${hasValue || value ? "!text-green-500 scale-110" : ""} ${language === "en" ? "mr-3" : "ml-3"}`}
                >
                    <Icon icon="solar:info-circle-broken" />
                    <div className="inputIconText bg-darktheme2">{languageText.Required}</div>
                </div>
            )}

            {/* Clear Button */}



        </motion.div>
    );
}

export default ImageUploadField;