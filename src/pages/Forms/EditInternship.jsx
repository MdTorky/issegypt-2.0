import React, { useState, useEffect } from "react";
import SelectField from "../../components/formInputs/SelectField";
import useSubmitForm from "../../hooks/useSubmitForm";
import useFetchDataById from "../../hooks/useFetchDataById";
import ErrorContainer from "../../components/formInputs/ErrorContainer";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useFormsContext } from '../../hooks/useFormContext';
import { AnimatePresence, motion } from "framer-motion";
import Loader from "../../components/loaders/Loader";
import InputField from "../../components/formInputs/InputField";
import FormButton from "../../components/formInputs/FormButton";
import MultiSelectField from "../../components/formInputs/MultiSelectField";
import { useAuthContext } from '../../hooks/useAuthContext';


const EditInternship = ({ languageText, language, api }) => {
    const { user } = useAuthContext();
    const navigate = useNavigate()

    useEffect(() => {
        if (!user) {
            navigate('/auth/login', { replace: true }); // Redirect to login
        }
    }, [user, navigate]);

    const { id } = useParams();
    const locations = useLocation();
    const { forms, dispatch } = useFormsContext();


    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [faculty, setFaculty] = useState("");
    const [website, setWebsite] = useState("");
    const [applyEmail, setApplyEmail] = useState("");
    const [apply, setApply] = useState("");
    const [img, setImg] = useState("");
    const [categories, setCategories] = useState([]);
    const [location, setLocation] = useState([]);

    const facultyOptions = [
        { value: "Electrical", label: languageText.FKE, icon: "material-symbols:electric-bolt-rounded" },
        { value: "Computing", label: languageText.FC, icon: "icon-park-solid:code-laptop" },
        { value: "Mechanical", label: languageText.FKM, icon: "vaadin:tools" },
        { value: "Civil", label: languageText.FKA, icon: "fa6-solid:helmet-safety" },
        { value: "Chemical", label: languageText.FKT, icon: "mdi:flask" },
        { value: "Other", label: languageText.Other, icon: "icon-park-solid:other" },
    ];

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


    const { data: InternData, loading, error } = useFetchDataById(`${api}/api/internship/${id}`);
    useEffect(() => {
        if (InternData && !loading && !error) {
            setName(InternData.name);
            setEmail(InternData.email);
            setFaculty(InternData.faculty);
            setWebsite(InternData.website);
            setApplyEmail(InternData.applyEmail);
            setApply(InternData.apply);
            setImg(InternData.img);
            setCategories(InternData.categories);
            setLocation(InternData.location);
        }
    }, [InternData, loading, error]);


    const { handleSubmit, error: submitError, setError, submitLoading } =
        useSubmitForm();

    const onSubmit = async (e) => {
        e.preventDefault(); // Prevent default first

        // Validate required fields
        if (!name || !img || !faculty || !categories.length || !location.length) {
            setError(languageText.FillRequired);
            return;
        }

        const internData = {
            name,
            email,
            faculty,
            website,
            applyEmail,
            apply,
            img,
            categories,
            location
        };

        try {
            await handleSubmit(`${api}/api/internship/${id}`, "PATCH", internData, "internships", languageText.EditCompanySuccessMessage);
            navigate(-1)
            setTimeout(() => {
                window.scrollTo(0, 0); // Ensure the scroll position is reset
            }, 0);
        } catch (error) {
            console.error("Submission failed:", error);
            setError(languageText.SubmitFailed);
        }
    };


    return (
        <div className=" flex justify-center items-center">
            {loading ? (
                <div className='h-screen flex justify-center items-center'>
                    <Loader text={languageText.Loading} />
                </div>
            ) :
                submitLoading ? (
                    <div className='h-screen flex justify-center items-center'>
                        <Loader text={languageText.Updating} />
                    </div>
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
                            <h1
                                className={`formTitle`}>
                                {(() => {
                                    const words = languageText.CompanyForm.split(" ");
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

                            <div className="flex gap-4 w-full justify-center">
                                <InputField
                                    placeholder={languageText.CompanyName}
                                    iconValue="heroicons-solid:office-building"
                                    icon="heroicons-outline:office-building"
                                    type="text"
                                    language={language}
                                    languageText={languageText}
                                    required={true}
                                    setValue={setName}
                                    regex={null}
                                    value={name}
                                />
                                <InputField
                                    placeholder={languageText.CompanyEmail}
                                    iconValue="entypo:email"
                                    icon="entypo:email"
                                    type="email"
                                    language={language}
                                    languageText={languageText}
                                    setValue={setEmail}
                                    regex={null}
                                    value={email}

                                />
                            </div>

                            <div className="flex gap-4 w-full justify-center">
                                <InputField
                                    placeholder={languageText.CompanyWebsite}
                                    iconValue="pepicons-pop:internet-circle-filled"
                                    icon="pepicons-pencil:internet-circle"
                                    type="text"
                                    language={language}
                                    languageText={languageText}
                                    setValue={setWebsite}
                                    regex={null}
                                    value={website}

                                />
                                <InputField
                                    placeholder={languageText.CompanyImageLink}
                                    iconValue="fluent:image-copy-28-filled"
                                    icon="fluent:image-copy-28-regular"
                                    type="text"
                                    language={language}
                                    languageText={languageText}
                                    required={true}
                                    setValue={setImg}
                                    regex={null}
                                    value={img}

                                />
                            </div>
                            <div className="flex gap-4 w-full justify-center">
                                <InputField
                                    placeholder={languageText.CompanyApplyEmail}
                                    iconValue="streamline:send-email-solid"
                                    icon="streamline:send-email"
                                    type="email"
                                    language={language}
                                    languageText={languageText}
                                    setValue={setApplyEmail}
                                    regex={null}
                                    value={applyEmail}

                                />
                                <InputField
                                    placeholder={languageText.CompanyApplyPage}
                                    iconValue="mdi:arrow-top-left-bold-box"
                                    icon="mdi:arrow-top-left-bold-box-outline"
                                    type="text"
                                    language={language}
                                    languageText={languageText}
                                    setValue={setApply}
                                    regex={null}
                                    value={apply}

                                />
                            </div>

                            <SelectField
                                options={facultyOptions}
                                placeholder={languageText.ChooseFaculty}
                                iconValue="basil:university-solid"
                                icon="basil:university-outline"
                                language={language}
                                languageText={languageText}
                                required={true}
                                setValue={setFaculty}
                                regex={null}
                                value={faculty}

                            />

                            <div className="flex gap-4 w-full justify-center">
                                <MultiSelectField
                                    options={categoryOptions}
                                    placeholder={languageText.SelectCategories}
                                    iconValue="iconamoon:category-fill"
                                    icon="iconamoon:category-light"
                                    language={language}
                                    languageText={languageText}
                                    setValue={setCategories}
                                    regex={null}
                                    required={true}
                                    value={categories}

                                />
                                <MultiSelectField
                                    options={locationOptions}
                                    placeholder={languageText.SelectCity}
                                    iconValue="solar:city-bold"
                                    icon="solar:city-broken"
                                    language={language}
                                    languageText={languageText}
                                    setValue={setLocation}
                                    regex={null}
                                    required={true}
                                    value={location}


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

export default EditInternship