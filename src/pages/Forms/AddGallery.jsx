import { useState, useEffect } from "react";
import SelectField from "../../components/formInputs/SelectField";
import useSubmitForm from "../../hooks/useSubmitForm";
import ErrorContainer from "../../components/formInputs/ErrorContainer";
import { AnimatePresence, motion } from "framer-motion";
import Loader from "../../components/loaders/Loader";
import InputField from "../../components/formInputs/InputField";
import FormButton from "../../components/formInputs/FormButton";
import { useNavigate } from "react-router-dom";
import { useFormsContext } from '../../hooks/useFormContext';
import { useAuthContext } from '../../hooks/useAuthContext';
import DriveUploader from "../../components/formInputs/DriveImageUploader";
import useFetchData from "../../hooks/useFetchData";

// Import the new component (Ensure the file name matches what you saved)
// import DriveUploadField from "../../components/formInputs/DriveUploadField";

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

const AddGallery = ({ languageText, language, api }) => {

    const { dispatch } = useFormsContext();
    const { user } = useAuthContext();
    const navigate = useNavigate()

    const [folderName, setFolderName] = useState("");
    const [arabicFolderName, setArabicFolderName] = useState("");
    const [folderLink, setFolderLink] = useState("");
    const [driveLink, setDriveLink] = useState("");
    const [folderImage, setFolderImage] = useState(""); // This stores the Web View Link
    const [icon, setIcon] = useState("");
    const [time, setTime] = useState("");
    const [session, setSession] = useState("");
    const [committee, setCommittee] = useState("");
    const [driveCondition, setDriveCondition] = useState("");

    const { data: galleryData, loading, error: galleryError } = useFetchData(`${api}/api/gallery`);
    useEffect(() => {
        if (galleryData && !loading && !error) {
            dispatch({
                type: "SET_ITEM",
                collection: "galleries",
                payload: galleryData,
            });
        }
    }, [galleryData, galleryError, dispatch]);

    useEffect(() => {
        // Only run if a session is selected and we have galleries data
        if (session && galleryData) {

            // 1. Filter all galleries to find only the ones in the selected year
            const eventsInThisSession = galleryData.filter(g => g.session === session);

            // 2. Find the highest number currently in that year
            // We convert g.time to an Integer. If it's not a number, treat as 0.
            const maxNumber = eventsInThisSession.reduce((max, gallery) => {
                const currentNum = parseInt(gallery.time) || 0;
                return currentNum > max ? currentNum : max;
            }, 0);

            // 3. Set the new time to Max + 1
            setTime(String(maxNumber + 1));
        }
    }, [session, galleryData]);

    const sessions = [
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
        { value: "Social", label: languageText.SocialCommittee, icon: "solar:people-nearby-bold" },
        { value: "Academic", label: languageText.AcademicCommittee, icon: "heroicons:academic-cap-solid" },
        { value: "Culture", label: languageText.CultureCommittee, icon: "mdi:religion-islamic" },
        { value: "Sport", label: languageText.SportCommittee, icon: "fluent-mdl2:more-sports" },
        { value: "Women", label: languageText.WomenCommittee, icon: "healthicons:woman" },
        { value: "General", label: languageText.General, icon: "oui:integration-general" },
    ];

    const { handleSubmit, error, setError, submitLoading } = useSubmitForm();

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

        const addGallery = {
            folderName,
            arabicFolderName,
            driveLink: finalDriveLink,
            folderLink: finalFolderLink,
            folderImage, // This comes from the DriveUploadField
            icon,
            time,
            session,
            committee
        };

        await handleSubmit(`${api}/api/gallery`, "POST", addGallery, "galleries", languageText.GalleryAddMessage);
        navigate(-1);
    };

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
                    className={`w-full p-8 flex flex-col justify-center items-center m-auto rounded-xl`}
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
                            {languageText.AddGalleryForm}<span className="text-darktheme2 dark:text-whitetheme"></span>
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
                            <InputField
                                placeholder={languageText.EventNumber}
                                iconValue="solar:hashtag-circle-bold"
                                icon="solar:hashtag-circle-broken"
                                type="text"
                                required={true}
                                language={language}
                                languageText={languageText}
                                setValue={setTime}
                                value={time} // Ensure it displays the auto-calculated value
                                regex={null}
                                readOnly={true}
                            />

                        </div>

                        {/* NEW COMPONENT IMPLEMENTATION */}
                        <div className="formRow">
                            <DriveUploader
                                placeholder={languageText.EventImage}
                                iconValue="fluent:image-copy-28-filled"
                                icon="fluent:image-copy-28-regular"
                                language={language}
                                languageText={languageText}
                                required={true}
                                api={api}
                                folderId="1nscG5s3ioqUWgEuGUAYQffuZ_9HB1Kjx"
                                initialValue={folderImage}
                                onUploadComplete={(fileId, webViewLink) => {
                                    // If webViewLink is null (cleared), set empty string
                                    setFolderImage(webViewLink || "");
                                }}
                            />
                        </div>
                        <h3 className={`text-md text-redtheme ${language === "en" ? "text-left" : "text-right"}`}>{languageText.ForgetUploadIcon}</h3>
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
                                options={driveOptions}
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

                        {/* FIX: Changed "Link Ready" to "Drive is Ready" to match options array */}
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
                                />
                            </div>
                        )}

                        <AnimatePresence mode="popLayout">
                            {error &&
                                <ErrorContainer error={error.message} setError={setError} />
                            }
                        </AnimatePresence>

                        <FormButton icon="hugeicons:task-done-01" text={languageText.SubmitForm} />
                    </motion.form>
                </motion.div>
            )}
        </div>
    )
}

export default AddGallery;