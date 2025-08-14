import React, { useState, useEffect, useCallback } from "react";
import { Bar } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";
import { Icon } from "@iconify/react";
import { useAuthContext } from "../../hooks/useAuthContext";

// Import your custom hooks
import useFetchData from "../../hooks/useFetchData"; // Adjust path if needed
import useDelete from "../../hooks/useDelete";
import useSubmitForm from "../../hooks/useSubmitForm";
import Loader from "../../components/loaders/Loader";
import SearchInput from "../../components/formInputs/SearchInput";
import SelectField from "../../components/formInputs/SelectField";
import AdminNavBar from "../../components/AdminNavBar";
import InputField from "../../components/formInputs/InputField";
import TextareaField from "../../components/formInputs/TextareaField";
import FormButton from "../../components/formInputs/FormButton";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

// The base URL for your backend API
// const api = process.env.REACT_APP_API_URL || 'http://localhost:4000/api/knowledge';

const EGPTDashboard = ({ api, language, languageText }) => {
    // --- STATE MANAGEMENT ---

    // State for filters and pagination
    const [filters, setFilters] = useState({
        language: "",
        category: "",
        sortBy: "usageCount",
        sortOrder: "desc",
        search: "",
    });
    const [currentPage, setCurrentPage] = useState(1);
    const [pageInput, setPageInput] = useState("1");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [limit, setLimit] = useState(10)
    // State for the Edit Modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [formData, setFormData] = useState({});

    const { user } = useAuthContext();
    const [committeeType, setCommitteeType] = useState(user?.committee);

    // --- HOOK-BASED DATA FETCHING & MUTATIONS ---

    // Debounce search input to avoid excessive API calls
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearch(filters.search);
        }, 500); // 500ms delay
        return () => clearTimeout(handler);
    }, [filters.search]);

    // Construct URLs for hooks based on state
    const analyticsUrl = `${api}/api/knowledge/analytics`;
    const knowledgeUrl = new URL(`${api}/api/knowledge`);


    knowledgeUrl.search = new URLSearchParams({
        ...filters,
        search: debouncedSearch,
        page: currentPage,
        limit: limit,
    }).toString();

    // Fetch data using your custom hooks
    const {
        data: analytics,
        loading: loadingAnalytics,
        error: analyticsError,
    } = useFetchData(analyticsUrl);
    const {
        data: knowledgeData,
        loading: loadingKnowledge,
        error: knowledgeError,
    } = useFetchData(knowledgeUrl.toString());

    // Initialize mutation hooks
    const { deleteItem, deleteLoading } = useDelete();
    const { handleSubmit, submitLoading } = useSubmitForm();

    // Update pagination and input when data loads
    useEffect(() => {
        if (knowledgeData?.pagination) {
            setPageInput(knowledgeData.pagination.currentPage.toString());
        }
    }, [knowledgeData]);

    // --- EVENT HANDLERS ---

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters((prev) => ({ ...prev, [name]: value }));
        setCurrentPage(1); // Reset to first page on filter change
    };

    const handlePageJump = (e) => {
        if (e.key === "Enter") {
            const pageNum = parseInt(pageInput);
            if (pageNum >= 1 && pageNum <= knowledgeData?.pagination.totalPages) {
                setCurrentPage(pageNum);
            }
        }
    };

    const handleEditClick = (item) => {
        setEditingItem(item);
        setFormData({
            text: item.text,
            answer: item.answer,
            keywords: item.keywords.join(", "),
            priority: item.priority,
            category: item.category,
        });
        setIsModalOpen(true);
    };

    const handleDeleteClick = async (id) => {
        if (
            window.confirm(
                "Are you sure you want to delete this knowledge entry? This action cannot be undone."
            )
        ) {
            try {
                // Your hook seems to dispatch state updates, which might not work if this component
                // isn't wrapped in your FormsContext. We'll rely on a refetch for now.
                await deleteItem(
                    `${api}/api/knowledge/${id}`,
                    "knowledge",
                    id,
                    "Knowledge entry deleted successfully!"
                );
                // Manually trigger a refetch if dispatch doesn't work here. This is a failsafe.
                // For a production app, ensure context is available or refactor hook.
                window.location.reload(); // Simple but effective way to refresh data
            } catch (error) {
                console.error("Error deleting item:", error);
                alert("Failed to delete item.");
            }
        }
    };

    const handleModalFormChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleModalSave = async (e) => {
        e.preventDefault();
        try {
            const updatePayload = {
                ...formData,
                keywords: formData.keywords
                    .split(",")
                    .map((k) => k.trim())
                    .filter(Boolean),
            };
            await handleSubmit(
                `${api}/api/knowledge/${editingItem._id}`,
                "PATCH",
                updatePayload,
                "knowledge",
                "Knowledge updated successfully!"
            );
            setIsModalOpen(false);
            setEditingItem(null);
            // Manually trigger a refetch
            window.location.reload();
        } catch (error) {
            console.error("Error updating item:", error);
            alert("Failed to update item.");
        }
    };

    // --- CHART DATA & OPTIONS ---

    const chartOptions = {
        indexAxis: "y",
        responsive: true,
        plugins: { legend: { display: false } },
        scales: {
            x: { ticks: { color: "#f7f4f3" } },
            y: { ticks: { color: "#f7f4f3" } },
        },
    };

    const popularChartData = {
        labels: analytics?.mostPopular.map(
            (item) => (item.text || "").substring(0, 30) + "..."
        ),
        datasets: [
            {
                data: analytics?.mostPopular.map((item) => item.usageCount),
                backgroundColor: "#f7f4f3",
                borderColor: "#a31621",
                borderWidth: 2,
            },
        ],
    };

    const unknownChartData = {
        labels: analytics?.frequentUnknown.map(
            (item) => (item.question || "").substring(0, 30) + "..."
        ),
        datasets: [
            {
                data: analytics?.frequentUnknown.map((item) => item.count),
                backgroundColor: "#a31621",
                borderColor: "#62050d",
                borderWidth: 1,
            },
        ],
    };

    // Define this at the top of your component file
    const categoriesOptions = [
        { value: "", label: "All Categories" },
        { value: "general", label: "General", icon: "oui:integration-general" },
        { value: "services", label: "Services", icon: "ri:service-fill" },
        { value: "admission", label: "Admission", icon: "mdi:account-school" },
        { value: "courses", label: "Courses", icon: "mdi:book-open-page-variant" },
        { value: "events", label: "Events", icon: "mdi:calendar-star" },
        { value: "contact", label: "Contact", icon: "typcn:phone" },
        { value: "about", label: "About", icon: "fluent:people-20-filled" },
        { value: "facilities", label: "Facilities", icon: "mdi:office-building" },
        { value: "board", label: "Board", icon: "mdi:account-group" },
        { value: "leadership", label: "Leadership", icon: "mdi:crown" },
        {
            value: "academic",
            label: "Academic",
            icon: "heroicons:academic-cap-solid",
        },
        { value: "other", label: "Other", icon: "mdi:dots-horizontal" },
    ];
    const categoriesOptionsEdit = [
        { value: "general", label: "General", icon: "oui:integration-general" },
        { value: "services", label: "Services", icon: "ri:service-fill" },
        { value: "admission", label: "Admission", icon: "mdi:account-school" },
        { value: "courses", label: "Courses", icon: "mdi:book-open-page-variant" },
        { value: "events", label: "Events", icon: "mdi:calendar-star" },
        { value: "contact", label: "Contact", icon: "typcn:phone" },
        { value: "about", label: "About", icon: "fluent:people-20-filled" },
        { value: "facilities", label: "Facilities", icon: "mdi:office-building" },
        { value: "board", label: "Board", icon: "mdi:account-group" },
        { value: "leadership", label: "Leadership", icon: "mdi:crown" },
        {
            value: "academic",
            label: "Academic",
            icon: "heroicons:academic-cap-solid",
        },
        { value: "other", label: "Other", icon: "mdi:dots-horizontal" },
    ];

    // --- RENDER LOGIC ---

    if (loadingAnalytics)
        return (
            <div className="h-screen flex w-full justify-center">
                <Loader text={languageText.Loading} />
            </div>
        );

    // if (analyticsError) return <div className="text-red-500 text-center p-10">Error loading analytics: {analyticsError}</div>;

    return (
        <div className="lg:flex">
            <AdminNavBar
                languageText={languageText}
                language={language}
                api={api}
                setCommitteeType={setCommitteeType}
            />
            <div className="flex flex-col justify-center items-center p-8 w-full ">
                <h1 className="mt-30 text-3xl lg:text-6xl font-bold text-center text-redtheme mb-8">
                    E-GPT Dashboard
                </h1>
                {/* Analytics Section */}
                <section className="mb-12 flex flex-col gap-15">
                    <div className="w-full lg:justify-center justify-center flex flex-wrap gap-3 lg:gap-10">
                        <div className="adminDashboardCard group">
                            <div className="flex flex-col">
                                <p className="lg:text-2xl text-gray-300">
                                    Total Knowledge Entries
                                </p>
                                <h1 className="lg:text-8xl text-whitetheme group-hover:text-redtheme duration-500">
                                    {analytics?.totalKnowledgeEntries || 0}
                                </h1>
                            </div>
                            <div className="lg:text-9xl text-whitetheme group-hover:text-redtheme duration-500">
                                <Icon icon="garden:knowledge-base-26" />
                            </div>
                        </div>
                        <div className="adminDashboardCard group">
                            <div className="flex flex-col">
                                <p className="lg:text-2xl text-gray-300">
                                    Total Unknown Questions
                                </p>
                                <h1 className="lg:text-8xl text-whitetheme group-hover:text-redtheme duration-500">
                                    {analytics?.totalUnknownQuestions || 0}
                                </h1>
                            </div>
                            <div className="lg:text-9xl text-whitetheme group-hover:text-redtheme duration-500">
                                <Icon icon="hugeicons:file-unknown" />
                            </div>
                        </div>
                    </div>
                    {/* <div className="">
                        <div className="bg-radial from-darktheme2/90 to-darktheme/90 p-6 rounded-lg shadow-lg ring-4 ring-darktheme2/80 border-4 border-whitetheme hover:ring-redtheme dark:border-darktheme">
                            <h3 className="text-xl font-semibold mb-4 text-whitetheme">
                                Most Popular Questions
                            </h3>
                            <Bar data={popularChartData} options={chartOptions} />
                        </div>
                        <div className="bbg-radial from-darktheme2/90 to-darktheme/90 p-6 rounded-lg shadow-lg ring-4 ring-darktheme2/80 border-4 border-whitetheme hover:ring-redtheme dark:border-darktheme">
                        <h3 className="text-xl font-semibold mb-4">Most Frequent Unknown Questions</h3>
                        <Bar data={unknownChartData} options={chartOptions} />
                    </div>
                    </div> */}
                </section>

                {/* Knowledge Table Section */}
                <section className="w-full">
                    <h1 className="text-2xl md:text-4xl font-bold text-redtheme dark:text-whitetheme text-center my-10 ">
                        Manage Knowledge Base
                    </h1>

                    {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
           */}
                    <div className="w-3/4 m-auto mb-10 flex lg:flex-row flex-col gap-4 items-center px-10">
                        <SearchInput
                            languageText={languageText}
                            language={language}
                            onSearch={(query) =>
                                handleFilterChange({
                                    target: { name: "search", value: query }, // acts like a synthetic event
                                })
                            }
                        />

                        <SelectField
                            options={[
                                { value: "", label: "All Languages" },
                                { value: "en", label: "English", icon: "circle-flags:uk" },
                                { value: "ar", label: "Arabic", icon: "circle-flags:ps" },
                            ]}
                            placeholder="Select Language"
                            icon="clarity:language-line" // default icon
                            iconValue="clarity:language-solid" // icon when open
                            language={language}
                            languageText={languageText}
                            value={filters.language} // controlled value
                            setValue={(val) =>
                                handleFilterChange({ target: { name: "language", value: val } })
                            }
                        />

                        <SelectField
                            options={categoriesOptions}
                            placeholder="Select Category"
                            icon="iconamoon:category-light"
                            iconValue="iconamoon:category-fill"
                            language={language}
                            languageText={languageText}
                            value={filters.category}
                            setValue={(val) =>
                                handleFilterChange({ target: { name: "category", value: val } })
                            }
                        />

                        <SelectField
                            options={[
                                { value: "", label: "No Sorting" },
                                {
                                    value: "usageCount",
                                    label: "Most Used",
                                    icon: "ic:round-motion-photos-paused",
                                },
                                { value: "lastUsed", label: "Most Recent", icon: "mdi:recent" },
                                {
                                    value: "createdAt",
                                    label: "Newest",
                                    icon: "icon-park-outline:green-new-energy",
                                },
                            ]}
                            placeholder="Sort by Usage"
                            icon="material-symbols-light:data-usage" // default icon
                            iconValue="ic:round-data-usage" // icon when open
                            language={language}
                            languageText={languageText}
                            value={filters.sortBy} // controlled value
                            setValue={(val) =>
                                handleFilterChange({ target: { name: "sortBy", value: val } })
                            }
                        />

                        <SelectField
                            options={[
                                { value: 1000, label: "All Entries" },
                                { value: 10, label: "10", },
                                { value: 20, label: "20" },
                                { value: 50, label: "50" },
                            ]}
                            placeholder="Select Entries"
                            icon="fluent:table-sparkle-24-regular" // default icon
                            iconValue="fluent:table-sparkle-24-filled" // icon when open
                            language={language}
                            languageText={languageText}
                            value={limit} // controlled value
                            setValue={setLimit}
                        />
                    </div>

                    <div className="w-full overflow-x-auto h-full p-5 m-3 flex flex-col  2xl:items-center gap-4 mt-4">
                        <div className="tableHeader !w-full 2xl:min-w-full min-w-[800px]">
                            <div className="tableDiv"></div>
                            <div className="tableDiv">Text</div>
                            <div className="tableDiv">Language</div>
                            <div className="tableDiv">Category</div>
                            <div className="tableDiv">Usage</div>
                            <div className="tableDiv">Action</div>
                        </div>

                        <div className="tableBody">
                            {knowledgeData?.data.map((item, index) => (
                                <div className="tableRow" key={item._id}>
                                    <div className="tableDiv">{index + 1}</div>
                                    <div className="tableDiv">
                                        {/* <span className="w-1/3 bg-red-900 m-auto text-start"> */}
                                        {item.text}
                                        {/* </span> */}
                                    </div>
                                    <div className="tableDiv">
                                        <span
                                            className={` w-1/5 rounded ${item.language === "ar"
                                                ? "bg-emerald-600"
                                                : "bg-yellow-600"
                                                }`}
                                        >
                                            {item.language.toUpperCase()}
                                        </span>
                                    </div>
                                    <div className="tableDiv">{item.category}</div>
                                    <div className="tableDiv">{item.usageCount}</div>
                                    <div className="tableDiv flex flex-wrap justify-center items-center gap-2">
                                        <button
                                            onClick={() => handleEditClick(item)}
                                            className="tableButton bg-blue-900 text-whitetheme group"
                                        >
                                            <Icon icon="mdi:library-edit" />
                                            <div className="inputIconText !bg-blue-900 !ring-blue-900">
                                                {languageText.Edit}
                                            </div>
                                        </button>
                                        <button
                                            onClick={() => handleDeleteClick(item._id)}
                                            disabled={deleteLoading}
                                            className="tableButton bg-redtheme2 text-whitetheme group"
                                        >
                                            <Icon icon="solar:trash-bin-minimalistic-broken" />
                                            <div className="inputIconText !bg-redtheme2 !ring-redtheme2">
                                                {languageText.Delete}
                                            </div>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="flex justify-center items-center mt-6 gap-4">
                            <button
                                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                                disabled={currentPage === 1}
                                className="bg-redtheme2/80 hover:bg-redtheme ring-3 ring-redtheme2 border-3 border-whitetheme dark:border-darktheme text-whitetheme py-2 px-4 rounded disabled:opacity-50 cursor-pointer"
                            >
                                <Icon icon="solar:map-arrow-left-bold-duotone" />
                            </button>

                            <div className="bg-darktheme2/80 ring-3 ring-darktheme2 border-3 border-whitetheme dark:border-darktheme text-whitetheme px-3 py-2 rounded">
                                Page
                                <input
                                    type="number"
                                    value={pageInput}
                                    min={1}
                                    max={knowledgeData?.pagination.totalPages}
                                    onChange={(e) => setPageInput(e.target.value)}
                                    onKeyDown={handlePageJump}
                                    className="mx-3 text-center text-darktheme rounded bg-whitetheme"
                                />{" "}
                                of {knowledgeData?.pagination.totalPages || 1}
                            </div>

                            <button
                                onClick={() =>
                                    setCurrentPage((p) =>
                                        Math.min(knowledgeData?.pagination.totalPages, p + 1)
                                    )
                                }
                                disabled={currentPage === knowledgeData?.pagination.totalPages}
                                className="bg-redtheme2/80 hover:bg-redtheme ring-3 ring-redtheme2 border-3 border-whitetheme dark:border-darktheme text-whitetheme py-2 px-4 rounded disabled:opacity-50 cursor-pointer"
                            >
                                <Icon icon="solar:map-arrow-right-bold-duotone" />
                            </button>
                        </div>
                    </div>

                    {/* <div className="flex justify-center items-center mt-6 gap-4">
                        <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="bg-red-theme hover:bg-red-theme-dark text-white font-bold py-2 px-4 rounded disabled:opacity-50"><Icon icon='solar:map-arrow-left-bold-duotone' /></button>


                        <span>Page <input type="number" value={pageInput} onChange={(e) => setPageInput(e.target.value)} onKeyDown={handlePageJump} className="w-16 text-center bg-dark-theme rounded" /> of {knowledgeData?.pagination.totalPages || 1}</span>


                        <button onClick={() => setCurrentPage(p => Math.min(knowledgeData?.pagination.totalPages, p + 1))} disabled={currentPage === knowledgeData?.pagination.totalPages} className="bg-red-theme hover:bg-red-theme-dark text-white font-bold py-2 px-4 rounded disabled:opacity-50">→</button>
                    </div> */}
                </section>

                {/* Edit Modal */}
                {isModalOpen && (
                    <div className="fixed inset-0 bg-darktheme2/80 flex justify-center items-center z-50">
                        <div className="bg-gradient-to-r from-whitetheme2 to-whitetheme dark:from-darktheme2 dark:to-darktheme p-4 rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">

                            <form onSubmit={handleModalSave} className="formForm dark:!from-darktheme2 dark:!to-darktheme !from-whitetheme2 !to-whitetheme">
                                {/* <div>
                                    <label className="block mb-1">Text (Question)</label>
                                    <textarea
                                        name="text"
                                        value={formData.text}
                                        onChange={handleModalFormChange}
                                        required
                                        className="w-full bg-dark-theme-light p-2 rounded h-24"
                                    />
                                </div> */}
                                <h2 className="text-4xl font-bold mb-6 text-darktheme dark:text-whitetheme text-center">
                                    Edit Knowledge Entry
                                </h2>
                                <InputField
                                    placeholder="Question"
                                    iconValue="mynaui:question-waves-solid"
                                    icon="mynaui:question-waves"
                                    type="text"
                                    language={language}
                                    languageText={languageText}
                                    required={true}
                                    value={formData.text}
                                    setValue={(val) =>
                                        handleModalFormChange({ target: { name: "text", value: val } })
                                    }
                                    regex={null}
                                />
                                <TextareaField
                                    placeholder="Answer"
                                    iconValue="fluent:prompt-16-regular"
                                    icon="fluent:prompt-16-regular"
                                    type="text"
                                    language={language}
                                    languageText={languageText}
                                    required={true}
                                    value={formData.answer}
                                    setValue={(val) =>
                                        handleModalFormChange({ target: { name: "answer", value: val } })
                                    }
                                    regex={null}
                                />
                                <InputField
                                    placeholder="Keywords (comma-separated)"
                                    iconValue="mdi:label-multiple"
                                    icon="mdi:label-multiple-outline"
                                    type="text"
                                    language={language}
                                    languageText={languageText}
                                    required={true}
                                    value={formData.keywords}
                                    setValue={(val) =>
                                        handleModalFormChange({ target: { name: "keywords", value: val } })
                                    }
                                    regex={null}
                                />

                                <SelectField
                                    options={categoriesOptionsEdit}
                                    placeholder="Select Category"
                                    icon="iconamoon:category-light"
                                    iconValue="iconamoon:category-fill"
                                    language={language}
                                    languageText={languageText}
                                    value={formData.category}
                                    setValue={(val) =>
                                        handleModalFormChange({ target: { name: "category", value: val } })
                                    }
                                />

                                <InputField
                                    placeholder="Priority"
                                    iconValue="iconoir:priority-high-solid"
                                    icon="iconoir:priority-high"
                                    type="number"
                                    language={language}
                                    languageText={languageText}
                                    required={true}
                                    value={formData.priority}
                                    setValue={(val) =>
                                        handleModalFormChange({ target: { name: "priority", value: val } })
                                    }
                                    regex={null}
                                />



                                <div className="flex justify-end gap-4 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setIsModalOpen(false)}
                                        className="bg-linear-to-bl from-redtheme to-redtheme2 border-3 border-whitetheme dark:border-darktheme2 ring-4 ring-redtheme cursor-pointer duration-300 text-white font-bold py-2 px-4 rounded-lg hover:scale-110"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={submitLoading}
                                        className="bg-linear-to-bl from-emerald-600 to-emerald-500 border-3 border-whitetheme dark:border-darktheme2 ring-4 ring-emerald-600 cursor-pointer duration-300 text-white font-bold py-2 px-4 rounded-lg hover:scale-110 disabled:opacity-50"
                                    >
                                        {submitLoading ? "Saving..." : "Save Changes"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default EGPTDashboard;
