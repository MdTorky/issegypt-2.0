import React from 'react'
import { Icon } from "@iconify/react";
import CircularButton from '../CircularButton';
import { AnimatePresence, motion } from "framer-motion";
import { useAuthContext } from '../../hooks/useAuthContext';
import useDelete from '../../hooks/useDelete';
import SuccessMessage from '../formInputs/SuccessMessage';
import Loader from '../loaders/Loader';


const InternCard = ({ intern, language, languageText, api, setSuccessText }) => {
    const { user } = useAuthContext()


    const InputChildVariants = {
        hidden: { opacity: 0, scale: 0 },
        visible: {
            opacity: 1, scale: 1,
            transition: {
                type: "spring",
                stiffness: 100,
                staggerChildren: 0.3
            }
        },
        exit: { opacity: 0, y: 50 }
    };

    // const { deleteItem, error, successMessage, setError, setSuccessMessage, deleteLoading } = useDelete();

    // const handleDelete = async () => {
    //     const isConfirmed = window.confirm(languageText.ServiceDeleteConfirmation);

    //     if (!isConfirmed) return;

    //     try {
    //         const url = `${api}/api/helping/${helpingData._id}`;
    //         // Pass _id instead of id to match with your data structure
    //         const success = await deleteItem(url, "helpinghands", helpingData._id, languageText.ServiceDeletedMessage);
    //         if (success) {
    //             setSuccessText(languageText.ServiceDeletedMessage);
    //         }
    //     } catch (err) {
    //         console.error("Deletion failed:", err);
    //         setError(err.message || "Failed to delete item");
    //     }
    // };

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
            className="mx-auto !ltr">
            <div className="relative flex flex-col mt-6 border-4 dark:border-3 border-darktheme2 dark:border-whitetheme  ring-6 ring-whitetheme  bg-radial  from-whitetheme2 to-whitetheme dark:from-darktheme dark:to-darktheme2 shadow-md bg-clip-border rounded-xl w-70 dark:outline-3 outline-darktheme2">
                <div
                    className="relative h-[150px] mx-4 -mt-6 overflow-hidden text-white shadow-lg bg-clip-border rounded-xl bg-blue-gray-500 shadow-blue-gray-500/40 border-5 border-whitetheme  dark:border-darktheme  dark:outline-2 outline-whitetheme ring-6 ring-darktheme bg-center bg-cover p-1 bg-radial from-darktheme to-darktheme2">
                    <img
                        src={intern.img}
                        alt={intern.name}
                        className='bg-center bg-cover w-full h-full rounded '

                    />
                </div>
                <div className="p-6">
                    <h5 className="flex mb-2  text-xl font-semibold text-redtheme dark:text-whitetheme font-tanker">
                        {intern.name}
                    </h5>
                    {intern && intern.categories && (
                        <div className="flex flex-wrap w-full gap-1 justify-center">
                            {intern.categories.map((category) => (
                                <span key={category} className="font-tanker bg-redtheme px-2 text-whitetheme rounded">
                                    {category}
                                </span>
                            ))}
                        </div>
                    )}
                </div>
                <div className="p-2 w-[90%] m-auto mb-3 flex justify-around items-center rounded-lg  ring-0 ring-gray-400 dark:ring-whitetheme">

                    {intern.website &&
                        <CircularButton
                            key={intern.website}
                            icon="pepicons-pop:internet-circle-filled"
                            text={languageText.Website}
                            link={intern.website}
                            type="Website"
                            language={language}
                        />
                    }
                    {intern.email &&
                        <CircularButton
                            key={intern.email}
                            icon="entypo:email"
                            text={languageText.Email}
                            link={intern.email}
                            type="Email"
                            language={language}
                        />
                    }
                    {intern.applyEmail &&
                        <CircularButton
                            key={intern.applyEmail}
                            icon="akar-icons:paper-airplane"
                            text={languageText.ApplyEmail}
                            link={intern.applyEmail}
                            type="Email"
                            language={language}
                        />
                    }
                    {intern.apply &&
                        <CircularButton
                            key={intern.apply}
                            icon="mdi:arrow-top-left-bold-box"
                            text={languageText.ApplyPage}
                            link={intern.apply}
                            type="Website"
                            language={language}
                        />
                    }



                    {user && (
                        <div className='bg-redtheme/80 flex gap-5 justify-between p-2 py-3 ring-2 rounded-xl ring-redtheme  border-2 border-whitetheme'>
                            <CircularButton
                                icon="mdi:library-edit"
                                text={languageText.EditCompany}
                                link={`/editIntern/${intern._id}`}
                                type="WebsiteRoute"
                                language={language}
                            />
                        </div>
                    )}

                </div>
            </div>
        </motion.div>
    )
}

export default InternCard