import React, { useState, useEffect } from "react";
import useSubmitForm from "../../hooks/useSubmitForm";
import useFetchDataById from "../../hooks/useFetchDataById";
import InputField from "../../components/formInputs/InputField";
import ErrorContainer from "../../components/formInputs/ErrorContainer";
import FormButton from "../../components/formInputs/FormButton";
import { useParams, useNavigate } from "react-router-dom";
import { useFormsContext } from '../../hooks/useFormContext';
import { AnimatePresence, motion } from "framer-motion";
import Loader from "../../components/loaders/Loader";
import SelectField from "../../components/formInputs/SelectField";
import { useAuthContext } from '../../hooks/useAuthContext';
import DriveUploader from "../../components/formInputs/DriveImageUploader";
import { processImageLink } from "../../utils/ProcessImageLink";

// --- HELPER FUNCTIONS ---

const constructDriveLink = (folderId) => {
    if (folderId && typeof folderId === 'string') {
        return `https://drive.google.com/drive/u/0/folders/${folderId.trim()}`;
    }
    return '';
};

// New helper to extract ID from full URL
const extractFolderId = (input) => {
    if (!input) return "";

    // Check if input is a URL containing "/folders/"
    if (typeof input === 'string' && input.includes("drive.google.com") && input.includes("/folders/")) {
        // Extract the ID part after /folders/
        const match = input.match(/\/folders\/([a-zA-Z0-9_-]+)/);
        if (match && match[1]) {
            return match[1];
        }
    }

    // If it's not a URL, return the input as is (assuming it's already the ID)
    return input.trim();
};

// ------------------------

