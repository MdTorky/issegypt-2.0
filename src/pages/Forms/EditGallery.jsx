import React, { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
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


const EditGallery = ({ language, languageText, api }) => {
    const { id } = useParams(); // Get the ID of the Helping Hand from the URL
    const navigate = useNavigate()
    const { galleries, dispatch } = useFormsContext();


    const [folderName, setFolderName] = useState(""); // Selected service
    const [arabicFolderName, setArabicFolderName] = useState(""); // Selected group
    const [folderLink, setFolderLink] = useState("");
    const [driveLink, setDriveLink] = useState("");
    const [folderImage, setFolderImage] = useState("");
    const [icon, setIcon] = useState("");
    const [time, setTime] = useState("");
    const [session, setSession] = useState("");


    const { data: galleryData, loading, error } = useFetchDataById(`${api}/api/gallery/${id}`);
    useEffect(() => {
        if (galleryData && !loading && !error) {
            setFolderName(galleryData.folderName);
            setArabicFolderName(galleryData.arabicFolderName);
            setFolderLink(galleryData.folderLink);
            setDriveLink(galleryData.driveLink);
            setIcon(galleryData.icon);
            setTime(galleryData.time);
            setSession(galleryData.session);
            setFolderImage(galleryData.folderImage);
        }
    }, [galleryData, loading, error]);

    const { handleSubmit, error: submitError, setError, submitLoading } =
        useSubmitForm();

    const onSubmit = async (e) => {
        e.preventDefault();

        const updatedHelpingData = {
            folderName,
            arabicFolderName,
            driveLink,
            folderLink,
            folderImage,
            icon,
            time,
            session,
        };

        await handleSubmit(`${api}/api/gallery/${id}`, "PATCH", updatedHelpingData, "galleries", languageText.GalleryUpdateMessage);
        navigate(-1);
    };



    const InputChildVariants = {
        hidden: { opacity: 0, y: -50 },
        visible: {
            opacity: 1, y: 0,
            transition: {
                type: "spring",
                stiffness: 100,
            }
        },
        exit: { opacity: 0, y: 50 }
    };

    const sessions = [
        { label: "2023", value: "2023", aValue: "2023", },
        { label: "2024", value: "2024", aValue: "2024", },
        { label: "2025", value: "2025", aValue: "2025", },
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

                            <img src={folderImage} className="w-70 shadow-xl rounded-xl ring-darktheme ring-3 dark:ring-whitetheme border-9 border-whitetheme/0" />

                            <div className="flex gap-4 w-full justify-center">
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

                            <div className="flex gap-4 w-full justify-center">
                                <InputField
                                    placeholder={languageText.EventImageLink}
                                    iconValue="fluent:image-copy-28-filled"
                                    icon="fluent:image-copy-28-regular"
                                    type="text"
                                    language={language}
                                    languageText={languageText}
                                    setValue={setFolderImage}
                                    regex={null}
                                    required={true}
                                    value={folderImage}
                                />

                                <InputField
                                    placeholder={languageText.EventIcon}
                                    iconValue="icomoon-free:spinner9"
                                    icon="icomoon-free:spinner9"
                                    type="text"
                                    required={true}
                                    language={language}
                                    languageText={languageText}
                                    setValue={setIcon}
                                    regex={null}
                                    value={icon}
                                />
                            </div>


                            <div className="flex gap-4 w-full justify-center">

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
                                />
                                <SelectField
                                    options={sessions}
                                    placeholder={languageText.ChooseService}
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



                            <div className="flex gap-4 w-full justify-center">
                                <InputField
                                    placeholder={languageText.GalleryLink}
                                    iconValue="fluent:image-copy-28-filled"
                                    icon="fluent:image-copy-28-regular"
                                    type="text"
                                    language={language}
                                    languageText={languageText}
                                    setValue={setDriveLink}
                                    regex={null}
                                    value={driveLink}
                                />
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
                                    value={folderLink}
                                />
                            </div>
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

export default EditGallery