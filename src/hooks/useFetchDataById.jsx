import { useState, useEffect } from "react";

const useFetchDataById = (url) => {
    const [data, setData] = useState(null); // Holds the fetched data
    const [loading, setLoading] = useState(true); // Indicates if data is being fetched
    const [error, setError] = useState(null); // Holds any error messages

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true); // Start loading
                setError(null); // Reset error state

                const response = await fetch(url);

                if (!response.ok) {
                    throw new Error(`Error fetching data. Status: ${response.status}`);
                }

                const result = await response.json();
                setData(result); // Set the fetched data
            } catch (err) {
                setError(err.message || "An error occurred while fetching data."); // Set error message
            } finally {
                setLoading(false); // Stop loading
            }
        };

        fetchData(); // Call the fetch function
    }, [url]); // Re-run effect when `url` changes

    return { data, loading, error }; // Return the state values
};

export default useFetchDataById;