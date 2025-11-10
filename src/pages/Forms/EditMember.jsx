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
import { useAuthContext } from '../../hooks/useAuthContext';


const EditMember = ({ languageText, language, api }) => {
    const { user } = useAuthContext();
    const navigate = useNavigate()



    const { id } = useParams();
    const { forms, dispatch } = useFormsContext();


    const [name, setName] = useState("");
    const [arabicName, setArabicName] = useState("");
    const [email, setEmail] = useState("");
    const [faculty, setFaculty] = useState("");
    const [type, setType] = useState("");
    const [committee, setCommittee] = useState("");
    const [phone, setPhone] = useState("");
    const [linkedIn, setLinkedIn] = useState("");
    const [memberId, setMemberId] = useState("");
    const [img, setImg] = useState("");

    const facultyOptions = [
        { value: "Electrical Engineering", label: languageText.FKE, icon: "material-symbols:electric-bolt-rounded" },
        { value: "Computer Science", label: languageText.FC, icon: "icon-park-solid:code-laptop" },
        { value: "Mechanical Engineering", label: languageText.FKM, icon: "vaadin:tools" },
        { value: "Civil Engineering", label: languageText.FKA, icon: "fa6-solid:helmet-safety" },
        { value: "Chemical Engineering", label: languageText.FKT, icon: "mdi:flask" },
        { value: "Other", label: languageText.Other, icon: "icon-park-solid:other" },
    ];

    const typeOptions = [
        { value: "President", label: "President" },
        { value: "Member", label: "Member" },
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



    const { data: memberData, loading, error } = useFetchDataById(`${api}/api/member/${id}`);
    useEffect(() => {
        if (memberData && !loading && !error) {
            setName(memberData.name);
            setArabicName(memberData.arabicName);
            setEmail(memberData.email);
            setFaculty(memberData.faculty);
            setType(memberData.type);
            setCommittee(memberData.committee);
            setPhone(memberData.phone);
            setLinkedIn(memberData.linkedIn);
            setMemberId(memberData.memberId);
            setImg(memberData.img);
        }
    }, [memberData, loading, error]);


    const { handleSubmit, error: submitError, setError, submitLoading } =
        useSubmitForm();

    const onSubmit = async (e) => {
        e.preventDefault(); // Prevent default first

        // Validate required fields
        // if (!name || !img || !faculty || !categories.length || !location.length) {
        //     setError(languageText.FillRequired);
        //     return;
        // }

        const memberData = {
            name,
            arabicName,
            email,
            faculty,
            type,
            committee,
            phone,
            linkedIn,
            memberId,
            img
        };

        try {
            await handleSubmit(`${api}/api/member/${id}`, "PATCH", memberData, "members", languageText.EditMemberSuccessMessage);
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
                <div className="h-screen flex justify-center">

                    <Loader text={languageText.Loading} />
                </div>
            ) :
                submitLoading ? (
                    <div className="h-screen flex justify-center">
                        <Loader text={languageText.Updating} />
                    </div>
                ) : error ? (
                    <ErrorContainer message={error.message || "Failed to load data"} />
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

                            <img src={img} className="w-40 shadow-xl rounded-xl ring-darktheme ring-3 dark:ring-whitetheme border-9 border-whitetheme/0" />


                            <div className="flex gap-4 w-full justify-center">
                                <InputField
                                    placeholder={languageText.FullName}
                                    iconValue="fluent:rename-16-filled"
                                    icon="fluent:rename-16-regular"
                                    type="text"
                                    language={language}
                                    languageText={languageText}
                                    required={true}
                                    setValue={setName}
                                    regex={null}
                                    value={name}
                                />
                                <InputField
                                    placeholder={languageText.ArabicFullName}
                                    iconValue="fluent:rename-16-filled"
                                    icon="fluent:rename-16-regular"
                                    type="text"
                                    language={language}
                                    languageText={languageText}
                                    required={true}
                                    setValue={setArabicName}
                                    regex={null}
                                    value={arabicName}
                                />

                            </div>

                            <div className="flex gap-4 w-full justify-center">
                                <InputField
                                    placeholder={languageText.Email}
                                    iconValue="entypo:email"
                                    icon="entypo:email"
                                    type="email"
                                    language={language}
                                    languageText={languageText}
                                    setValue={setEmail}
                                    regex={null}
                                    value={email}

                                />
                                <InputField
                                    placeholder={languageText.WhatsApp}
                                    iconValue="ant-design:whats-app-outlined"
                                    icon="ant-design:whats-app-outlined"
                                    type="text"
                                    language={language}
                                    languageText={languageText}
                                    required={true}
                                    setValue={setPhone}
                                    regex={null}
                                    value={phone}

                                />
                            </div>
                            <div className="flex gap-4 w-full justify-center">
                                <InputField
                                    placeholder={languageText.linkedin}
                                    iconValue="tabler:brand-linkedin"
                                    icon="tabler:brand-linkedin"
                                    type="text"
                                    language={language}
                                    languageText={languageText}
                                    setValue={setLinkedIn}
                                    regex={null}
                                    value={linkedIn}

                                />
                                {/* <InputField
                                    placeholder={languageText.MemberID}
                                    iconValue="streamline-ultimate:touch-id-bold"
                                    icon="streamline-ultimate:touch-id-bold"
                                    type="number"
                                    language={language}
                                    languageText={languageText}
                                    setValue={setMemberId}
                                    regex={null}
                                    value={memberId}

                                /> */}
                                <InputField
                                    placeholder={languageText.ImageLink}
                                    iconValue="fluent:image-copy-28-filled"
                                    icon="fluent:image-copy-28-regular"
                                    type="text"
                                    language={language}
                                    languageText={languageText}
                                    setValue={setImg}
                                    regex={null}
                                    value={img}

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
                                <SelectField
                                    options={committeeOptions}
                                    placeholder={languageText.ChooseCommittee}
                                    iconValue="fluent:people-team-16-filled"
                                    icon="fluent:people-team-16-regular"
                                    language={language}
                                    languageText={languageText}
                                    required={true}
                                    setValue={setCommittee}
                                    regex={null}
                                    value={committee}

                                />

                                <SelectField
                                    options={typeOptions}
                                    placeholder={languageText.ChooseFaculty}
                                    iconValue="basil:university-solid"
                                    icon="basil:university-outline"
                                    language={language}
                                    languageText={languageText}
                                    required={true}
                                    setValue={setType}
                                    regex={null}
                                    value={type}

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

export default EditMember