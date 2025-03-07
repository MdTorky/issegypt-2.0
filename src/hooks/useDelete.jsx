// import { useContext, useState } from "react";
// import { FormsContext } from "../contexts/formContext";

// const useDelete = () => {
//     const { dispatch } = useContext(FormsContext);

//     // State for managing loading, error, and success messages
//     const [error, setError] = useState(""); // Error message state
//     const [successMessage, setSuccessMessage] = useState(""); // Success message state
//     const [deleteLoading, setDeleteLoading] = useState(false); // Loading state

//     // Function to delete an item
//     const deleteItem = async (url, collection, id, text) => {
//         // Reset previous states
//         setError("");
//         setSuccessMessage("");
//         setDeleteLoading(true);

//         try {
//             // Make the DELETE request to the backend
//             const response = await fetch(url, {
//                 method: "DELETE",
//                 headers: {
//                     "Content-Type": "application/json",
//                 },
//             });

//             // Check if the response is not OK
//             if (!response.ok) {
//                 const errorData = await response.json();
//                 throw new Error(errorData.message || "Failed to delete item");
//             }

//             // Dispatch the DELETE_ITEM action to update the global state
//             dispatch({
//                 type: "DELETE_ITEM",
//                 collection,
//                 payload: { _id: id }, // Assuming `_id` is the unique identifier for the item
//             });

//             // Set success message
//             setSuccessMessage(text);
//             setError("");
//             setSubmitLoading(false);
//             return true; // Indicate success
//         } catch (err) {
//             // Set error message
//             setError(err.message || "An unexpected error occurred.");
//             console.error("Error deleting item:", err);
//             throw err; // Re-throw the error for handling in the component
//         } finally {
//             // Ensure loading state is reset
//             setDeleteLoading(false);
//         }
//     };

//     // Return all necessary values and functions
//     return {
//         deleteItem,
//         error,
//         successMessage,
//         setError,
//         setSuccessMessage,
//         deleteLoading,
//     };
// };

// export default useDelete;



import { useContext, useState } from "react";
import { FormsContext } from "../contexts/formContext";
import { useSuccessMessage } from "../contexts/successMessageContext";


const useDelete = () => {
    const { dispatch } = useContext(FormsContext);
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [deleteLoading, setDeleteLoading] = useState(false);
    const { showSuccessMessage } = useSuccessMessage();


    const deleteItem = async (url, collection, id, text) => {
        setError("");
        setSuccessMessage("");
        setDeleteLoading(true);

        try {
            const response = await fetch(url, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Failed to delete item");
            }

            // Update the state immediately after successful API call
            dispatch({
                type: "DELETE_ITEM",
                collection,
                payload: { _id: id }
            });

            // setSuccessMessage(text);
            showSuccessMessage(text);

            return true;
        } catch (err) {
            setError(err.message || "An unexpected error occurred.");
            console.error("Error deleting item:", err);
            throw err;
        } finally {
            setDeleteLoading(false);
        }
    };

    return {
        deleteItem,
        error,
        setError,
        deleteLoading,
    };
};

export default useDelete;