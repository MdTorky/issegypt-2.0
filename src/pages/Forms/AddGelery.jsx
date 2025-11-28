import React, { useState, useEffect } from "react";
import SelectField from "../../components/formInputs/SelectField"; // Ensure correct path
import useSubmitForm from "../../hooks/useSubmitForm";
import ErrorContainer from "../../components/formInputs/ErrorContainer";
import { AnimatePresence, motion } from "framer-motion";
import Loader from "../../components/loaders/Loader";
import InputField from "../../components/formInputs/InputField";
import FormButton from "../../components/formInputs/FormButton";
import MultiSelectField from "../../components/formInputs/MultiSelectField";
import { useNavigate } from "react-router-dom";
import AdminNavBar from "../../components/AdminNavBar";
import { useFormsContext } from '../../hooks/useFormContext';
import { useAuthContext } from '../../hooks/useAuthContext';
import ImageUploadField from "../../components/formInputs/ImageUploadField";

import DriveImageUploader from "../../components/formInputs/DriveImageUploader"; // Adjust path
import uploadFileToBackend from "../../utils/uploadFileToBackend";

const EVENT_POSTER_DRIVE_ID = "1nscG5s3ioqUWgEuGUAYQffuZ_9HB1Kjx";

const constructDriveLink = (folderId) => {
    if (folderId && typeof folderId === 'string') {
        return `https://drive.google.com/drive/u/0/folders/${folderId.trim()}`;
    }
    return '';
};

