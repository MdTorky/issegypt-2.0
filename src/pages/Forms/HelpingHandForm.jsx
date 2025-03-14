import React, { useState, useEffect } from "react";
import SelectField from "../../components/formInputs/SelectField"; // Ensure correct path
import { Icon } from "@iconify/react";
import useSubmitForm from "../../hooks/useSubmitForm";
import ErrorContainer from "../../components/formInputs/ErrorContainer";
import { useFormsContext } from '../../hooks/useFormContext';
import { AnimatePresence, motion } from "framer-motion";
import useFetchData from "../../hooks/useFetchData";
import Loader from "../../components/loaders/Loader";
import InputField from "../../components/formInputs/InputField";
import FormButton from "../../components/formInputs/FormButton";
import AdminNavBar from "../../components/AdminNavBar";
import { useAuthContext } from '../../hooks/useAuthContext';
import { useNavigate } from "react-router-dom";

const HelpingHandForm = ({ language, languageText, api }) => {
  const { user } = useAuthContext();
  const navigate = useNavigate()

  // useEffect(() => {
  //   if (!user) {
  //     navigate('/auth/login', { replace: true }); // Redirect to login
  //   }
  // }, [user, navigate]);

  const { services, dispatch } = useFormsContext();
  const [service, setService] = useState(""); // Selected service
  const [group, setGroup] = useState(""); // Selected group
  const [name, setName] = useState("");
  const [aName, setAName] = useState("");
  const [description, setDescription] = useState("");
  const [aDescription, setADescription] = useState("");
  const [img, setImg] = useState("");
  const [links, setLinks] = useState([]);

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

  const { data: serviceData, loading, error } = useFetchData(`${api}/api/service`);
  useEffect(() => {
    if (serviceData && !loading && !error) {
      dispatch({
        type: "SET_ITEM",
        collection: "services",
        payload: serviceData,
      });
    }
  }, [serviceData, loading, error, dispatch]);

  // console.log("Services:", services);
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

  const { handleSubmit, error: submitError, setError, submitLoading } =
    useSubmitForm();


  const onSubmit = async (e) => {
    e.preventDefault();

    const helpingData = {
      service,
      group,
      name,
      aName,
      description,
      aDescription,
      img,
      links,
    };

    await handleSubmit(`${api}/api/helping`, "POST", helpingData, "helpinghands", languageText.ServiceSuccessMessage);
  };



  return (
    <div className="lg:flex ">
      <AdminNavBar languageText={languageText} language={language} api={api} />
      <div className=" flex w-full justify-center items-center">
        {loading ?
          (
            <div className="h-screen flex justify-center items-center">
              <Loader text={languageText.Loading} />
            </div>
          ) :
          submitLoading ? (
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
              <motion.form
                className="formForm "
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
                  {languageText.Services} <span className="text-darktheme2 dark:text-whitetheme">{languageText.Form}</span>
                </motion.h2>

                <div className="formRow">

                  <SelectField
                    options={serviceOptions}
                    placeholder={languageText.ChooseService}
                    iconValue="ri:service-fill"
                    icon="ri:service-line"
                    language={language}
                    languageText={languageText}
                    required={true}
                    setValue={setService} // Update the selected service
                    regex={null}
                  />

                  {selectedService?.groups.length > 0 && (
                    <SelectField
                      options={groupOptions}
                      placeholder={languageText.ChooseGroup}
                      iconValue="fluent:tab-group-16-filled"
                      icon="fluent:tab-group-16-regular"
                      language={language}
                      languageText={languageText}
                      required={true}
                      setValue={setGroup}
                      regex={null}
                    />
                  )}
                </div>

                {selectedService && (
                  <AnimatePresence>
                    <motion.div
                      variants={{
                        visible: { transition: { staggerChildren: 0.2 } },
                        exit: { transition: { staggerChildren: 0.1 } },
                      }}
                      className="flex flex-col gap-3"
                    >
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
                          setValue={setADescription}
                          regex={null}
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
                        <div key={index} className="formRow">
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
                          />

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
                    </motion.div>
                  </AnimatePresence>
                )}

                <AnimatePresence mode="popLayout">
                  {submitError &&
                    <ErrorContainer error={submitError} setError={setError} />}
                </AnimatePresence>
                <FormButton icon="hugeicons:task-done-01" text={languageText.SubmitForm} />
              </motion.form>
            </motion.div>
          )}
      </div>
    </div>
  );
};

export default HelpingHandForm;