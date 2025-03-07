import React, { useState, useEffect } from "react";

import { AnimatePresence, motion } from 'framer-motion';
import Loader from "../../components/loaders/Loader";
import useFetchDataById from "../../hooks/useFetchDataById";
import { useFormsContext } from '../../hooks/useFormContext'
import { Link, useParams } from 'react-router-dom';
import { Icon } from "@iconify/react";

const Product = ({ languageText, language, api, }) => {

    const { id } = useParams()

    const [sizeError, setSizeError] = useState("");
    const [size, setSize] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const sizes = ["XS", "S", "M", "L", "XL", "XXL"];


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
        setSize(null);
        setQuantity(1);
        setSizeError("");
        localStorage.removeItem('selectedSize');
        localStorage.setItem('selectedPrice', 30);
        localStorage.setItem('selectedQuantity', 1);
    }, [productData, loading, error, dispatch]);



    const handlePurchase = (e) => {
        e.preventDefault();
        if (!size) {
            setSizeError(languageText.PleaseSelectSize)
        }
        else {
            window.location.href = `/purchase/${productData._id}`;
        }
    }

    const handleSizeChange = (e) => {
        const selectedSize = e.target.value;
        setSize(selectedSize);
        localStorage.setItem('selectedSize', selectedSize);
    };

    const decrementQuantity = () => {
        if (quantity > 1) {
            const updatedQuantity = quantity - 1;
            setQuantity(updatedQuantity);
            productData.pPrice = (productData.pPrice * updatedQuantity / quantity);
            localStorage.setItem('selectedQuantity', updatedQuantity);
        }
    };

    const incrementQuantity = () => {
        if (quantity < 5) {
            const updatedQuantity = quantity + 1;
            setQuantity(updatedQuantity);
            productData.pPrice = (productData.pPrice * updatedQuantity / quantity);
            localStorage.setItem('selectedQuantity', updatedQuantity);
        }
    };

    const handleShare = async (e) => {
        e.stopPropagation();
        e.preventDefault();
        if (navigator.share) {
            try {
                await navigator.share({
                    title: "Check this ISS EGYPT Product Out!",
                    text: "Have a look at this amazing product!",
                    url: window.location.href, // Current page URL
                });
                console.log("Content shared successfully!");
            } catch (error) {
                console.error("Error sharing content:", error);
            }
        } else {
            alert("Web Share API not supported in your browser.");
        }
    };


    return (
        <div>
            <div className="relative w-full h-[130vh] md:h-[80vh] flex items-center justify-center bg-cover bg-center "

                style={{ backgroundImage: "url('')" }}>

                <motion.img
                    src="https://img.freepik.com/premium-photo/white-closet-with-lot-clothes-baskets_248459-21163.jpg"
                    className="absolute w-full h-300 m-auto left-0 right-0 object-cover brightness-50"
                    initial={{ scale: 1.1, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 1.1, opacity: 0 }}
                    transition={{ duration: 0.6 }}
                    layout
                />

                {/* White Overlay Shape */}
                {/* <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-whitetheme/80 to-transparent z-10"></div> */}

                {/* Content */}

                {loading ? (
                    <Loader text={languageText.Loading} />
                ) : (
                    <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.4, type: "spring", stiffness: 100 }}
                        className="relative mt-5 md:mt-30 lg:mt-40 z-20 justify-center md:px-10 lg:px-4 lg:py-10 rounded-xl flex flex-col lg:flex-row bg-whitetheme/10">

                        {/* Title */}
                        <div className=" flex flex-col pt-4 lg:pt-20 w-100 text-center lg:text-start">
                            <motion.p
                                initial={{ x: language === "en" ? -100 : 100, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ duration: 0.4, type: "spring", stiffness: 100, delay: 0.3 }}
                                className="text-darktheme"
                            >{language === "en" ? productData.pDescription : productData.pArabicDescription}</motion.p>
                            <motion.h1
                                initial={{ x: language === "en" ? -200 : 200, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ duration: 0.4, type: "spring", stiffness: 100, delay: 0.6 }}
                                className="text-6xl text-whitetheme ">{language === "en" ? productData.pTitle : productData.pArabicTitle}</motion.h1>
                        </div>

                        {/* Center Image */}
                        <div className="mt-4 lg:mt-0 flex lg:w-fit w-full">
                            <div className='w-full bg-redtheme2/0 rounded-full flex relative items-center m-auto '>
                                <img src={productData.pFrontImage} alt="" className='relative flex w-70  lg:w-100 m-auto bottom-0 items-center left-0 right-0 hover:scale-130 hover:-translate-y-20 transition-all duration-500 ease-in-out z-20' />
                            </div>
                        </div>



                        {/* Product Info */}
                        <motion.div
                            initial={{ x: language === "en" ? 100 : -100, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ duration: 0.4, type: "spring", stiffness: 100, delay: 0.3 }}
                            className=" flex flex-col pt-3 pb-6 lg:pt-20 lg:pb-0  px-4 lg:px-2 gap-2">
                            <div className="w-full justify-end flex">
                                <motion.p
                                    key={productData.pPrice}
                                    initial={{ scale: 0, y: 30 }}
                                    animate={{ scale: 1, y: 0 }}
                                    exit={{ scale: 0 }}
                                    transition={{ type: "spring", stiffness: 200 }}
                                    className="text-whitetheme w-fit rounded-xl text-4xl">{productData.pPrice} {languageText.RM}</motion.p>
                            </div>
                            <div className="flex justify-between items-center">
                                <p className="text-whitetheme text-lg">{languageText.Size} -
                                    <motion.span
                                        key={size}
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        exit={{ scale: 0 }}
                                        className={`text-darktheme font-tanker`}> {size}</motion.span></p>
                                <button className="mb-2 bg-whitetheme/10 w-fit px-2 rounded text-whitetheme2 text-lg cursor-pointer hover:scale-110 hover:translate-x-2 transition-all duration-500 ease-in-out">{languageText.SizeGuide}</button>
                            </div>
                            <div className="flex flex-wrap items-center gap-3">
                                {sizes.map((s) => (
                                    <label key={s} className="relative">
                                        <input
                                            type="radio"
                                            name="size"
                                            value={s}
                                            className="hidden peer"
                                            checked={size === s}
                                            onChange={handleSizeChange}
                                        />
                                        <div className="flex flex-col items-center justify-center w-13 h-10 rounded-lg border-3 border-darktheme2/40 bg-whitetheme/40  cursor-pointer  ring-3 ring-whitetheme/30 peer-checked:border-redtheme peer-checked:text-redtheme peer-checked:shadow-[0px_0px_47px_0px_rgba(163,22,33,1)] hover:scale-110 hover:-translate-y-3 transition-all duration-500 ease-in-out hover:bg-whitetheme/80 ">
                                            <span className="text-base font-medium font-tanker">{s}</span>
                                        </div>
                                    </label>
                                ))}
                            </div>
                            {sizeError && !size && <p className="mt-2 -mb-3 bg-redtheme/50 w-fit m-auto px-5 text-whitetheme text-center rounded flex items-center">{sizeError}</p>}


                            {/* Quantity */}
                            <div className='flex w-fit gap-20 justify-evenly items-center mt-4 bg-whitetheme/20 p-2 px-10 mx-auto rounded-xl border-3 border-darktheme2/40  ring-3 ring-whitetheme/30 '>
                                <div className="flex flex-col justify-center">
                                    <h3 className="text-gray-200/80 text-base">{languageText.SelectQuantity}</h3>
                                    <h3 className="text-whitetheme2 text-xl ">{quantity}</h3>
                                </div>

                                <div className="flex gap-3 items-center">
                                    <button onClick={decrementQuantity} className="rounded-full text-lg bg-darktheme2/30 text-whitetheme p-1 hover:scale-130 transition-all duration-500 ease-in-out cursor-pointer">
                                        <Icon icon="typcn:minus" /></button>
                                    <button onClick={incrementQuantity} className="rounded-full text-lg bg-darktheme2/30 text-whitetheme p-1 hover:scale-130 transition-all duration-500 ease-in-out cursor-pointer"><Icon icon="mingcute:plus-fill" /></button>
                                </div>
                            </div>


                            {/* Purchase Buttons */}
                            <div className="mt-4 flex justify-center gap-3">
                                <Link
                                    onClick={handlePurchase}
                                    className='bg-darktheme2/30 border-3 border-whitetheme/30  ring-3 ring-darktheme2/30 flex items-center text-3xl gap-2 p-2 px-5 rounded-xl text-whitetheme cursor-pointer hover:scale-105 transition-all duration-500 ease-in-out hover:bg-darktheme2/80'>
                                    <Icon icon="heroicons:shopping-bag" />
                                    <p >{languageText.Purchase}</p>
                                </Link>
                                <button className="bg-redtheme/40 border-3 border-whitetheme/30  ring-3 ring-darktheme2/30 flex items-center text-2xl gap-2 p-2 px-3 rounded-xl text-whitetheme cursor-pointer hover:scale-110 transition-all duration-500 ease-in-out hover:bg-redtheme/80 group relative" onClick={(e) => { e.stopPropagation(); e.preventDefault(); window.open(productData.pModel, "_blank") }}>
                                    <Icon icon="material-symbols:3d-rotation-rounded" />
                                    <div className="inputIconText bg-redtheme/40  !text-whitetheme  ">
                                        {languageText.DModel}

                                    </div>
                                </button>
                                <button className="bg-darktheme/50 border-3 border-whitetheme/30  ring-3 ring-darktheme2/30 flex items-center text-2xl gap-2 p-2 px-3 rounded-xl text-whitetheme cursor-pointer hover:scale-110 transition-all duration-500 ease-in-out hover:bg-darktheme2/80 group relative" onClick={handleShare}>
                                    <Icon icon="fluent:share-16-filled" />
                                    <div className="inputIconText bg-darktheme/50  !text-whitetheme  ">
                                        {languageText.Share}

                                    </div>
                                </button>
                            </div>
                        </motion.div>
                        {/* <AnimatePresence>
                            <motion.p
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                exit={{ y: 20, opacity: 0 }}
                                transition={{ duration: 0.8, type: "spring", stiffness: 200 }}

                                className="text-sm md:text-5xl text-redtheme">{productData.pTitle}</motion.p>
                            <motion.h1
                                initial={{ y: -20, scale: 0, opacity: 0 }}
                                animate={{ y: 0, scale: 1, opacity: 1 }}
                                exit={{ y: -20, opacity: 0 }}
                                transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
                                className="text-2xl md:text-8xl font-bold w-[85%] mx-auto text-whitetheme">
                                {languageText.StudentGalleryDesc}
                            </motion.h1>
                        </AnimatePresence> */}
                    </motion.div>
                )}
            </div>
        </div>
    )
}

export default Product