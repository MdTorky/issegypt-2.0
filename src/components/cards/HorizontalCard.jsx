import React from 'react'
import CircularButton from '../CircularButton';
import { AnimatePresence, motion } from "framer-motion";
import { useAuthContext } from '../../hooks/useAuthContext';
import useDelete from '../../hooks/useDelete';
import Loader from '../loaders/Loader';
import { usePopup } from "../../contexts/PopupContext";
import UserType from '../UserType';




const HorizontalCard = ({ helpingData, language, languageText, api, setSuccessText, ai }) => {
    const { user } = useAuthContext()


    const iconFinder = (type) => {
        if (type === "Website") {
            return "pepicons-pop:internet-circle-filled";
        } else if (type === "Location") {
            return "material-symbols:share-location-rounded";
        } else if (type === "Email") {
            return "entypo:email";
        } else if (type === "IOS") {
            return "ic:baseline-apple";
        } else if (type === "Android") {
            return "uil:android";
        } else if (type === "ImageLink") {
            return "fluent:image-copy-28-filled";
        } else if (type === "WhatsApp") {
            return "ant-design:whats-app-outlined";
        } else if (type === "YouTube") {
            return "mingcute:youtube-fill";
        } else if (type === "Instagram") {
            return "mdi:instagram";
        } else if (type === "Description") {
            return "tabler:file-description-filled";
        } else if (type === "Download") {
            return "mingcute:download-3-fill";
        } else if (type === "Link") {
            return "f7:link-circle-fill";
        } else if (type === "Bus") {
            return "fa6-solid:bus";
        } else if (type === "Other") {
            return "icon-park-solid:other";
        } else {
            return "icon-park-solid:other"; // Default icon if type is unknown
        }
    };

    const { showPopup } = usePopup();


    console.log(helpingData)
    const operationType = (type, aType, link) => {
        if (type === "Bus") {
            showPopup(type, aType, link);
        }
    };



    const InputChildVariants = {
        hidden: { opacity: 0, scale: 0 },
        visible: {
            opacity: 1, scale: 1,
            transition: {
                type: "spring",
                stiffness: 100,
                staggerChildren: 0.2
            }
        },
        exit: { opacity: 0, y: 50 }
    };

    const { deleteItem, error, setError, deleteLoading } = useDelete();


    const handleDelete = async () => {
        const isConfirmed = window.confirm(languageText.ServiceDeleteConfirmation);

        if (!isConfirmed) return;

        try {
            const url = `${api}/api/helping/${helpingData._id}`;
            const success = await deleteItem(url, "helpinghands", helpingData._id, languageText.ServiceDeletedMessage);
            if (success) {
                setSuccessText(languageText.ServiceDeletedMessage);
            }
        } catch (err) {
            console.error("Deletion failed:", err);
            setError(err.message || "Failed to delete item");
        }
    };



    return (
        <motion.div
            variants={InputChildVariants}
            whileHover={{
                scale: 1.1,
                transition: {
                    duration: 2,
                    type: 'spring',
                    stiffness: 100
                }
            }}
            className="mx-auto">

            {deleteLoading ? (
                <Loader text={languageText.Deleting} />
            ) : (

                <div className="relative flex  items-center mt-6 border-4 dark:border-3 border-darktheme2 dark:border-whitetheme  ring-6 ring-whitetheme  bg-radial  from-whitetheme2 to-whitetheme dark:from-darktheme dark:to-darktheme2 shadow-md bg-clip-border rounded-xl w-70 md:w-80 h-fit dark:outline-3 outline-darktheme2">
                    <div
                        className={`relative h-25 w-35 overflow-hidden text-white shadow-lg bg-clip-border rounded-xl bg-blue-gray-500 shadow-blue-gray-500/40 border-5 border-whitetheme  dark:border-darktheme  dark:outline-2 outline-whitetheme ring-6 ring-darktheme bg-center bg-cover bg-radial from-darktheme to-darktheme2 p-2 ${language === 'en' ? "-ml-6" : "-mr-6"} `}>
                        <img
                            src={helpingData.img}
                            alt={language === "en" ? helpingData.name : helpingData.aName}
                            className={` bg-center bg-cover w-full h-full  ${ai === "true" ? "brightness-0 invert-100 " : ""}`}
                        />
                    </div>
                    <div className={`flex flex-col w-full ${language === 'en' ? "ml-3" : "mr-3"}`} >
                        <div className="pt-6 pb-3 w-full">
                            <h5 className="flex text-xl font-semibold text-redtheme dark:text-whitetheme">
                                {language === "en" ? helpingData.name : helpingData.aName}
                            </h5>
                            {helpingData.description &&
                                <p className="flex font-light leading-none text-sm dark:text-gray-400">
                                    {language === "en" ? helpingData.description : helpingData.aDescription}
                                </p>
                            }


                        </div>
                        <div className="w-full flex justify-end  px-3">
                            <div className="p-2  flex rounded-xs items-center justify-end gap-4 w-full !text-xs">
                                {helpingData.links.sort((a, b) => a.type < b.type ? 1 : -1).map((link) => {
                                    return (
                                        <CircularButton
                                            key={link.url}
                                            icon={iconFinder(link.type)}
                                            text={link.type}
                                            aText={link.aType}
                                            link={link.url}
                                            type={link.type}
                                            language={language}
                                            operation={() => operationType(link.type, link.url, link.aType)}
                                        />
                                    );
                                })}
                                {UserType("All") && (
                                    <div className='bg-redtheme/80 flex gap-5 justify-between p-2 py-3 ring-2 rounded-xl ring-redtheme  border-2 border-whitetheme'>
                                        <CircularButton
                                            icon="mdi:library-edit"
                                            text={languageText.EditService}
                                            link={`/editHelpingHand/${helpingData._id}`}
                                            type="WebsiteRoute"
                                            language={language}
                                        />
                                        <CircularButton
                                            icon="material-symbols:scan-delete-rounded"
                                            text={languageText.DeleteService}
                                            operation={handleDelete}
                                            type="Operation"
                                            language={language}

                                        />
                                    </div>
                                )}

                            </div>
                        </div>
                    </div>
                </div>
            )}

        </motion.div>
    )
}

export default HorizontalCard