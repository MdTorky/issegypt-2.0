import { useState, useEffect, useRef } from "react"
import { useParams, useNavigate } from "react-router-dom"
import axios from "axios"
import Loader from "../../components/loaders/Loader"

const ParticipantScreen = ({ api, languageText }) => {
    const { code } = useParams()
    const navigate = useNavigate()
    const [group, setGroup] = useState(null)
    const [quiz, setQuiz] = useState(null)
    const [currentQuestion, setCurrentQuestion] = useState(null)
    const [answer, setAnswer] = useState("")
    const [timeLeft, setTimeLeft] = useState(0)
    const [submitted, setSubmitted] = useState(false)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const [selectedOption, setSelectedOption] = useState(null)

    // Use refs to store interval IDs and timers
    const timerRef = useRef(null)
    const pollingRef = useRef(null)
    const quizStatusPollingRef = useRef(null)
    const inputRef = useRef(null)
    const endTimeRef = useRef(null)
    const currentQuestionIndexRef = useRef(null)

    // Colors for the multiple choice buttons
    const colorClasses = {
        red: "bg-red-500 hover:bg-red-600",
        blue: "bg-blue-500 hover:bg-blue-600",
        green: "bg-green-500 hover:bg-green-600",
        yellow: "bg-yellow-500 hover:bg-yellow-600",
    }

    // Load group data from localStorage only once on mount
    useEffect(() => {
        const storedGroup = localStorage.getItem("quizGroup")
        if (!storedGroup) {
            navigate("/join")
            return
        }
        const parsedGroup = JSON.parse(storedGroup)
        if (parsedGroup.quizCode !== code) {
            navigate("/join")
            return
        }
        setGroup(parsedGroup)
        fetchQuiz()

        return () => {
            clearAllIntervals()
        }
    }, []) // Remove dependencies to prevent re-runs

    const clearAllIntervals = () => {
        ;[pollingRef, timerRef, quizStatusPollingRef].forEach((ref) => {
            if (ref.current) clearInterval(ref.current)
        })
    }

    const fetchQuiz = async () => {
        try {
            const response = await axios.get(`${api}/api/welcome/code/${code}`)
            setQuiz(response.data)
            if (response.data.isActive) {
                startPolling()
            } else {
                startQuizStatusPolling()
            }
            setLoading(false)
        } catch (err) {
            setError("Failed to load quiz")
            setLoading(false)
        }
    }

    const startQuizStatusPolling = () => {
        if (quizStatusPollingRef.current) clearInterval(quizStatusPollingRef.current)

        quizStatusPollingRef.current = setInterval(async () => {
            try {
                const response = await axios.get(`${api}/api/welcome/code/${code}`)
                if (response.data.isActive) {
                    setQuiz(response.data)
                    clearInterval(quizStatusPollingRef.current)
                    startPolling()
                }
            } catch (err) {
                console.error("Failed to check quiz status", err)
            }
        }, 3000)
    }

    const startPolling = () => {
        // Clear any existing polling interval
        if (pollingRef.current) clearInterval(pollingRef.current)

        // Initial fetch
        fetchCurrentQuestion()

        // Set up polling with more careful state tracking
        pollingRef.current = setInterval(() => {
            // Only fetch if we haven't fetched the current question yet or if the timer has expired
            const shouldFetch = !currentQuestion || timeLeft === 0;

            if (shouldFetch && !submitted) {
                fetchCurrentQuestion();
            }
        }, 3000);
    }

    const fetchCurrentQuestion = async () => {
        try {
            const response = await axios.get(`${api}/api/welcome/question/${code}`)

            // Compare with the ref value
            if (currentQuestionIndexRef.current !== response.data.index) {
                console.log("New question detected, updating state")
                currentQuestionIndexRef.current = response.data.index;

                setCurrentQuestion(response.data)
                setSubmitted(false)
                setAnswer("")
                setSelectedOption(null)

                // Set up the timer only for new questions
                endTimeRef.current = Date.now() + response.data.timeLimit * 1000
                startTimer()

                if (inputRef.current) inputRef.current.focus()
            } else {
                console.log("Same question, not updating")
            }
        } catch (err) {
            console.error("Failed to fetch current question", err)
            if (err.response?.status === 400) {
                clearAllIntervals()
                navigate("/quizCompleted")
            }
        }
    }

    const startTimer = () => {
        if (timerRef.current) clearInterval(timerRef.current)

        const updateTimer = () => {
            if (!endTimeRef.current) return

            const remaining = Math.max(0, Math.ceil((endTimeRef.current - Date.now()) / 1000))
            setTimeLeft(remaining)

            if (remaining === 0) {
                clearInterval(timerRef.current)
                timerRef.current = null
            }
        }

        // Update immediately
        updateTimer()
        timerRef.current = setInterval(updateTimer, 1000)
    }

    const handleSubmit = async (e) => {
        if (e) e.preventDefault();

        if (currentQuestion.questionType === "open" && !answer.trim()) return;
        if (currentQuestion.questionType === "multiple_choice" && !selectedOption) return;
        if (submitted) return;

        try {
            await axios.post(`${api}/api/welcome/answer`, {
                groupId: group.id,
                answer: currentQuestion.questionType === "open" ? answer.trim() : selectedOption
            })
            setSubmitted(true)
        } catch (err) {
            setError(err.response?.data?.error || "Failed to submit answer")
        }
    }

    const handleOptionSelect = (optionText) => {
        setSelectedOption(optionText);
        // Auto-submit when an option is selected
        setTimeout(() => {
            handleSubmit();
        }, 100);
    }

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins}:${secs < 10 ? "0" : ""}${secs}`
    }

    useEffect(() => {
        console.log("Current question changed:", currentQuestion?.index);
    }, [currentQuestion]);

    useEffect(() => {
        console.log("Time left changed:", timeLeft);
    }, [timeLeft]);

    if (loading)
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader text={languageText.Loading} />
            </div>
        )
    if (error)
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-red-600 text-xl">{error}</div>
            </div>
        )
    if (!quiz || !quiz.isActive) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4">
                <div className="max-w-md w-full bg-gradient-to-b from-whitetheme/50 to-whitetheme2/50 dark:from-darktheme/50 dark:to-darktheme2/50 rounded-lg shadow-md p-8 text-center">
                    <h1 className="text-2xl font-bold dark:text-whitetheme">{languageText.WaitingForQuiz}</h1>
                    <p className="mb-6 text-redtheme">{languageText.WaitForHost}</p>
                    <div className="bg-redtheme/70 p-4 rounded-lg inline-block text-whitetheme">
                        <p className="font-medium">{languageText.YourGroupName}</p>
                        <p className="text-4xl font-bold">{group.name}</p>
                    </div>
                </div>
            </div>
        )
    }
    if (!currentQuestion)
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-2xl">Waiting for the first question...</div>
            </div>
        )

    return (
        <div className="min-h-screen p-4">
            <div className="max-w-md mx-auto mt-30 lg:mt-50">
                <div className="bg-gradient-to-b from-whitetheme/50 to-whitetheme2/50 dark:from-darktheme/50 dark:to-darktheme2/50  rounded-lg shadow-md p-6 mb-4">
                    <div className="flex justify-between items-center mb-2">
                        <h2 className="text-lg font-semibold text-redtheme">
                            Question {currentQuestion.index + 1} of {currentQuestion.total}
                        </h2>
                        <div className="text-xl bg-redtheme/70 text-whitetheme px-3 py-1 rounded-md">{formatTime(timeLeft)}</div>
                    </div>
                    <div className="w-full bg-gray-200 h-3 rounded-full mb-6">
                        <div
                            className="bg-redtheme h-3 rounded-full transition-all duration-1000"
                            style={{ width: `${(timeLeft / currentQuestion.timeLimit) * 100}%` }}
                        ></div>
                    </div>
                </div>
                <div className="bg-gradient-to-b from-whitetheme/50 to-whitetheme2/50 dark:from-darktheme/50 dark:to-darktheme2/50 rounded-lg shadow-md p-6">
                    {submitted ? (
                        <div className="text-center py-6">
                            <div className="text-3xl font-bold text-redtheme">{languageText.AnswerSubmitted}</div>
                            <div className=" text-gray-600">{languageText.FinallySubmitted}</div>
                        </div>
                    ) : currentQuestion.questionType === "multiple_choice" ? (
                        <div className="grid grid-cols-2 gap-4">
                            {currentQuestion.options.map((option, index) => (
                                <button
                                    key={index}
                                    onClick={() => handleOptionSelect(option.text)}
                                    disabled={timeLeft === 0}
                                    className={`${colorClasses[option.color]} h-32 p-4 rounded-xl text-white font-bold text-lg shadow-md transition duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-opacity-50`}
                                >
                                    {option.text}
                                </button>
                            ))}
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit}>
                            <div className="mb-6">
                                <input
                                    ref={inputRef}
                                    type="text"
                                    value={answer}
                                    onChange={(e) => setAnswer(e.target.value)}
                                    className="w-full px-3 py-3 text-lg border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-redtheme text-darktheme dark:text-whitetheme"
                                    placeholder={languageText.YourAnswer}
                                    disabled={timeLeft === 0}
                                    autoComplete="off"
                                />
                            </div>
                            <button
                                type="submit"
                                className={`w-full py-3 px-4 rounded-md text-white font-medium ${timeLeft === 0 || !answer.trim() ? "bg-gray-400 cursor-not-allowed" : "bg-redtheme hover:bg-redtheme2 duration-300 ease-in-out"
                                    }`}
                                disabled={timeLeft === 0 || !answer.trim()}
                            >
                                Submit Answer
                            </button>
                        </form>
                    )}
                    {timeLeft === 0 && !submitted && (
                        <div className="mt-6 text-center text-red-600">Time's up! Waiting for next question...</div>
                    )}
                </div>
                <div className="mt-4 bg-darktheme/80 rounded-lg shadow-sm p-4 text-center">
                    <p className="text-sm text-whitetheme">
                        {languageText.YourGroupName} <span className="font-bold">{group.name}</span>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default ParticipantScreen

