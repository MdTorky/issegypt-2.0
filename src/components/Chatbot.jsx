

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Icon } from "@iconify/react"
import axios from "axios"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import InputField from "./formInputs/InputField"
import { useFormsContext } from "../hooks/useFormContext";
import useFetchData from "../hooks/useFetchData";
import eGPT from '../assets/img/eGPT logo 2.png'


export default function ChatBot({ api, botName = "e-GPT  – The ISS Egypt Assistant (Beta)", botIcon = "fluent:bot-sparkle-16-filled", chatbotImage = eGPT, language, languageText }) {
    const [isOpen, setIsOpen] = useState(false)
    const [messages, setMessages] = useState([
        {
            from: "bot",
            text: "Hi! I'm e-GPT your AI Assistant. I am happy to assist you! (Beta)",
            timestamp: new Date(),
        },
    ])
    const [input, setInput] = useState("")
    const [loading, setLoading] = useState(false)
    const [hoveredLink, setHoveredLink] = useState(null)
    const messagesEndRef = useRef(null)

    const { dispatch } = useFormsContext();
    const { data: knowledgeData, knowledgeLoader, error } = useFetchData(`${api}/api/knowledge`);
    const [randomSuggestions, setRandomSuggestions] = useState([]);
    const [filteredSuggestions, setFilteredSuggestions] = useState([]);
    const [liveSuggestion, setLiveSuggestion] = useState(null);
    const ar = (text) => {

        const arabicRegex = /[\u0600-\u06FF]/;
        const arabicChars = text.split('').filter(char => arabicRegex.test(char));
        return arabicChars.length / text.length > 0.3; // Only say Arabic if 30%+ of char
    }

    useEffect(() => {
        if (knowledgeData && Array.isArray(knowledgeData) && !knowledgeLoader && !error) {
            dispatch({
                type: "SET_ITEM",
                collection: "knowledges",
                payload: knowledgeData
            });

            const englishOnly = knowledgeData.filter(item => item.language === 'en');
            const shuffled = [...englishOnly].sort(() => 0.5 - Math.random()).slice(0, 3);
            setRandomSuggestions(shuffled);
        }
    }, [knowledgeData, knowledgeLoader, error, dispatch]);


    useEffect(() => {
        if (input.trim() && Array.isArray(knowledgeData)) {
            const lowercaseInput = input.toLowerCase();
            const arabic = isArabic(input);

            const matches = knowledgeData.filter(item => {
                // First message: filter by detected input language (en/ar)
                if (messages.length === 1 && item.language !== (arabic ? 'ar' : 'en')) return false;

                // After first message: allow any language
                const questionMatch = item.text?.toLowerCase().includes(lowercaseInput);
                const keywordMatch = Array.isArray(item.keywords) &&
                    item.keywords.some(keyword => keyword.toLowerCase().includes(lowercaseInput));
                return questionMatch || keywordMatch;
            });

            setFilteredSuggestions(matches.slice(0, 3));
            setLiveSuggestion(matches[0] || null);
        } else {
            setFilteredSuggestions([]);
            setLiveSuggestion(null);
        }
    }, [input, knowledgeData, messages.length]);


    // 2. Input changes — filter 3 for first message and 1 after that
    // useEffect(() => {
    //     if (input.trim() && Array.isArray(knowledgeData)) {
    //         const lowercaseInput = input.toLowerCase();

    //         const matches = knowledgeData.filter(item => {
    //             if (item.language !== 'en') return false;

    //             const questionMatch = item.text?.toLowerCase().includes(lowercaseInput);
    //             const keywordMatch = Array.isArray(item.keywords) &&
    //                 item.keywords.some(keyword => keyword.toLowerCase().includes(lowercaseInput));
    //             return questionMatch || keywordMatch;
    //         });

    //         setFilteredSuggestions(matches.slice(0, 3));
    //         setLiveSuggestion(matches[0] || null);
    //     } else {
    //         setFilteredSuggestions([]);
    //         setLiveSuggestion(null);
    //     }
    // }, [input, knowledgeData]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    const isArabic = (text) => {
        const arabicRegex = /[\u0600-\u06FF]/
        return arabicRegex.test(text)
    }

    const handleSend = async (messageToSend = input) => {
        if (typeof messageToSend !== "string" || !messageToSend.trim()) return;

        const userMessage = {
            from: "user",
            text: messageToSend,
            timestamp: new Date(),
        };
        setMessages((prev) => [...prev, userMessage]);
        setInput("");
        setLoading(true);

        try {
            const res = await axios.post(`${api}/api/knowledge/chat`, {
                message: messageToSend,
            });
            const botMessage = {
                from: "bot",
                text: res.data.reply,
                timestamp: new Date(),
            };
            setMessages((prev) => [...prev, botMessage]);
        } catch (err) {
            console.error(err);
            setMessages((prev) => [
                ...prev,
                {
                    from: "bot",
                    text: "Oops! Something went wrong. Please try again later.",
                    timestamp: new Date(),
                },
            ]);
        }

        setLoading(false);
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault()
            handleSend()
        }
    }

    const sendMessage = async (suggestion) => {
        const messageToSend = typeof suggestion === "string" ? suggestion : suggestion.text;
        setInput(messageToSend);
        handleSend(messageToSend);
    };

    function formatTime(timeStr) {
        const [hourStr, minuteStr] = timeStr.split(":");
        let hour = parseInt(hourStr, 10);
        const minute = parseInt(minuteStr, 10);
        const period = hour >= 12 ? "PM" : "AM";

        hour = hour % 12 || 12; // convert 0 -> 12 and 13 -> 1

        return `${hour}:${minute.toString().padStart(2, "0")}${period}`;
    }

    return (
        <>
            {/* Floating Chat Button */}
            <motion.div className="fixed bottom-6 right-6 z-110" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="w-12 h-12 md:w-16 md:h-16 bg-radial from-darktheme2/70 to-redtheme2/90 text-white flex justify-center items-center rounded-full ring-4 ring-redtheme2/70 border-3 border-whitetheme dark:border-darktheme2 cursor-pointer group z-100"
                >
                    <AnimatePresence mode="wait">
                        {isOpen ? (
                            <motion.div
                                key="close"
                                initial={{ rotate: -90, opacity: 0 }}
                                animate={{ rotate: 0, opacity: 1 }}
                                exit={{ rotate: 90, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                            >
                                <Icon icon="solar:close-circle-broken" className="w-6 h-6" />
                            </motion.div>
                        ) : (
                            <motion.div
                                key="chat"
                                initial={{ rotate: -90, opacity: 0 }}
                                animate={{ rotate: 0, opacity: 1 }}
                                exit={{ rotate: 90, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className="text-xl"
                            >
                                {chatbotImage ? (
                                    <img
                                        src={chatbotImage || "/placeholder.svg"}
                                        alt="Chatbot"
                                        className="w-2/3 h-2/3 m-auto rounded-full object-cover"
                                    />
                                ) : (
                                    // <Icon icon="mdi:chat" className="w-6 h-6" />
                                    <motion.div
                                        initial={{ scale: 1 }}
                                        animate={{ scale: [1, 0.8, 1] }}
                                        transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }}
                                    >

                                        <Icon icon="mdi:chat" />

                                    </motion.div>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                    <div className="inputIconText !bg-radial from-redtheme/80 to-redtheme/80 !text-whitetheme">
                        e-GPT AI Beta
                    </div>
                </button>
            </motion.div>

            {/* Chat Window */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: 20 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                        className="fixed bottom-24 right-6 w-96 h-[32rem] bg-white dark:bg-darktheme2 rounded-2xl z-110 md:flex flex-col overflow-hidden shadow-[4.0px_8.0px_8.0px_rgba(0,0,0,0.38)] hidden"

                    >
                        {/* Header */}
                        <div className="bg-gradient-to-l from-darktheme2 to-redtheme2 p-4 text-white">
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 rounded-full flex items-center justify-center">


                                    {chatbotImage ? (
                                        <img
                                            src={chatbotImage || "/placeholder.svg"}
                                            alt="Chatbot"
                                            className="w-full h-full m-auto rounded-full object-cover"
                                        />
                                    ) : (
                                        <motion.div
                                            initial={{ scale: 1 }}
                                            animate={{ scale: [1, 0.8, 1] }}
                                            transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }}
                                        >

                                            <Icon icon={botIcon} className="w-6 h-6" />

                                        </motion.div>
                                    )}
                                </div>
                                <div>
                                    <h3 className="font-semibold text-lg tracking-wide">{botName}</h3>
                                    <p className="text-sm opacity-90">Online</p>
                                </div>
                            </div>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-whitetheme dark:bg-darktheme2 ">
                            {messages.map((msg, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3 }}
                                    // dir={isArabic(msg.text) ? "rtl" : "ltr"}
                                    className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}
                                >
                                    <div
                                        className={`flex items-end space-x-2 max-w-[80%]  ${msg.from === "user" ? "flex-row-reverse space-x-reverse" : ""}`}
                                    >
                                        {/* Avatar */}
                                        <div
                                            className={`w-8 h-8 rounded-full flex  items-center justify-center flex-shrink-0  shadow-[0_3px_10px_rgb(0,0,0,0.2)] ${msg.from === "user" ? "bg-redtheme2 ring-2 ring-redtheme2 border-2 border-whitetheme dark:border-darktheme2 text-white" : "bg-darktheme2 dark:bg-whitetheme2 text-whitetheme dark:text-darktheme ring-2 ring-darktheme2 border-2 border-whitetheme dark:ring-whitetheme2 dark:border-darktheme2"
                                                }`}
                                        >
                                            <Icon icon={msg.from === "user" ? "solar:user-bold" : botIcon} />
                                        </div>

                                        {/* Message Bubble */}
                                        <div
                                            className={`rounded-2xl px-4 py-3 shadow-[4.0px_8.0px_8.0px_rgba(0,0,0,0.38)] ${msg.from === "user"
                                                ? "bg-redtheme2 ring-2 ring-redtheme2 border-2 border-whitetheme dark:border-darktheme2 text-white rounded-br-md"
                                                : "bg-darktheme dark:bg-whitetheme2 text-whitetheme dark:text-darktheme2 ring-2 ring-darktheme2 border-2 border-whitetheme dark:ring-whitetheme2 dark:border-darktheme2 rounded-bl-md"
                                                } ${isArabic(msg.text) ? "font-modernpro text-end" : "font-tanker text-start"}`}
                                        >
                                            <ReactMarkdown
                                                remarkPlugins={[remarkGfm]}
                                                components={{
                                                    a: ({ href, children }) => (
                                                        <a
                                                            href={href}
                                                            className={`underline hover:no-underline ${msg.from === "user" ? "text-blue-100" : "text-redtheme"
                                                                }`}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            onMouseEnter={() => setHoveredLink(href || null)}
                                                            onMouseLeave={() => setHoveredLink(null)}
                                                        >
                                                            {children}
                                                        </a>
                                                    ),
                                                    p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                                                    ul: ({ children }) => <ul className="list-disc list-inside space-y-1">{children}</ul>,
                                                    ol: ({ children }) => <ol className="list-decimal list-inside space-y-1">{children}</ol>,
                                                }}
                                            >
                                                {msg.text}
                                            </ReactMarkdown>
                                            <div className="text-end text-gray-500 font-tanker">
                                                {formatTime(msg.timestamp.toLocaleTimeString())}

                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}

                            {/* Loading Animation */}
                            {loading && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="flex justify-start"
                                >
                                    <div className="flex items-end space-x-2 max-w-[80%]">
                                        <div className="w-8 h-8 rounded-full bg-darktheme2 dark:bg-whitetheme2 text-whitetheme dark:text-darktheme ring-2 ring-darktheme2 border-2 border-whitetheme dark:ring-whitetheme2 dark:border-darktheme2 flex items-center justify-center flex-shrink-0">
                                            <Icon icon={botIcon} className="w-5 h-5" />
                                        </div>
                                        <div className="bg-darktheme dark:bg-whitetheme2 text-whitetheme dark:text-darktheme ring-2 ring-darktheme2 border-2 border-whitetheme dark:ring-whitetheme2 dark:border-darktheme rounded-2xl rounded-bl-md px-4 py-3 shadow-sm">
                                            <div className="flex space-x-1">
                                                <motion.div
                                                    className="w-2 h-2 bg-whitetheme dark:bg-redtheme2 rounded-full"
                                                    animate={{ scale: [1, 1.2, 1] }}
                                                    transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, delay: 0 }}
                                                />
                                                <motion.div
                                                    className="w-2 h-2 bg-whitetheme dark:bg-redtheme2 rounded-full"
                                                    animate={{ scale: [1, 1.2, 1] }}
                                                    transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, delay: 0.2 }}
                                                />
                                                <motion.div
                                                    className="w-2 h-2 bg-whitetheme dark:bg-redtheme2 rounded-full"
                                                    animate={{ scale: [1, 1.2, 1] }}
                                                    transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, delay: 0.4 }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            <div ref={messagesEndRef} />
                        </div>

                        {/* Link Preview */}
                        {hoveredLink && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mx-4 mb-2 bg-darktheme border-3 dark:bg-whitetheme2 border-gray-700 dark:border-gray-400 rounded-lg p-3 absolute bottom-15 right-0 left-0"
                            >
                                <div className="flex items-center space-x-2 text-sm">
                                    <Icon icon="mingcute:link-fill" className="w-4 h-4 dark:text-redtheme text-whitetheme2" />
                                    <span className="dark:text-redtheme text-whitetheme2 font-medium">Link Preview:</span>
                                </div>
                                <a
                                    href={hoveredLink}
                                    className="text-gray-500 text-sm hover:underline block mt-1 truncate"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    {hoveredLink}
                                </a>
                            </motion.div>
                        )}
                        {/* {messages.length === 1 && (
                            <div className="px-4 py-2 bg-white border-t border-gray-200 w-full">
                                <p className="text-sm text-gray-600 mb-2">Try asking about:</p>
                                <div className="flex gap-2 flex-wrap">
                                    {randomSuggestions.map((suggestion, index) => (
                                        <button
                                            key={index}
                                            onClick={() => sendMessage(suggestion)}
                                            className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-md text-sm text-gray-700 transition-colors cursor-pointer whitespace-nowrap"
                                        >
                                            {suggestion.question}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )} */}

                        {messages.length === 1 && (input.trim() ? filteredSuggestions.length > 0 : randomSuggestions.length > 0) ? (
                            // FIRST message logic: show random or filtered 3

                            // (filteredSuggestions || randomSuggestions) &&
                            <div className="px-4 py-2 bg-whitetheme dark:bg-darktheme2 border-t border-gray-200 dark:border-whitetheme w-full">
                                <p className="text-sm text-gray-500 mb-2">
                                    {input.trim() ? "Suggestions based on your input:" : "Try asking about:"}
                                </p>
                                <div className="flex gap-2 flex-wrap">
                                    {(input.trim() ? filteredSuggestions : randomSuggestions).map((suggestion, index) => (
                                        <button
                                            key={index}
                                            onClick={() => sendMessage(suggestion)}
                                            className="px-3 py-1 bg-gray-100 dark:bg-darktheme dark:text-whitetheme hover:bg-gray-200 dark:hover:bg-darktheme2/40 rounded-md text-sm text-gray-700 transition-colors cursor-pointer whitespace-nowrap"
                                        >
                                            {suggestion.text}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            // AFTER first message logic: show 1 live suggestion
                            input.trim() && liveSuggestion && (
                                <div className="px-4 py-2 bg-whitetheme dark:bg-darktheme2 border-t border-gray-200 dark:border-whitetheme w-full">
                                    <p className="text-sm text-gray-500 mb-2">Suggested question:</p>
                                    <button
                                        onClick={() => sendMessage(liveSuggestion)}
                                        className="flex items-center gap-1 px-3 py-1 bg-gray-100 dark:bg-darktheme dark:text-whitetheme hover:bg-gray-200 dark:hover:bg-darktheme2/40 rounded-md text-sm text-gray-700 transition-colors cursor-pointer whitespace-nowrap"
                                    >
                                        <Icon icon="hugeicons:idea-01" className="text-redtheme dark:text-whitetheme2" /> {liveSuggestion.text}
                                    </button>
                                </div>
                            )
                        )}
                        {/* Input */}
                        <div className="p-4 bg-whitetheme dark:bg-darktheme2 border-t-0 border-gray-200 dark:border-whitetheme">
                            <div className="flex space-x-2">
                                {/* <input
                                    type="text"
                                    className="flex-1 border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Type your message..."
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                    disabled={loading}
                                /> */}

                                <InputField
                                    placeholder="Type your message..."
                                    iconValue="mynaui:message-minus-solid"
                                    icon="mynaui:message-minus"
                                    type="text"
                                    language={language}
                                    languageText={languageText}
                                    required={true}
                                    setValue={setInput}
                                    regex={null}
                                    value={input}
                                    disabled={loading}
                                    onKeyPress={handleKeyPress}
                                />
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => handleSend(input)}
                                    disabled={loading || !input.trim()}
                                    className="bg-gradient-to-r from-redtheme2 to-redtheme text-white p-2 rounded-xl hover:shadow-lg transition-shadow duration-200 disabled:opacity-50 disabled:cursor-not-allowed w-15 flex justify-center items-center cursor-pointer"
                                >
                                    <Icon icon="lets-icons:send-fill" className="w-5 h-5" />
                                </motion.button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Mobile Responsive Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/20 z-30 md:hidden"
                        onClick={() => setIsOpen(false)}
                    />
                )}
            </AnimatePresence>

            {/* Mobile Chat Window */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: "100%" }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: "100%" }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                        className="fixed inset-x-4 bottom-4 top-20 bg-white dark:bg-darktheme2 rounded-2xl flex flex-col overflow-hidden shadow-[4.0px_8.0px_8.0px_rgba(0,0,0,0.38)] md:hidden z-120"
                    >
                        {/* Mobile Header */}
                        <div className="bg-gradient-to-l from-darktheme2 to-redtheme2 p-4 text-white">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10rounded-full flex items-center justify-center">
                                        {chatbotImage ? (
                                            <img
                                                src={chatbotImage || "/placeholder.svg"}
                                                alt="Chatbot"
                                                className="w-full h-full m-auto rounded-full object-cover"
                                            />
                                        ) : (
                                            <motion.div
                                                initial={{ scale: 1 }}
                                                animate={{ scale: [1, 0.8, 1] }}
                                                transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }}
                                            >

                                                <Icon icon={botIcon} className="w-6 h-6" />

                                            </motion.div>
                                        )}
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-lg tracking-wide">{botName}</h3>
                                        <p className="text-sm opacity-90">Online</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center"
                                >
                                    <Icon icon="solar:close-circle-broken" className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        {/* Mobile Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-whitetheme dark:bg-darktheme2">
                            {messages.map((msg, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3 }}
                                    // dir={isArabic(msg.text) ? "rtl" : "ltr"}
                                    className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}
                                >
                                    <div
                                        className={`flex items-end space-x-2 max-w-[85%] ${msg.from === "user" ? "flex-row-reverse space-x-reverse" : ""}`}
                                    >
                                        {/* Avatar */}
                                        <div
                                            className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 shadow-[0_3px_10px_rgb(0,0,0,0.2)] ${msg.from === "user"
                                                ? "bg-redtheme2 ring-2 ring-redtheme2 border-2 border-whitetheme dark:border-darktheme2 text-white"
                                                : "bg-darktheme2 dark:bg-whitetheme2 text-whitetheme dark:text-darktheme ring-2 ring-darktheme2 border-2 border-whitetheme dark:ring-whitetheme2 dark:border-darktheme2"
                                                }`}
                                        >
                                            <Icon icon={msg.from === "user" ? "solar:user-bold" : botIcon} />
                                        </div>

                                        {/* Message Bubble */}
                                        <div
                                            className={`rounded-2xl px-4 py-3 shadow-[4.0px_8.0px_8.0px_rgba(0,0,0,0.38)] ${msg.from === "user"
                                                ? "bg-redtheme2 ring-2 ring-redtheme2 border-2 border-whitetheme dark:border-darktheme2 text-white rounded-br-md"
                                                : "bg-darktheme dark:bg-whitetheme2 text-whitetheme dark:text-darktheme2 ring-2 ring-darktheme2 border-2 border-whitetheme dark:ring-whitetheme2 dark:border-darktheme2 rounded-bl-md"
                                                } ${isArabic(msg.text) ? "font-modernpro text-end" : "font-tanker text-start"}`}
                                        >
                                            <ReactMarkdown
                                                remarkPlugins={[remarkGfm]}
                                                components={{
                                                    a: ({ href, children }) => (
                                                        <a
                                                            href={href}
                                                            className={`underline hover:no-underline ${msg.from === "user" ? "text-blue-100" : "text-redtheme"
                                                                }`}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            onMouseEnter={() => setHoveredLink(href || null)}
                                                            onMouseLeave={() => setHoveredLink(null)}
                                                        >
                                                            {children}
                                                        </a>
                                                    ),
                                                    p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                                                    ul: ({ children }) => <ul className="list-disc list-inside space-y-1">{children}</ul>,
                                                    ol: ({ children }) => <ol className="list-decimal list-inside space-y-1">{children}</ol>,
                                                }}
                                            >
                                                {msg.text}
                                            </ReactMarkdown>
                                            <div className="text-end text-gray-500 font-tanker">
                                                {formatTime(msg.timestamp.toLocaleTimeString())}

                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}

                            {/* Loading Animation */}
                            {loading && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="flex justify-start"
                                >
                                    <div className="flex items-end space-x-2 max-w-[80%]">
                                        <div className="w-8 h-8 rounded-full bg-darktheme2 dark:bg-whitetheme2 text-whitetheme dark:text-darktheme ring-2 ring-darktheme2 border-2 border-whitetheme dark:ring-whitetheme2 dark:border-darktheme2 flex items-center justify-center flex-shrink-0">
                                            <Icon icon={botIcon} className="w-5 h-5" />
                                        </div>
                                        <div className="bg-darktheme dark:bg-whitetheme2 text-whitetheme dark:text-darktheme ring-2 ring-darktheme2 border-2 border-whitetheme dark:ring-whitetheme2 dark:border-darktheme rounded-2xl rounded-bl-md px-4 py-3 shadow-sm">
                                            <div className="flex space-x-1">
                                                <motion.div
                                                    className="w-2 h-2 bg-whitetheme dark:bg-redtheme2 rounded-full"
                                                    animate={{ scale: [1, 1.2, 1] }}
                                                    transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, delay: 0 }}
                                                />
                                                <motion.div
                                                    className="w-2 h-2 bg-whitetheme dark:bg-redtheme2 rounded-full"
                                                    animate={{ scale: [1, 1.2, 1] }}
                                                    transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, delay: 0.2 }}
                                                />
                                                <motion.div
                                                    className="w-2 h-2 bg-whitetheme dark:bg-redtheme2 rounded-full"
                                                    animate={{ scale: [1, 1.2, 1] }}
                                                    transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, delay: 0.4 }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            <div ref={messagesEndRef} />
                        </div>

                        {/* Link Preview */}
                        {hoveredLink && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mx-4 mb-2 bg-darktheme border-3 dark:bg-whitetheme2 border-gray-700 dark:border-gray-400 rounded-lg p-3"
                            >
                                <div className="flex items-center space-x-2 text-sm">
                                    <Icon icon="mingcute:link-fill" className="w-4 h-4 dark:text-redtheme text-whitetheme2" />
                                    <span className="dark:text-redtheme text-whitetheme2 font-medium">Link Preview:</span>
                                </div>
                                <a
                                    href={hoveredLink}
                                    className="text-gray-500 text-sm hover:underline block mt-1 truncate"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    {hoveredLink}
                                </a>
                            </motion.div>
                        )}
                        {messages.length === 1 && (input.trim() ? filteredSuggestions.length > 0 : randomSuggestions.length > 0) ? (
                            // FIRST message logic: show random or filtered 3
                            <div className="px-4 py-2 bg-whitetheme dark:bg-darktheme2 border-t border-gray-200 dark:border-whitetheme w-full">
                                <p className="text-sm text-gray-500 mb-2">
                                    {input.trim() ? "Suggestions based on your input:" : "Try asking about:"}
                                </p>
                                <div className="flex gap-2 flex-wrap">
                                    {(input.trim() ? filteredSuggestions : randomSuggestions).map((suggestion, index) => (
                                        <button
                                            key={index}
                                            onClick={() => sendMessage(suggestion)}
                                            className="px-3 py-1 bg-gray-100 dark:bg-darktheme dark:text-whitetheme hover:bg-gray-200 dark:hover:bg-darktheme2/40 rounded-md text-sm text-gray-700 transition-colors cursor-pointer whitespace-nowrap"
                                        >
                                            {suggestion.text}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            // AFTER first message logic: show 1 live suggestion
                            input.trim() && liveSuggestion && (
                                <div className="px-4 py-2 bg-whitetheme dark:bg-darktheme2 border-t border-gray-200 dark:border-whitetheme w-full">
                                    <p className="text-sm text-gray-500 mb-2">Suggested question:</p>
                                    <button
                                        onClick={() => sendMessage(liveSuggestion)}
                                        className="flex items-center gap-1 px-3 py-1 bg-gray-100 dark:bg-darktheme dark:text-whitetheme hover:bg-gray-200 dark:hover:bg-darktheme2/40 rounded-md text-sm text-gray-700 transition-colors cursor-pointer whitespace-nowrap"
                                    >
                                        <Icon icon="hugeicons:idea-01" className="text-redtheme dark:text-whitetheme2" /> {liveSuggestion.text}
                                    </button>
                                </div>
                            )
                        )}


                        {/* Mobile Input */}
                        <div className="p-4 bg-whitetheme dark:bg-darktheme2 border-t-0 border-gray-200 dark:border-whitetheme">
                            <div className="flex space-x-2">
                                <InputField
                                    placeholder="Type your message..."
                                    iconValue="mynaui:message-minus-solid"
                                    icon="mynaui:message-minus"
                                    type="text"
                                    language={language}
                                    languageText={languageText}
                                    required={true}
                                    setValue={setInput}
                                    regex={null}
                                    value={input}
                                    disabled={loading}
                                />
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => handleSend(input)}
                                    disabled={loading || !input.trim()}
                                    className="bg-gradient-to-r from-redtheme2 to-redtheme text-white p-3 rounded-xl hover:shadow-lg transition-shadow duration-200 disabled:opacity-50 disabled:cursor-not-allowed w-15 flex justify-center items-center cursor-pointer"
                                >
                                    <Icon icon="lets-icons:send-fill" className="w-5 h-5" />
                                </motion.button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}

