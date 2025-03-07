import React, { useEffect, useState } from 'react'
import useFetchDataById from "../../hooks/useFetchDataById";
import { useFormsContext } from '../../hooks/useFormContext'
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate, useParams } from 'react-router-dom';
import Loader from '../../components/loaders/Loader';
import { Icon } from "@iconify/react";


const Reference = ({ languageText, language, api }) => {
    const { id } = useParams()


    const { transactions, products, dispatch } = useFormsContext();

    const { data: transactionData, loading: transactionLoading, error: transactionError } = useFetchDataById(`${api}/api/transaction/t/${id}`);
    useEffect(() => {
        if (transactionData && !transactionLoading && !transactionError) {
            dispatch({
                type: "SET_ITEM",
                collection: "transactions",
                payload: transactionData,
            });
        }
    }, [transactionData, transactionLoading, transactionError, dispatch]);



    const { data: productData, loading: productLoading, error: productError } = useFetchDataById(`${api}/api/product/${transactionData?.productId}`);
    useEffect(() => {
        if (productData && !productLoading && !productError) {
            dispatch({
                type: "SET_ITEM",
                collection: "products",
                payload: productData,
            });
        }
    }, [productData, productLoading, productError, dispatch]);


    const status = (status) => {
        if (status === "Didn't Arrive") {
            return "bg-redtheme"
        } else if (status === "Available") {
            return "bg-emerald-700"
        } else {
            return "bg-darktheme"
        }
    }

    const statusTitle = (status) => {
        if (status === "Didn't Arrive") {
            return languageText.DidntArrive
        } else if (status === "Available") {
            return languageText.Available
        } else {
            return languageText.Delivered
        }
    }

    return (
        <div>
            {transactionLoading || productLoading ? (
                <div className='h-screen flex items-center justify-center'>
                    <Loader text={languageText.Loading} />
                </div>
            ) : (
                <div className='flex flex-col items-center justify-center 2xl:px-40 gap-6 '>
                    <h1
                        className={`formTitle !text-5xl justify-center lg:!text-8xl !mb-0 flex flex-wrap m-auto !mt-20 gap-4`}>
                        {(() => {
                            const words = languageText.ProductReference.split(" ");
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


                    <div className='flex flex-col lg:flex-row rounded-xl lg:justify-evenly lg:w-[80%] mb-10 lg:p-5 py-4'>
                        <div className='flex lg:flex-row flex-col gap-5 lg:gap-10  '>
                            <div className='md:w-100 w-80 lg:m-0 m-auto bg-darktheme2/40 ring-4 ring-darktheme2/40 border-4 border-whitetheme/90 p-3 relative rounded-3xl'>
                                <img src={productData?.pFrontImage} alt="" />
                                <div className="absolute bottom-0 left-0 right-0 flex m-auto w-full md:h-100 h-80 bg-gradient-to-t from-darktheme2 via-darktheme2/95 to-transparent z-10 rounded-b-3xl "></div>

                                <div className={` absolute bottom-10  text-4xl lg:text-5xl text-whitetheme z-20 w-[85%] ${language === "en" ? "left-10" : "right-10"}`}>
                                    <h1>{language === "en" ? productData?.pTitle : productData?.pArabicTitle}</h1>
                                </div>

                            </div>

                            {/* Right Side*/}
                            <div className='flex flex-col justify-between gap-5'>
                                <div className=' bg-gradient-to-b from-darktheme2/40 to-darktheme/80 ring-4 ring-darktheme2/40 border-4 border-whitetheme/90 p-3 relative rounded-2xl w-80 md:w-100 flex flex-col  px-5 m-auto lg:m-0 h-full'>

                                    <p className='text-whitetheme text-center text-2xl'>{languageText.PersonalDetails}</p>
                                    <div className={`flex bg-darktheme/60 rounded-lg p-3 w-fit text-3xl text-whitetheme ${language === "en" ? "ml-auto" : "mr-auto"}`}>
                                        <Icon icon="mdi:card-account-details" />
                                    </div>
                                    <p className='text-3xl text-whitetheme font-tanker'>{transactionData.buyerName}</p>
                                    <p className='text-xl text-whitetheme/60 font-tanker'>{transactionData.buyerEmail}</p>
                                    <p className='text-whitetheme/60 font-tanker'>{transactionData.buyerPhone}</p>
                                    <p className='text-whitetheme/60 font-tanker'>{transactionData.buyerAddress}</p>

                                    <div className={`bg-whitetheme rounded w-fit px-6 text-2xl  font-tanker text-redtheme ${language === "en" ? "ml-auto" : "mr-auto"}`}>{id}</div>
                                    <div>

                                    </div>
                                </div>


                                <div className=' bg-gradient-to-b from-redtheme/40 to-redtheme2/80  ring-4 ring-redtheme/40 border-4 border-whitetheme/90 p-3 relative rounded-2xl w-80 md:w-100 flex flex-col  px-5 m-auto lg:m-0 h-full'>

                                    <p className='text-whitetheme text-center text-2xl'>{languageText.ProductDetails}</p>
                                    <div className={`flex bg-redtheme/60 rounded-lg p-3 w-fit text-3xl text-whitetheme ${language === "en" ? "ml-auto" : "mr-auto"}`}>
                                        <Icon icon="ix:product" />
                                    </div>
                                    <p className='text-2xl text-gray-300 '>{language === "en" ? productData?.pDescription : productData?.pArabicDescription}</p>
                                    <div className="w-full mb-4">
                                        {/* Header */}
                                        <div className="flex justify-between w-full text-center text-2xl text-whitetheme">
                                            <p className="flex-1">{languageText.Quantity}</p>
                                            <p className="flex-1">{languageText.Size}</p>
                                            <p className="flex-1">{languageText.Price}</p>
                                        </div>

                                        {/* Values */}
                                        <div className="flex justify-between w-full text-center text-lg text-darktheme2 dark:text-whitetheme2">
                                            <p className="flex-1">{transactionData.productQuantity}</p>
                                            <p className="flex-1 font-tanker">{transactionData.productSize}</p>
                                            <p className="flex-1">{transactionData.productQuantity * productData?.pPrice} {languageText.RM}</p>
                                        </div>
                                    </div>

                                    <div className={`${status(transactionData.transactionStatus)}  text-whitetheme rounded w-fit px-6 text-2xl ${language === "en" ? "ml-auto" : "mr-auto"}`}>{statusTitle(transactionData.transactionStatus)}</div>
                                    <div>

                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Reference