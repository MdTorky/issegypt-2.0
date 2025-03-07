import React, { useState, useEffect, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Icon } from "@iconify/react";
import faculties from "../data/faculties.json";
import HandCard from "../components/cards/HandCard";
import { useScrollAnimations } from "../hooks/useScrollAnimations";
import useFetchData from "../hooks/useFetchData";
import { useFormsContext } from '../hooks/useFormContext';
import Loader from "../components/loaders/Loader";
import { Link } from "react-router-dom";
import { useAuthContext } from '../hooks/useAuthContext';
import SearchInput from "../components/formInputs/SearchInput";
import HandCardLoader from "../components/loaders/HandCardLoader";
import ScrollToTop from "../components/ScrollToTop";

const HelpingHand = ({ language, languageText, api }) => {
    const { user } = useAuthContext()
    const { services, dispatch } = useFormsContext();

    const [searchQuery, setSearchQuery] = useState("");
    const [selectedFaculty, setSelectedFaculty] = useState(null);
    const [facultyKey, setFacultyKey] = useState(0);
    const {
        handTitleOpacity,
    } = useScrollAnimations();





    // Variants for Parent-Child Animations
    const parentStagger = {
        visible: { transition: { staggerChildren: 0.2, } },
        exit: {
            transition: { staggerChildren: 0.1, },
        }

    };
    const buttonChildVariants = {
        hidden: { opacity: 0, y: -50 },
        visible: {
            opacity: 1, y: 0,
            transition: {
                type: "spring",
                stiffness: 100,
                // damping: 20
            }
        },
        exit: { opacity: 0, y: 50 }
    };

    const facultyChildVariants = {
        hidden: { x: -100, opacity: 0 },
        visible: {
            x: 0,
            opacity: 1,
            transition: {
                type: "spring",
                stiffness: 100,
                // damping: 15,
            },
        },
        exit: { x: -200, opacity: 0 }
    };




    useEffect(() => {
        if (selectedFaculty) {
            setFacultyKey((prev) => prev + 1); // Increment key to trigger re-animation
        }
    }, [selectedFaculty]);



    const FacultySocialLinkButton = ({ text, icon, color, link, webLink }) => {
        const handleClick = () => {
            if (link) {
                window.open(link, "_blank");
            }
        };

        return (
            <motion.div
                variants={buttonChildVariants}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.5 }}
                className={`generalButton group ${color}`}
                onClick={handleClick} // ✅ Handle external link click
            >
                {webLink ? ( // ✅ If webLink exists, use <Link>
                    <Link to={webLink} className="flex items-center">
                        <Icon icon={icon} />
                        <div className={`generalButtonText ${color}`}>{text}</div>
                    </Link>
                ) : ( // ✅ If no webLink, just render the button content
                    <>
                        <Icon icon={icon} />
                        <div className={`generalButtonText ${color}`}>{text}</div>
                    </>
                )}
            </motion.div>
        );
    };



    const FacultyLinkButton = memo(({ faculty, index }) => {
        return (
            <motion.div
                key={index}
                variants={buttonChildVariants}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col justify-center items-center gap-2"
            >
                <button
                    onClick={() => setSelectedFaculty(faculty)}
                    className={`generalButton group !bg-darktheme2 ${selectedFaculty?.id === faculty.id && "!bg-redtheme"}`}
                >
                    <Icon icon={selectedFaculty?.id === faculty.id ? faculty.iconFull : faculty.icon} />
                    <div className={`generalButtonText !bg-darktheme2 !text-lg`}>
                        {faculty.abb}
                    </div>
                </button>
                <p className="w-15 text-center text-whitetheme text-xs">{language === "en" ? faculty.title : faculty.aTitle}</p>
            </motion.div>
        );
    });



    const nextFaculty = () => {
        if (!selectedFaculty) {
            setSelectedFaculty(faculties[0]);
            return;
        }

        const currentIndex = faculties.findIndex(faculty => faculty.id === selectedFaculty.id);
        const nextIndex = (currentIndex + 1) % faculties.length;
        setSelectedFaculty(faculties[nextIndex]);
    };

    const previousFaculty = () => {
        if (!selectedFaculty) {
            setSelectedFaculty(faculties[faculties.length - 1])
            return;
        }

        const currentIndex = faculties.findIndex(faculty => faculty.id === selectedFaculty.id);
        const prevIndex = (currentIndex - 1 + faculties.length) % faculties.length;
        setSelectedFaculty(faculties[prevIndex]);
    };

    const { data: serviceData, loading, error } = useFetchData(`${api}/api/service`);
    useEffect(() => {
        if (serviceData && !loading && !error) {
            dispatch({
                type: "SET_ITEM",
                collection: "services",
                payload: serviceData,
            });
        }
    }, []);

    const filteredServices = serviceData?.filter((service) =>
        service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.aName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.aDescription.toLowerCase().includes(searchQuery.toLowerCase())
    );


    const extraHands = [
        {
            name: "Internships",
            aName: "التدريب",
            description: "Find a Job Quicker",
            aDescription: "دورلك على شغل يرم عظمك",
            icon: "hugeicons:permanent-job",
            url: "/internships"
        }
    ]

    return (
        <div className="relative w-full  overflow-hidden">
            {/* {loading ? (
                <Loader text={languageText.Loading} />
            ) : (<> */}
            <motion.img
                src="https://www.freevector.com/uploads/vector/preview/31065/Vecteezy_Background-Red_BK1120.jpg"
                alt="Background Image"
                className="sticky object-cover w-[90%] h-[380px] mx-auto mt-30 rounded-4xl ring-darktheme2 ring-3 border-4 border-whitetheme "
                initial={{ opacity: 0, scale: 1.2 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, ease: "linear", type: "spring", stiffness: 100, }}
            />

            {/* Content Overlay */}

            <div
                className="absolute top-40 left-0 right-0 flex items-center justify-center"
            >
                <div className="text-center text-white flex justify-between gap-3 items-center  md:w-full">
                    <motion.a
                        className="text-lg md:text-2xl mb-6 w-1/3 md:w-full"
                        initial={{ y: -50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 1, delay: 0.3, type: "spring", stiffness: 200 }}
                        href="#helpingHand"
                    >
                        {languageText.HelpingHand}
                    </motion.a>
                    <motion.h1
                        className="text-3xl md:text-5xl font-bold mb-4 tracking-wide w-1/3 md:w-full"
                        initial={{ y: -50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 1, type: "spring", stiffness: 200, }}
                    >
                        {languageText.UTMFaculties}
                    </motion.h1>
                    <motion.p
                        className="text-lg md:text-2xl mb-6 w-1/3 md:w-full"
                        initial={{ y: -50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1, }}
                        transition={{ duration: 1, delay: 0.3, type: "spring", stiffness: 200, }}

                    >
                        {languageText.Services}
                    </motion.p>
                </div>
            </div>

            {/* Main Container */}
            <motion.div
                className="absolute w-[80%] h-fit lg:h-[600px] lg:top-60 top-70 left-0 right-0 mx-auto rounded-4xl bg-radial from-darktheme to-darktheme2 py-10 lg:py-50 ring-0 ring-gray-300 flex lg:flex-row flex-col justify-around items-center gap-10 lg:gap-30 shadow-[0_3px_10px_rgb(0,0,0,0.2)]
                "
                initial={{ opacity: 0, scale: 0.3 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, ease: "linear", type: "spring", stiffness: 100, }}
            >

                {/* <div className="absolute w-300 rounded-4xl h-90 bg-red-900 top-60 !z-0"></div> */}
                {/* Left Part */}
                {selectedFaculty && (
                    <AnimatePresence mode="popLayout">
                        <motion.div
                            key={facultyKey}
                            className={`w-100 lg:text-start text-center ${language === "en" ? "lg:pl-5" : "lg:pr-5"}`}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            variants={parentStagger}
                        >
                            <motion.p variants={facultyChildVariants} className="text-2xl text-gray-400">{languageText.FacultyOf}</motion.p>
                            <motion.h1 variants={facultyChildVariants} className="text-[4em] leading-none lg:text-6xl 2xl:text-8xl text-redtheme lg:w-full m-auto w-[85%]">{language === "en" ? selectedFaculty.title : selectedFaculty.aTitle}</motion.h1>
                            <motion.p variants={facultyChildVariants} className="text-2xl text-gray-400">Faculty Description</motion.p>
                            <motion.p variants={facultyChildVariants} className="text-1xl text-gray-400">{selectedFaculty.email}</motion.p>
                            <div className=" flex flex-col items-center justify-center gap-4 bg-darktheme p-4 rounded-lg ring-3 2xl:px-10 ring-gray-400 w-fit m-auto lg:m-0 lg:mt-5 mt-5">
                                <p className="text-2xl text-gray-400 ">{languageText.FacultyLinks}</p>
                                {/* <AnimatePresence mode="popLayout"> */}
                                <motion.div
                                    initial="hidden"
                                    animate="visible"
                                    exit="exit"
                                    variants={parentStagger}
                                    key={facultyKey}
                                    className=" flex gap-4 items-center">
                                    <FacultySocialLinkButton
                                        text={languageText.Website}
                                        icon={"pepicons-pencil:internet-circle"}
                                        color="!bg-darktheme2"
                                        link={selectedFaculty.website}
                                    />
                                    <FacultySocialLinkButton
                                        text={languageText.Email}
                                        icon={"entypo:email"}
                                        color={"!bg-red-900"}
                                        link={selectedFaculty.email2}
                                    />
                                    <FacultySocialLinkButton
                                        text={languageText.Location}
                                        icon={"material-symbols:share-location-rounded"}
                                        color={"!bg-blue-900"}
                                        link={selectedFaculty.location}
                                    />
                                </motion.div>
                                {/* </AnimatePresence> */}
                            </div>
                        </motion.div>
                    </AnimatePresence>

                )}

                {/* Middle Part */}
                {selectedFaculty && (

                    <AnimatePresence mode="wait">
                        <motion.div
                            className="w-60 h-60 lg:w-100 lg:h-100 rounded-full bg-radial from-darktheme to-darktheme2 text-whitetheme flex items-center justify-center before:absolute before:w-70 before:h-70 lg:before:w-110 lg:before:h-110 before:rounded-full before:border-y-5 before:border-redtheme2 relative "

                        >
                            <motion.img
                                key={facultyKey}
                                initial={{ opacity: 0, rotate: "-180deg", filter: "blur(50px)", scale: 0.2 }}
                                animate={{ opacity: 1, rotate: "0deg", filter: "blur(0)", scale: 1 }}
                                exit={{ opacity: 0, rotate: "180deg", filter: "blur(0)" }}
                                transition={{ duration: 0.3, ease: "easeInOut" }}
                                src={selectedFaculty.image}
                                className="object-cover w-[90%] h-[90%] rounded-full ring-2 ring-whitetheme2 border-darktheme2 border-10"
                                alt=""
                            />

                            <motion.button
                                whileHover={{
                                    scale: 1.3,
                                    border: "1px solid var(--whitetheme)"
                                }}
                                whileTap={{
                                    scale: 0.8
                                }}
                                transition={{
                                    duration: 0.5, ease: "linear", type: "spring"
                                }}
                                className="absolute -left-10 lg:-left-12 top-1/2 transform -translate-y-1/2 bg-darktheme  text-whitetheme  rounded-full p-2 cursor-pointer ring-3 ring-redtheme2 "

                                onClick={language === "en" ? previousFaculty : nextFaculty}

                            >
                                <Icon icon='solar:map-arrow-left-bold-duotone' />
                            </motion.button>
                            <motion.button
                                whileHover={{
                                    scale: 1.3,
                                    border: "1px solid var(--whitetheme)",
                                    background: "var(--redtheme2)"
                                }}
                                whileTap={{
                                    scale: 0.8
                                }}
                                transition={{
                                    duration: 0.5, ease: "linear", type: "spring"
                                }}
                                className="absolute lg:-right-12 -right-10 top-1/2 transform -translate-y-1/2 bg-darktheme  text-whitetheme rounded-full p-2 cursor-pointer ring-3 ring-redtheme2"
                                onClick={language === "en" ? nextFaculty : previousFaculty}

                            >
                                <Icon icon='solar:map-arrow-right-bold-duotone' />
                            </motion.button>
                        </motion.div>
                    </AnimatePresence>
                )}

                {/* Right Part */}
                <div
                    className={` flex flex-col items-center gap-3 w-80 ${!selectedFaculty && "lg:scale-180 w-full "}`}
                // transition={{ duration: 0.5, delay: 0.6 }}

                >
                    <p className="text-2xl text-gray-400">{languageText.ChooseFaculty}</p>
                    <AnimatePresence mode="wait">
                        <motion.div
                            variants={parentStagger}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            transition={{ duration: 0.5 }}
                            className="flex gap-3 lg:gap-7 items-center flex-wrap justify-center"
                        >
                            {faculties &&
                                faculties.map((faculty, index) => (
                                    <FacultyLinkButton faculty={faculty} index={index} />
                                ))}
                        </motion.div>
                    </AnimatePresence>
                    {selectedFaculty && (
                        <div

                            className="mt-5 flex flex-col items-center justify-center gap-4 bg-darktheme p-4 px-10 rounded-lg ring-3 ring-gray-400"
                        >
                            <p className="text-2xl text-gray-400">{languageText.ISSEGYPTLINKS}</p>
                            <AnimatePresence mode="popLayout">
                                <motion.div
                                    variants={parentStagger}
                                    initial="hidden"
                                    animate="visible"
                                    exit="exit"
                                    key={facultyKey}
                                    className="flex gap-4">
                                    <FacultySocialLinkButton
                                        text={languageText.DriveLink}
                                        icon={"mingcute:drive-fill"}
                                        color="!bg-[#498af4]"
                                        // link={selectedFaculty.driveLink}
                                        webLink={`/drive/${selectedFaculty.explorerLink}`}
                                    />
                                    <FacultySocialLinkButton
                                        text={languageText.WhatsappGroup}
                                        icon={"ant-design:whats-app-outlined"}
                                        color={"!bg-[#25D366]"}
                                        link={selectedFaculty.group}
                                    />
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    )}
                </div>
            </motion.div>

            <div className={`w-[80%] m-auto lg:mt-100 ${selectedFaculty ? "mt-250" : "mt-40"}`} id="helpingHand">
                <div className="flex justify-between lg:flex-row flex-col py-2 gap-3 items-center">
                    {user && <motion.div id className="text-2xl text-gray-400"><Link to="/addService">
                        {languageText.AddService}
                    </Link></motion.div>}
                    <motion.h1 id className="text-6xl text-center lg:text-5xl text-redtheme">{languageText.HelpingHand}</motion.h1>
                    <SearchInput languageText={languageText} language={language} onSearch={(query) => setSearchQuery(query)} />

                </div>


                <motion.div className="my-10 flex flex-wrap gap-10 justify-center">
                    {loading ? Array.from({ length: 6 }).map((_, index) => (
                        <HandCardLoader key={index} />
                    )) :
                        filteredServices.length <= 0 ? (
                            <div className="w-full flex justify-center items-center p-5 rounded-xl text-whitetheme">
                                <div className="noData text-5xl">
                                    <Icon icon="fa-solid:sad-tear" />{languageText.NoServices}
                                </div>
                            </div>
                        ) :
                            <motion.div
                                variants={parentStagger}
                                initial="hidden"
                                animate="visible"
                                className="flex flex-wrap gap-10 justify-center"
                            >

                                {extraHands.map((hand) => (
                                    <HandCard
                                        service={hand}
                                        language={language}
                                        languageText={languageText}
                                    />
                                ))}
                                {filteredServices.sort((a, b) => a.name > b.name ? 1 : -1).map((service, index) => (
                                    <HandCard
                                        index={index}
                                        service={service}
                                        language={language}
                                        languageText={languageText}
                                    />
                                ))}
                            </motion.div>
                    }
                </motion.div>
            </div>
            {/* </>)} */}
            <ScrollToTop languageText={languageText} />

        </div >
    );
};

export default HelpingHand