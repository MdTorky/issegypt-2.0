import { createContext, useContext, useState, useEffect } from "react";

const PopupContext = createContext();

export const PopupProvider = ({ children }) => {
    const [popUp, setPopUp] = useState(false);
    const [popTitle, setPopTitle] = useState("");
    const [popATitle, setPopATitle] = useState("");
    const [popDesc, setPopDesc] = useState("");

    const showPopup = (title, atitle, descpription) => {
        setPopTitle(title);
        setPopATitle(atitle);
        setPopDesc(descpription);
        setPopUp(true);
    };

    const hidePopup = () => {
        setPopUp(false);
    };

    // Close the popup when ESC key is pressed
    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === "Escape") {
                hidePopup();
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, []);

    return (
        <PopupContext.Provider value={{ popUp, popDesc, popTitle, popATitle, showPopup, hidePopup }}>
            {children}
        </PopupContext.Provider>
    );
};

export const usePopup = () => useContext(PopupContext);
