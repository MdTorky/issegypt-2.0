import React, { useState, useEffect } from "react";
import { useFormsContext } from '../../hooks/useFormContext';
import { useAuthContext } from '../../hooks/useAuthContext';
import Loader from "../../components/loaders/Loader";
import { Icon } from "@iconify/react";
import useSubmitForm from "../../hooks/useSubmitForm";
import { AnimatePresence, motion } from "framer-motion";
import uploadFile from "../../utils/uploadFile";
import InputField from "../../components/formInputs/InputField";
import ImageUploadField from "../../components/formInputs/ImageUploadField";
import MultiSelectField from "../../components/formInputs/MultiSelectField";
import SelectField from "../../components/formInputs/SelectField";
import FormButton from "../../components/formInputs/FormButton";
import { useNavigate, useParams } from "react-router-dom";
import useFetchDataById from "../../hooks/useFetchDataById";
import ErrorContainer from "../../components/formInputs/ErrorContainer";

const CreatedForm = ({ languageText, language, api }) => {
    const { user } = useAuthContext();
    const { link } = useParams()


    const [fullName, setFullName] = useState('')
    const [matric, setMatric] = useState('')
    const [email, setEmail] = useState('')
    const [phone, setPhone] = useState('')
    const [faculty, setFaculty] = useState('')
    const [year, setYear] = useState('')
    const [semester, setSemester] = useState('')
    const [picture, setPicture] = useState(null)
    const [proof, setProof] = useState(null);
    const [customInputs, setCustomInputs] = useState([]);
    const [selectInputValues, setSelectInputValues] = useState({});
    const [descOpen, setDescOpen] = useState(false)

    const [joinedGroup, setJoinedGroup] = useState(false)
    const navigate = useNavigate();


    const facultyOptions = [
        { value: "Electrical", label: languageText.FKE, icon: "material-symbols:electric-bolt-rounded" },
        { value: "Computing", label: languageText.FC, icon: "icon-park-solid:code-laptop" },
        { value: "Mechanical", label: languageText.FKM, icon: "vaadin:tools" },
        { value: "Civil", label: languageText.FKA, icon: "fa6-solid:helmet-safety" },
        { value: "Chemical", label: languageText.FKT, icon: "mdi:flask" },
        { value: "Architecture", label: languageText.FAB, icon: "icon-park-solid:book-one" },
        { value: "Bridging", label: languageText.Space, icon: "tdesign:architecture-hui-style-filled" },
        { value: "Other", label: languageText.Other, icon: "icon-park-solid:other" },
    ];

    const yearOptions = [
        { value: "2019", label: "2019" },
        { value: "2020", label: "2020" },
        { value: "2021", label: "2021" },
        { value: "2022", label: "2022" },
        { value: "2023", label: "2023" },
        { value: "2024", label: "2024" },
        { value: "2025", label: "2025" },
    ];

    const semesterOptions = [
        { value: "Bridging", label: languageText.Space },
        { value: "1", label: "1" },
        { value: "2", label: "2" },
        { value: "3", label: "3" },
        { value: "4", label: "4" },
        { value: "5", label: "5" },
        { value: "6", label: "6" },
        { value: "7", label: "7" },
        { value: "8", label: "8" },
        { value: "Masters", label: "Masters" },
        { value: "PhD", label: "PhD" },
    ];


    const { forms, ISSForm, dispatch } = useFormsContext();

    const { data: formData, loading: formLoading, error: formError } = useFetchDataById(`${api}/api/forms/link/${link}`);
    useEffect(() => {
        if (formData && !formLoading && !formError) {
            dispatch({
                type: "SET_ITEM",
                collection: "forms",
                payload: formData,
            });
        }
    }, [formData, formLoading, formError, dispatch]);







    const { data: issData, loading: issLoading, error: issError } = useFetchDataById(`${api}/api/issForms/events/${formData?._id}`);
    useEffect(() => {
        if (issData && !issLoading && !issError) {
            dispatch({
                type: "SET_ITEM",
                collection: "ISSForm",
                payload: issData,
            });
        }
    }, [issData, issLoading, issError, dispatch]);



    const { handleSubmit, error: submitError, setError, submitLoading } =
        useSubmitForm();


    const onSubmit = async (e) => {
        e.preventDefault(); // Prevent default first

        // Validate required fields
        if ((formData.inputs.includes("Faculty") && !faculty) || (formData.inputs.includes("Semester") && !semester) || (formData.inputs.includes("Year") && !year) || (formData.inputs.includes("Select Input") && !selectInputValues)) {
            setError(languageText.FillRequired);
            return;
        }
        let pictureUrl = null;
        if (picture) {
            pictureUrl = await uploadFile("image", picture, "images_preset");
        }

        let proofUrl = null;
        if (proof) {
            proofUrl = await uploadFile("image", proof, "images_preset");
        }

        const issformData = {
            eventName: formData?.eventName,
            eventID: formData?._id,
            fullName,
            matric,
            email,
            phone,
            faculty,
            year,
            semester,
            picture: pictureUrl,
            proof: proofUrl,
            customInputs: formData.inputs.includes("Custom Inputs")
                ? Object.values(customInputs)
                : [],
            selectInputs: selectInputValues
        };

        try {
            await handleSubmit(`${api}/api/issForms`, "POST", issformData, "ISSForm", languageText.FormSuccessMessage);
            setError("");
            navigate('/')
        } catch (error) {
            console.error("Submission failed:", error);
            setError(languageText.SubmitFailed);
        }
    };



    const handleGroupClick = (e, groupLink) => {
        e.preventDefault();
        window.open(groupLink)
    }


    useEffect(() => {
        document.title = formData?.eventName
    }, []);


    return (
        <div className="lg:flex ">
            {formLoading || issLoading ? (
                <div className="h-screen flex w-full justify-center">
                    <Loader text={languageText.Loading} />
                </div>
            ) :
                !formData ? (
                    <div className="h-screen flex w-full items-center justify-center">
                        <div className="noData text-redtheme lg:!text-6xl">
                            <Icon icon="material-symbols:nearby-error-rounded" />
                            {languageText.Sorry + " "}
                            {languageText.NoSuchForm}
                        </div>
                    </div>
                ) :
                    formData.limit === issData?.length ? (
                        <div className="h-screen flex w-full items-center justify-center">
                            <div className="noData text-redtheme lg:!text-6xl">
                                <Icon icon="material-symbols:nearby-error-rounded" />
                                {languageText.Sorry + " "}
                                {languageText.ReachedLimit}
                            </div>
                        </div>
                    ) :
                        !formData?.status ? (
                            <div className="h-screen flex w-full items-center justify-center">
                                <div className="noData text-redtheme lg:!text-6xl">
                                    <Icon icon="material-symbols:nearby-error-rounded" />
                                    {languageText.Sorry + " "}
                                    {languageText.FormClosed}
                                </div>
                            </div>
                        ) :
                            submitLoading ? (
                                <div className="h-screen flex w-full justify-center">
                                    <Loader text={languageText.Submitting} />
                                </div>
                            ) :
                                (
                                    <div className='flex lg:flex-1 flex-col items-center justify-center 2xl:px-40 gap-6 '>
                                        <h1
                                            className={`formTitle !text-5xl justify-center lg:!text-8xl !mb-0 flex flex-wrap m-auto !mt-20 gap-4 ${language === "ar" ? "flex-row-reverse" : ""}`}>
                                            {(() => {
                                                const words = ((language === "en" ? formData.eventName : formData.arabicEventName) + " " + languageText.Form).split(" ");
                                                const lastWord = words.pop();
                                                return (
                                                    <>
                                                        {words.join(" ")}
                                                        {words.length > 0 && " "}
                                                        <span className="text-darktheme2 dark:text-whitetheme2">{lastWord}</span>
                                                    </>
                                                );
                                            })()}
                                        </h1>
                                        <div className='flex flex-col lg:flex-row rounded-xl lg:justify-evenly lg:w-[80%] mb-10 lg:p-5 py-4 items-center'>

                                            {/* Event Poster */}
                                            <div className='flex flex-col gap-3  '>
                                                <div className='md:w-150 w-90 lg:m-0 m-auto bg-darktheme2/40 ring-4 ring-darktheme2/40 border-4 border-whitetheme/90 p-3 relative rounded-3xl'>
                                                    <img src={formData?.eventImg} alt="" className="rounded-xl" />
                                                    <div className="absolute bottom-0 left-0 right-0 flex m-auto w-full md:h-80 h-50 bg-gradient-to-t from-darktheme2 via-darktheme2/95 to-transparent z-10 rounded-b-3xl "></div>

                                                    <div className={` absolute bottom-10  text-4xl lg:text-5xl text-whitetheme z-20 w-[85%] ${language === "en" ? "left-10" : "right-10"}`}>
                                                        <h1>{language === "en" ? formData.eventName : formData.arabicEventName}</h1>
                                                    </div>
                                                </div>
                                                <AnimatePresence>
                                                    <motion.div
                                                        initial={{ height: 60 }}
                                                        animate={{ height: descOpen ? "100%" : 60 }}
                                                        exit={{ height: 60 }}
                                                        transition={{ duration: 0.5 }}
                                                        className={` bg-darktheme2/40 ring-4 ring-darktheme2/40 border-4 border-whitetheme/90 p-3 relative rounded-2xl w-90 md:w-150 flex-col items-center justify-between px-5 m-auto lg:m-0`}>
                                                        <p onClick={() => setDescOpen(!descOpen)} className='w-full flex items-center justify-between whitespace-break-spaces text-xl lg:text-xl text-darktheme2 dark:text-whitetheme cursor-pointer'>{descOpen ? languageText.CloseDescription : languageText.ViewDescription}
                                                            <Icon
                                                                icon="solar:alt-arrow-down-bold-duotone"
                                                                className={`transition-transform duration-300 text-darktheme dark:text-whitetheme2 ${descOpen ? "rotate-180" : ""}`}
                                                            />
                                                        </p>


                                                        {descOpen &&
                                                            <p className='text-whitetheme whitespace-break-spaces text-xl lg:text-xl'>{formData.eventDescription}</p>
                                                        }
                                                    </motion.div>
                                                </AnimatePresence>
                                            </div>


                                            {/* Form */}
                                            <motion.form

                                                onSubmit={onSubmit}
                                                // variants={{
                                                //     visible: { transition: { staggerChildren: 0.2, } },
                                                //     exit: {
                                                //         transition: { staggerChildren: 0.1, },
                                                //     }
                                                // }}
                                                // initial="hidden"
                                                // animate="visible"
                                                // exit="exit"
                                                transition={{ duration: 0.8, ease: "linear", type: "spring", stiffness: 100 }}
                                                className={`lg:w-[50%] p-8 flex flex-col gap-4  rounded-xl`}
                                            >
                                                <h1 className='text-2xl text-center text-redtheme dark:text-whitetheme'>{languageText.PersonalDetails}</h1>

                                                <div className="formRow">
                                                    {formData.inputs.includes("Full Name") &&
                                                        <InputField
                                                            placeholder={languageText.FullName}
                                                            iconValue="solar:text-field-bold"
                                                            icon="solar:text-field-broken"
                                                            type="text"
                                                            language={language}
                                                            languageText={languageText}
                                                            required={true}
                                                            setValue={setFullName}
                                                            regex={null}
                                                        />
                                                    }
                                                    {formData.inputs.includes("Matric") &&
                                                        <InputField
                                                            placeholder={languageText.MatricNo}
                                                            iconValue="ion:id-card"
                                                            icon="ion:id-card-outline"
                                                            type="text"
                                                            language={language}
                                                            languageText={languageText}
                                                            required={true}
                                                            setValue={setMatric}
                                                            regex={null}
                                                        />
                                                    }
                                                </div>

                                                <div className="formRow">
                                                    {formData.inputs.includes("Email") &&
                                                        <InputField
                                                            placeholder={languageText.Email}
                                                            iconValue="entypo:email"
                                                            icon="entypo:email"
                                                            type="email"
                                                            language={language}
                                                            languageText={languageText}
                                                            required={true}
                                                            setValue={setEmail}
                                                            regex={null}
                                                        />
                                                    }
                                                    {formData.inputs.includes("Phone No.") &&
                                                        <InputField
                                                            placeholder={languageText.PhoneNo}
                                                            iconValue="fluent:phone-20-filled"
                                                            icon="fluent:phone-20-regular"
                                                            type="number"
                                                            language={language}
                                                            languageText={languageText}
                                                            required={true}
                                                            setValue={setPhone}
                                                            regex={null}
                                                        />
                                                    }
                                                </div>


                                                <div className="formRow items-center">
                                                    {formData.inputs.includes("Faculty") &&
                                                        <SelectField
                                                            options={facultyOptions}
                                                            placeholder={languageText.ChooseYourFaculty}
                                                            iconValue="basil:university-solid"
                                                            icon="basil:university-outline"
                                                            language={language}
                                                            languageText={languageText}
                                                            required={true}
                                                            setValue={setFaculty}
                                                            regex={null}
                                                        />
                                                    }

                                                    {formData.inputs.includes("Picture") &&
                                                        <ImageUploadField
                                                            placeholder={languageText.PersonalPicture}
                                                            iconValue="iconamoon:profile-circle-fill"
                                                            icon="iconamoon:profile-circle"
                                                            type="number"
                                                            language={language}
                                                            languageText={languageText}
                                                            required={true}
                                                            setValue={setPicture}
                                                            regex={null}
                                                        />
                                                    }
                                                </div>
                                                <div className="formRow">
                                                    {formData.inputs.includes("Year") &&
                                                        <SelectField
                                                            options={yearOptions}
                                                            placeholder={languageText.ChooseYear}
                                                            iconValue="solar:calendar-date-bold"
                                                            icon="solar:calendar-date-broken"
                                                            language={language}
                                                            languageText={languageText}
                                                            required={true}
                                                            setValue={setYear}
                                                            regex={null}
                                                        />
                                                    }

                                                    {formData.inputs.includes("Semester") &&
                                                        <SelectField
                                                            options={semesterOptions}
                                                            placeholder={languageText.ChooseSemester}
                                                            iconValue="mdi:book-education"
                                                            icon="mdi:book-education-outline"
                                                            language={language}
                                                            languageText={languageText}
                                                            required={true}
                                                            setValue={setSemester}
                                                            regex={null}
                                                        />
                                                    }
                                                </div>






                                                {formData.inputs.includes("Custom Inputs") &&
                                                    formData.customInputs.reduce((acc, customInput, index) => {
                                                        if (index % 2 === 0) {
                                                            // Start a new formRow for every two elements
                                                            acc.push([]);
                                                        }
                                                        acc[acc.length - 1].push(customInput);
                                                        return acc;
                                                    }, []).map((inputPair, rowIndex) => (
                                                        <div className="formRow" key={rowIndex}>
                                                            {inputPair.map((customInput, index) => (
                                                                <InputField
                                                                    key={rowIndex * 2 + index} // Unique key
                                                                    placeholder={customInput}
                                                                    iconValue="icomoon-free:spinner9"
                                                                    icon="icomoon-free:spinner9"
                                                                    type="text"
                                                                    language={language}
                                                                    languageText={languageText}
                                                                    required={true}
                                                                    setValue={(value) => {
                                                                        setCustomInputs(prev => ({
                                                                            ...prev,
                                                                            [customInput]: value
                                                                        }));
                                                                    }}
                                                                    regex={null}
                                                                />
                                                            ))}
                                                        </div>
                                                    ))
                                                }


                                                {formData.inputs.includes("Select Input") &&
                                                    formData.selectInputs.reduce((acc, selectInput, index) => {
                                                        if (index % 2 === 0) {
                                                            // Start a new formRow for every two elements
                                                            acc.push([]);
                                                        }
                                                        acc[acc.length - 1].push(selectInput);
                                                        return acc;
                                                    }, []).map((inputPair, rowIndex) => (
                                                        <div className="formRow" key={rowIndex}>
                                                            {inputPair.map((selectInput, index) => (
                                                                selectInput.isMultiSelect ? (
                                                                    <MultiSelectField
                                                                        key={rowIndex * 2 + index} // Unique key
                                                                        options={selectInput.options.map(opt => ({
                                                                            value: opt,
                                                                            label: opt
                                                                        }))}
                                                                        placeholder={selectInput.label}
                                                                        iconValue="fluent:select-all-on-16-filled"
                                                                        icon="fluent:select-all-on-16-regular"
                                                                        language={language}
                                                                        languageText={languageText}
                                                                        setValue={(value) => {
                                                                            setSelectInputValues(prev => ({
                                                                                ...prev,
                                                                                [selectInput.label]: value
                                                                            }));
                                                                        }}
                                                                        value={selectInputValues[selectInput.label]}
                                                                        regex={null}
                                                                        required={true}
                                                                    />
                                                                ) : (
                                                                    <SelectField
                                                                        key={rowIndex * 2 + index} // Unique key
                                                                        options={selectInput.options.map(opt => ({
                                                                            value: opt,
                                                                            label: opt
                                                                        }))}
                                                                        placeholder={selectInput.label}
                                                                        iconValue="eva:checkmark-square-2-fill"
                                                                        icon="eva:checkmark-square-2-outline"
                                                                        language={language}
                                                                        languageText={languageText}
                                                                        required={true}
                                                                        setValue={(value) => {
                                                                            setSelectInputValues(prev => ({
                                                                                ...prev,
                                                                                [selectInput.label]: value
                                                                            }));
                                                                        }}
                                                                        value={selectInputValues[selectInput.label]}
                                                                    />
                                                                )
                                                            ))}
                                                        </div>
                                                    ))
                                                }


                                                {formData.inputs.includes("Payment") &&
                                                    <>
                                                        <hr className='w-3/4 h-1 mx-auto bg-redtheme dark:bg-whitetheme' />
                                                        <h1 className='text-2xl text-center text-redtheme dark:text-whitetheme'>{languageText.PaymentDetails} - <span className="text-darktheme dark:text-redtheme">{formData.paymentAmount} {languageText.RM}</span> </h1>


                                                        <div className="formRow">

                                                            <div className="lg:w-1/2 ring-3 p-1 ring-darktheme rounded-xl">
                                                                <img src={formData.paymentQR} className="rounded-xl m-auto" />
                                                            </div>

                                                            <ImageUploadField
                                                                placeholder={languageText.UploadProofImage}
                                                                iconValue="fluent:reciept-20-filled"
                                                                icon="fluent:reciept-20-filled"
                                                                type="number"
                                                                language={language}
                                                                languageText={languageText}
                                                                required={true}
                                                                setValue={setProof}
                                                                regex={null}
                                                            />

                                                        </div>
                                                    </>
                                                }

                                                {formData.groupLink && (

                                                    <div>

                                                        <button
                                                            onClick={(e) => { handleGroupClick(e, formData.groupLink) }}
                                                            target="_blank"
                                                            className="flex m-auto my-2 py-2 items-center bg-green-600 text-whitetheme text-xl rounded-lg w-full text-center justify-center gap-2 cursor-pointer duration-300 ring-3 ring-green-600 border-3 border-whitetheme dark:border-darktheme hover:scale-110"

                                                        >
                                                            <Icon icon="ant-design:whats-app-outlined" />
                                                            {languageText.GroupLink}</button>

                                                        <label className="m-auto relative flex items-center cursor-pointer group justify-center">
                                                            <input className="peer sr-only sl-only" type="checkbox"

                                                                checked={joinedGroup}
                                                                onChange={() => setJoinedGroup(!joinedGroup)} />
                                                            <div
                                                                className="w-6 h-6 rounded bg-transparent border-2 border-redtheme transition-all duration-300 ease-in-out peer-checked:bg-radial from-redtheme2 to-redtheme peer-checked:border-0 peer-checked:rotate-12 after:content-[''] after:absolute after:top-1/2 after:left-1/2 after:-translate-x-1/2 after:-translate-y-1/2 after:w-5 after:h-5 after:opacity-0 after:bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiNmZmZmZmYiIHN0cm9rZS13aWR0aD0iMyIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48cG9seWxpbmUgcG9pbnRzPSIyMCA2IDkgMTcgNCAxMiI+PC9wb2x5bGluZT48L3N2Zz4=')] after:bg-contain after:bg-no-repeat peer-checked:after:opacity-100 after:transition-opacity after:duration-300 hover:shadow-[0_0_15px_rgba(168,85,247,0.5)]"
                                                            ></div>
                                                            <span className="mx-3 text-lg font-medium text-redtheme">{languageText.JoinedGroup}</span>
                                                        </label>
                                                    </div>
                                                )}

                                                <AnimatePresence mode="popLayout">
                                                    {submitError &&
                                                        <ErrorContainer error={submitError} setError={setError} />}
                                                </AnimatePresence>
                                                {((formData.groupLink && joinedGroup) || (!formData.groupLink)) && <FormButton icon="hugeicons:task-done-01" text={languageText.SubmitForm} />}
                                            </motion.form>
                                        </div>

                                    </div>
                                )
            }
        </div >
    )
}

export default CreatedForm