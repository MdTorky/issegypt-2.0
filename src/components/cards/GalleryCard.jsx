import React from 'react'
import { motion, useReducedMotion } from "framer-motion";
import { Icon } from "@iconify/react";
import { useAuthContext } from '../../hooks/useAuthContext';
import CircularButton from '../CircularButton';
import { Link } from 'react-router-dom';


const GalleryCard = ({ languageText, language, gallery }) => {
    const { user } = useAuthContext()

    const shouldReduceMotion = useReducedMotion();


    const InputChildVariants = {
        hidden: { opacity: 0, y: -100 },
        visible: {
            opacity: 1, y: 0,
            transition: {
                type: "spring",
                stiffness: 100,
                staggerChildren: 0.5
            }
        },
        exit: {
            opacity: 0, y: 50, transform: {
                staggerChildren: 0.5
            }
        }
    };


    // className='w-100 h-120 lg:h-100 lg:hover:h-120 transition-all duration-300 ease-in-out bg-darktheme2/ ring-3 border-7 border-whitetheme/0 ring-darktheme dark:ring-whitetheme shadow-2xl  rounded-[30px] group relative  overflow-hidden'>
    return (
        <motion.div
            variants={InputChildVariants}
            className='h-120 flex items-end px-10'>
            <div
                className='w-95 h-120 lg:h-100 lg:hover:h-120 transition-all duration-300 ease-in-out bg-darktheme2/80 ring-3 ring-darktheme/60 dark:ring-darktheme shadow-2xl  rounded-[30px] group relative  overflow-hidden'>
                <div className="w-full h-100 relative bg-contain bg-top overflow-hidden rounded-[30px]">
                    <img
                        src={gallery.folderImage}
                        className="w-full h-full object-cover rounded-[30px] shadow-[0_3px_10px_rgb(0,0,0,0.2)]"
                    />

                    <div className="absolute bottom-0 left-0 right-0 flex m-auto w-full h-80 bg-gradient-to-t from-darktheme2 via-darktheme2/95 to-transparent z-10 rounded-b-[30px] "></div>

                    {user &&

                        <div className=' flex gap-5 justify-between p-2 py-3 rounded-xl  right-5 absolute top-3 z-10'>
                            <CircularButton
                                icon="fluent:image-edit-16-filled"
                                text={languageText.EditService}
                                link={`/editgallery/${gallery._id}`}
                                type="WebsiteRoute"
                                language={language}
                            />

                        </div>
                    }

                    <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-darktheme /70 to-transparent z-10"
                        initial={{ x: "-100%", y: "0%" }}
                        variants={{
                            initial: { opacity: 0, x: "-100%", y: "0%" },
                            hover: { opacity: 1, x: "100%", y: "0%" },
                        }}
                        transition={{ duration: 1.5, ease: "linear" }}
                        animate={!shouldReduceMotion ? {} : { opacity: 0 }}
                    />



                    <div className={` absolute bottom-10  text-5xl text-whitetheme z-20 w-[85%] ${language === "en" ? "left-10" : "right-10"}`}>
                        {/* <Icon icon={gallery.icon} /> */}
                        <h1>{language === "en" ? gallery.folderName : gallery.arabicFolderName}</h1>
                    </div>

                </div>

                {gallery.folderLink === "Coming Soon" ? (
                    <div className='absolute bottom-5 flex w-full justify-center gap-5 px-4 mt-3'>
                        <div className='w-full p-2 bg-redtheme text-whitetheme rounded-xl flex items-center justify-center gap-3 cursor-pointer'>COMING SOON</div>
                    </div>
                ) : (
                    <div className='absolute bottom-5 flex w-full justify-center gap-5 px-4 mt-3'>
                        <button onClick={() => window.open(gallery.folderLink, "_blank")} className='w-full p-2 bg-[#FCF6F5FF] text-[#89ABE3] rounded-xl flex items-center justify-center gap-3 cursor-pointer hover:text-[#FCF6F5FF] hover:bg-[#89ABE3] transition-all duration-300 hover:scale-110'> <Icon icon="fluent:folder-24-filled" />{languageText.DriveLink}</button>
                        {gallery.driveLink && <Link to={`/gallery/${gallery._id}`} className='w-full p-2 bg-[#89ABE3] text-[#FCF6F5FF] rounded-xl flex items-center justify-center gap-3 cursor-pointer hover:bg-[#FCF6F5FF] hover:text-[#89ABE3] transition-all duration-300 hover:scale-110'><Icon icon="mingcute:grid-2-fill" />{languageText.GalleryLink}</Link>}
                    </div>
                )}
            </div>
        </motion.div>
    )
}
// 
export default GalleryCard