import React, { useEffect, useState } from 'react'
import { useScrollAnimations } from "../hooks/useScrollAnimations";
import SearchInput from '../components/formInputs/SearchInput';
import SelectField from '../components/formInputs/SelectField';
import GalleryCard from '../components/cards/GalleryCard';
import useFetchData from "../hooks/useFetchData";
import { useFormsContext } from '../hooks/useFormContext';
import { Icon } from "@iconify/react/dist/iconify.js";
import Loader from '../components/loaders/Loader';
import { AnimatePresence, motion } from 'framer-motion';
import ScrollToTop from '../components/ScrollToTop';

const Gallery = ({ languageText, language, api }) => {

    const [session, setSession] = useState("2025")
    const [committee, setCommittee] = useState("")
    const [searchQuery, setSearchQuery] = useState("");
    const {
        scaleDown,
        translateY,
        opacityDown,
        scaleBackground,
        fixedScaleDown,
        y
    } = useScrollAnimations();

    const { dispatch } = useFormsContext();

    const { data: galleryData, loading, error } = useFetchData(`${api}/api/gallery`);
    useEffect(() => {
        if (galleryData && !loading && !error) {
            dispatch({
                type: "SET_ITEM",
                collection: "galleries",
                payload: galleryData,
            });
        }
    }, [galleryData, error, dispatch]);

    const sessions = [
        { label: languageText.All, value: "", aValue: "", },
        { label: "2023", value: "2023", aValue: "2023", },
        { label: "2024", value: "2024", aValue: "2024", },
        { label: "2025", value: "2025", aValue: "2025", },
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

    const filteredGalleries = galleryData?.filter((gallery) => {
        const searchRegex = new RegExp(searchQuery, 'i');
        return (
            (searchRegex.test(gallery.folderName) || searchRegex.test(gallery.arabicFolderName)) &&
            (!session || gallery.session === session) &&
            (!committee || gallery.committee === committee)
        )
    });



    return (
        <div>
            <div className="relative w-full h-[60vh] md:h-[80vh] flex items-center justify-center bg-cover bg-center"

                style={{ backgroundImage: "url('')" }}>

                <motion.img
                    src="https://static.vecteezy.com/system/resources/thumbnails/030/551/580/small_2x/modern-art-gallery-interior-with-blank-poster-on-wall-photo.jpeg"
                    className="absolute w-full h-300 m-auto left-0 right-0 object-cover brightness-50"
                    initial={{ scale: 1.1, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 1.1, opacity: 0 }}
                    transition={{ duration: 0.6 }}
                    layout
                    style={{
                        position: fixedScaleDown,
                        scale: scaleBackground,
                        opacity: opacityDown,
                        y: translateY,
                    }}
                />

                {/* White Overlay Shape */}
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-whitetheme/80 to-transparent z-10"></div>

                {/* Content */}
                <div className="relative z-20 text-center px-4">
                    <AnimatePresence>
                        <motion.p
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: 20, opacity: 0 }}
                            transition={{ duration: 0.8, type: "spring", stiffness: 200 }}

                            className="text-xl md:text-5xl text-redtheme">{languageText.StudentGallery}</motion.p>
                        <motion.h1
                            initial={{ y: -20, scale: 0, opacity: 0 }}
                            animate={{ y: 0, scale: 1, opacity: 1 }}
                            exit={{ y: -20, opacity: 0 }}
                            transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
                            className="text-5xl md:text-8xl font-bold w-[85%] mx-auto text-whitetheme">
                            {languageText.StudentGalleryDesc}
                        </motion.h1>
                    </AnimatePresence>
                </div>
            </div>

            <div className='my-10 flex flex-col justify-center items-center gap-10 mt-100'>

                {/* <h1 className={`formTitle !text-7xl lg:!text-9xl !mb-0 flex flex-wrap m-auto gap-4 ${language === "ar" && "flex-row-reverse "}`}>{languageText.ISSEGYPT} <span className='text-darktheme2 dark:text-whitetheme2'>{languageText.Gallery}</span></h1> */}
                <h1
                    className={`formTitle !text-7xl justify-center lg:!text-9xl !mb-0 flex flex-wrap m-auto gap-4`}>
                    {(() => {
                        const words = languageText.ISSEGYPTGallery.split(" ");
                        const lastWord = words.pop(); // Remove the last word
                        return (
                            <>
                                {words.join(" ")} {/* Join remaining words */}
                                {words.length > 0 && " "} {/* Add space if needed */}
                                <span className="text-darktheme2 dark:text-whitetheme2">{lastWord}</span>
                            </>
                        );
                    })()}
                </h1>
                <div className='lg:w-2/4 w-full flex  lg:flex-row justify-center items-center z-20 gap-2 lg:gap-10 flex-col-reverse'>
                    <div className='w-[40%] lg:w-[20%]'>
                        <SelectField
                            options={sessions}
                            placeholder={languageText.ChooseService}
                            iconValue="mdi:update"
                            icon="mdi:update"
                            language={language}
                            languageText={languageText}
                            setValue={setSession}
                            regex={null}
                            value={session}
                        />
                    </div>
                    <div className='w-[40%] lg:w-[30%]'>
                        <SelectField
                            options={committeeOptions}
                            placeholder={languageText.ChooseCommittee}
                            iconValue="fluent:people-team-16-filled"
                            icon="fluent:people-team-16-regular"
                            language={language}
                            languageText={languageText}
                            setValue={setCommittee}
                            regex={null}
                            value={committee}
                        />
                    </div>
                    <SearchInput languageText={languageText} language={language} onSearch={(query) => setSearchQuery(query)} />


                </div>

                {loading ? (
                    <Loader text={languageText.Loading} />
                ) :
                    !filteredGalleries || filteredGalleries.length <= 0 ? (
                        <div className="w-full flex justify-center items-center p-5 rounded-xl text-whitetheme">
                            <div className="noData text-4xl lg:text-8xl">
                                <Icon icon="iconamoon:dislike-fill" />{languageText.NoEventYet}
                            </div>
                        </div>
                    ) : (
                        <AnimatePresence>
                            <motion.div
                                variants={{
                                    visible: { transition: { staggerChildren: 0.2 } },
                                    exit: { transition: { staggerChildren: 0.1 } },
                                }}
                                initial="hidden"
                                animate="visible"
                                className='flex justify-center gap-5 flex-wrap lg:-mt-15'>
                                {filteredGalleries.sort((a, b) => a.time - b.time).map((gallery, index) => (
                                    <GalleryCard language={language} gallery={gallery} languageText={languageText} />
                                ))}
                            </motion.div>
                        </AnimatePresence>
                    )}
            </div>
            <ScrollToTop languageText={languageText} />


        </div>
    )
}

export default Gallery