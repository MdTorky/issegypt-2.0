import React, { createContext, useState, useContext } from "react";
import SuccessMessage from "../components/formInputs/SuccessMessage";
import { AnimatePresence } from "framer-motion";

// Import your SuccessMessage component

const SuccessMessageContext = createContext();

export const SuccessMessageProvider = ({ children }) => {
    const [message, setMessage] = useState(null);

    const showSuccessMessage = (text) => {
        setMessage(text);
        setTimeout(() => {
            setMessage(null);
        }, 5000);
    };

    return (
        <SuccessMessageContext.Provider value={{ showSuccessMessage }}>
            {children}
            <AnimatePresence>
                {message && <SuccessMessage text={message} setValue={setMessage} />}
            </AnimatePresence>
        </SuccessMessageContext.Provider>
    );
};

// Custom Hook to use the success message
export const useSuccessMessage = () => useContext(SuccessMessageContext);