const AddGallery = ({ languageText, language, api }) => {


    const { galleries, dispatch } = useFormsContext();
    const { user } = useAuthContext();
    const navigate = useNavigate()


    const [folderName, setFolderName] = useState(""); // Selected service
    const [arabicFolderName, setArabicFolderName] = useState(""); // Selected group
    const [folderLink, setFolderLink] = useState("");
    const [folderImage, setFolderImage] = useState("");
    const [time, setTime] = useState("");
    const [session, setSession] = useState("");
    const [committee, setCommittee] = useState("");
    const [driveCondition, setDriveCondition] = useState("");


    const [isImageUploading, setIsImageUploading] = useState(false)
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);

    const sessions = [
        { label: "2025", value: "2025", aValue: "2025", },
        { label: "2026", value: "2026", aValue: "2026", },
        { label: "2027", value: "2027", aValue: "2027", },
    ];

    const drive = [
        { label: "Coming Soon", value: "Coming Soon", icon: "hugeicons:coming-soon-01" },
        { label: "No Drive", value: "No Drive", icon: "iconoir:google-drive-warning" },
        { label: "Drive is Ready", value: "Drive is Ready", icon: "material-symbols:drive-export" },
    ];

    const committeeOptions = [
        { label: languageText.All, value: "", aValue: "", },
        { value: "General", label: languageText.General, icon: "oui:integration-general" },
        { value: "Social", label: languageText.SocialCommittee, icon: "solar:people-nearby-bold" },
        { value: "Academic", label: languageText.AcademicCommittee, icon: "heroicons:academic-cap-solid" },
        { value: "Culture", label: languageText.CultureCommittee, icon: "mdi:religion-islamic" },
        { value: "Sport", label: languageText.SportCommittee, icon: "fluent-mdl2:more-sports" },
        { value: "Women", label: languageText.WomenCommittee, icon: "healthicons:woman" },
    ];

    const { handleSubmit, error, setError, submitLoading } =
        useSubmitForm();


    const onSubmit = async (e) => {
        e.preventDefault();

        let finalDriveLink = "";
        let finalFolderLink = folderLink;
        let finalFolderImage = folderImage;

        if (driveCondition === "Drive is Ready") {
            // Case 1: Link is ready. Construct the full URL.

            // Check if folderLink (Folder ID) is present
            if (!finalFolderLink || typeof finalFolderLink !== 'string' || finalFolderLink.trim() === '') {
                setError({ message: "Drive condition is 'Link Ready' but the Folder ID is missing." });
                return;
            }

            finalDriveLink = constructDriveLink(finalFolderLink);

        } else if (driveCondition === "Coming Soon") {
            finalFolderLink = "Coming Soon";
            finalDriveLink = "";

        } else if (driveCondition === "No Drive") {
            finalFolderLink = "No Drive";
            finalDriveLink = "";

        } else {
            setError({ message: "Please select a valid Drive Condition." });
            return;
        }

        if (selectedFile) {
            // A new file is selected, must upload it first.
            setIsImageUploading(true);
            setError(null);

            try {
                // Call the shared upload utility
                const url = await uploadFileToBackend(
                    selectedFile,
                    EVENT_POSTER_DRIVE_ID,
                    api,
                    user?.token
                );

                finalFolderImage = url;
                setFolderImage(url); // Update state with the final URL

            } catch (uploadError) {
                setError({ message: uploadError.message || languageText.UploadFailed });
                setIsImageUploading(false);
                return; // Stop submission on upload failure
            } finally {
                setIsImageUploading(false);
            }
        }

        if (!finalFolderImage || finalFolderImage.length < 10) {
            setError({ message: languageText.MissingPosterURL || "Event Image URL is missing. Please select and upload an image." });
            return;
        }
        const addGallery = {
            folderName,
            arabicFolderName,
            driveLink: finalDriveLink,
            folderLink: finalFolderLink,
            folderImage: finalFolderImage,
            time,
            session,
            committee
        };

        await handleSubmit(`${api}/api/gallery`, "POST", addGallery, "galleries", languageText.GalleryAddMessage);
        navigate(-1);
    };

    // console.log("Image Uploading Status:", isImageUploading);
    console.log("Folder Image URL:", folderImage);
    return (

        <div>
            {submitLoading ? (
                <div className="h-screen flex justify-center">
                    <Loader text={languageText.Submitting} />
                </div>
            ) : (
                <motion.div
                    initial={{ opacity: 0, y: -200 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -200 }}
                    transition={{ duration: 0.8, ease: "linear", type: "spring", stiffness: 100 }}
                    className={`w-full p-8  flex flex-col justify-center items-center m-auto  rounded-xl`}
                >

                    <motion.form
                        className="formForm lg:w-140 my-20 "
                        variants={{
                            visible: { transition: { staggerChildren: 0.2 } },
                            exit: { transition: { staggerChildren: 0.1 } },
                        }}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        onSubmit={onSubmit}
                    >
                        <motion.h2
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ opacity: 0, scale: 0 }}
                            transition={{ duration: 0.9, delay: 0.1, type: "spring" }}
                            className={`formTitle ${language === "en" ? "" : "flex flex-row-reverse"}`}
                        >
                            AddGalleryForm<span className="text-darktheme2 dark:text-whitetheme"></span>
                        </motion.h2>


                        <div className="formRow">
                            <InputField
                                placeholder={languageText.EventName}
                                iconValue="solar:text-field-bold"
                                icon="solar:text-field-broken"
                                type="text"
                                required={true}
                                language={language}
                                languageText={languageText}
                                setValue={setFolderName}
                                regex={null}
                            />
                            <InputField
                                placeholder={languageText.EventArabicName}
                                iconValue="solar:text-field-bold"
                                icon="solar:text-field-broken"
                                type="text"
                                required={true}
                                language={language}
                                languageText={languageText}
                                setValue={setArabicFolderName}
                                regex={null}
                            />
                        </div>

                        <div className="formRow">
                            <InputField
                                placeholder={languageText.EventNumber}
                                iconValue="solar:hashtag-circle-bold"
                                icon="solar:hashtag-circle-broken"
                                type="number"
                                required={true}
                                language={language}
                                languageText={languageText}
                                setValue={setTime}
                                regex={null}
                            />
                            <SelectField
                                options={sessions}
                                placeholder={languageText.EventYear}
                                iconValue="mdi:update"
                                icon="mdi:update"
                                language={language}
                                languageText={languageText}
                                required={true}
                                setValue={setSession}
                                regex={null}
                            />
                        </div>

                        <DriveImageUploader
                            placeholder={languageText.EventImageLink}
                            iconValue="fluent:image-copy-28-filled"
                            icon="fluent:image-copy-28-regular"
                            language={language}
                            languageText={languageText}
                            required={true}
                            setValue={setFolderImage}
                            driveFolderId={EVENT_POSTER_DRIVE_ID}
                            // setFile={setSelectedFile}
                            // setPreview={setPreviewImage}
                            uploadHandler={uploadFileToBackend}
                            apiBaseUrl={api}
                            token={user?.token}
                            setUploadStatus={setIsImageUploading}
                        />
                        <div className="formRow">
                            <SelectField
                                options={committeeOptions}
                                placeholder={languageText.ChooseCommittee}
                                iconValue="fluent:people-team-16-filled"
                                icon="fluent:people-team-16-regular"
                                language={language}
                                languageText={languageText}
                                required={true}
                                setValue={setCommittee}
                                regex={null}
                            />
                            <SelectField
                                options={drive}
                                placeholder="Choose Drive Condition"
                                iconValue="material-symbols:drive-export"
                                icon="material-symbols:drive-export"
                                language={language}
                                languageText={languageText}
                                required={true}
                                setValue={setDriveCondition}
                                regex={null}
                            />
                        </div>


                        {driveCondition === "Drive is Ready" && (
                            <div className="formRow">
                                <InputField
                                    placeholder={languageText.DriveLink}
                                    iconValue="mingcute:drive-fill"
                                    icon="mingcute:drive-line"
                                    type="text"
                                    required={true}
                                    language={language}
                                    languageText={languageText}
                                    setValue={setFolderLink}
                                    regex={null}
                                />
                            </div>
                        )}
                        <AnimatePresence mode="popLayout">
                            {error &&
                                // Pass the message string if the component expects a string prop called 'error'
                                <ErrorContainer error={error.message} setError={setError} />
                            }
                        </AnimatePresence>
                        {isImageUploading && <Loader />}
                        <FormButton
                            icon="hugeicons:task-done-01"
                            text={languageText.SubmitForm}
                            disabled={isImageUploading || !folderImage || folderImage.length < 10}
                        />
                    </motion.form>

                </motion.div>
            )}
        </div>
    )
}

export default AddGallery