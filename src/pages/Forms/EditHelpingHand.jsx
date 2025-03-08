import React, { useState, useEffect } from "react";
import SelectField from "../../components/formInputs/SelectField";
import { Icon } from "@iconify/react";
import useSubmitForm from "../../hooks/useSubmitForm";
import useFetchDataById from "../../hooks/useFetchDataById";
import useFetchData from "../../hooks/useFetchData";
import ErrorContainer from "../../components/formInputs/ErrorContainer";
import { useParams, useNavigate } from "react-router-dom";
import { useFormsContext } from '../../hooks/useFormContext';
import { AnimatePresence, motion } from "framer-motion";
import Loader from "../../components/loaders/Loader";
import InputField from "../../components/formInputs/InputField";
import FormButton from "../../components/formInputs/FormButton";
import { useAuthContext } from '../../hooks/useAuthContext';

const EditHelpingHand = ({ language, languageText, api }) => {
    const { id } = useParams(); // Get the ID of the Helping Hand from the URL
    const { services, dispatch } = useFormsContext();
    const { user } = useAuthContext();
    const navigate = useNavigate()


    const [service, setService] = useState(""); // Selected service
    const [group, setGroup] = useState(""); // Selected group
    const [name, setName] = useState("");
    const [aName, setAName] = useState("");
    const [description, setDescription] = useState("");
    const [aDescription, setADescription] = useState("");
    const [img, setImg] = useState("");
    const [links, setLinks] = useState([]);

    const { data: helpingData, loading, error } = useFetchDataById(`${api}/api/helping/${id}`);
    useEffect(() => {
        if (helpingData && !loading && !error) {
            setService(helpingData.service);
            setGroup(helpingData.group);
            setName(helpingData.name);
            setAName(helpingData.aName);
            setDescription(helpingData.description);
            setADescription(helpingData.aDescription);
            setImg(helpingData.img);
            setLinks(helpingData.links);
        }
    }, [helpingData, loading, error]);

    const linkTypes = [
        { label: languageText.Website, value: "Website", aValue: "موقع", icon: "pepicons-pop:internet-circle-filled" },
        { label: languageText.Location, value: "Location", aValue: "العنوان", icon: "material-symbols:share-location-rounded" },
        { label: languageText.Email, value: "Email", aValue: "البريد الإلكتروني", icon: "entypo:email" },
        { label: languageText.IOS, value: "IOS", aValue: "آي أو إس", icon: "ic:baseline-apple" },
        { label: languageText.Android, value: "Android", aValue: "أندرويد", icon: "uil:android" },
        { label: languageText.ImageLink, value: "ImageLink", aValue: "صورة", icon: "fluent:image-copy-28-filled" },
        { label: languageText.WhatsApp, value: "WhatsApp", aValue: "واتساب", icon: "ant-design:whats-app-outlined" },
        { label: languageText.YouTube, value: "YouTube", aValue: "يوتيوب", icon: "mingcute:youtube-fill" },
        { label: languageText.Instagram, value: "Instagram", aValue: "إنستغرام", icon: "mdi:instagram" },
        { label: languageText.Download, value: "Download", aValue: "تنزيل", icon: "mingcute:download-3-fill" },
        { label: languageText.Link, value: "Link", aValue: "رابط", icon: "f7:link-circle-fill" },
        { label: languageText.Description, value: "Description", aValue: "وصف", icon: "tabler:file-description-filled" },
        { label: languageText.Bus, value: "Bus", aValue: "الباص", icon: "fa6-solid:bus" },
        { label: languageText.Other, value: "Other", aValue: "آخر", icon: "icon-park-solid:other" },
    ];

    const addLink = () => {
        setLinks([...links, { type: "", url: "", aType: "" }]);
    };

    const updateLink = (index, field, value) => {
        const updatedLinks = [...links];
        if (field === "type") {
            const selectedLinkType = linkTypes.find((lt) => lt.value === value);
            updatedLinks[index].type = value;
            updatedLinks[index].aType = selectedLinkType?.aValue || ""; // Set the Arabic type
        } else {
            updatedLinks[index][field] = value;
        }
        setLinks(updatedLinks);
    };

    const removeLink = (index) => {
        setLinks(links.filter((_, i) => i !== index));
    };

    const { data: serviceData, loading: serviceLoading, error: serviceError } = useFetchData(`${api}/api/service`);

    useEffect(() => {
        if (serviceData && !serviceLoading && !serviceError) {
            dispatch({
                type: "SET_ITEM",
                collection: "services",
                payload: serviceData,
            });
        }
    }, [serviceData, serviceLoading, serviceError, dispatch]);

    console.log("Services:", services);
    const selectedService = services.find((s) => s.link === service);
    const groupOptions = selectedService?.groups.map((group) => ({
        icon: selectedService.icon,
        value: group.name,
        label: language === "ar" ? group.aName : group.name,
    })) || [];

    const serviceOptions = services.map((service) => ({
        value: service.link,
        label: language === "ar" ? service.aName : service.name,
        icon: service.icon,
    }));

    const { handleSubmit, error: submitError, setError, submitLoading } =
        useSubmitForm();

    const onSubmit = async (e) => {
        e.preventDefault();

        const updatedHelpingData = {
            service,
            group,
            name,
            aName,
            description,
            aDescription,
            img,
            links,
        };

        await handleSubmit(`${api}/api/helping/${id}`, "PATCH", updatedHelpingData, "helpinghands", languageText.ServiceUpdateMessage);
        navigate(-1);
    };

    const InputChildVariants = {
        hidden: { opacity: 0, y: -50 },
        visible: {
            opacity: 1, y: 0,
            transition: {
                type: "spring",
                stiffness: 100,
            }
        },
        exit: { opacity: 0, y: 50 }
    };

    return (
        <div>
            {serviceLoading || loading ? (
                <div className='h-screen flex justify-center items-center'>
                    <Loader text={languageText.Loading} />
                </div>
            ) : error ? (
                <ErrorContainer message={error.message || "Failed to load data"} />
            ) : (
                <motion.div
                    initial={{ opacity: 0, y: -200 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -200 }}
                    transition={{ duration: 0.8, ease: "linear", type: "spring", stiffness: 100 }}
                    className={`w-full p-8 flex flex-col justify-center items-center m-auto rounded-xl `}
                >
                    <motion.form
                        className="formForm  my-10"
                        variants={{
                            visible: { transition: { staggerChildren: 0.2 } },
                            exit: { transition: { staggerChildren: 0.1 } },
                        }}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        onSubmit={onSubmit}
                    >
                        <motion.h2
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ opacity: 0, scale: 0 }}
                            transition={{ duration: 0.9, delay: 0.1, type: "spring" }}
                            className={`formTitle ${language === "en" ? "" : "flex flex-row-reverse"}  gap-2`}
                        >
                            {languageText.Edit} {languageText.Services} <span className="text-darktheme2 dark:text-whitetheme">{languageText.Form}</span>
                        </motion.h2>

                        <div className="flex gap-4 w-full justify-center">
                            <SelectField
                                options={serviceOptions}
                                placeholder={languageText.ChooseService}
                                iconValue="ri:service-fill"
                                icon="ri:service-line"
                                language={language}
                                languageText={languageText}
                                required={true}
                                setValue={setService}
                                regex={null}
                                value={service}
                            />


                            {/* Group Selection */}
                            {selectedService?.groups.length > 0 && (
                                <SelectField
                                    options={groupOptions}
                                    placeholder={languageText.ChooseGroup}
                                    iconValue="fluent:people-team-16-filled"
                                    icon="fluent:people-team-16-regular"
                                    language={language}
                                    languageText={languageText}
                                    required={true}
                                    setValue={setGroup}
                                    regex={null}
                                    value={group}

                                />
                            )}
                        </div>

                        <div className="flex gap-4 w-full justify-center">
                            <InputField
                                placeholder={languageText.ServiceName}
                                iconValue="mdi:rename"
                                icon="mdi:rename-outline"
                                type="text"
                                required={true}
                                language={language}
                                languageText={languageText}
                                setValue={setName}
                                regex={null}
                                value={name}
                            />

                            <InputField
                                placeholder={languageText.ServiceArabicName}
                                iconValue="mdi:rename"
                                icon="mdi:rename-outline"
                                type="text"
                                required={true}
                                language={language}
                                languageText={languageText}
                                setValue={setAName}
                                regex={null}
                                value={aName}
                            />
                        </div>

                        <div className="flex gap-4 w-full justify-center">
                            <InputField
                                placeholder={languageText.ServiceDescription}
                                iconValue="tabler:file-description-filled"
                                icon="tabler:file-description"
                                type="text"
                                required={false}
                                language={language}
                                languageText={languageText}
                                setValue={setDescription}
                                regex={null}
                                value={description}
                            />
                            <InputField
                                placeholder={languageText.ServiceArabicDescription}
                                iconValue="tabler:file-description-filled"
                                icon="tabler:file-description"
                                type="text"
                                required={false}
                                language={language}
                                languageText={languageText}

                                setValue={setADescription}
                                regex={null}
                                value={aDescription}
                            />
                        </div>

                        <InputField
                            placeholder={languageText.ServiceImageLink}
                            iconValue="fluent:image-copy-28-filled"
                            icon="fluent:image-copy-28-regular"
                            type="text"
                            required={true}
                            language={language}
                            languageText={languageText}
                            setValue={setImg}
                            regex={null}
                            value={img}
                        />

                        <motion.button
                            variants={InputChildVariants}
                            whileHover={{
                                scale: 1.1
                            }}
                            whileTap={{
                                scale: 0.6
                            }}
                            type="button"
                            className=" w-full mt-2 lg:-translate-y-1 py-3 bg-redtheme text-white rounded-lg cursor-pointer"
                            onClick={addLink}
                        >
                            {languageText.AddLink}
                        </motion.button>

                        {links.map((link, index) => (
                            <div key={index} className="flex items-center w-full gap-4">

                                <SelectField
                                    options={linkTypes}
                                    placeholder={languageText.SelectLinkType}
                                    iconValue="f7:link-circle-fill"
                                    icon="f7:link-circle"
                                    language={language}
                                    languageText={languageText}
                                    required={true}
                                    setValue={(value) => updateLink(index, "type", value)}
                                    regex={null}
                                    value={link.type}

                                />

                                {/* Link URL */}
                                <InputField
                                    placeholder={languageText.ServiceLink}
                                    iconValue="f7:link-circle-fill"
                                    icon="f7:link-circle"
                                    type="text"
                                    required={true}
                                    language={language}
                                    languageText={languageText}
                                    setValue={(value) => updateLink(index, "url", value)}
                                    regex={null}
                                    value={link.url}

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
                                    onClick={() => removeLink(index)}
                                >
                                    <Icon icon="solar:trash-bin-minimalistic-broken" className="text-xl" />
                                </motion.button>
                            </div>
                        ))}

                        {/* Submit Button */}
                        <AnimatePresence mode="popLayout">
                            {submitError &&
                                <ErrorContainer error={submitError} setError={setError} />}
                        </AnimatePresence>
                        <FormButton icon="hugeicons:task-done-01" text={languageText.SubmitForm} />

                    </motion.form>
                </motion.div>
            )}
        </div>
    );
};

export default EditHelpingHand;