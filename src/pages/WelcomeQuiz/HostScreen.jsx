import { useState, useEffect, useRef } from "react"
import { useParams } from "react-router-dom"
import axios from "axios"
import qrLogo from '../../assets/img/Join Code.png'
import { Icon } from "@iconify/react";
import Loader from "../../components/loaders/Loader";
import { AnimatePresence, motion } from "framer-motion";


const HostScreen = ({ api }) => {
    const { code } = useParams()
    const [quiz, setQuiz] = useState(null)
    const [groups, setGroups] = useState([])
    const [currentQuestion, setCurrentQuestion] = useState(null)
    const [timeLeft, setTimeLeft] = useState(0)
    const [quizStarted, setQuizStarted] = useState(false)
    const [quizEnded, setQuizEnded] = useState(false)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const timerRef = useRef(null)
    const pollingRef = useRef(null)

    const [groupLoading, setGroupLoading] = useState(false)

    // Fetch quiz data
    useEffect(() => {
        const fetchQuiz = async () => {
            try {
                const response = await axios.get(`${api}/api/welcome/code/${code}`)
                setQuiz(response.data)
                setQuizStarted(response.data.isActive)

                if (response.data.isActive) {
                    fetchCurrentQuestion()
                }

                setLoading(false)
            } catch (err) {
                console.error("Error fetching quiz:", err)
                setError("Failed to load quiz. Please check the quiz code and try again.")
                setLoading(false)
            }
        }

        fetchQuiz()

        // Poll for new groups
        pollingRef.current = setInterval(() => {
            fetchGroups()
        }, 3000)

        return () => {
            if (pollingRef.current) clearInterval(pollingRef.current)
            if (timerRef.current) clearInterval(timerRef.current)
        }
    }, [code])

    // Fetch groups
    const fetchGroups = async () => {
        setGroupLoading(true)
        try {
            const response = await axios.get(`${api}/api/welcome/results/${code}`)
            setGroups(response.data)
            setGroupLoading(false)

        } catch (err) {
            console.error("Failed to fetch groups", err)
            setGroupLoading(false)

        }
    }

    // Fetch current question
    const fetchCurrentQuestion = async () => {
        try {
            const response = await axios.get(`${api}/api/welcome/question/${code}`)
            setCurrentQuestion(response.data)
            setTimeLeft(response.data.timeLimit)

            // Start timer
            if (timerRef.current) clearInterval(timerRef.current)
            timerRef.current = setInterval(() => {
                setTimeLeft((prev) => {
                    if (prev <= 1) {
                        clearInterval(timerRef.current)
                        return 0
                    }
                    return prev - 1
                })
            }, 1000)
        } catch (err) {
            console.error("Failed to fetch current question", err)
            // If we get a 400 error, the quiz might have ended
            if (err.response?.status === 400) {
                setQuizEnded(true)
                setQuizStarted(false)
                fetchGroups() // Get final results
            }
        }
    }

    // Start quiz
    const startQuiz = async () => {
        try {
            await axios.put(`${api}/api/welcome/start/${code}`)
            setQuizStarted(true)
            fetchCurrentQuestion()
        } catch (err) {
            setError("Failed to start quiz")
        }
    }

    // Move to next question
    const nextQuestion = async () => {
        if (timerRef.current) clearInterval(timerRef.current)

        try {
            const response = await axios.put(`${api}/api/welcome/next/${code}`)

            if (response.data.message === "Quiz completed") {
                setQuizEnded(true)
                setQuizStarted(false)
                fetchGroups() // Get final results
            } else {
                fetchCurrentQuestion()
            }
        } catch (err) {
            setError("Failed to move to next question")
        }
    }

    // Format time
    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins}:${secs < 10 ? "0" : ""}${secs}`
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-2xl"><Loader text="Loading..." /></div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-red-600 text-xl">{error}</div>
            </div>
        )
    }

    return (
        <div className=" flex flex-col justify-center items-center">
            <div className="mt-20 mx-auto p-6 ">
                <div className="flex gap-10 items-center flex-wrap justify-center w-full">
                    <div className="flex  flex-col justify-between items-center gap-4 mb-6">
                        <h1 className="text-8xl text-redtheme font-bold dark:text-whitetheme">{quiz.title}</h1>
                        {!quizStarted && !currentQuestion && (
                            <div className="w-100 bg-darktheme2/70 dark:bg-whitetheme ring-3 ring-darktheme2/70 dark:ring-whitetheme border-4 border-whitetheme dark:border-darktheme2 p-2 rounded-xl ">
                                <img src={qrLogo} alt="" className="rounded-lg" />
                            </div>
                        )}
                        {!quizStarted && !currentQuestion && (<div className="w-100 justify-center bg-gradient-to-l from-darktheme/80 to-darktheme2 ring-3 ring-darktheme/70 dark:ring-darktheme border-4 border-whitetheme dark:border-darktheme2 px-4 py-2 rounded-lg text-2xl flex items-center gap-3">
                            <Icon icon="hugeicons:sms-code" className="text-whitetheme text-3xl" />
                            <span className="font-medium text-whitetheme2">Join Code: </span>
                            <span className="font-bold text-5xl text-whitetheme tracking-wider">{quiz.code}</span>
                        </div>
                        )}
                    </div>

                    {!quizStarted && !quizEnded && (
                        <div className=" bg-gradient-to-b from-whitetheme/50 to-whitetheme2/50 dark:from-darktheme/50 dark:to-darktheme2/50 rounded-xl shadow-xl py-6 flex flex-col max-w-200">
                            <h2 className="text-2xl mb-4 text-center dark:text-whitetheme w-[80%] m-auto">Waiting for Groups to Join</h2>
                            {groups.length === 0 ? (
                                <p className="text-gray-600 text-center">No groups have joined yet.</p>
                            ) : (
                                <div className="flex justify-center gap-10 mb-10  flex-wrap w-[90%] m-auto">
                                    {groups.map((group) => (
                                        <motion.div
                                            initial={{ y: -110, opacity: 0 }}
                                            animate={{ y: 0, opacity: 1 }}
                                            transition={{ duration: 0.4, type: "spring", stiffness: 100 }}
                                            key={group._id} className="w-50 bg-radial from-redtheme to-darktheme2 border-4 border-whitetheme dark:border-darktheme2 ring-3 ring-redtheme text-whitetheme rounded-lg p-3 text-center">
                                            <span className="font-medium text-xl">{group.name}</span>
                                        </motion.div>
                                    ))}
                                </div>
                            )}

                            <button
                                onClick={startQuiz}
                                disabled={groups.length === 0}
                                className={`w-[60%] m-auto py-3 px-4 rounded-md text-whitetheme text-xl font-medium duration-300 ease-in-out ${groups.length === 0 ? "bg-gray-400 cursor-not-allowed" : "bg-redtheme hover:bg-redtheme2 cursor-pointer"
                                    }`}
                            >
                                Start Quiz
                            </button>
                        </div>
                    )}
                </div>
                {quizStarted && currentQuestion && (
                    <div className="bg-gradient-to-b from-whitetheme/50 to-whitetheme2/50 dark:from-darktheme/50 dark:to-darktheme2/50  rounded-lg shadow-md p-6 mb-20">
                        <div className="flex justify-between items-center mb-2">
                            <h2 className="text-xl font-semibold text-redtheme">
                                Emoji {currentQuestion.index + 1} of {currentQuestion.total}
                            </h2>
                            <div className="text-xl font-mono bg-redtheme/70 text-whitetheme px-3 py-1 rounded-md">{formatTime(timeLeft)}</div>
                        </div>

                        <div className="w-full bg-gray-200 h-4 rounded-full mb-6">
                            <div
                                className="bg-redtheme h-4 rounded-xl transition-all duration-1000"
                                style={{ width: `${(timeLeft / currentQuestion.timeLimit) * 100}%` }}
                            ></div>
                        </div>

                        <div className="text-8xl font-medium mb-8 text-center py-6">{currentQuestion.text}</div>
                        {/* <div className="text-9xl font-medium mb-8 text-center py-6">👩‍⚖🏃😭👊</div> */}

                        {/* {timeLeft === 0 ? ( */}
                        <div className="text-center text-gray-600">Waiting for all groups to answer...</div>
                        <button
                            onClick={nextQuestion}
                            className="w-full py-3 px-4 rounded-md bg-redtheme text-white font-medium hover:bg-redtheme2 duration-300 ease-in-out cursor-pointer"
                        >
                            {currentQuestion === 15 ? "Finish Quiz" : "Next Question"}
                        </button>
                        {/* ) : ( */}
                        {/* )} */}
                    </div>
                )}

                {quizEnded && (
                    <div className=" p-6 mb-80">
                        <h2 className="text-5xl font-semibold text-center">Quiz Finished</h2>

                        {/* {groups.length === 0 ? (
                            <p className="text-gray-600 text-center">No groups participated in this quiz.</p>
                        ) : (
                            <div className="space-y-4">
                                {groups.map((group, index) => (
                                    <div key={group._id} className="flex items-center p-4 border rounded-lg">
                                        <div className="w-10 h-10 flex items-center justify-center bg-blue-100 rounded-full mr-4">
                                            <span className="font-bold">{index + 1}</span>
                                        </div>
                                        <div className="flex-grow">
                                            <h3 className="font-medium text-lg">{group.name}</h3>
                                        </div>
                                        <div className="text-2xl font-bold">{group.totalPoints}</div>
                                    </div>
                                ))}
                            </div>
                        )} */}

                        {/* <div className="mt-8 text-center">
                            <a href={`/results/${code}`} className="inline-block py-2 px-4 bg-gray-200 rounded-md hover:bg-gray-300 transition">
                                Results
                            </a>
                        </div> */}
                    </div>
                )}

                {/* <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-semibold mb-4">Groups</h2>

                    {groups.length === 0 ? (
                        <p className="text-gray-600">No groups have joined yet.</p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-gray-50">
                                        <th className="px-4 py-2 text-left">Group</th>
                                        <th className="px-4 py-2 text-right">Points</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {groups
                                        .sort((a, b) => b.totalPoints - a.totalPoints)
                                        .map((group) => (
                                            <tr key={group._id} className="border-t">
                                                <td className="px-4 py-3">{group.name}</td>
                                                <td className="px-4 py-3 text-right font-medium">{group.totalPoints}</td>
                                            </tr>
                                        ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div> */}
            </div>
        </div>
    )
}

export default HostScreen

