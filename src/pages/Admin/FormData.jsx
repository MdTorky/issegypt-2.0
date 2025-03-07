import React, { useState, useEffect } from "react";
import useFetchDataById from "../../hooks/useFetchDataById";
import { useFormsContext } from '../../hooks/useFormContext';
import Loader from "../../components/loaders/Loader";
import { Icon } from "@iconify/react";
import { AnimatePresence, motion } from "framer-motion";
import { useParams } from "react-router-dom";
import AdminNavBar from "../../components/AdminNavBar";
import SearchInput from "../../components/formInputs/SearchInput";
import * as XLSX from "xlsx";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import SuccessMessage from "../../components/formInputs/SuccessMessage";
import ScrollToTop from "../../components/ScrollToTop";



const FormData = ({ languageText, language, api }) => {
    const { id } = useParams()
    const { forms, ISSForm, dispatch } = useFormsContext();
    const [searchQuery, setSearchQuery] = useState("");
    const [copySuccess, setCopySuccess] = useState('')


    const { data: formData, loading: formLoading, error: formError } = useFetchDataById(`${api}/api/forms/${id}`);
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

    const filteredForms = issData?.filter((form) => {
        const searchRegex = new RegExp(searchQuery, 'i');
        return (
            (searchRegex.test(form.fullName) || searchRegex.test(form.matric) || searchRegex.test(form.email))
        )
    });


    const downloadExcel = () => {
        if (!issData || issData.length === 0) return;

        // Extract headers from formData.inputs
        const headers = [];
        if (formData.inputs.includes("Full Name")) headers.push(languageText.FullName);
        if (formData.inputs.includes("Matric")) headers.push(languageText.MatricNo);
        if (formData.inputs.includes("Email")) headers.push(languageText.Email);
        if (formData.inputs.includes("Phone No.")) headers.push(languageText.PhoneNo);
        if (formData.inputs.includes("Faculty")) headers.push(languageText.Faculty);
        if (formData.inputs.includes("Year")) headers.push(languageText.Year);
        if (formData.inputs.includes("Semester")) headers.push(languageText.Semester);


        formData.customInputs?.forEach((customInput) => headers.push(customInput));
        formData.selectInputs?.forEach((selectInput) => headers.push(selectInput.label));
        if (formData.inputs.includes("Picture")) headers.push(languageText.PersonalPicture);
        if (formData.inputs.includes("Payment")) headers.push(languageText.Proof);

        // Extract data from forms
        const rows = issData.map((form) => {
            const row = [];
            if (formData.inputs.includes("Full Name")) row.push(form.fullName);
            if (formData.inputs.includes("Matric")) row.push(form.matric);
            if (formData.inputs.includes("Email")) row.push(form.email);
            if (formData.inputs.includes("Phone No.")) row.push(form.phone);
            if (formData.inputs.includes("Faculty")) row.push(form.faculty);
            if (formData.inputs.includes("Year")) row.push(form.year);
            if (formData.inputs.includes("Semester")) row.push(form.semester);

            formData.customInputs?.forEach((_, index) => row.push(form.customInputs?.[index] || ""));
            formData.selectInputs?.forEach((selectInput) => {
                row.push(
                    Array.isArray(form?.selectInputs?.[selectInput.label])
                        ? form.selectInputs[selectInput.label].join(", ")
                        : form.selectInputs[selectInput.label] || "-"
                );
            });

            if (formData.inputs.includes("Picture")) row.push(form.picture);
            if (formData.inputs.includes("Payment")) row.push(form.proof);
            return row;
        });

        // Create a worksheet
        const ws = XLSX.utils.aoa_to_sheet([headers, ...rows]);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "FormData");

        // Write file
        XLSX.writeFile(wb, (formData.eventName + " Form.xlsx"));
    };



    const downloadProfilePictures = async () => {
        if (!issData || issData.length === 0) return;

        const zip = new JSZip();
        const imageFolder = zip.folder(formData.eventName + " Profile Pictures");

        await Promise.all(
            issData.map(async (form, index) => {
                if (form.picture) {
                    try {
                        const response = await fetch(form.picture);
                        const blob = await response.blob();
                        // imageFolder.file(`profile_${index + 1}.jpg`, blob);
                        imageFolder.file(`${form.fullName}.jpg`, blob);
                    } catch (error) {
                        console.error("Error fetching profile picture:", error);
                    }
                }
            })
        );

        zip.generateAsync({ type: "blob" }).then((content) => {
            saveAs(content, `${formData.eventName + " " + languageText.PersonalPicture}.zip`);
        });
    };



    const downloadPaymentProofs = async () => {
        if (!issData || issData.length === 0) return;

        const zip = new JSZip();
        const paymentFolder = zip.folder(formData.eventName + " Payment Proof");

        await Promise.all(
            issData.map(async (form, index) => {
                if (form.proof) {
                    try {
                        const response = await fetch(form.proof);
                        const blob = await response.blob();
                        paymentFolder.file(`${form.fullName}_Proof.jpg`, blob);
                    } catch (error) {
                        console.error("Error fetching payment proof:", error);
                    }
                }
            })
        );

        zip.generateAsync({ type: "blob" }).then((content) => {
            saveAs(content, `${formData.eventName + " " + languageText.Proof}.zip`);
        });
    };


    const handleHeaderClick = (header) => {
        const columnData = issData.map((form) => {
            switch (header) {
                case "Full Name":
                    return form.fullName;
                case "Matric":
                    return form.matric;
                case "Email":
                    return form.email;
                case "Phone No.":
                    return form.phone;
                case "Faculty":
                    return form.faculty;
                case "Year":
                    return form.year;
                case "Semester":
                    return form.semester;
                case "Custom Inputs":
                    return form.customInputs ? form.customInputs.join(', ') : '';
                default: // Handle dynamic Select Input headers
                    return form.selectInputs?.[header]
                        ? Array.isArray(form.selectInputs[header])
                            ? form.selectInputs[header].join(', ')
                            : form.selectInputs[header]
                        : '';

            }
        });

        const columnDataText = columnData.join('\n');
        navigator.clipboard.writeText(columnDataText);
        setCopySuccess(languageText.AllOfThe + " " + header + " " + languageText.DataCopiedSuccessfully)
        // toast.success(`${header} column data copied to clipboard`);
    };

    return (
        <div className="lg:flex ">
            <AdminNavBar languageText={languageText} language={language} api={api} />
            {(formLoading || issLoading) ? (
                <div className="h-screen flex w-full justify-center">
                    <Loader text={languageText.Loading} />
                </div>
            ) : (
                <div className=" flex flex-col justify-center items-center p-8 overflow-y-auto overflow-x-hidden w-full">

                    <div className={`adminDashboardCard group mb-3 lg:mt-30 ${language === "en" ? "md:ml-auto" : "md:mr-auto"}`}>
                        <div className="flex flex-col">
                            <p className="lg:text-2xl text-gray-300">{languageText.TotalSubmissions}</p>
                            <h1 className="lg:text-8xl text-whitetheme group-hover:text-redtheme duration-500">{issData?.length}</h1>
                        </div>
                        <div className="lg:text-9xl text-whitetheme group-hover:text-redtheme duration-500">
                            <Icon icon="ic:baseline-question-answer" />
                        </div>
                    </div>

                    <h1 className="text-8xl font-bold text-redtheme dark:text-whitetheme text-center my-10 ">{language === "en" ? formData.eventName : formData.arabicEventName}</h1>


                    <div className="flex lg:flex-row flex-col gap-2 items-center">
                        <SearchInput languageText={languageText} language={language} onSearch={(query) => setSearchQuery(query)} />

                        <div className="flex flex-wrap gap-4">
                            <motion.button
                                initial={{ opacity: 0, scale: 0 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0 }}
                                transition={{ duration: 0.3, type: 'spring', stiffness: 200 }}
                                whileTap={{ scale: 0.6 }}
                                whileHover={{ scale: 1.2 }}
                                type="button"
                                className="AddFormButton group bg-green-800"
                                onClick={downloadExcel}
                            >

                                <Icon icon="file-icons:microsoft-excel" className="text-xl" />
                                <div className="inputIconText bg-green-800">
                                    {languageText.DownlaodExcel}
                                </div>
                            </motion.button>
                            <motion.button
                                initial={{ opacity: 0, scale: 0 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0 }}
                                transition={{ duration: 0.3, type: 'spring', stiffness: 200 }}
                                whileTap={{ scale: 0.6 }}
                                whileHover={{ scale: 1.2 }}
                                type="button"
                                className="AddFormButton group bg-redtheme"
                                onClick={downloadProfilePictures}
                            >

                                <Icon icon="iconamoon:profile-circle-fill" className="text-xl" />
                                <div className="inputIconText bg-redtheme">
                                    {languageText.DownloadProfile}
                                </div>
                            </motion.button>
                            <motion.button
                                initial={{ opacity: 0, scale: 0 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0 }}
                                transition={{ duration: 0.3, type: 'spring', stiffness: 200 }}
                                whileTap={{ scale: 0.6 }}
                                whileHover={{ scale: 1.2 }}
                                type="button"
                                className="AddFormButton group bg-darktheme"
                                onClick={downloadPaymentProofs}
                            >

                                <Icon icon="fluent:reciept-20-filled" className="text-xl" />
                                <div className="inputIconText bg-darktheme">
                                    {languageText.DownloadProof}

                                </div>
                            </motion.button>

                        </div>
                    </div>



                    <p className="auto 2xl:hidden ScrollHorizontally mt-4" >{languageText.ScrollHorizontally}</p>



                    <div className="w-full overflow-auto h-full p-5 m-3 flex flex-col  2xl:items-center gap-4 mt-4">
                        {/* Scrollable Table Wrapper */}
                        <div className="tableHeader !w-full 2xl:min-w-full min-w-[800px]">
                            {formData.inputs.includes("Picture") && <div className="tableDiv"></div>}

                            {formData.inputs.includes("Full Name") && (<div
                                onClick={() => handleHeaderClick("Full Name")}
                                className="tableDiv cursor-pointer">{languageText.FullName}</div>)}

                            {formData.inputs.includes("Matric") && (<div
                                onClick={() => handleHeaderClick("Matric")}
                                className="tableDiv cursor-pointer">{languageText.MatricNo}</div>)}

                            {formData.inputs.includes("Email") && (<div
                                onClick={() => handleHeaderClick("Email")}
                                className="tableDiv cursor-pointer">{languageText.Email}</div>)}

                            {formData.inputs.includes("Phone No.") && (<div
                                onClick={() => handleHeaderClick("Phone No.")}
                                className="tableDiv cursor-pointer">{languageText.PhoneNo}</div>)}

                            {formData.inputs.includes("Faculty") && (<div
                                onClick={() => handleHeaderClick("Faculty")}
                                className="tableDiv cursor-pointer">{languageText.Faculty}</div>)}

                            {formData.inputs.includes("Year") && (<div
                                onClick={() => handleHeaderClick("Year")}
                                className="tableDiv cursor-pointer">{languageText.Year}</div>)}

                            {formData.inputs.includes("Semester") && (<div
                                onClick={() => handleHeaderClick("Semester")}
                                className="tableDiv cursor-pointer">{languageText.Semester}</div>)}

                            {formData.inputs.includes("Custom Inputs") && formData.customInputs.length > 0 && (
                                formData.customInputs.map((customInput, index) => (
                                    <div key={index}
                                        onClick={() => handleHeaderClick("Custom Inputs")}
                                        className="tableDiv cursor-pointer">{customInput}</div>
                                ))
                            )}
                            {formData.inputs.includes("Select Input") && formData?.selectInputs?.map((selectInput, index) => (
                                <div key={index}
                                    onClick={() => handleHeaderClick(selectInput?.label)}
                                    className="tableDiv cursor-pointer">{selectInput?.label}</div>
                            ))}
                            {formData?.inputs.includes("Payment") && (
                                <div className="tableDiv">{languageText.Proof}</div>
                            )}
                        </div>

                        <div className="tableBody">
                            {(filteredForms?.length === 0 || issData?.length === 0) && (
                                <div className="tableRow ">
                                    <div className="w-full flex justify-center items-center gap-2">
                                        <Icon icon="material-symbols:nearby-error-rounded" />
                                        {languageText.NoForms}</div>
                                </div>
                            )}


                            {filteredForms?.map((form) => (
                                <div className="tableRow" key={form.id}>

                                    {formData.inputs.includes("Picture") && <div className="tableDiv">
                                        <img src={form.picture} alt="" className=" cursor-pointer w-20 lg:w-20 m-auto rounded-lg"
                                            onClick={() => { window.open(form.picture, "_blank") }}
                                        />
                                    </div>}


                                    {formData.inputs.includes("Full Name") && (<div className="tableDiv">{form.fullName}</div>)}
                                    {formData.inputs.includes("Matric") && (<div className="tableDiv">{form.matric}</div>)}
                                    {formData.inputs.includes("Email") && (<div className="tableDiv !text-xs">{form.email}</div>)}
                                    {formData.inputs.includes("Phone No.") && (<div className="tableDiv">{form.phone}</div>)}
                                    {formData.inputs.includes("Faculty") && (<div className="tableDiv">{form.faculty}</div>)}
                                    {formData.inputs.includes("Year") && (<div className="tableDiv">{form.year}</div>)}
                                    {formData.inputs.includes("Semester") && (<div className="tableDiv">{form.semester}</div>)}

                                    {/* {formData.inputs.includes("Custom Inputs") && formData?.customInputs != "" && (
                                        form?.customInputs.map((customInput, index) => (
                                            <div className="tableDiv">{customInput}</div>
                                        ))
                                    )} */}


                                    {formData.inputs.includes("Custom Inputs") &&
                                        formData.customInputs && // Check if it exists
                                        Array.isArray(formData.customInputs) && // Ensure it's an array
                                        formData.customInputs.map((customInput, index) => (
                                            <div
                                                key={index}
                                                onClick={() => handleHeaderClick("Custom Inputs")}
                                                className="tableDiv cursor-pointer"
                                            >
                                                {customInput}
                                            </div>
                                        ))}

                                    {formData.inputs.includes("Select Input") && formData?.selectInputs && formData?.selectInputs.map((selectInput, index) => (
                                        <div className="tableDiv" key={index}>
                                            {Array.isArray(form?.selectInputs?.[selectInput?.label])
                                                ? form?.selectInputs[selectInput?.label].join(', ')
                                                : form?.selectInputs[selectInput?.label] || '-'}
                                        </div>
                                    ))}


                                    {formData.inputs.includes("Payment") && <div className="tableDiv">
                                        <img src={form.proof} alt="" className=" cursor-pointer w-20 lg:w-20 m-auto rounded-lg"
                                            onClick={() => { window.open(form.proof, "_blank") }}
                                        />
                                    </div>}
                                </div>
                            ))}

                        </div>
                    </div>
                </div>
            )}
            <AnimatePresence>
                {copySuccess && <SuccessMessage languageText={languageText} text={copySuccess} setValue={setCopySuccess} language={language} />}
            </AnimatePresence>
            <ScrollToTop languageText={languageText} />

        </div>
    )
}

export default FormData