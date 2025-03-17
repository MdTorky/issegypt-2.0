import React, { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import useFetchDataById from "../hooks/useFetchDataById";
import { useParams } from "react-router-dom";
import { useFormsContext } from '../hooks/useFormContext'
import { AnimatePresence, motion } from "framer-motion";
import Loader from "../components/loaders/Loader";
import VerticalCard from "../components/cards/VerticalCard";
import HorizontalCard from "../components/cards/HorizontalCard";
import SuccessMessage from "../components/formInputs/SuccessMessage";
import { useScrollAnimations } from "../hooks/useScrollAnimations";
import SearchInput from "../components/formInputs/SearchInput";
import ScrollToTop from "../components/ScrollToTop";


const Service = ({ language, languageText, api }) => {
    const { link } = useParams()

    const { services, helpinghands, dispatch } = useFormsContext();
    const [successText, setSuccessText] = useState()
    const [searchQuery, setSearchQuery] = useState("");

    const {
        scaleDown,
        translateY,
        opacityDown,
        scaleBackground,
        fixedScaleDown,
        y
    } = useScrollAnimations();

    const { data: serviceData, loading: serviceLoading, error: serviceError } = useFetchDataById(`${api}/api/service/service/${link}`);
    useEffect(() => {
        if (serviceData && !serviceLoading && !serviceError) {
            dispatch({
                type: "SET_ITEM",
                collection: "services",
                payload: serviceData,
            });
        }
    }, [serviceData, serviceLoading, serviceError, dispatch]);

    const { data: helpingData, loading, error } = useFetchDataById(`${api}/api/helping/service/${link}`);
    useEffect(() => {
        if (helpingData && !loading && !error) {
            dispatch({
                type: "SET_ITEM",
                collection: "helpinghands",
                payload: helpingData,
            });
        }
    }, [helpingData, loading, error, dispatch]);


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

    const currentHelpingHands = helpinghands || [];

    const filteredServices = currentHelpingHands?.filter((service) => {
        const searchRegex = new RegExp(searchQuery, 'i');
        return (
            (searchRegex.test(service.name) ||
                searchRegex.test(service.aName) ||
                searchRegex.test(service.description) ||
                searchRegex.test(service.aDescription)
            )
        )
    });

    useEffect(() => {
        document.title = serviceData?.name + " | " + languageText.ISSEgyptGateway
    }, []);


    return (
        <div className="mb-10 flex relative">
            {(serviceLoading || loading) ? (
                <div className="h-screen flex items-center justify-center w-full">
                    <Loader text={languageText.Loading} />
                </div>
            ) : !serviceData ? (
                <div className="w-full flex justify-center items-center h-screen p-5 rounded-xl text-whitetheme">
                    <div className="noData text-4xl lg:text-8xl">
                        <Icon icon="iconamoon:dislike-fill" />{languageText.NoService}
                    </div>
                </div>
            ) : ((serviceLoading && loading) && serviceError || error) ? (
                <div className="w-full flex justify-center items-center h-screen p-5 rounded-xl text-whitetheme">
                    <div className="noData text-4xl lg:text-8xl">
                        <Icon icon="iconamoon:dislike-fill" />{languageText.NoService}
                    </div>
                </div>

            ) : (
                <div className="w-full flex flex-col items-center  gap-10">
                    <div className="relative w-full h-[60vh] md:h-[80vh] flex items-center justify-center bg-cover bg-center">

                        <motion.img
                            src={serviceData.bgImage}
                            className="absolute w-full h-300 m-auto left-0 right-0 object-cover brightness-30"
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

                                    className="text-xl md:text-5xl text-redtheme">
                                    {language === "en" ? serviceData?.description : serviceData?.aDescription}
                                </motion.p>
                                <motion.h1
                                    initial={{ y: -20, scale: 0, opacity: 0 }}
                                    animate={{ y: 0, scale: 1, opacity: 1 }}
                                    exit={{ y: -20, opacity: 0 }}
                                    transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
                                    className="text-6xl md:text-9xl font-bold w-full mx-auto text-whitetheme">
                                    {language === "en" ? serviceData?.name : serviceData?.aName}
                                </motion.h1>
                            </AnimatePresence>
                        </div>
                    </div>


                    <div className="mt-100 flex flex-col items-center  gap-10 px-10">
                        <motion.h2
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ opacity: 0, scale: 0 }}
                            transition={{ duration: 0.9, delay: 0.1, type: "spring" }}
                            className="serviceTitle"
                        >
                            {language === "en" ? serviceData?.name : serviceData?.aName}
                            <span className="text-darktheme2 dark:text-whitetheme"></span>

                        </motion.h2>
                        <SearchInput languageText={languageText} language={language} onSearch={(query) => setSearchQuery(query)} />
                        <motion.div
                            variants={{
                                visible: { transition: { staggerChildren: 0.2 } },
                                exit: { transition: { staggerChildren: 0.1 } },
                            }}
                            initial="hidden"
                            animate="visible"
                            className="flex justify-center gap-10 w-full flex-wrap">
                            {serviceData?.groups.length > 0 && serviceData?.groups.map((group, index) => (
                                <motion.div
                                    variants={InputChildVariants}
                                    key={index}
                                    className="serviceContainer"
                                >
                                    <h1 className="serviceContainerTitle">
                                        {language === "en" ? group.name : group.aName}
                                    </h1>



                                    <motion.div
                                        variants={InputChildVariants}
                                        className="flex flex-col gap-5 mb-5"
                                    >
                                        {filteredServices
                                            .filter((helping) => helping.group === group.name)
                                            .map((helping, index) => (
                                                serviceData.card === "Vertical" ? (
                                                    <VerticalCard
                                                        key={helping._id}
                                                        helpingData={helping}
                                                        language={language}
                                                        languageText={languageText}
                                                        api={api}
                                                        setSuccessText={setSuccessText}

                                                    />
                                                ) : (
                                                    <HorizontalCard
                                                        key={helping._id}
                                                        helpingData={helping}
                                                        language={language}
                                                        languageText={languageText}
                                                        api={api}
                                                        setSuccessText={setSuccessText}
                                                        ai={link === "aitools" ? "true" : "false"}
                                                    />
                                                )
                                            ))}
                                        {(!filteredServices.length ||
                                            filteredServices.filter((helping) => helping.group === group.name).length === 0) && (
                                                <div className="noData m-auto">
                                                    <Icon icon="iconamoon:dislike-fill" />{languageText.NoData}

                                                </div>
                                            )}
                                    </motion.div>
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>
                </div>
            )}
            <AnimatePresence>
                {successText && <SuccessMessage languageText={languageText} text={successText} setValue={setSuccessText} language={language} />}
            </AnimatePresence>
            <ScrollToTop languageText={languageText} />

        </div>
    );
};

//             ) : (
//                 <div className="mt-30 w-full flex flex-col items-center px-10 gap-10">
//                     <motion.h2
//                         initial={{ scale: 0, opacity: 0 }}
//                         animate={{ scale: 1, opacity: 1 }}
//                         exit={{ opacity: 0, scale: 0 }}
//                         transition={{ duration: 0.9, delay: 0.1, type: "spring" }}
//                         className="serviceTitle"
//                     >
//                         {language === "en" ? serviceData?.name : serviceData?.aName} <span className="text-darktheme2 dark:text-whitetheme"></span>
//                     </motion.h2>
//                     <motion.div
//                         variants={{
//                             visible: { transition: { staggerChildren: 0.2 } },
//                             exit: { transition: { staggerChildren: 0.1 } },
//                         }}
//                         initial="hidden"
//                         animate="visible"
//                         className="flex justify-center gap-10 w-full flex-wrap">
//                         {serviceData?.groups.length > 0 && serviceData?.groups.map((group, index) => (
//                             <motion.div
//                                 variants={InputChildVariants}
//                                 key={index} className="serviceContainer">
//                                 <h1 className="serviceContainerTitle">{language === "en" ? group.name : group.aName}</h1>
//                                 <motion.div
//                                     variants={InputChildVariants}
//                                     className="flex flex-col gap-5 mb-5"
//                                 >
//                                     {Array.isArray(helpingData) &&
//                                         helpingData
//                                             .filter((helping) => helping.group === group.name)
//                                             .map((helping, index) => {
//                                                 return (
//                                                     serviceData.card === "Vertical" ? (
//                                                         <VerticalCard key={index} helpingData={helping} language={language} languageText={languageText} api={api} />
//                                                     ) : (
//                                                         <HorizontalCard helpingData={helping} language={language} languageText={languageText} api={api} />
//                                                     )

//                                                 )
//                                             })}
//                                     {/* Check if there are no matching items */}
//                                     {(!Array.isArray(helpingData) || helpingData.filter((helping) => helping.group === group.name).length === 0) && (
//                                         <div className="noData">
//                                             <Icon icon="iconamoon:dislike-fill" />{languageText.NoData}
//                                         </div>
//                                     )}
//                                 </motion.div>

//                             </motion.div>
//                         ))}

//                     </motion.div>
//                 </div>
//             )}
//         </div>
//     )
// }

export default Service;



