import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Icon } from "@iconify/react"
import axios from "axios"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import InputField from "./formInputs/InputField"
import { useFormsContext } from "../hooks/useFormContext"
import useFetchData from "../hooks/useFetchData"
import eGPT from '../assets/img/eGPT logo 2.png'
import Loader from './loaders/SmallLoader'

export default function ChatBot({ api, botIcon = "fluent:bot-sparkle-16-filled", chatbotImage = eGPT, language, languageText }) {

    const botName = languageText.egpt
    const [isOpen, setIsOpen] = useState(false)
    const [messages, setMessages] = useState([
        {
            from: "bot",
            text: languageText.egptIntro,
            timestamp: new Date(),
        },
    ])
    const [input, setInput] = useState("")
    const [loading, setLoading] = useState(false)
    const [hoveredLink, setHoveredLink] = useState(null)
    const messagesEndRef = useRef(null)

    const { dispatch } = useFormsContext();
    const { data: knowledgeData, loading: knowledgeLoader, error } = useFetchData(`${api}/api/knowledge`);
    const { data: suggestionKnowledge, loading: suggestionLoading, error: suggestionError } = useFetchData(`${api}/api/knowledge/suggestions`);
    const [randomSuggestions, setRandomSuggestions] = useState([]);
    const [filteredSuggestions, setFilteredSuggestions] = useState([]);
    const [liveSuggestion, setLiveSuggestion] = useState(null);

    const isArabic = (text) => {
        if (typeof text !== 'string') return false;
        const arabicRegex = /[\u0600-\u06FF]/;
        const arabicChars = text.split('').filter(char => arabicRegex.test(char));
        return (arabicChars.length / text.length) > 0.3;
    };

    useEffect(() => {
        if (suggestionKnowledge && Array.isArray(suggestionKnowledge) && !suggestionLoading && !suggestionError) {
            dispatch({
                type: "SET_ITEM",
                collection: "knowledges",
                payload: suggestionKnowledge
            });

            const englishOnly = suggestionKnowledge.filter(item => item.language === 'en');
            const shuffled = [...englishOnly].sort(() => 0.5 - Math.random()).slice(0, 3);
            setRandomSuggestions(shuffled);
        }
    }, [suggestionKnowledge, suggestionLoading, suggestionError, dispatch]);


    useEffect(() => {
        if (input.trim() && suggestionKnowledge && Array.isArray(suggestionKnowledge)) {
            const lowercaseInput = input.toLowerCase();
            const arabicInput = isArabic(input);

            const matches = suggestionKnowledge.filter(item => {
                if (messages.length <= 1) {
                    const itemLang = item.language === 'ar';
                    if (itemLang !== arabicInput) {
                        return false;
                    }
                }
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
    }, [input, suggestionKnowledge, messages.length]);

    const scrollToBottom = () => {
        // Use timeout to ensure DOM update is finished
        setTimeout(() => {
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
        }, 100);
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages, loading])


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
        hour = hour % 12 || 12;
        return `${hour}:${minute.toString().padStart(2, "0")}${period}`;
    }

    // --- Animation Variants ---
    const chatContainerVariants = {
        hidden: { opacity: 0, scale: 0.8, y: 50 },
        visible: {
            opacity: 1,
            scale: 1,
            y: 0,
            transition: { type: "spring", stiffness: 300, damping: 25 }
        },
        exit: { opacity: 0, scale: 0.8, y: 50, transition: { duration: 0.2 } }
    };

    const messageVariants = {
        hidden: { opacity: 0, y: 20, scale: 0.9 },
        visible: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 400, damping: 30 } }
    };

    return (
        <>
            {/* --- Floating Launcher Button --- */}
            <motion.div
                className="fixed bottom-6 right-6 z-100 "
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
            >
                <div className="relative group">
                    {/* Pulsing ring effect */}
                    <motion.div
                        className="absolute inset-0 rounded-full bg-yellow-500 opacity-70 blur-md"
                        animate={{ scale: [1, 1.3, 1], opacity: [0.7, 0, 0.7] }}
                        transition={{ duration: 2, repeat: Infinity }}
                    />

                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="relative w-16 h-16 bg-gradient-to-br from-yellow-500 via-yellow-600 to-yellow-700 text-white rounded-full shadow-[0_0_20px_rgba(234,179,8,0.5)] border-2 border-white/30 flex items-center justify-center overflow-hidden z-10 cursor-pointer"
                    >
                        {/* Shine sweep */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:animate-[shimmer_1s_infinite]" />

                        <AnimatePresence mode="wait">
                            {isOpen ? (
                                <motion.div
                                    key="close"
                                    initial={{ rotate: -90, opacity: 0 }}
                                    animate={{ rotate: 0, opacity: 1 }}
                                    exit={{ rotate: 90, opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <Icon icon="solar:close-circle-bold-duotone" className="w-8 h-8 text-white" />
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="open"
                                    initial={{ rotate: 90, opacity: 0 }}
                                    animate={{ rotate: 0, opacity: 1 }}
                                    exit={{ rotate: -90, opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                    className="p-1"
                                >
                                    {chatbotImage ? (
                                        <img src={chatbotImage} alt="Bot" className="w-full h-full object-cover rounded-full" />
                                    ) : (
                                        <Icon icon={botIcon} className="w-8 h-8 text-white" />
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </button>

                    {/* Badge */}
                    {/* {!isOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="absolute -top-10 left-1/2 -translate-x-1/2 bg-black/80 text-white text-xs px-3 py-1 rounded-full whitespace-nowrap backdrop-blur-sm pointer-events-none"
                        >
                            Need help?
                        </motion.div>
                    )} */}
                    <div className="inputIconText !bg-radial from-yellow-600/60 to-yellow-600/60 !text-whitetheme !ring-yellow-600">
                        e-GPT AI Beta
                    </div>
                </div>

            </motion.div>

            {/* --- Chat Window --- */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        variants={chatContainerVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="fixed bottom-24 right-4 md:right-8 w-[92vw] md:w-[400px] h-[600px] max-h-[85vh] flex flex-col z-110 overflow-hidden rounded-[2rem] border border-white/20 shadow-[0_20px_50px_rgba(0,0,0,0.3)] bg-white/70 dark:bg-[#121212]/80 backdrop-blur-2xl"
                    >
                        {/* Header */}
                        <div className="relative p-5 shrink-0 bg-gradient-to-r from-gray-900/90 via-black/80 to-gray-900/90 dark:from-black dark:to-gray-900 text-white border-b border-white/5">
                            {/* Decorative Glows */}
                            <div className="absolute top-0 right-0 w-40 h-40 bg-yellow-500/20 rounded-full blur-[50px] pointer-events-none" />
                            <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-500/10 rounded-full blur-[40px] pointer-events-none" />

                            <div className="relative z-10 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="relative">
                                        <div className="w-12 h-12 rounded-full p-0.5 bg-gradient-to-br from-yellow-400 to-yellow-600 shadow-lg shadow-yellow-500/20">
                                            <div className="w-full h-full rounded-full bg-black overflow-hidden relative">
                                                {chatbotImage ? (
                                                    <img src={chatbotImage} alt="Avatar" className="w-full h-full object-cover" />
                                                ) : (
                                                    <Icon icon={botIcon} className="w-6 h-6 m-auto mt-2 text-white" />
                                                )}
                                            </div>
                                        </div>
                                        <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-black rounded-full shadow-[0_0_8px_rgba(34,197,94,0.8)]"></span>
                                    </div>
                                    <div>
                                        <h3 className={`text-xl font-bold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-yellow-100 to-yellow-500 ${isArabic(botName) ? 'font-modernpro' : 'font-tanker'}`}>
                                            {botName}
                                        </h3>
                                        <p className="text-xs text-gray-400 flex items-center gap-1">
                                            <Icon icon="svg-spinners:pulse-2" className="text-yellow-500" />
                                            {languageText.Online}
                                        </p>
                                    </div>
                                </div>
                                <div>
                                    <button onClick={() => setIsOpen(false)} className="text-white/50 hover:text-white transition-colors">
                                        <Icon icon="solar:minimize-square-3-linear" className="w-6 h-6" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Messages Area */}

                        <div className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-thin scrollbar-thumb-yellow-500/20 scrollbar-track-transparent">
                            {messages.map((msg, index) => {
                                const isUser = msg.from === "user";
                                const isAr = isArabic(msg.text);
                                // Dynamic font class based on user request
                                const fontClass = isAr ? 'font-modernpro' : 'font-tanker';

                                return (
                                    <motion.div
                                        key={index}
                                        variants={messageVariants}
                                        initial="hidden"
                                        animate="visible"
                                        layout // Good for smoother list updates
                                        className={`flex ${isUser ? "justify-end" : "justify-start"}`}
                                    >
                                        <div className={`flex items-end gap-3 max-w-[85%] ${isUser ? "flex-row-reverse" : "flex-row"}`}>

                                            {/* Avatar */}
                                            {!isUser && (
                                                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-black/50 border border-white/10 flex items-center justify-center text-yellow-500 shadow-md">
                                                    <Icon icon={botIcon} className="w-4 h-4" />
                                                </div>
                                            )}

                                            {/* Bubble */}
                                            <div className={`relative group`}>
                                                <div
                                                    className={`
                                                        px-5 py-3.5 rounded-2xl shadow-sm text-sm md:text-base transition-all duration-300
                                                        ${isUser
                                                            ? "bg-gradient-to-tr from-yellow-600 via-yellow-500 to-amber-500 text-white rounded-br-none shadow-lg shadow-yellow-500/20"
                                                            : "bg-white/80 dark:bg-zinc-800/80 backdrop-blur-md text-gray-800 dark:text-gray-100 border border-white/20 dark:border-white/5 rounded-bl-none shadow-md"}
                                                        ${fontClass} ${isAr ? 'text-right leading-relaxed tracking-wide' : 'text-left tracking-wide'}
                                                    `}
                                                >
                                                    <ReactMarkdown
                                                        remarkPlugins={[remarkGfm]}
                                                        components={{
                                                            a: ({ href, children }) => (
                                                                <a
                                                                    href={href}
                                                                    className={`font-bold underline decoration-dotted decoration-2 underline-offset-4 transition-colors
                                                                        ${isUser ? "text-white hover:text-yellow-100" : "text-yellow-600 dark:text-yellow-400 hover:text-yellow-700 dark:hover:text-yellow-300"}
                                                                    `}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    onMouseEnter={() => setHoveredLink(href || null)}
                                                                    onMouseLeave={() => setHoveredLink(null)}
                                                                >
                                                                    {children}
                                                                </a>
                                                            ),
                                                            p: ({ children }) => <p className="mb-2 last:mb-0 leading-relaxed">{children}</p>,
                                                            ul: ({ children }) => <ul className="list-disc list-inside space-y-1 my-2 bg-black/5 dark:bg-white/5 p-2 rounded-lg">{children}</ul>,
                                                            ol: ({ children }) => <ol className="list-decimal list-inside space-y-1 my-2 bg-black/5 dark:bg-white/5 p-2 rounded-lg">{children}</ol>,
                                                            code: ({ node, inline, className, children, ...props }) => (
                                                                <code className={`${inline ? 'bg-black/10 dark:bg-white/10 px-1 py-0.5 rounded text-xs font-mono' : 'block bg-black/80 text-white p-2 rounded-lg text-xs overflow-x-auto'}`} {...props}>
                                                                    {children}
                                                                </code>
                                                            )
                                                        }}
                                                    >
                                                        {msg.text}
                                                    </ReactMarkdown>
                                                </div>

                                                {/* Timestamp */}
                                                <div className={`absolute -bottom-5 w-max text-[10px] text-gray-800 opacity-100 group-hover:opacity-100 transition-opacity ${isUser ? 'right-0' : 'left-0'}`}>
                                                    {formatTime(msg.timestamp.toLocaleTimeString())}
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                )
                            })}

                            {/* Typing Indicator */}
                            {loading && (
                                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex justify-start">
                                    <div className="flex items-end gap-3">
                                        <div className="w-8 h-8 rounded-full bg-black/50 flex items-center justify-center text-yellow-500">
                                            <Icon icon="eos-icons:bubble-loading" className="w-5 h-5" />
                                        </div>
                                        <div className="h-10 px-4 bg-white/50 dark:bg-zinc-800/50 backdrop-blur-sm rounded-2xl rounded-bl-none flex items-center border border-white/10">
                                            <div className="flex gap-1.5">
                                                {[0, 1, 2].map((i) => (
                                                    <motion.div
                                                        key={i}
                                                        className="w-1.5 h-1.5 bg-yellow-500 rounded-full"
                                                        animate={{ y: [0, -5, 0] }}
                                                        transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.2 }}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* --- Detailed Link Preview --- */}
                        <AnimatePresence>
                            {hoveredLink && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20, scale: 0.9 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 20, scale: 0.9 }}
                                    className="absolute bottom-[4.5rem] left-4 right-4 z-50 pointer-events-none"
                                >
                                    <div className="bg-white/90 dark:bg-zinc-900/95 backdrop-blur-xl border border-yellow-500/30 p-3 rounded-xl shadow-2xl flex gap-3 items-center">
                                        <div className="w-10 h-10 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg flex items-center justify-center shrink-0">
                                            <Icon icon="solar:link-circle-bold-duotone" className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className="text-xs font-bold text-yellow-600 dark:text-yellow-500 uppercase tracking-widest mb-0.5">Link Preview</p>
                                            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate">{hoveredLink}</p>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>


                        {/* Suggestions */}
                        <div className="px-4 pb-2">
                            {(messages.length === 1 && (input.trim() ? filteredSuggestions.length > 0 : randomSuggestions.length > 0)) || (input.trim() && liveSuggestion) ? (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    className="flex flex-wrap gap-2 justify-center"
                                >
                                    {messages.length === 1 ? (
                                        (input.trim() ? filteredSuggestions : randomSuggestions).map((item, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() => sendMessage(item)}
                                                className="px-3 py-1.5 text-xs font-medium bg-white/80 dark:bg-zinc-800/80 border border-gray-200 dark:border-gray-700 rounded-full hover:bg-yellow-500 hover:text-white dark:hover:bg-yellow-500 hover:border-yellow-500 transition-all shadow-sm"
                                            >
                                                {item.text}
                                            </button>
                                        ))
                                    ) : (
                                        input.trim() && liveSuggestion && (
                                            <button
                                                onClick={() => sendMessage(liveSuggestion)}
                                                className="w-full flex items-center gap-2 p-2 bg-gradient-to-r from-yellow-500/10 to-transparent border border-yellow-500/20 rounded-lg text-sm text-yellow-700 dark:text-yellow-300 hover:bg-yellow-500/20 transition-colors text-left"
                                            >
                                                <Icon icon="solar:lightbulb-bolt-bold-duotone" className="w-5 h-5 flex-shrink-0 text-yellow-500" />
                                                <span className="truncate">{liveSuggestion.text}</span>
                                            </button>
                                        )
                                    )}
                                </motion.div>
                            ) : null}
                        </div>


                        {/* Input Area */}
                        <div className="p-4 bg-white/60 dark:bg-[#121212]/80 backdrop-blur-md border-t border-white/10 relative">
                            {/* Gradient line at top */}
                            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-yellow-500/50 to-transparent" />

                            <div className="flex items-center gap-2">
                                <div className="flex-1">
                                    <InputField
                                        placeholder={languageText.TypeQuestion}
                                        iconValue="solar:chat-line-bold-duotone" // Updated icon
                                        icon="solar:chat-line-linear"
                                        type="text"
                                        language={language}
                                        languageText={languageText}
                                        required={true}
                                        setValue={setInput}
                                        regex={null}
                                        value={input}
                                        disabled={loading}
                                        onKeyPress={handleKeyPress}
                                    // Ensuring InputField inherits styling nicely or wrapping it
                                    />
                                </div>

                                <motion.button
                                    whileHover={{ scale: 1.05, rotate: -10 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => handleSend(input)}
                                    disabled={loading || !input.trim()}
                                    className="w-12 h-12 flex items-center justify-center bg-gradient-to-br from-yellow-500 to-amber-600 text-white rounded-xl shadow-lg shadow-yellow-500/30 hover:shadow-yellow-500/50 transition-shadow disabled:opacity-50 disabled:shadow-none"
                                >
                                    <Icon icon="solar:plain-3-bold" className="w-6 h-6  translate-y-0.5 -rotate-45" />
                                </motion.button>
                            </div>
                        </div>

                    </motion.div>
                )}
            </AnimatePresence>

            {/* Mobile Backdrop */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 md:hidden"
                        onClick={() => setIsOpen(false)}
                    />
                )}
            </AnimatePresence>
        </>
    )
}
