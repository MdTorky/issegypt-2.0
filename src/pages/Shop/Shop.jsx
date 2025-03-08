import React, { useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion';
import ShopCard from '../../components/cards/ShopCard';
import Loader from '../../components/loaders/Loader';
import { useFormsContext } from '../../hooks/useFormContext';
import useFetchData from "../../hooks/useFetchData";

const Shop = ({ languageText, language, api }) => {

    const { dispatch } = useFormsContext();

    const { data: productData, loading, error } = useFetchData(`${api}/api/product`);
    useEffect(() => {
        if (productData && !loading && !error) {
            dispatch({
                type: "SET_ITEM",
                collection: "products",
                payload: productData,
            });
        }
    }, [productData, error, dispatch]);


    return (

        <div>
            <div className="relative w-full h-[60vh] md:h-[80vh] flex  items-center justify-center ">
                <div className='flex  h-300 p-20 bg-gray-300 w-full justify-start items-center bg-[url(https://images.unsplash.com/photo-1557821552-17105176677c?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)] bg-cover bg-center'>
                    <div className="absolute flex bottom-0 top-0 m-auto left-0 w-full h-300 bg-gradient-to-t from-darktheme/80 to-transparent"></div>
                    <div className='z-10'>
                        <motion.h1
                            initial={{ x: -200, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: -200, opacity: 0 }}
                            transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
                            className='text-5xl text-center  lg:text-9xl lg:text-start text-whitetheme '>{languageText.ISSEgyptShop}</motion.h1>
                        <motion.p

                            initial={{ x: -200, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: -200, opacity: 0 }}
                            transition={{ duration: 0.8, delay: 0.2, type: "spring", stiffness: 100 }}
                            className='text-xl text-center  lg:text-4xl lg:text-start  text-gray-300'>{languageText.ShopDesc}
                        </motion.p>
                    </div>
                </div>
            </div>

            <div className='flex flex-col mt-100 md:mt-60 xl:mt-80 2xl:mt-70 mb-10 w-full items-center gap-5'>
                <h1 className='text-6xl text-start text-redtheme '>{languageText.ISSEgyptShop}</h1>
                <div className='flex lg:w-full flex-row flex-wrap justify-center gap-10'>
                    {loading ? (
                        <Loader text={languageText.Loading} />
                    ) : (
                        productData.map((product) => (

                            <ShopCard product={product} language={language} languageText={languageText} />
                        )))}

                </div>
            </div>

            {/* <div className=' h-200 w-100 flex justify-center rounded-xl relative'>
                        <div className='absolute size-80 bg-blue-300 rounded-full flex m-auto left-0 right-0 top-0 bottom-0' />
                        <img src={shirt} alt="" className='z-10' />
                    </div> */}


        </div>
    )
}


export default Shop
