import React, { useEffect, useState } from "react";
import { useScrollAnimations } from "../hooks/useScrollAnimations";
import useFetchData from "../hooks/useFetchData";
import { useFormsContext } from "../hooks/useFormContext";
import { Icon } from "@iconify/react/dist/iconify.js";
import Loader from "../components/loaders/Loader";
import { AnimatePresence, motion } from "framer-motion";
import SearchInput from "../components/formInputs/SearchInput";
import InternCard from "../components/cards/InternCard";
import MultiSelectField from "../components/formInputs/MultiSelectField";
import ScrollToTop from "../components/ScrollToTop";

const Internships = ({ languageText, language, api }) => {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [selectedLocations, setSelectedLocations] = useState([]);


    const {
        scaleDown,
        translateY,
        opacityDown,
        scaleBackground,
        fixedScaleDown,
        y
    } = useScrollAnimations();

    const { dispatch } = useFormsContext();
    const { data: internData, loading, error } = useFetchData(`${api}/api/internship`);

    useEffect(() => {
        if (internData && !loading && !error) {
            dispatch({
                type: "SET_ITEM",
                collection: "internships",
                payload: internData
            });
        }
    }, [internData, error, dispatch]);



    // Filter internships based on search query
    const filteredInternships = internData?.filter((intern) => {
        const searchRegex = new RegExp(searchQuery, "i");
        const matchesSearch = searchRegex.test(intern.name) || searchRegex.test(intern.faculty);

        const matchesCategory =
            selectedCategories.length === 0 ||
            intern.categories?.some((category) => selectedCategories.includes(category));

        const matchesLocation =
            selectedLocations.length === 0 ||
            intern.location?.some((location) => selectedLocations.includes(location));

        return matchesSearch && matchesCategory && matchesLocation;
    });

    // Faculty List
    const faculties = ["Other", "Electrical", "Computing", "Mechanical", "Civil", "Chemical"];

    // Filter internships based on faculty
    const getInternsByFaculty = (faculty) => {
        return filteredInternships?.sort((a, b) => a.name.localeCompare(b.name)).filter((intern) => intern.faculty === faculty);
    };



    const categoryOptions = [
        {
            value: 'Technology',
            label: languageText.technology,
            icon: "streamline:ai-technology-spark-solid"
        },
        {
            value: 'AI',
            label: languageText.ai,
            icon: "hugeicons:ai-brain-03"
        },
        {
            icon: "material-symbols:finance-rounded",
            value: 'Finance',
            label: languageText.finance
        },
        {
            icon: "fluent:building-retail-money-20-filled",
            value: 'Retail',
            label: languageText.retail
        },
        {
            icon: "material-symbols:precision-manufacturing-rounded",
            value: 'Manufacturing',
            label: languageText.manufacturing
        },
        {
            icon: "mdi:sim",
            value: 'Telecom',
            label: languageText.telecom
        },
        {
            icon: "hugeicons:solar-energy",
            value: 'Energy',
            label: languageText.energy
        },
        {
            icon: "mdi:transportation",
            value: 'Transport',
            label: languageText.transport
        },
        {
            icon: "icon-park-solid:entertainment",
            value: 'Entertainment',
            label: languageText.entertainment
        },
        {
            icon: "tabler:battery-automotive-filled",
            value: 'Automotive',
            label: languageText.automotive
        },
        {
            icon: "mdi:book-education",
            value: 'Education',
            label: languageText.education
        },
        {
            icon: "fa6-solid:hospital",
            value: 'Hospitality & Healthcare',
            label: languageText.hospitalityHealthcare
        },
        {
            icon: "fluent:real-estate-20-filled",
            value: 'Real Estate',
            label: languageText.realEstate
        },
        {
            icon: "qlementine-icons:media-16",
            value: 'Media & Communication',
            label: languageText.mediaCommunication
        },
        {
            icon: "carbon:ibm-consulting-advantage-assistant",
            value: 'Consulting',
            label: languageText.consulting
        },
        {
            icon: "lsicon:goods-filled",
            value: 'Consumer Goods',
            label: languageText.consumerGoods
        },
        {
            icon: "healthicons:pharmacy-outline-24px",
            value: 'Pharmaceuticals & Biotech',
            label: languageText.pharmaceuticalsBiotech
        },
        {
            icon: "mdi:aeroplane",
            value: 'Aerospace',
            label: languageText.aerospaceEngineering
        },
        {
            icon: "game-icons:chemical-drop",
            value: 'Chemical',
            label: languageText.chemical
        },
        {
            icon: "game-icons:clothes",
            value: 'Fashion',
            label: languageText.fashion
        },
        {
            icon: "fluent:food-20-filled",
            value: 'Food',
            label: languageText.food
        },
        {
            icon: "healthicons:insurance-card",
            value: 'Insurance',
            label: languageText.insurance
        },
        {
            icon: "mdi:car-cog",
            value: 'Logistics',
            label: languageText.logistics
        },
        {
            icon: "fluent-mdl2:internet-sharing",
            value: 'Internet Services',
            label: languageText.internetServices
        },
        {
            icon: "material-symbols-light:shop-rounded",
            value: 'E-Commerce',
            label: languageText.eCommerce
        },
        {
            icon: "material-symbols-light:security",
            value: 'Cybersecurity',
            label: languageText.security
        },
        {
            icon: "game-icons:archive-research",
            value: 'Research',
            label: languageText.research
        }
    ];


    const locationOptions = [
        {
            value: 'Johor',
            label: "Johor"
        },
        {
            value: 'Kedah',
            label: "Kedah"
        },
        {
            value: 'Kelantan',
            label: "Kelantan"
        },
        {
            value: 'Kuala Lumpur',
            label: "Kuala Lumpur"
        },
        {
            value: 'Melacca',
            label: "Melacca"
        },
        {
            value: 'Negeri Sembilan',
            label: "Negeri Sembilan"
        },
        {
            value: 'Pahang',
            label: "Pahang"
        },
        {
            value: 'Penang',
            label: "Penang"
        },
        {
            value: 'Perak',
            label: "Perak"
        },
        {
            value: 'Perlis',
            label: "Perlis"
        },
        {
            value: 'Sabah',
            label: "Sabah"
        },
        {
            value: 'Sarawak',
            label: "Sarawak"
        },
        {
            value: 'Selangor',
            label: "Selangor"
        },
        {
            value: 'Terengganu',
            label: "Terengganu"
        },
        {
            value: 'Overseas',
            label: "Overseas"
        }
    ];

    const facultyTitle = (faculty) => {
        if (faculty === "Electrical") {
            return languageText.FKE
        } else if (faculty === "Computing") {
            return languageText.FC
        } else if (faculty === "Mechanical") {
            return languageText.FKM
        } else if (faculty === "Civil") {
            return languageText.FKA
        } else if (faculty === "Chemical") {
            return languageText.FKT
        } else {
            return languageText.GeneralCompnaies
        }
    }

    return (
        <div>
            <div
                className="relative w-full h-[60vh] md:h-[80vh] flex items-center justify-center bg-cover bg-center"
                style={{ backgroundImage: "url('')" }}
            >
                <motion.img
                    src="https://images.unsplash.com/photo-1435575653489-b0873ec954e2?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
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
                        y: translateY
                    }}
                />

                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-darktheme/80 to-transparent z-10"></div>

                {/* Content */}
                <div className="relative z-20 text-center px-4">
                    <AnimatePresence>
                        <motion.p
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: 20, opacity: 0 }}
                            transition={{ duration: 0.8, type: "spring", stiffness: 200 }}
                            className="text-3xl md:text-5xl text-center m-auto text-redtheme"
                        >
                            {languageText.InternshipsDesc}
                        </motion.p>
                        <motion.h1
                            initial={{ y: -20, scale: 0, opacity: 0 }}
                            animate={{ y: 0, scale: 1, opacity: 1 }}
                            exit={{ y: -20, opacity: 0 }}
                            transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
                            className="text-7xl md:text-8xl font-bold mx-auto text-whitetheme"
                        >
                            {languageText.Internships}
                        </motion.h1>
                    </AnimatePresence>
                </div>
            </div>

            <div className="lg:my-10 flex flex-col justify-center items-center lg:gap-10 gap-4 mt-150 lg:mt-100">
                <h1 className="formTitle !text-5xl justify-center lg:!text-9xl !mb-0 flex flex-wrap m-auto gap-4">
                    {languageText.Companies}
                </h1>
                <div className="lg:w-fit w-full flex justify-center items-center z-20 gap-4 lg:gap-10 lg:flex-row flex-col">

                    <MultiSelectField
                        options={categoryOptions}
                        placeholder={languageText.SelectCategories}
                        iconValue="iconamoon:category-fill"
                        icon="iconamoon:category-light"
                        language={language}
                        languageText={languageText}
                        setValue={setSelectedCategories}
                        regex={null}
                        value={selectedCategories}
                    />
                    <SearchInput languageText={languageText} language={language} onSearch={(query) => setSearchQuery(query)} />
                    <MultiSelectField
                        options={locationOptions}
                        placeholder={languageText.SelectCity}
                        iconValue="solar:city-bold"
                        icon="solar:city-broken"
                        language={language}
                        languageText={languageText}
                        setValue={setSelectedLocations}
                        regex={null}
                        value={selectedLocations}
                    />
                </div>

                <p className="ScrollHorizontally">{languageText.ScrollHorizontally}</p>

                {loading ? (
                    <Loader text={languageText.Loading} />
                ) : filteredInternships?.length === 0 ? (
                    <div className="w-full flex justify-center items-center p-5 rounded-xl text-whitetheme">
                        <div className="noData text-4xl lg:text-8xl">
                            <Icon icon="iconamoon:dislike-fill" /> {languageText.NoCompanies}
                        </div>
                    </div>
                ) : (

                    <div className="flex  gap-10 w-full h-full overflow-auto px-5 py-2">
                        {faculties.map((faculty, index) => {
                            const facultyInterns = getInternsByFaculty(faculty);
                            return facultyInterns.length > 0 ? (
                                <div key={index} className="serviceContainer h-fit flex flex-col gap-4">
                                    <h1 className="serviceContainerTitle">{facultyTitle(faculty)}</h1>
                                    {facultyInterns.map((intern) => (
                                        <InternCard key={intern.id} intern={intern} languageText={languageText} language={language} />
                                    ))}
                                </div>
                            ) : null;
                        })}
                    </div>
                )}
            </div>
            <ScrollToTop languageText={languageText} />
        </div>
    );
};

export default Internships;
