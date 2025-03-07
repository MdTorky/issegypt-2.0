// import { useContext, useState } from "react";
// import { FormsContext } from "../contexts/formContext";
// import { useSuccessMessage } from "../contexts/successMessageContext";

// const useSubmitForm = () => {
//     const { dispatch } = useContext(FormsContext);
//     const [error, setError] = useState("");
//     const [successMessage, setSuccessMessage] = useState("");
//     const [submitLoading, setSubmitLoading] = useState(false);
//     const { showSuccessMessage } = useSuccessMessage();

//     const handleSubmit = async (url, method, data, collection, text) => {
//         setSubmitLoading(true);
//         try {
//             setError("");
//             setSuccessMessage("");

//             const response = await fetch(url, {
//                 method: method,
//                 headers: {
//                     "Content-Type": "application/json",
//                 },
//                 body: JSON.stringify(data),
//             });

//             let result;
//             try {
//                 result = await response.json();
//             } catch (parseError) {
//                 console.error("Non-JSON response received:", await response.text());
//                 throw new Error("Unexpected response format");
//             }

//             if (response.ok) {
//                 // For POST requests
//                 if (method === "POST") {
//                     dispatch({
//                         type: "CREATE_ITEM",
//                         collection,
//                         payload: result
//                     });
//                 }
//                 // For PUT/PATCH requests
//                 else if (method === "PUT" || method === "PATCH") {
//                     dispatch({
//                         type: "UPDATE_ITEM",
//                         collection,
//                         payload: {
//                             id: data._id, // Make sure this matches your data structure
//                             changes: result
//                         }
//                     });
//                 }

//                 showSuccessMessage(text);

//                 setError("");
//                 return result;
//             } else {
//                 throw new Error(result.message || "Something went wrong.");
//             }
//         } catch (err) {
//             console.error("Error submitting form:", err);
//             setError("An unexpected error occurred. Please try again.");
//             throw err;
//         } finally {
//             setSubmitLoading(false);
//         }
//     };

//     return { handleSubmit, error, setError, submitLoading };
// };

// export default useSubmitForm;

import { useContext, useState } from "react";
import { FormsContext } from "../contexts/formContext";
import { useSuccessMessage } from "../contexts/successMessageContext";

const useSubmitForm = () => {
    const { dispatch } = useContext(FormsContext);
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [submitLoading, setSubmitLoading] = useState(false);
    const { showSuccessMessage } = useSuccessMessage();

    const handleSubmit = async (url, method, data, collection, text) => {
        setSubmitLoading(true);
        try {
            setError("");
            setSuccessMessage("");

            // Extract the ID from the URL for update operations
            const id = url.split('/').pop();

            // Immediately update UI state before waiting for the server
            if ((method === "PUT" || method === "PATCH") && collection === "forms") {
                // Dispatch optimistic update
                dispatch({
                    type: "UPDATE_ITEM",
                    collection,
                    payload: {
                        id: id,
                        changes: data
                    }
                });
            }

            const response = await fetch(url, {
                method: method,
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            let result;
            try {
                result = await response.json();
            } catch (parseError) {
                console.error("Non-JSON response received:", await response.text());
                throw new Error("Unexpected response format");
            }

            if (response.ok) {
                // For POST requests
                if (method === "POST") {
                    dispatch({
                        type: "CREATE_ITEM",
                        collection,
                        payload: result
                    });
                }

                showSuccessMessage(text);
                setError("");
                return result;
            } else {
                throw new Error(result.message || "Something went wrong.");
            }
        } catch (err) {
            console.error("Error submitting form:", err);
            setError("An unexpected error occurred. Please try again.");
            throw err;
        } finally {
            setSubmitLoading(false);
        }
    };

    return { handleSubmit, error, setError, submitLoading };
};

export default useSubmitForm;