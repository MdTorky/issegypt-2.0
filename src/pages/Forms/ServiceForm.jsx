import React, { useState } from 'react';
import InputField from '../../components/formInputs/InputField';
import { AnimatePresence, motion } from "framer-motion";
import FormButton from '../../components/formInputs/FormButton';
import SelectField from "../../components/formInputs/SelectField";
import { Icon } from "@iconify/react";
import useSubmitForm from "../../hooks/useSubmitForm";
import ErrorContainer from "../../components/formInputs/ErrorContainer";
import Loader from '../../components/loaders/Loader';
import AdminNavBar from '../../components/AdminNavBar';
import { useAuthContext } from '../../hooks/useAuthContext';
import { useNavigate } from "react-router-dom";

const ServiceForm = ({ language, languageText, api }) => {
    const { user } = useAuthContext();
    const navigate = useNavigate()

    useEffect(() => {
        if (!user) {
            navigate('/auth/login', { replace: true }); // Redirect to login
        }
    }, [user, navigate]);


    const [name, setName] = useState('');
    const [aName, setAName] = useState('');
    const [description, setDescription] = useState('');
    const [aDescription, setADescription] = useState('');
    const [sIcon, setSIcon] = useState('');
    const [link, setLink] = useState('');
    const [card, setCard] = useState('');
    const [bgImage, setBgImage] = useState('');
    const [groups, setGroups] = useState([]);



    const handleAddGroup = () => {
        setGroups([...groups, { name: '', aName: '' }]);
    };

    const handleRemoveGroup = (index) => {
        setGroups(groups.filter((_, i) => i !== index));
    };

    const handleGroupChange = (index, field, value) => {
        const updatedGroups = [...groups];
        updatedGroups[index][field] = value;
        setGroups(updatedGroups);
    };

    const { handleSubmit, error, setError, submitLoading } =
        useSubmitForm();

    const onSubmit = async (e) => {
        e.preventDefault();

        const serviceData = {
            name,
            aName,
            description,
            aDescription,
            icon: sIcon,
            link,
            card,
            groups,
            bgImage,
            status: "Active"
        };

        // Use the handleSubmit function from the custom hook
        await handleSubmit(`${api}/api/service`, "POST", serviceData, "services", languageText.ServiceSuccessMessage);
    };


    const parentStagger = {
        visible: { transition: { staggerChildren: 0.2, } },
        exit: {
            transition: { staggerChildren: 0.1, },
        }

    };

    const InputChildVariants = {
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

    return (
        <div className="lg:flex ">
            <AdminNavBar languageText={languageText} language={language} api={api} />
            <div className=' flex justify-center items-center'>
                {submitLoading ?
                    (
                        <div className='h-screen flex justify-center items-center'>
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
                            <motion.form
                                onSubmit={onSubmit}
                                className="formForm gap-4"
                                variants={parentStagger}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                            >
                                <motion.h2
                                    initial={{ scale: 0, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    exit={{ opacity: 0, scale: 0 }}
                                    transition={{ duration: 0.9, delay: 0.1, type: "spring" }}
                                    className={`formTitle ${language === "en" ? "" : "flex flex-row-reverse"}  gap-2`}
                                > {languageText.AddService} <span className="text-darktheme2 dark:text-whitetheme">{languageText.Form} </span>
                                </motion.h2>

                                <div className="formRow">
                                    <InputField
                                        placeholder={languageText.ServiceName}
                                        iconValue="mdi:rename"
                                        icon="mdi:rename-outline"
                                        type="text"
                                        language={language}
                                        languageText={languageText}
                                        required={true}
                                        setValue={setName}
                                        regex={null}
                                    />
                                    <InputField
                                        placeholder={languageText.ServiceArabicName}
                                        iconValue="mdi:rename"
                                        icon="mdi:rename-outline"
                                        type="text"
                                        language={language}
                                        languageText={languageText}
                                        required={true}
                                        setValue={setAName}
                                        regex={null}
                                    />
                                </div>

                                <div className="formRow">
                                    <InputField
                                        placeholder={languageText.ServiceDescription}
                                        iconValue="tabler:file-description-filled"
                                        icon="tabler:file-description"
                                        type="text"
                                        language={language}
                                        languageText={languageText}
                                        required={true}
                                        setValue={setDescription}
                                        regex={null}
                                    />
                                    <InputField
                                        placeholder={languageText.ServiceArabicDescription}
                                        iconValue="tabler:file-description-filled"
                                        icon="tabler:file-description"
                                        type="text"
                                        language={language}
                                        languageText={languageText}
                                        required={true}
                                        setValue={setADescription}
                                        regex={null}
                                    />

                                </div>

                                <div className="formRow">
                                    <InputField
                                        placeholder={languageText.ServiceIcon}
                                        iconValue="icomoon-free:spinner9"
                                        icon="icomoon-free:spinner9"
                                        type="text"
                                        language={language}
                                        languageText={languageText}
                                        required={true}
                                        setValue={setSIcon}
                                        regex={null}
                                    />

                                    <InputField
                                        placeholder={languageText.ServiceLink}
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
                                    <SelectField
                                        options={[
                                            { value: "Horizontal", label: languageText.HorizontalCard, icon: "mynaui:rectangle-solid" },
                                            { value: "Vertical", label: languageText.VerticalCard, icon: "icon-park-solid:rectangle" },
                                        ]}
                                        placeholder={languageText.ChooseServiceCard}
                                        iconValue="bxs:card"
                                        icon="bx:card"
                                        language={language}
                                        languageText={languageText}
                                        required={true}
                                        setValue={setCard}
                                        regex={null}
                                    />
                                    <InputField
                                        placeholder={languageText.BackgroundImage}
                                        iconValue="mingcute:background-fill"
                                        icon="mingcute:background-line"
                                        type="text"
                                        language={language}
                                        languageText={languageText}
                                        required={true}
                                        setValue={setBgImage}
                                        regex={null}
                                    />

                                </div>

                                <motion.button
                                    variants={InputChildVariants}
                                    type="button"
                                    className=" w-full mt-2 lg:-translate-y-1 py-3 bg-redtheme text-white rounded-lg cursor-pointer"
                                    onClick={handleAddGroup}
                                >
                                    {languageText.AddGroup}
                                </motion.button>

                                {/* <div className="w-full"> */}
                                {groups.map((group, index) => (
                                    <div key={index} className="flex gap-4 items-center">
                                        <InputField
                                            placeholder={languageText.GroupName}
                                            iconValue="fluent:tab-group-16-filled"
                                            icon="fluent:tab-group-16-regular"
                                            type="text"
                                            language={language}
                                            languageText={languageText}
                                            required={true}
                                            setValue={(value) => handleGroupChange(index, 'name', value)}
                                            regex={null}
                                        />
                                        <InputField
                                            placeholder={languageText.GroupArabicName}
                                            iconValue="fluent:tab-group-16-filled"
                                            icon="fluent:tab-group-16-regular"
                                            type="text"
                                            language={language}
                                            languageText={languageText}
                                            required={true}
                                            setValue={(value) => handleGroupChange(index, 'aName', value)}
                                            regex={null}
                                        />
                                        <motion.button
                                            initial={{ opacity: 0, scale: 0 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0 }}
                                            transition={{ duration: 0.3, type: 'spring', stiffness: 200 }}
                                            whileTap={{ scale: 0.6 }}
                                            whileHover={{ scale: 1.2 }}
                                            type="button"
                                            className="text-whitetheme bg-redtheme p-2 rounded-full w-fit absolute left-0 right-0 flex justify-center m-auto cursor-pointer"
                                            onClick={() => handleRemoveGroup(index)}
                                        >
                                            <Icon icon="solar:trash-bin-minimalistic-broken" className="text-xl" />
                                        </motion.button>
                                    </div>
                                ))}
                                {/* </div> */}

                                <FormButton icon="hugeicons:task-done-01" text={languageText.SubmitForm} />
                                <AnimatePresence mode="popLayout">
                                    {error &&
                                        <ErrorContainer error={error} setError={setError} />}
                                </AnimatePresence>
                            </motion.form>
                        </motion.div>
                    )
                }

            </div >
        </div >
    );
};

export default ServiceForm;
