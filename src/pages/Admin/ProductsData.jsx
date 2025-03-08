import React, { useState, useEffect } from "react";
import useFetchDataById from "../../hooks/useFetchDataById";
import { useFormsContext } from '../../hooks/useFormContext';
import Loader from "../../components/loaders/Loader";
import { Icon } from "@iconify/react";
import { AnimatePresence, motion } from "framer-motion";
import { Link, useNavigate, useParams } from "react-router-dom";
import AdminNavBar from "../../components/AdminNavBar";
import SearchInput from "../../components/formInputs/SearchInput";
import * as XLSX from "xlsx";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import SuccessMessage from "../../components/formInputs/SuccessMessage";
import useFetchData from "../../hooks/useFetchData";
import useSubmitForm from "../../hooks/useSubmitForm";
import SelectField from "../../components/formInputs/SelectField";
import ScrollToTop from "../../components/ScrollToTop";
import { useAuthContext } from '../../hooks/useAuthContext';



const ProductsData = ({ languageText, language, api }) => {

    const { products, transactions, dispatch } = useFormsContext();
    const [searchQuery, setSearchQuery] = useState("");
    const [copySuccess, setCopySuccess] = useState('');
    const [combinedData, setCombinedData] = useState([]);
    const [loading, setLoading] = useState(false)
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });


    const { data: productsData, loading: productsLoading, error: productsError } = useFetchData(`${api}/api/product`);
    useEffect(() => {
        if (productsData && !productsLoading && !productsError) {
            dispatch({
                type: "SET_ITEM",
                collection: "products",
                payload: productsData,
            });
        }
    }, [productsData, productsLoading, productsError, dispatch]);


    const { data: transactionData, loading: transactionLoading, error: transactionError } = useFetchData(`${api}/api/transaction`);
    useEffect(() => {
        if (transactionData && !transactionLoading && !transactionError) {
            dispatch({
                type: "SET_ITEM",
                collection: "transactions",
                payload: transactionData,
            });
        }
    }, [transactionData, transactionLoading, transactionError, dispatch]);


    useEffect(() => {
        if (products && transactions) {
            const mergedData = transactions.map(transaction => {
                const product = products.find(p => p._id === transaction.productId);
                return {
                    ...transaction,
                    product: product || {} // Include product details
                };
            });
            setCombinedData(mergedData);
        }
    }, [products, transactions]);

    const filteredData = combinedData.filter(item => {
        const searchRegex = new RegExp(searchQuery, 'i');
        return (
            (item.product.pTitle && searchRegex.test(item.product.pTitle)) ||
            (item.product.pArabicTitle && searchRegex.test(item.product.pArabicTitle)) ||
            (item.buyerName && searchRegex.test(item.buyerName)) ||
            (item.buyerEmail && searchRegex.test(item.buyerEmail)) ||
            (item.buyerMatric && searchRegex.test(item.buyerMatric))
        );
    });

    const { handleSubmit, error: submitError, setError, submitLoading } =
        useSubmitForm();

    const onSubmit = async (e, transaction, status) => {
        e.preventDefault();

        const updateFormStatus = {
            transactionStatus: status
        };

        try {
            // Update the transaction status
            await handleSubmit(
                `${api}/api/transaction/${transaction._id}`,
                "PATCH",
                updateFormStatus,
                "transactions",
                languageText.StatusUpdateMessage
            );

            // Additionally update the local state for immediate UI update
            dispatch({
                type: "UPDATE_ITEM",
                collection: "transactions",
                payload: {
                    id: transaction._id,
                    changes: updateFormStatus
                }
            });
        } catch (error) {
            console.error("Failed to update form status:", error);
        }
    };







    const handleDownloadExcel = () => {
        const tableData = combinedData.map(item => ({
            Name: item.buyerName,
            Matric: item.buyerMatric,
            Email: item.buyerEmail,
            Phone: item.buyerPhone,
            Product: item.product.pTitle,
            Quantity: item.productQuantity,
            Size: item.productSize,
            Price: item.productQuantity * (item.product.pPrice || 0),
            Address: item.buyerAddress,
            Proof: item.proof,
        }));

        const worksheet = XLSX.utils.json_to_sheet(tableData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Products_Transactions");
        XLSX.writeFile(workbook, "Products_Transactions.xlsx");
    };

    const handleDownloadAllProofPictures = async () => {
        const zip = new JSZip();
        const folder = zip.folder("Proof_Images");
        const imagePromises = combinedData.map(async (item) => {
            const response = await fetch(item.proof);
            if (response.ok) {
                const blob = await response.blob();
                folder.file(`${item.buyerName + "_" + item.referenceNumber}.jpg`, blob);
            }
        });

        try {
            await Promise.all(imagePromises);
            const content = await zip.generateAsync({ type: "blob" });
            saveAs(content, "Proof_Images.zip");
        } catch (error) {
            console.error("Error downloading proof images:", error);
        }
    };





    const handleSendEmail = async ({ e, referenceNumber }) => {
        e.preventDefault();

        setLoading(true);

        const response = await fetch(`${api}/api/transaction/sendEmail/${referenceNumber}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        })

        const json = await response.json()


        if (!response.ok) {
            setError(json.error)
        }

        if (response.ok) {
            setError(null)

            dispatch({
                type: 'CREATE_FORM',
                collection: "transactions",
                payload: json
            })
            {
                setCopySuccess(languageText.EmailSuccessMessage)
            }
            setLoading(false);
            // navigate("/")

        }
    };


    const handleSendAllEmail = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${api}/api/transaction/sendAllEmail`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to send emails');
            }

            const data = await response.json();
            dispatch({ type: 'UPDATE_ITEM', collection: 'transactions', payload: data });
            setCopySuccess(languageText.EmailSuccessMessage);
        } catch (error) {
            console.error('Error sending emails:', error);
            setError(languageText.EmailFailedMessage || 'An error occurred');
        } finally {
            setLoading(false);
        }
    };



    const handleUpdateAllStatus = async (status) => {
        try {
            const response = await fetch(`${api}/api/transaction/t/updateAll`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status }),
            });

            if (!response.ok) {
                throw new Error(`Error updating all transactions. Status: ${response.status}`);
            }

            // Update all transactions in context
            const updatedTransactions = transactions.map(transaction => ({
                ...transaction,
                transactionStatus: status
            }));

            dispatch({
                type: 'SET_ITEM',
                collection: 'transactions',
                payload: updatedTransactions
            });

            // Update combinedData state
            setCombinedData(prevData =>
                prevData.map(transaction => ({
                    ...transaction,
                    transactionStatus: status
                }))
            );

            setCopySuccess(languageText.StatusUpdateSuccess);


        } catch (error) {
            console.error('An error occurred while updating all transactions:', error);
        }
    };


    const handleSort = (key) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };


    const sortedData = [...filteredData].sort((a, b) => {
        if (!sortConfig.key) return 0;
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];

        // If sorting a nested object (like product.pTitle)
        if (sortConfig.key.includes('.')) {
            const keys = sortConfig.key.split('.');
            aValue = keys.reduce((obj, key) => obj?.[key], a);
            bValue = keys.reduce((obj, key) => obj?.[key], b);
        }

        if (aValue < bValue) return sortConfig.direction === 'ascending' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'ascending' ? 1 : -1;
        return 0;
    });

    return (
        <div className="lg:flex ">
            <AdminNavBar languageText={languageText} language={language} api={api} />
            {productsLoading || transactionLoading ? (
                <div className="h-screen flex w-full justify-center">
                    <Loader text={languageText.Loading} />
                </div>
            ) :
                loading ? (
                    <div className="h-screen flex w-full justify-center">
                        <Loader text={languageText.Sending} />
                    </div>
                ) : (
                    <div className=" flex flex-col justify-center items-center p-8 w-full ">

                        <div className={`adminDashboardCard group mb-3 lg:mt-30 ${language === "en" ? "md:ml-auto" : "md:mr-auto"}`}>
                            <div className="flex flex-col">
                                <p className="lg:text-2xl text-gray-300">{languageText.TotalPurchases}</p>
                                <h1 className="lg:text-8xl text-whitetheme group-hover:text-redtheme duration-500">{productsData?.length}</h1>
                            </div>
                            <div className="lg:text-9xl text-whitetheme group-hover:text-redtheme duration-500">
                                <Icon icon="mingcute:tag-2-fill" />
                            </div>
                        </div>

                        <h1 className="text-5xl md:text-8xl font-bold text-redtheme dark:text-whitetheme text-center my-10 ">{languageText.Purchases}</h1>


                        <div className="flex lg:flex-row flex-col gap-2 items-center">
                            <SearchInput languageText={languageText} language={language} onSearch={(query) => setSearchQuery(query)} />


                            <div className="flex flex-wrap gap-4 w-full">
                                <motion.button
                                    initial={{ opacity: 0, scale: 0 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0 }}
                                    transition={{ duration: 0.3, type: 'spring', stiffness: 200 }}
                                    whileTap={{ scale: 0.6 }}
                                    whileHover={{ scale: 1.2 }}
                                    type="button"
                                    className="AddFormButton group bg-green-800"
                                    onClick={handleDownloadExcel}
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
                                    className="AddFormButton group bg-darktheme"
                                    onClick={handleDownloadAllProofPictures}
                                >

                                    <Icon icon="fluent:reciept-20-filled" className="text-xl" />
                                    <div className="inputIconText bg-darktheme">
                                        {languageText.DownloadProof}

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
                                    onClick={async () => {
                                        const userConfirmed = window.confirm(languageText.EmailConfirm);
                                        if (userConfirmed) {
                                            await handleSendAllEmail();
                                        }
                                    }}
                                >

                                    <Icon icon="mdi:cube-send" className="text-xl" />
                                    <div className="inputIconText bg-redtheme">
                                        {languageText.SendEmailltoAll}

                                    </div>
                                </motion.button>
                            </div>

                            <SelectField
                                options={[
                                    { value: "Didn't Arrive", label: languageText.DidntArrive, icon: "iconamoon:close-circle-2-bold" },
                                    { value: "Available", label: languageText.Available, icon: "solar:delivery-bold" },
                                    { value: "Delivered", label: languageText.Delivered, icon: "material-symbols-light:delivery-truck-speed-rounded" },
                                ]}
                                placeholder={languageText.ApplyStatus}
                                language={language}
                                languageText={languageText}
                                icon="f7:status"
                                iconValue="f7:status"
                                setValue={async (value) => {
                                    if (window.confirm(languageText.TransactionsConfirm)) {
                                        await handleUpdateAllStatus(value);
                                    }
                                }}
                            />

                        </div>

                        <p className="auto 2xl:hidden ScrollHorizontally mt-4" >{languageText.ScrollHorizontally}</p>


                        <div className="w-full overflow-x-auto h-full p-5 m-3 flex flex-col  2xl:items-center gap-4 mt-4">
                            <div className="tableHeader !w-full 2xl:min-w-full min-w-[800px]">
                                <div className="tableDiv cursor-pointer " onClick={() => handleSort("referenceNumber")}>
                                    {languageText.ReferenceNo} {sortConfig.key === "referenceNumber" && (sortConfig.direction === "ascending" ? <Icon icon="solar:alt-arrow-up-bold-duotone" /> : <Icon icon="solar:alt-arrow-down-bold-duotone" />)}
                                </div>
                                <div className="tableDiv cursor-pointer" onClick={() => handleSort("buyerName")}>
                                    {languageText.FullName} {sortConfig.key === "buyerName" && (sortConfig.direction === "ascending" ? <Icon icon="solar:alt-arrow-up-bold-duotone" /> : <Icon icon="solar:alt-arrow-down-bold-duotone" />)}
                                </div>
                                <div className="tableDiv cursor-pointer" onClick={() => handleSort("buyerMatric")}>
                                    {languageText.MatricNo} {sortConfig.key === "buyerMatric" && (sortConfig.direction === "ascending" ? <Icon icon="solar:alt-arrow-up-bold-duotone" /> : <Icon icon="solar:alt-arrow-down-bold-duotone" />)}
                                </div>
                                <div className="tableDiv cursor-pointer" onClick={() => handleSort("buyerEmail")}>
                                    {languageText.Email} {sortConfig.key === "buyerEmail" && (sortConfig.direction === "ascending" ? <Icon icon="solar:alt-arrow-up-bold-duotone" /> : <Icon icon="solar:alt-arrow-down-bold-duotone" />)}
                                </div>
                                <div className="tableDiv cursor-pointer" onClick={() => handleSort("buyerPhone")}>
                                    {languageText.PhoneNo} {sortConfig.key === "buyerPhone" && (sortConfig.direction === "ascending" ? <Icon icon="solar:alt-arrow-up-bold-duotone" /> : <Icon icon="solar:alt-arrow-down-bold-duotone" />)}
                                </div>
                                <div className="tableDiv cursor-pointer" onClick={() => handleSort("product.pTitle")}>
                                    {languageText.Product} {sortConfig.key === "product.pTitle" && (sortConfig.direction === "ascending" ? <Icon icon="solar:alt-arrow-up-bold-duotone" /> : <Icon icon="solar:alt-arrow-down-bold-duotone" />)}
                                </div>
                                <div className="tableDiv cursor-pointer" onClick={() => handleSort("productQuantity")}>
                                    {languageText.Quantity} {sortConfig.key === "productQuantity" && (sortConfig.direction === "ascending" ? <Icon icon="solar:alt-arrow-up-bold-duotone" /> : <Icon icon="solar:alt-arrow-down-bold-duotone" />)}
                                </div>
                                <div className="tableDiv cursor-pointer" onClick={() => handleSort("productSize")}>
                                    {languageText.Size} {sortConfig.key === "productSize" && (sortConfig.direction === "ascending" ? <Icon icon="solar:alt-arrow-up-bold-duotone" /> : <Icon icon="solar:alt-arrow-down-bold-duotone" />)}
                                </div>
                                <div className="tableDiv cursor-pointer" onClick={() => handleSort("buyerAddress")}>
                                    {languageText.Address} {sortConfig.key === "buyerAddress" && (sortConfig.direction === "ascending" ? <Icon icon="solar:alt-arrow-up-bold-duotone" /> : <Icon icon="solar:alt-arrow-down-bold-duotone" />)}
                                </div>
                                {/* <div className="tableDiv">{languageText.Product}</div> */}
                                {/* <div className="tableDiv">{languageText.Quantity}</div>
                                <div className="tableDiv">{languageText.Size}</div>
                                <div className="tableDiv">{languageText.Address}</div> */}
                                <div className="tableDiv">{languageText.Proof}</div>
                                <div className="tableDiv">{languageText.Status}</div>
                                <div className="tableDiv">{languageText.Action}</div>
                            </div>


                            <div className="tableBody">
                                {sortedData?.length === 0 && (
                                    <div className="tableRow ">
                                        <div className="w-full flex justify-center items-center gap-2">
                                            <Icon icon="material-symbols:nearby-error-rounded" />
                                            {languageText.NoProducts}</div>
                                    </div>
                                )}


                                {sortedData?.map((item) => (
                                    <div className="tableRow" key={item._id}>
                                        <div className="tableDiv">{item.referenceNumber}</div>
                                        <div className="tableDiv">{item.buyerName}</div>
                                        <div className="tableDiv">{item.buyerMatric}</div>
                                        <div className="tableDiv !text-[9px]">{item.buyerEmail}</div>
                                        <div className="tableDiv">{item.buyerPhone}</div>
                                        <div className="tableDiv !text-sm">{item.product.pTitle}</div>
                                        <div className="tableDiv">{item.productQuantity}</div>
                                        <div className="tableDiv">{item.productSize}</div>
                                        <div className="tableDiv">{item.buyerAddress}</div>
                                        <div className="tableDiv">
                                            <img src={item.proof} alt="" className=" cursor-pointer w-20 lg:w-20 m-auto rounded-lg"
                                                onClick={() => { window.open(item.proof, "_blank") }}
                                            />
                                        </div>
                                        <div className="tableDiv">
                                            <div
                                                className={`TransactionStatus ${item.transactionStatus === "Didn't Arrive"
                                                    ? "bg-redtheme w-fit m-auto px-2 rounded"
                                                    : item.transactionStatus === "Available"
                                                        ? "bg-yellow-600 w-fit m-auto px-2 rounded"
                                                        : "bg-emerald-700 w-fit m-auto px-2 rounded"
                                                    }`}
                                            >{item.transactionStatus}</div>
                                        </div>

                                        <div className="tableDiv flex flex-wrap justify-center items-center gap-2">
                                            <button
                                                onClick={(e) => {
                                                    onSubmit(e, item, "Didn't Arrive")
                                                }}
                                                className="tableButton bg-redtheme text-whitetheme group">
                                                <Icon icon="iconamoon:close-circle-2-bold" />
                                                <div className="inputIconText !bg-redtheme !ring-redtheme">{languageText.StatusDidntArrive}</div>
                                            </button>
                                            <button
                                                onClick={(e) => {
                                                    onSubmit(e, item, "Available")
                                                }}
                                                className="tableButton bg-yellow-600 text-whitetheme group">
                                                <Icon icon="solar:delivery-bold" />
                                                <div className="inputIconText !bg-yellow-600 !ring-yellow-600">{languageText.StatusAvailable}</div>
                                            </button>

                                            <button
                                                onClick={(e) => {
                                                    onSubmit(e, item, "Delivered")
                                                }}
                                                className="tableButton bg-emerald-700 text-whitetheme group">
                                                <Icon icon="material-symbols-light:delivery-truck-speed-rounded" />
                                                <div className="inputIconText !bg-emerald-700 !ring-emerald-700">{languageText.StatusDelievered}</div>
                                            </button>

                                            <button
                                                onClick={(e) => {
                                                    handleSendEmail({ e: e, referenceNumber: item.referenceNumber })
                                                }}
                                                className="tableButton bg-darktheme2 text-whitetheme group">
                                                <Icon icon="mdi:email-fast" />
                                                <div className="inputIconText !bg-darktheme2 !ring-darktheme2">{languageText.SendAvailableEmail}</div>
                                            </button>
                                        </div>
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

export default ProductsData