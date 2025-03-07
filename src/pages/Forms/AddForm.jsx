import React, { useState, useEffect } from "react";
import AdminNavBar from "../../components/AdminNavBar";
import useFetchData from "../../hooks/useFetchData";
import { useFormsContext } from '../../hooks/useFormContext';
import { useAuthContext } from '../../hooks/useAuthContext';
import UserType from "../../components/UserType";
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

const AddForm = ({ languageText, language, api }) => {

    const { user } = useAuthContext();
    const [committeeType, setCommitteeType] = useState(user?.committee);
    const [formType, setFormType] = useState(user?.committee)

    useEffect(() => {
        if (user?.committee) {
            setCommitteeType(user.committee);
            setFormType(user.committee)
        }
    }, [user]);

    const [eventName, setEventName] = useState('');
    const [arabicEventName, setArabicEventName] = useState('');
    const [eventImg, setEventImg] = useState(null);
    const [eventDescription, setEventDescription] = useState('');
    const [groupLink, setGroupLink] = useState('');
    const [paymentAmount, setPaymentAmount] = useState('');
    const [formLimit, setFormLimit] = useState('');
    const [link, setLink] = useState('')
    const [paymentQR, setPaymentQR] = useState(null);

    const [inputs, setInputs] = useState([]);
    const [customInputs, setCustomInputs] = useState([]);
    const [selectInputs, setSelectInputs] = useState([]);


    const addCustomInput = () => {
        const newInput = { id: Date.now(), label: "" };
        setCustomInputs((prev) => [...prev, newInput]);
    };


    const removeCustomInput = (id) => {
        setCustomInputs((prev) => prev.filter((input) => input.id !== id));
    };

    useEffect(() => {

        if (inputs.includes("Custom Inputs") && customInputs.length === 0) {
            setCustomInputs([{ id: Date.now(), label: "" }]);
        }

        if (!inputs.includes("Custom Inputs")) {
            setCustomInputs([]);
        }
    }, [inputs]);


    const addSelectInput = () => {
        const newInput = {
            id: Date.now(),
            label: "",
            options: [""], // Start with one empty option
            isMultiSelect: false,
        };
        setSelectInputs((prev) => [...prev, newInput]);
    };


    const removeSelectInput = (id) => {
        setSelectInputs((prev) => prev.filter((input) => input.id !== id));
    };


    const updateLabel = (id, value) => {
        const updatedInputs = selectInputs.map((item) =>
            item.id === id ? { ...item, label: value } : item
        );
        setSelectInputs(updatedInputs);
    };


    const addOption = (id) => {
        const updatedInputs = selectInputs.map((item) =>
            item.id === id ? { ...item, options: [...item.options, ""] } : item
        );
        setSelectInputs(updatedInputs);
    };

    const updateOption = (id, optionIndex, value) => {
        const updatedInputs = selectInputs.map((item) =>
            item.id === id
                ? {
                    ...item,
                    options: item.options.map((opt, index) =>
                        index === optionIndex ? value : opt
                    ),
                }
                : item
        );
        setSelectInputs(updatedInputs);
    };

    const removeOption = (id, optionIndex) => {
        const updatedInputs = selectInputs.map((item) =>
            item.id === id
                ? {
                    ...item,
                    options: item.options.filter((_, index) => index !== optionIndex),
                }
                : item
        );
        setSelectInputs(updatedInputs);
    };

    const toggleMultiSelect = (id) => {
        const updatedInputs = selectInputs.map((item) =>
            item.id === id ? { ...item, isMultiSelect: !item.isMultiSelect } : item
        );
        setSelectInputs(updatedInputs);
    };


    useEffect(() => {
        // If "Select Input" is selected and no select inputs exist, add one default input field
        if (inputs.includes("Select Input") && selectInputs.length === 0) {
            setSelectInputs([
                {
                    id: Date.now(),
                    label: "",
                    options: [""], // Start with one empty option
                    isMultiSelect: false,
                },
            ]);
        }

        // If "Select Input" is deselected, clear all select inputs
        if (!inputs.includes("Select Input")) {
            setSelectInputs([]);
        }
    }, [inputs]);


    useEffect(() => {

        if (!inputs.includes("Form Limit")) {
            setFormLimit('')
        }

        if (!inputs.includes("Payment")) {
            setPaymentAmount('')
            setPaymentQR('')
        }
    }, [inputs])

    const inputOptions = [
        {
            value: 'Form Limit',
            label: languageText.FormLimit,
            icon: "material-symbols:speed-rounded"
        },
        {
            value: 'Full Name',
            label: languageText.FullName,
            icon: "fluent:rename-16-filled"
        },
        {
            value: 'Matric',
            label: languageText.MatricNo,
            icon: "ion:id-card"
        },
        {
            value: 'Email',
            label: languageText.Email,
            icon: "entypo:email"
        },
        {
            value: 'Phone No.',
            label: languageText.PhoneNo,
            icon: "fluent:phone-20-filled"
        },
        {
            value: 'Faculty',
            label: languageText.Faculty,
            icon: "basil:university-solid"
        },
        {
            value: 'Year',
            label: languageText.Year,
            icon: "solar:calendar-date-bold"
        },
        {
            value: 'Semester',
            label: languageText.Semester,
            icon: "mdi:book-education"
        },
        {
            value: 'Picture',
            label: languageText.PersonalPicture,
            icon: "iconamoon:profile-circle-fill"
        },
        {
            value: 'Payment',
            label: languageText.Payment,
            icon: "material-symbols-light:payments"
        },
        {
            value: 'Custom Inputs',
            label: languageText.CustomFields,
            icon: "si:dashboard-customize-fill"
        },
        {
            value: 'Select Input',
            label: languageText.SelectField,
            icon: "fluent:select-all-on-16-filled"
        },

    ];


    const committeeOptions = [
        { value: "ISS Egypt", label: languageText.President, icon: "emojione-monotone:flag-for-egypt" },
        { value: "Vice", label: languageText.VicePresident, icon: "fontisto:person" },
        { value: "Secretary", label: languageText.Secretary, icon: "mingcute:document-2-fill" },
        { value: "Treasurer", label: languageText.Treasurer, icon: "fluent:money-16-filled" },
        { value: "Social", label: languageText.SocialPresident, icon: "solar:people-nearby-bold" },
        { value: "Academic", label: languageText.AcademicPresident, icon: "heroicons:academic-cap-solid" },
        { value: "Culture", label: languageText.CulturePresident, icon: "mdi:religion-islamic" },
        { value: "Sports", label: languageText.SportPresident, icon: "fluent-mdl2:more-sports" },
        { value: "Media", label: languageText.MediaPresident, icon: "ic:outline-camera" },
        { value: "WomenAffairs", label: languageText.WomenPresident, icon: "healthicons:woman" },
        { value: "PR", label: languageText.PublicRelation, icon: "material-symbols:public" },
        { value: "HR", label: languageText.HR, icon: "fluent:people-community-add-20-filled" },
    ];




    const { handleSubmit, error: submitError, setError, submitLoading } =
        useSubmitForm();


    const onSubmit = async (e) => {
        e.preventDefault(); // Prevent default first

        // Validate required fields
        if (!eventName || !arabicEventName || !link || !eventDescription) {
            setError(languageText.FillRequired);
            return;
        }
        let imgUrl = null;
        if (eventImg) {
            imgUrl = await uploadFile("image", eventImg, "images_preset");
        }

        let proofUrl = null;
        if (paymentQR) {
            proofUrl = await uploadFile("image", paymentQR, "images_preset");
        }

        const formData = {
            eventName,
            arabicEventName,
            eventImg: imgUrl,
            eventDescription,
            type: formType,
            link,
            inputs,
            groupLink,
            paymentQR: proofUrl,
            paymentAmount,
            customInputs: customInputs.map((input) => input.label),
            status: true,
            limit: formLimit,
            selectInputs
        };

        try {
            await handleSubmit(`${api}/api/forms`, "POST", formData, "forms", languageText.FormSuccessMessage);
            setError(""); // Clear any previous error messages
        } catch (error) {
            console.error("Submission failed:", error);
            setError(languageText.SubmitFailed);
        }
    };

    return (
        <div className="lg:flex ">
            <AdminNavBar languageText={languageText} language={language} api={api} />
            <div className=" flex lg:flex-1 justify-center items-center">

                {submitLoading ? (
                    <div className="h-screen flex justify-center items-center">
                        <Loader text={languageText.Submitting} />
                    </div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, y: -200 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -200 }}
                        transition={{ duration: 0.8, ease: "linear", type: "spring", stiffness: 100 }}
                        className={`w-full p-8 flex flex-col justify-center items-center m-auto rounded-xl my-20`}
                    >
                        <AnimatePresence>
                            <motion.form
                                className="formForm"
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
                                        const words = languageText.CreateNewForm.split(" ");
                                        const lastWord = words.pop(); // Remove the last word
                                        return (
                                            <>
                                                {words.join(" ")}
                                                {words.length > 0 && " "}
                                                <span className="text-darktheme2 dark:text-whitetheme2">{lastWord}</span>
                                            </>
                                        );
                                    })()}
                                </h1>

                                <div className="formRow">
                                    <InputField
                                        placeholder={languageText.EventName}
                                        iconValue="solar:text-field-bold"
                                        icon="solar:text-field-broken"
                                        type="text"
                                        language={language}
                                        languageText={languageText}
                                        required={true}
                                        setValue={setEventName}
                                        regex={null}
                                    />

                                    <InputField
                                        placeholder={languageText.EventArabicName}
                                        iconValue="solar:text-field-bold"
                                        icon="solar:text-field-broken"
                                        type="text"
                                        language={language}
                                        languageText={languageText}
                                        required={true}
                                        setValue={setArabicEventName}
                                        regex={null}
                                    />
                                </div>

                                <div className="formRow">
                                    <InputField
                                        placeholder={languageText.EventDescription}
                                        iconValue="tabler:file-description-filled"
                                        icon="tabler:file-description"
                                        type="text"
                                        language={language}
                                        languageText={languageText}
                                        required={true}
                                        setValue={setEventDescription}
                                        regex={null}
                                    />

                                    <InputField
                                        placeholder={languageText.CustomLink}
                                        iconValue="f7:link-circle-fill"
                                        icon="f7:link-circle"
                                        type="text"
                                        language={language}
                                        languageText={languageText}
                                        required={true}
                                        setValue={setLink}
                                        regex={null}
                                    />
                                </div>



                                <div className="formRow">
                                    <ImageUploadField
                                        placeholder={languageText.EventPoster}
                                        iconValue="fluent:image-border-16-filled"
                                        icon="fluent:image-border-16-regular"
                                        type="number"
                                        language={language}
                                        languageText={languageText}
                                        setValue={setEventImg}
                                        regex={null}
                                    />

                                    <InputField
                                        placeholder={languageText.GroupLink}
                                        iconValue="ant-design:whats-app-outlined"
                                        icon="ant-design:whats-app-outlined"
                                        type="text"
                                        language={language}
                                        languageText={languageText}
                                        setValue={setGroupLink}
                                        regex={null}
                                    />
                                </div>


                                {UserType("All") &&
                                    <SelectField
                                        options={committeeOptions}
                                        placeholder={languageText.ChooseCommittee}
                                        iconValue="fluent:people-team-16-filled"
                                        icon="fluent:people-team-16-regular"
                                        language={language}
                                        languageText={languageText}
                                        required={true}
                                        setValue={setFormType}
                                        regex={null}
                                        value={formType}
                                    />
                                }

                                <MultiSelectField
                                    options={inputOptions}
                                    placeholder={languageText.ChooseInputFields}
                                    iconValue="iconamoon:category-fill"
                                    icon="iconamoon:category-light"
                                    language={language}
                                    languageText={languageText}
                                    setValue={setInputs}
                                    regex={null}
                                    required={true}
                                />

                                {inputs.includes("Form Limit") &&

                                    <InputField
                                        placeholder={languageText.FormLimit}
                                        iconValue="material-symbols:speed-rounded"
                                        icon="material-symbols:speed-outline-rounded"
                                        type="number"
                                        language={language}
                                        languageText={languageText}
                                        setValue={setFormLimit}
                                        regex={null}
                                        required={true}
                                    />
                                }


                                {inputs.includes("Payment") &&
                                    <div className="text-center w-full shadow-xl bg-darktheme2/10 dark:bg-whitetheme/10 p-4 rounded-xl">
                                        <p className="text-2xl dark:text-whitetheme text-darktheme2 mb-2">{languageText.PaymentDetails}</p>
                                        <div className="flex md:flex-row flex-col gap-4 w-full justify-center">

                                            <InputField
                                                placeholder={languageText.PaymentAmount}
                                                iconValue="fluent:money-16-filled"
                                                icon="fluent:money-16-regular"
                                                type="number"
                                                language={language}
                                                languageText={languageText}
                                                setValue={setPaymentAmount}
                                                regex={null}
                                                required={true}
                                            />
                                            <ImageUploadField
                                                placeholder={languageText.QRImage}
                                                iconValue="mage:qr-code-fill"
                                                icon="mage:qr-code"
                                                type="number"
                                                language={language}
                                                languageText={languageText}
                                                required={true}
                                                setValue={setPaymentQR}
                                                regex={null}
                                            />
                                        </div>
                                    </div>
                                }



                                {inputs.includes("Custom Inputs") && (
                                    <div className="text-center w-full shadow-xl bg-darktheme2/10 dark:bg-whitetheme/10 p-4 rounded-xl">
                                        <p className="text-2xl dark:text-whitetheme text-darktheme2 mb-2">{languageText.CustomInputFields}</p>
                                        <div className="w-full flex flex-col gap-4">
                                            {customInputs.map((input, index) => (
                                                <div
                                                    className="w-full flex relative gap-2"
                                                    key={input.id}>
                                                    <InputField
                                                        placeholder={languageText.CustomInputLabel}
                                                        icon="tabler:label-important"
                                                        iconValue="tabler:label-important-filled"
                                                        type="text"
                                                        required={true}
                                                        value={input.label}
                                                        setValue={(value) => {
                                                            const updatedInputs = customInputs.map((item) =>
                                                                item.id === input.id ? { ...item, label: value } : item
                                                            );
                                                            setCustomInputs(updatedInputs);
                                                        }}
                                                        language={language}
                                                        languageText={languageText}
                                                    />

                                                    {index > 0 && <motion.button
                                                        initial={{ opacity: 0, scale: 0 }}
                                                        animate={{ opacity: 1, scale: 1 }}
                                                        exit={{ opacity: 0, scale: 0 }}
                                                        transition={{ duration: 0.3, type: 'spring', stiffness: 200 }}
                                                        whileTap={{ scale: 0.6 }}
                                                        whileHover={{ scale: 1.2 }}
                                                        type="button"
                                                        className="AddFormButton group bg-redtheme"
                                                        onClick={() => removeCustomInput(input.id)}
                                                    >

                                                        <Icon icon="solar:trash-bin-minimalistic-broken" className="text-xl" />
                                                        <div className="inputIconText bg-redtheme">
                                                            {languageText.RemoveCustomInput}
                                                        </div>
                                                    </motion.button>
                                                    }


                                                    {index === customInputs.length - 1 && <motion.button
                                                        initial={{ opacity: 0, scale: 0 }}
                                                        animate={{ opacity: 1, scale: 1 }}
                                                        exit={{ opacity: 0, scale: 0 }}
                                                        transition={{ duration: 0.3, type: 'spring', stiffness: 200 }}
                                                        whileTap={{ scale: 0.6 }}
                                                        whileHover={{ scale: 1.2 }}
                                                        type="button"
                                                        className="AddFormButton group bg-green-600"
                                                        onClick={addCustomInput}
                                                    >
                                                        <Icon icon="si:dashboard-customize-line" className="text-xl" />
                                                        <div className="inputIconText bg-green-600">
                                                            {languageText.AddCustomInput}
                                                        </div>
                                                    </motion.button>
                                                    }
                                                </div>

                                            ))}

                                        </div>
                                    </div>
                                )}











                                {inputs.includes("Select Input") && (
                                    <div className="text-center w-full shadow-xl bg-darktheme2/10 dark:bg-whitetheme/10 p-4 rounded-xl">
                                        <p className="text-2xl dark:text-whitetheme text-darktheme2 mb-2">{languageText.SelectInputField}</p>
                                        <div className="w-full flex flex-col gap-4">
                                            {selectInputs.map((input, index) => (
                                                <div key={input.id}
                                                    className="flex flex-col pb-2 border-b-2 border-darkthme"
                                                >

                                                    <div className="flex md:flex-row flex-col gap-4 w-full justify-center h-full">
                                                        <InputField
                                                            placeholder={languageText.EnterSelectLabel}
                                                            icon="tabler:label-important"
                                                            iconValue="tabler:label-important-filled"
                                                            type="text"
                                                            required={true}
                                                            value={input.label}
                                                            setValue={(value) => updateLabel(input.id, value)}
                                                            language={language}
                                                            languageText={languageText}
                                                        />

                                                        {/* Options Input */}
                                                        <div className="w-full flex flex-col gap-4">
                                                            {input.options.map((option, optionIndex) => (
                                                                <div key={optionIndex}
                                                                    className="flex gap-2 w-full justify-center">
                                                                    <InputField
                                                                        placeholder={languageText.Option + " " + (optionIndex + 1)}
                                                                        icon="material-symbols:list-alt-outline"
                                                                        iconValue="material-symbols:list-alt"
                                                                        type="text"
                                                                        required={true}
                                                                        value={option}
                                                                        setValue={(value) => updateOption(input.id, optionIndex, value)}
                                                                        language={language}
                                                                        languageText={languageText}
                                                                    />
                                                                    {optionIndex > 0 && <motion.button
                                                                        initial={{ opacity: 0, scale: 0 }}
                                                                        animate={{ opacity: 1, scale: 1 }}
                                                                        exit={{ opacity: 0, scale: 0 }}
                                                                        transition={{ duration: 0.3, type: 'spring', stiffness: 200 }}
                                                                        whileTap={{ scale: 0.6 }}
                                                                        whileHover={{ scale: 1.2 }}
                                                                        type="button"
                                                                        className="AddFormButton group bg-redtheme"
                                                                        onClick={() => removeOption(input.id, optionIndex)}
                                                                    >

                                                                        <Icon icon="solar:list-cross-broken" className="text-xl" />
                                                                        <div className="inputIconText bg-redtheme">
                                                                            {languageText.RemoveOption}
                                                                        </div>
                                                                    </motion.button>

                                                                    }

                                                                    {optionIndex === input.options.length - 1 && <motion.button
                                                                        initial={{ opacity: 0, scale: 0 }}
                                                                        animate={{ opacity: 1, scale: 1 }}
                                                                        exit={{ opacity: 0, scale: 0 }}
                                                                        transition={{ duration: 0.3, type: 'spring', stiffness: 200 }}
                                                                        whileTap={{ scale: 0.6 }}
                                                                        whileHover={{ scale: 1.2 }}
                                                                        type="button"
                                                                        className="AddFormButton group bg-green-600"
                                                                        onClick={() => addOption(input.id)}
                                                                    >
                                                                        <Icon icon="material-symbols:list-alt-add" className="text-xl" />
                                                                        <div className="inputIconText bg-green-600">
                                                                            {languageText.AddOption}
                                                                        </div>

                                                                    </motion.button>
                                                                    }
                                                                </div>
                                                            ))}

                                                        </div>
                                                        {/* Delete Button */}
                                                    </div>


                                                    <div className='flex flex-col gap-2 mt-5'>

                                                        {index > 0 &&
                                                            <motion.button
                                                                initial={{ opacity: 0, scale: 0 }}
                                                                animate={{ opacity: 1, scale: 1 }}
                                                                exit={{ opacity: 0, scale: 0 }}
                                                                transition={{ duration: 0.3, type: 'spring', stiffness: 200 }}
                                                                whileTap={{ scale: 0.6 }}
                                                                whileHover={{ scale: 1.1 }}
                                                                type="button"
                                                                className="AddFormButton flex items-center gap-2 group w-full bg-redtheme"
                                                                onClick={() => removeSelectInput(input.id)}
                                                            >
                                                                <Icon icon="mdi:book-remove-multiple" className="text-xl" /> {languageText.RemoveSelectInput}
                                                            </motion.button>
                                                        }


                                                        <label className="m-auto relative flex items-center cursor-pointer group">
                                                            <input className="peer sr-only sl-only" type="checkbox"

                                                                checked={input.isMultiSelect}
                                                                onChange={() => toggleMultiSelect(input.id)} />
                                                            <div
                                                                className="w-6 h-6 rounded bg-transparent border-2 border-redtheme transition-all duration-300 ease-in-out peer-checked:bg-radial from-redtheme2 to-redtheme peer-checked:border-0 peer-checked:rotate-12 after:content-[''] after:absolute after:top-1/2 after:left-1/2 after:-translate-x-1/2 after:-translate-y-1/2 after:w-5 after:h-5 after:opacity-0 after:bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiNmZmZmZmYiIHN0cm9rZS13aWR0aD0iMyIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48cG9seWxpbmUgcG9pbnRzPSIyMCA2IDkgMTcgNCAxMiI+PC9wb2x5bGluZT48L3N2Zz4=')] after:bg-contain after:bg-no-repeat peer-checked:after:opacity-100 after:transition-opacity after:duration-300 hover:shadow-[0_0_15px_rgba(168,85,247,0.5)]"
                                                            ></div>
                                                            <span className="mx-3 text-lg font-medium text-redtheme">{languageText.AllowMultiSelect}</span>
                                                        </label>

                                                    </div>
                                                </div>
                                            ))}

                                            {/* Add Another Select Input Button */}
                                            <motion.button
                                                initial={{ opacity: 0, scale: 0 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                exit={{ opacity: 0, scale: 0 }}
                                                transition={{ duration: 0.3, type: 'spring', stiffness: 200 }}
                                                whileTap={{ scale: 0.6 }}
                                                whileHover={{ scale: 1.1 }}
                                                type="button"
                                                className="AddFormButton flex items-center gap-2 group w-full bg-darktheme"
                                                onClick={addSelectInput}
                                            >
                                                <Icon icon="material-symbols:add-box" className="text-xl" />  {languageText.AddAnotherSelectInput}

                                            </motion.button>
                                        </div>
                                    </div>
                                )}

                                <AnimatePresence mode="popLayout">
                                    {submitError &&
                                        <ErrorContainer error={submitError} setError={setError} />}
                                </AnimatePresence>
                                <FormButton icon="hugeicons:task-done-01" text={languageText.SubmitForm} />
                            </motion.form>
                        </AnimatePresence>
                    </motion.div>
                )}
            </div>
        </div>
    )
}

export default AddForm