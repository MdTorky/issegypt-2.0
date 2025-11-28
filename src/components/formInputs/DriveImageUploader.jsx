import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Icon } from "@iconify/react";
import { useDropzone } from 'react-dropzone';
import { processImageLink } from "../../utils/ProcessImageLink";


const DriveUploadField = ({
    placeholder,
    icon,
    iconValue,
    required,
    onUploadComplete, // Callback when upload finishes (returns fileId, link)
    initialValue,     // If you want to show an existing image
    language,
    languageText,
    folderId,
    api,
}) => {
    const [isFocused, setIsFocused] = useState(false);
    const [previewImage, setPreviewImage] = useState(initialValue || null);

    // Upload States
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [uploadSuccess, setUploadSuccess] = useState(!!initialValue);
    const [error, setError] = useState("");

    // Handle File Selection (Drop or Click)
    const onDrop = (acceptedFiles) => {
        setError("");
        if (acceptedFiles.length > 0) {
            const selectedFile = acceptedFiles[0];
            setFile(selectedFile);
            setUploadSuccess(false); // Reset success until uploaded

            // Create local preview immediately
            const reader = new FileReader();
            reader.onload = () => {
                setPreviewImage(reader.result);
            };
            reader.readAsDataURL(selectedFile);
        }
    };

    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        accept: { 'image/*': [] }, // Limit to images
        disabled: uploading // Disable drag/drop while uploading
    });

    // Handle the actual Upload logic
    const handleUploadClick = async (e) => {
        e.stopPropagation(); // Prevent opening file dialog
        if (!file) return setError(languageText?.SelectFile || "Please select a file");

        setUploading(true);
        setError("");

        const formData = new FormData();
        formData.append("image", file);
        formData.append("folderId", folderId);

        try {
            const res = await axios.post(`${api}/api/gallery/upload`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            const { fileId, webViewLink } = res.data;
            setUploadSuccess(true);
            if (onUploadComplete) onUploadComplete(fileId, webViewLink);

        } catch (err) {
            console.error(err);
            setError(err.response?.data?.error || err.message || "Upload Failed");
            setUploadSuccess(false);
        } finally {
            setUploading(false);
        }
    };

    const handleClear = (e) => {
        e.stopPropagation();
        setPreviewImage(null);
        setFile(null);
        setUploadSuccess(false);
        setError("");
        if (onUploadComplete) onUploadComplete(null, null); // Clear parent state
    };

    // Animation Variant
    const InputChildVariants = {
        hidden: { opacity: 0, y: -50 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { type: "spring", stiffness: 100 },
        },
        exit: { opacity: 0, y: 50 },
    };

    // Determine Border Color based on state
    const getBorderClass = () => {
        if (error) return "!ring-red-500 ring-2";
        if (uploadSuccess) return "!ring-green-500 ring-2 ring-offset-2 ring-offset-whitetheme dark:ring-offset-black";
        if (isFocused) return "focus-within:ring-2 focus-within:ring-gray-700 dark:focus-within:ring-darktheme focus-within:ring-offset-2 focus-within:ring-offset-whitetheme dark:focus-within:ring-offset-darktheme2";
        return "";
    };

    return (
        <div className="w-full flex flex-col">
            <motion.div
                variants={InputChildVariants}
                className={`flex text-[14px] w-full items-center bg-gradient-to-r from-whitetheme/50 to-whitetheme2/50 dark:from-darktheme2/50 dark:to-darktheme/50 border-3 border-gray-700 rounded-lg cursor-pointer
                    ${getBorderClass()}
                    ${uploading ? "opacity-75 cursor-wait" : ""}
                `}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
            >
                {/* Left Icon */}
                <div
                    className={`transition-all duration-300 group relative
                        ${isFocused || uploadSuccess ? "text-green-500 scale-110" : "text-darktheme dark:text-whitetheme2"} 
                        ${language === "en" ? "ml-4" : "mr-4"}
                        ${error ? "!text-red-500" : ""}
                    `}
                >
                    <Icon icon={uploadSuccess ? iconValue : icon} />
                    <div className="inputIconText bg-darktheme2">{placeholder}</div>
                </div>

                {/* Drag and Drop Area */}
                <div {...getRootProps()} className="flex-grow flex items-center min-h-[45px]">
                    <input {...getInputProps()} required={(!uploadSuccess && required) ? true : false} />

                    {/* Placeholder Text */}
                    {!previewImage && (
                        <p className="text-gray-400 px-3 py-3 rounded-l-lg truncate">
                            {file ? file.name : placeholder}
                        </p>
                    )}

                    {/* Image Preview */}
                    {previewImage && (
                        <div className="py-2 px-2 flex-grow flex justify-center">
                            <img
                                src={processImageLink(previewImage)}
                                alt="Preview"
                                className="max-h-32 object-contain rounded border border-gray-600"
                            />
                        </div>
                    )}
                </div>

                {/* ACTIONS SECTION */}

                {/* 1. Upload Button (Show if file selected but NOT uploaded yet) */}
                {file && !uploadSuccess && !uploading && (
                    <button
                        onClick={handleUploadClick}
                        className={`transition-all duration-300 group relative cursor-pointer text-redtheme hover:text-redtheme2 ${language === "en" ? "mr-3" : "ml-3"}`}
                    >
                        <Icon icon="mingcute:upload-3-fill" width="24" />
                        <div className="inputIconText bg-darktheme2">{languageText?.Upload || "Upload Now"}</div>
                    </button>
                )}

                {/* 2. Loading Spinner */}
                {uploading && (
                    <div className={`animate-spin text-redtheme ${language === "en" ? "mr-3" : "ml-3"}`}>
                        <Icon icon="line-md:loading-twotone-loop" width="28" />
                    </div>
                )}

                {/* 3. Clear Button (Show if uploaded OR if file exists) */}
                {(previewImage) && !uploading && (
                    <button
                        onClick={handleClear}
                        className={`transition-all duration-300 group relative cursor-pointer text-darktheme dark:text-whitetheme2 hover:text-red-500 ${language === "en" ? "mr-3" : "ml-3"}`}
                    >
                        <Icon icon="solar:close-circle-broken" width="24" />
                        <div className="inputIconText bg-darktheme2">{languageText?.Clear || "Clear"}</div>
                    </button>
                )}

                {/* 4. Required / Info Icon (Only show if not uploaded) */}
                {!uploadSuccess && !uploading && required && (
                    <div
                        className={`transition-all duration-300 group relative text-darktheme dark:text-whitetheme2 
                        ${isFocused ? "!text-red-500 scale-110" : ""} 
                        ${language === "en" ? "mr-3" : "ml-3"}`}
                    >
                        <Icon icon="solar:info-circle-broken" />
                        <div className="inputIconText bg-darktheme2">{languageText?.Required || "Required"}</div>
                    </div>
                )}
            </motion.div>

            {/* Error Message Below Input */}
            {error && (
                <motion.p
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    className="text-red-500 text-xs mt-1 ml-1"
                >
                    {error}
                </motion.p>
            )}
        </div>
    );
}

export default DriveUploadField;