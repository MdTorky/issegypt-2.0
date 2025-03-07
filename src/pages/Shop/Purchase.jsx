import React, { useEffect, useState } from 'react'
import Loader from "../../components/loaders/Loader";
import useFetchDataById from "../../hooks/useFetchDataById";
import { useFormsContext } from '../../hooks/useFormContext'
import { useNavigate, useParams } from 'react-router-dom';
import { AnimatePresence, motion } from "framer-motion";
import InputField from '../../components/formInputs/InputField';
import SelectField from '../../components/formInputs/SelectField';
import ImageUploadField from '../../components/formInputs/ImageUploadField';
import ErrorContainer from '../../components/formInputs/ErrorContainer';
import FormButton from '../../components/formInputs/FormButton';
import useSubmitForm from "../../hooks/useSubmitForm";
import uploadFile from '../../utils/uploadFile';


const Purchase = ({ languageText, language, api }) => {
    const { id } = useParams()

    const navigate = useNavigate()

    const [buyerName, setBuyerName] = useState('')
    const [buyerMatric, setBuyerMatric] = useState('')
    const [buyerEmail, setBuyerEmail] = useState('')
    const [buyerPhone, setBuyerPhone] = useState('')
    const [buyerFaculty, setBuyerFaculty] = useState('')
    const [buyerAddress, setBuyerAddress] = useState('')
    const [productQuantity, setProductQuantity] = useState('')
    const [productSize, setProductSize] = useState('')
    const [proof, setProof] = useState(null);
    useEffect(() => {
        const savedSize = localStorage.getItem('selectedSize');
        if (savedSize) {
            setProductSize(savedSize); // Set the size from localStorage
        }

        const savedQuantity = localStorage.getItem('selectedQuantity');
        if (savedQuantity) {
            setProductQuantity(savedQuantity);
        }
    }, []);


    const { products, dispatch } = useFormsContext();

    const { data: productData, loading, error } = useFetchDataById(`${api}/api/product/${id}`);
    useEffect(() => {
        if (productData && !loading && !error) {
            dispatch({
                type: "SET_ITEM",
                collection: "products",
                payload: productData,
            });
        }
    }, [productData, loading, error, dispatch]);

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

    const addressOptions = [
        { label: languageText.Melawis, value: "Melawis" },
        { label: languageText.Melana, value: "Melana" },
        { label: languageText.Desa, value: "Desa" },
        { label: languageText.Garden, value: "Garden" },
        { label: languageText.DSummit, value: "D'Summit" },
        { label: languageText.Flora, value: "Flora" },
        { label: languageText.OnCampus, value: "On Campus" },
        { label: languageText.Other, value: "Other" },
    ];

    const { handleSubmit, error: submitError, setError, submitLoading } =
        useSubmitForm();


    const onSubmit = async (e) => {
        e.preventDefault();

        let proofUrl = null;
        if (proof) {
            proofUrl = await uploadFile("image", proof, "shop_preset");
        }


        const transactionData = {
            productId: productData._id,
            buyerName,
            buyerMatric,
            buyerEmail,
            buyerPhone,
            buyerFaculty,
            buyerAddress,
            productSize,
            productQuantity,
            proof: proofUrl,
        };

        await handleSubmit(`${api}/api/transaction`, "POST", transactionData, "transactions", languageText.PurchaseSuccessMessage);
        navigate("/");
    };

    return (
        <div>
            {loading ? (
                <div className='h-screen flex items-center justify-center'>
                    <Loader text={languageText.Loading} />
                </div>
            ) : submitLoading ? (
                <div className='h-screen flex items-center justify-center'>
                    <Loader text={languageText.Submitting} />
                </div>
            ) : (
                <div className='flex flex-col items-center justify-center 2xl:px-40 gap-6 '>
                    <h1
                        className={`formTitle !text-5xl justify-center lg:!text-8xl !mb-0 flex flex-wrap m-auto !mt-20 gap-4`}>
                        {(() => {
                            const words = languageText.PurchaseForm.split(" ");
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

                    {/* Whole Container */}
                    <div className='flex flex-col lg:flex-row rounded-xl lg:justify-evenly lg:w-[80%] mb-10 lg:p-5 py-4'>


                        {/* Product */}
                        <div className='flex flex-col gap-3  '>
                            <div className='md:w-100 w-80 lg:m-0 m-auto bg-darktheme2/40 ring-4 ring-darktheme2/40 border-4 border-whitetheme/90 p-3 relative rounded-3xl'>
                                <img src={productData.pFrontImage} alt="" />
                                <div className="absolute bottom-0 left-0 right-0 flex m-auto w-full md:h-100 h-80 bg-gradient-to-t from-darktheme2 via-darktheme2/95 to-transparent z-10 rounded-b-3xl "></div>

                                <div className={` absolute bottom-10  text-4xl lg:text-5xl text-whitetheme z-20 w-[85%] ${language === "en" ? "left-10" : "right-10"}`}>
                                    <h1>{language === "en" ? productData.pTitle : productData.pArabicTitle}</h1>
                                </div>

                                <div className={` font-tanker absolute top-5  text-4xl text-whitetheme z-20 w-[85%] ${language === "en" ? "left-10" : "right-10"}`}>
                                    <h1>{productSize}</h1>
                                </div>
                            </div>

                            <div className=' bg-darktheme2/40 ring-4 ring-darktheme2/40 border-4 border-whitetheme/90 p-3 relative rounded-2xl w-80 md:w-100 flex items-center justify-between px-5 m-auto lg:m-0'>
                                <p className='text-whitetheme text-xl lg:text-2xl lg:!w-[70%]'>{language === "en" ? productData.pDescription : productData.pArabicDescription}</p>
                                <div className='flex flex-col items-center gap-0.5'>
                                    <p className='whitespace-nowrap text-sm lg:text-base text-whitetheme'>{languageText.Quantity}: <span className=' bg-whitetheme px-2 rounded text-darktheme'>{productQuantity}</span></p>
                                    <p className='text-sm  whitespace-nowrap lg:text-2xl bg-darktheme/50 dark:bg-darktheme text-whitetheme px-5 rounded'>{productQuantity * productData.pPrice} {languageText.RM}</p>
                                </div>
                            </div>
                        </div>

                        {/* Form */}

                        <motion.form

                            onSubmit={onSubmit}
                            variants={{
                                visible: { transition: { staggerChildren: 0.2, } },
                                exit: {
                                    transition: { staggerChildren: 0.1, },
                                }
                            }}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            transition={{ duration: 0.8, ease: "linear", type: "spring", stiffness: 100 }}
                            className={`lg:w-[50%] p-8 flex flex-col gap-4  rounded-xl`}
                        >
                            <h1 className='text-2xl text-center text-redtheme dark:text-whitetheme'>{languageText.PersonalDetails}</h1>
                            <div className="flex gap-4 w-full">
                                <InputField
                                    placeholder={languageText.FullName}
                                    iconValue="fluent:rename-16-filled"
                                    icon="fluent:rename-16-regular"
                                    type="text"
                                    language={language}
                                    languageText={languageText}
                                    required={true}
                                    setValue={setBuyerName}
                                    regex={null}
                                />
                                <InputField
                                    placeholder={languageText.Email}
                                    iconValue="entypo:email"
                                    icon="entypo:email"
                                    type="email"
                                    language={language}
                                    languageText={languageText}
                                    required={true}
                                    setValue={setBuyerEmail}
                                    regex={null}
                                />
                            </div>
                            <div className="flex gap-4 w-full">
                                <InputField
                                    placeholder={languageText.MatricNo}
                                    iconValue="ion:id-card"
                                    icon="ion:id-card-outline"
                                    type="text"
                                    language={language}
                                    languageText={languageText}
                                    required={true}
                                    setValue={setBuyerMatric}
                                    regex={null}
                                />
                                <InputField
                                    placeholder={languageText.PhoneNo}
                                    iconValue="fluent:phone-20-filled"
                                    icon="fluent:phone-20-regular"
                                    type="number"
                                    language={language}
                                    languageText={languageText}
                                    required={true}
                                    setValue={setBuyerPhone}
                                    regex={null}
                                />
                            </div>
                            <div className="flex gap-4 w-full">
                                <SelectField
                                    options={facultyOptions}
                                    placeholder={languageText.ChooseYourFaculty}
                                    iconValue="basil:university-solid"
                                    icon="basil:university-outline"
                                    language={language}
                                    languageText={languageText}
                                    required={true}
                                    setValue={setBuyerFaculty}
                                    regex={null}
                                />
                                <SelectField
                                    options={addressOptions}
                                    placeholder={languageText.ChosoeYourAddress}
                                    iconValue="f7:location-circle-fill"
                                    icon="f7:location-circle"
                                    language={language}
                                    languageText={languageText}
                                    required={true}
                                    setValue={setBuyerAddress}
                                    regex={null}
                                />
                            </div>

                            <hr className='w-3/4 h-1 mx-auto bg-redtheme dark:bg-whitetheme' />
                            <h1 className='text-2xl text-center text-redtheme dark:text-whitetheme'>{languageText.PaymentDetails}</h1>

                            <div className="flex gap-4 w-full">
                                <motion.div
                                    variants={InputChildVariants}
                                    className='w-1/2 rounded-xl border-3 border-gray-700 p-1'>
                                    <img src="https://res.cloudinary.com/dmv4mxgn5/image/upload/v1720717445/Events/Fifa_ot5yio.png" className='rounded-lg' alt="" />
                                </motion.div>
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

                            <div className='m-auto'>
                                {!proof &&
                                    <ErrorContainer error={languageText.UploadProofError} />
                                }
                                {submitError &&
                                    <ErrorContainer error={submitError} setError={setError} />
                                }
                                {proof ? (
                                    <FormButton icon="hugeicons:task-done-01" text={languageText.SubmitForm} />
                                ) : null}
                            </div>
                        </motion.form>
                    </div>
                </div>


                // <div className={`flex flex-col lg:flex-row h-screen w-full items-center overflow-hidden relative justify-between  `}>
                //     <motion.div
                //         transition={{ duration: 0.8, }}
                //         className="relative top-0 left-0 h-full bg-cover bg-center flex justify-center bg-darktheme/40  p-4 mt-30 mb-10 lg:mt-0  lg:mb-0"
                //     >
                //         < img src={productData.pFrontImage} alt="" />
                //         <div className="absolute bottom-0 left-0 right-0 flex m-auto w-full h-full bg-gradient-to-t from-darktheme2 via-darktheme2/95 to-transparent z-10  "></div>
                //         <div className={` absolute bottom-10   text-whitetheme z-20 w-[85%] ${language === "en" ? "left-10" : "right-10"}`}>
                //             <h1 className='text-5xl'>{language === "en" ? productData.pTitle : gallery.pArabicTitle}</h1>
                //             <p className='text-3xl text-gray-400'>{language === "en" ? productData.pDescription : gallery.pArabicDescription}</p>
                //         </div>
                //     </motion.div>


                //     <motion.div
                //         transition={{ duration: 0.8, ease: "linear" }}
                //         className='relative flex flex-col justify-center m-auto rounded-xl'>

                //         <motion.h2
                //             initial={{ scale: 0, opacity: 0 }}
                //             animate={{ scale: 1, opacity: 1 }}
                //             exit={{ opacity: 0, scale: 0 }} //

                //             transition={{ duration: 0.9, delay: 0.1, type: "spring" }}

                //             className="text-4xl lg:text-6xl bg-gradient-to-r from-redtheme to-redtheme2 bg-clip-text text-transparent text-center font-bold mb-10 m-auto">
                //             {languageText.Register} <span className="text-darktheme2 dark:text-whitetheme">{languageText.Account}</span>
                //         </motion.h2>
                //         <motion.form
                //             // onSubmit={handleRegisterSubmit}
                //             // variants={parentStagger}
                //             initial="hidden"
                //             animate="visible"
                //             exit="exit"
                //             className="formForm ">

                //             <h1 className='text-2xl'>Personal Details</h1>

                //             <div className="flex gap-4 w-full">
                //                 <InputField
                //                     placeholder={languageText.ServiceName}
                //                     iconValue="mdi:rename"
                //                     icon="mdi:rename-outline"
                //                     type="text"
                //                     language={language}
                //                     languageText={languageText}
                //                     required={true}
                //                     setValue={setBuyerName}
                //                     regex={null}
                //                 />
                //                 <InputField
                //                     placeholder={languageText.ServiceName}
                //                     iconValue="mdi:rename"
                //                     icon="mdi:rename-outline"
                //                     type="email"
                //                     language={language}
                //                     languageText={languageText}
                //                     required={true}
                //                     setValue={setBuyerEmail}
                //                     regex={null}
                //                 />
                //             </div>
                //             <div className="flex gap-4 w-full">
                //                 <InputField
                //                     placeholder={languageText.ServiceName}
                //                     iconValue="mdi:rename"
                //                     icon="mdi:rename-outline"
                //                     type="text"
                //                     language={language}
                //                     languageText={languageText}
                //                     required={true}
                //                     setValue={setBuyerMatric}
                //                     regex={null}
                //                 />
                //                 <InputField
                //                     placeholder={languageText.ServiceName}
                //                     iconValue="mdi:rename"
                //                     icon="mdi:rename-outline"
                //                     type="number"
                //                     language={language}
                //                     languageText={languageText}
                //                     required={true}
                //                     setValue={setBuyerPhone}
                //                     regex={null}
                //                 />
                //             </div>
                //             <div className="flex gap-4 w-full">
                //                 <SelectField
                //                     options={facultyOptions}
                //                     placeholder={languageText.ChooseCommittee}
                //                     iconValue="fluent:people-team-16-filled"
                //                     icon="fluent:people-team-16-regular"
                //                     language={language}
                //                     languageText={languageText}
                //                     required={true}
                //                     setValue={setBuyerFaculty}
                //                     regex={null}
                //                 />
                //                 <SelectField
                //                     options={addressOptions}
                //                     placeholder={languageText.ChooseCommittee}
                //                     iconValue="fluent:people-team-16-filled"
                //                     icon="fluent:people-team-16-regular"
                //                     language={language}
                //                     languageText={languageText}
                //                     required={true}
                //                     setValue={setBuyerFaculty}
                //                     regex={null}
                //                 />
                //             </div>

                //         </motion.form>
                //     </motion.div>
                // </div>
            )}
        </div >
    )
}

export default Purchase