const EditGallery = ({ language, languageText, api }) => {
    const { id } = useParams(); // Get the ID of the Helping Hand from the URL
    const { galleries, dispatch } = useFormsContext();
    const { user } = useAuthContext();
    const navigate = useNavigate()


    const [folderName, setFolderName] = useState(""); // Selected service
    const [arabicFolderName, setArabicFolderName] = useState(""); // Selected group
    const [folderLink, setFolderLink] = useState("");
    const [driveLink, setDriveLink] = useState("");
    const [folderImage, setFolderImage] = useState("");
    const [icon, setIcon] = useState("");
    const [time, setTime] = useState("");
    const [session, setSession] = useState("");
    const [committee, setCommittee] = useState("");
    const [driveCondition, setDriveCondition] = useState("")


    const { data: galleryData, loading, error } = useFetchDataById(`${api}/api/gallery/${id}`);

    useEffect(() => {
        if (galleryData && !loading && !error) {
            setFolderName(galleryData.folderName);
            setArabicFolderName(galleryData.arabicFolderName);
            setDriveLink(galleryData.driveLink);
            setIcon(galleryData.icon);
            setTime(galleryData.time);
            setFolderImage(galleryData.folderImage);
            setSession(galleryData.session);
            setCommittee(galleryData.committee);

            const link = galleryData.folderLink;

            // Logic to pre-fill the condition and ID
            if (link === "Coming Soon") {
                setDriveCondition("Coming Soon");
                setFolderLink(""); // Clear ID input
            } else if (link === "No Drive") {
                setDriveCondition("No Drive");
                setFolderLink("");
            } else {
                setDriveCondition("Drive is Ready");
                setFolderLink(link); // Set the Folder ID
            }
        }
    }, [galleryData, loading, error]);

    const { handleSubmit, error: submitError, setError, submitLoading } = useSubmitForm();

    const onSubmit = async (e) => {
        e.preventDefault();

        let finalDriveLink = "";
        let finalFolderLink = folderLink;

        // Apply same logic as AddGallery
        if (driveCondition === "Drive is Ready") {

            // 1. CLEAN THE ID: Extract ID if it's a full URL
            finalDriveLink = extractFolderId(finalFolderLink);

            if (!finalDriveLink || typeof finalDriveLink !== 'string' || finalDriveLink.trim() === '') {
                setError({ message: "Drive condition is 'Ready' but the Folder ID is missing." });
                return;
            }

            // 2. Construct the full link
            finalFolderLink = constructDriveLink(finalDriveLink);

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

        const updatedHelpingData = {
            folderName,
            arabicFolderName,
            driveLink: finalDriveLink,
            folderLink: finalFolderLink, // This is now the clean ID
            folderImage,
            icon,
            time,
            session,
            committee
        };

        await handleSubmit(`${api}/api/gallery/${id}`, "PATCH", updatedHelpingData, "galleries", languageText.GalleryUpdateMessage);
        navigate(-1); // Go back
    };



    const sessions = [
        { label: "2023", value: "2023", aValue: "2023", },
        { label: "2024", value: "2024", aValue: "2024", },
        { label: "2025", value: "2025", aValue: "2025", },
        { label: "2026", value: "2026", aValue: "2026", },
        { label: "2027", value: "2027", aValue: "2027", },
    ];

    const driveOptions = [
        { label: "Coming Soon", value: "Coming Soon" },
        { label: "No Drive", value: "No Drive" },
        { label: "Drive is Ready", value: "Drive is Ready" },
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

    return (
        <div>
            {loading ? (
                <div className="h-screen flex justify-center">

                    <Loader text={languageText.Loading} />
                </div>
            ) :
                submitLoading ? (
                    <div className="h-screen flex justify-center">
                        <Loader text={languageText.Updating} />
                    </div>
                ) : error ? (
                    <ErrorContainer message={error.message || "Failed to load data"} />
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
                                {languageText.EditGalleryForm}<span className="text-darktheme2 dark:text-whitetheme"></span>
                            </motion.h2>

                            <img src={processImageLink(folderImage)} className="w-70 shadow-xl rounded-xl ring-darktheme ring-3 dark:ring-whitetheme border-9 border-whitetheme/0" />

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
                                    value={folderName}
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
                                    value={arabicFolderName}
                                />
                            </div>

                            <div className="formRow">

                                <InputField
                                    placeholder={languageText.EventNumber}
                                    iconValue="solar:hashtag-circle-bold"
                                    icon="solar:hashtag-circle-broken"
                                    type="text"
                                    required={true}
                                    language={language}
                                    languageText={languageText}
                                    setValue={setTime}
                                    regex={null}
                                    value={time}
                                    readOnly={true} // Assuming you want this readOnly based on AddGallery logic
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
                                    value={session}
                                />
                            </div>

                            <DriveUploader
                                placeholder={languageText.EventImage}
                                iconValue="fluent:image-copy-28-filled"
                                icon="fluent:image-copy-28-regular"
                                language={language}
                                languageText={languageText}
                                api={api}
                                folderId="1nscG5s3ioqUWgEuGUAYQffuZ_9HB1Kjx" // Same image folder ID as AddGallery
                                initialValue={folderImage} // Pre-fills the existing image
                                onUploadComplete={(fileId, webViewLink) => {
                                    setFolderImage(webViewLink || "");
                                }}
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
                                    value={committee}
                                />

                                <SelectField
                                    options={driveOptions}
                                    placeholder="Choose Drive Condition"
                                    iconValue="material-symbols:drive-export"
                                    icon="material-symbols:drive-export"
                                    language={language}
                                    languageText={languageText}
                                    required={true}
                                    setValue={setDriveCondition}
                                    regex={null}
                                    value={driveCondition} // Bind value
                                />
                            </div>
                            {driveCondition === "Drive is Ready" && (
                                <div className="formRow">
                                    <InputField
                                        placeholder={languageText.DriveLink || "Folder ID"}
                                        iconValue="mingcute:drive-fill"
                                        icon="mingcute:drive-line"
                                        type="text"
                                        required={true}
                                        language={language}
                                        languageText={languageText}
                                        setValue={setFolderLink}
                                        regex={null}
                                        value={folderLink} // This is the ID
                                    />
                                </div>
                            )}
                            {/* {driveLink} */}
                            <AnimatePresence mode="popLayout">
                                {submitError &&
                                    <ErrorContainer error={submitError} setError={setError} />}
                            </AnimatePresence>
                            <FormButton icon="hugeicons:task-done-01" text={languageText.SubmitForm} />
                        </motion.form>

                    </motion.div>

                )}

        </div>
    )
}

export default EditGallery;