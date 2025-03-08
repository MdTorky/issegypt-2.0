import React, { useState, useEffect } from "react";
import AdminNavBar from "../../components/AdminNavBar";
import useFetchData from "../../hooks/useFetchData";
import { useFormsContext } from '../../hooks/useFormContext';
import { useAuthContext } from '../../hooks/useAuthContext';
import Loader from "../../components/loaders/Loader";
import { Icon } from "@iconify/react";
import useSubmitForm from "../../hooks/useSubmitForm";
import SearchInput from '../../components/formInputs/SearchInput';
import useDelete from '../../hooks/useDelete';
import { Link } from "react-router-dom";
import ScrollToTop from "../../components/ScrollToTop";
import { useNavigate } from "react-router-dom";

const MyForms = ({ languageText, language, api }) => {

    const { user } = useAuthContext();
    const navigate = useNavigate()

    useEffect(() => {
        if (!user) {
            navigate('/auth/login', { replace: true }); // Redirect to login
        }
    }, [user, navigate]);

    const { forms, dispatch } = useFormsContext();
    const [committeeType, setCommitteeType] = useState(user?.committee);
    const [searchQuery, setSearchQuery] = useState("");


    useEffect(() => {
        if (user?.committee) {
            setCommitteeType(user.committee);
        }
    }, [user]);


    const { data: formsData, loading: formsLoading, error: formsError } = useFetchData(`${api}/api/forms`);

    useEffect(() => {
        if (formsData && !formsLoading && !formsError) {
            dispatch({
                type: "SET_ITEM",
                collection: "forms",
                payload: formsData,
            });
        }
    }, [formsData, formsLoading, formsError, dispatch]);


    const { data: issData, loading: issLoading, error: issError } = useFetchData(`${api}/api/issForms`);

    useEffect(() => {
        if (issData && !issLoading && !issError) {
            dispatch({
                type: "SET_ITEM",
                collection: "ISSForm",
                payload: issData,
            });
        }
    }, [issData, issLoading, issError, dispatch]);

    // Use the forms from context instead of formsData for rendering
    // const formsToUse = forms || [];

    const currentCommitteeFormsFilter = forms?.filter((form) => form.type === committeeType);

    // Check Which forms to Display
    const AllFormsDisplay = committeeType === "All" ? forms : currentCommitteeFormsFilter;

    const filteredForms = AllFormsDisplay?.filter((form) => {
        const searchRegex = new RegExp(searchQuery, 'i');
        return (
            (searchRegex.test(form.eventName) || searchRegex.test(form.arabicEventName) || searchRegex.test(form.type))
        )
    });


    const { handleSubmit, error: submitError, setError, submitLoading } =
        useSubmitForm();

    const onSubmit = async (e, form) => {
        e.preventDefault();

        const updateFormStatus = {
            status: !form.status
        };

        try {
            await handleSubmit(
                `${api}/api/forms/${form._id}`,
                "PATCH",
                updateFormStatus,
                "forms",
                languageText.StatusUpdateMessage
            );
        } catch (error) {
            console.error("Failed to update form status:", error);
        }
    };


    const { deleteItem, error, setError: deleteError, deleteLoading } = useDelete();


    const handleDelete = async (e, id) => {
        e.preventDefault();
        const isConfirmed = window.confirm(languageText.FormDeleteConfirmation);

        if (!isConfirmed) return;

        try {
            const url = `${api}/api/forms/${id}`;
            const url2 = `${api}/api/issforms/${id}`;
            const success = await deleteItem(url, "forms", id, languageText.FormDeletedMessage);
            const success2 = await deleteItem(url2, "ISSForm", id, languageText.FormDeletedMessage);
        } catch (err) {
            console.error("Deletion failed:", err);
            setError(err.message || "Failed to delete item");
        }
    };

    return (
        <div className="lg:flex">
            {/* Navbar */}
            <AdminNavBar languageText={languageText} language={language} api={api} setCommitteeType={setCommitteeType} />

            {/* Main Content */}
            {formsLoading || issLoading ? (
                <div className="flex justify-center items-center w-full h-screen">
                    <Loader text={languageText.Loading} />
                </div>
            ) : deleteLoading ? (
                <div className="flex justify-center items-center w-full h-screen">
                    <Loader text={languageText.Deleting} />
                </div>
            ) : (
                <div className=" flex flex-col justify-center items-center p-8 overflow-y-auto overflow-x-hidden w-full">

                    <div className={`adminDashboardCard mt-20 group mb-3 ${language === "en" ? "md:ml-auto" : "md:mr-auto"}`}>
                        <div className="flex flex-col">
                            <p className="lg:text-2xl text-gray-300">{languageText.TotalForms}</p>
                            <h1 className="lg:text-8xl text-whitetheme group-hover:text-redtheme duration-500">{AllFormsDisplay.length}</h1>
                        </div>
                        <div className="lg:text-9xl text-whitetheme group-hover:text-redtheme duration-500">
                            <Icon icon="fluent:form-multiple-20-filled" />
                        </div>
                    </div>

                    <h1 className="text-8xl font-bold text-redtheme text-center  dark:text-whitetheme">{languageText.MyForms}</h1>
                    <p className="text-gray-600 text-2xl text-center  mb-4">
                        {languageText.MyFormDesc}
                    </p>

                    <SearchInput languageText={languageText} language={language} onSearch={(query) => setSearchQuery(query)} />

                    <p className="auto md:hidden ScrollHorizontally mt-4" >{languageText.ScrollHorizontally}</p>


                    <div className="w-full overflow-x-auto p-5 mx-3 flex flex-col md:justify-center md:items-center gap-4 mt-4">
                        <div className="tableHeader">
                            <div className="tableDiv"></div>
                            <div className="tableDiv">{languageText.Submissions}</div>
                            <div className="tableDiv">{languageText.EventName}</div>
                            <div className="tableDiv">{languageText.Status}</div>
                            {committeeType === "All" && <div className="tableDiv">{languageText.Committee}</div>}
                            <div className="tableDiv">{languageText.Action}</div>
                        </div>
                        <div className="tableBody">
                            {filteredForms.length === 0 && (
                                <div className="tableRow ">
                                    <div className="w-full flex justify-center items-center gap-2">
                                        <Icon icon="material-symbols:nearby-error-rounded" />
                                        {languageText.NoForms}</div>
                                </div>
                            )}


                            {filteredForms.map((form) => (
                                <div className="tableRow" key={form.id}>
                                    <div className="tableDiv">
                                        <img src={form.eventImg} alt="" className="w-20 lg:w-30 m-auto rounded-lg" />
                                    </div>

                                    <div className="tableDiv">
                                        {(issData.filter((forms) => forms?.eventID === form?._id)).length}
                                    </div>

                                    <div className="tableDiv">
                                        {language === "en" ? form?.eventName : form?.arabicEventName}
                                    </div>

                                    <div className="tableDiv">
                                        <div className={`w-[80%] h-10 lg:w-[30%] py-1 rounded m-auto ${form.status ? 'bg-green-500 text-green-500' : "bg-redtheme text-redtheme"}`}>
                                        </div>
                                    </div>

                                    {committeeType === "All" && <div className="tableDiv">{form.type}</div>}


                                    <div className="tableDiv flex flex-wrap justify-center items-center gap-2">
                                        <Link
                                            to={`/form/${form.link}`}
                                            className="tableButton bg-whitetheme text-darktheme group">
                                            <Icon icon="fluent:open-12-filled" />
                                            <div className="inputIconText !bg-whitetheme !text-darktheme !ring-whitetheme !ring-offset-darktheme">{languageText.OpenForm}</div>
                                        </Link>

                                        <Link
                                            to={`/formData/${form._id}`}
                                            className="tableButton bg-darktheme text-whitetheme group">
                                            <Icon icon="icon-park-outline:excel" />
                                            <div className="inputIconText !bg-radial from-darktheme to-darktheme2">{languageText.ViewData}</div>
                                        </Link>

                                        <Link
                                            to={`/editForm/${form._id}`}
                                            className="tableButton bg-blue-800 text-whitetheme group">
                                            <Icon icon="mdi:library-edit" />
                                            <div className="inputIconText !bg-blue-800 !ring-blue-800">{languageText.EditForm}</div>
                                        </Link>

                                        <button
                                            onClick={(e) => {
                                                onSubmit(e, form)
                                            }}
                                            className="tableButton bg-emerald-700 text-whitetheme group">
                                            <Icon icon="f7:status" />
                                            <div className="inputIconText !bg-emerald-700 !ring-emerald-700">{languageText.ChangeStatus}</div>
                                        </button>

                                        <button
                                            onClick={(e) => {
                                                handleDelete(e, form._id)
                                            }}
                                            className="tableButton bg-redtheme text-whitetheme group">
                                            <Icon icon="solar:trash-bin-minimalistic-broken" />
                                            <div className="inputIconText !bg-redtheme !ring-redtheme">{languageText.DeleteForm}</div>
                                        </button>
                                    </div>
                                </div>
                            ))}

                        </div>
                    </div>
                </div>
            )}
            <ScrollToTop languageText={languageText} />

        </div>
    )
}

export default MyForms