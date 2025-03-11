
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import InputField from "../../components/formInputs/InputField"
import ErrorContainer from "../../components/formInputs/ErrorContainer"
import { AnimatePresence, motion } from "motion/react"
import Loader from "../../components/loaders/Loader"
import FormButton from "../../components/formInputs/FormButton"

const JoinQuiz = ({ api, languageText, language }) => {
    const [code, setCode] = useState("")
    const [groupName, setGroupName] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError("")

        try {
            const response = await axios.post(`${api}/api/welcome/join`, {
                code: code.toUpperCase(),
                groupName,
            })

            // Store group info in localStorage
            localStorage.setItem(
                "quizGroup",
                JSON.stringify({
                    id: response.data.id,
                    name: response.data.name,
                    groupCode: response.data.groupCode,
                    quizCode: response.data.quizCode,
                }),
            )

            // Redirect to participant screen
            navigate(`/participant/${response.data.quizCode}`)
        } catch (err) {
            setError(err.response?.data?.error || "Failed to join quiz")
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            {loading ? (
                <Loader text={languageText.Loading} />
            ) : (


                <motion.div
                    initial={{ opacity: 0, rotate: 180 }}
                    animate={{ opacity: 1, rotate: 0 }}
                    exit={{ opacity: 0, rotate: -180 }}
                    transition={{ duration: 0.8, ease: "linear", type: "spring", stiffness: 150 }}

                    className="max-w-md w-full bg-gradient-to-b from-whitetheme/50 to-whitetheme2/50 dark:from-darktheme/50 dark:to-darktheme2/50 rounded-lg shadow-md p-8">
                    <h1 className="text-4xl font-bold text-center mb-6 dark:text-whitetheme ">{languageText.JoinQuiz}</h1>

                    {/* {error && <div className="bg-red-50 text-red-600 p-3 rounded-md mb-4">{error}</div>} */}
                    <AnimatePresence>
                        <motion.form
                            variants={{
                                visible: { transition: { staggerChildren: 0.2 } },
                                exit: { transition: { staggerChildren: 0.1 } },
                            }}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            onSubmit={handleSubmit}
                            className="flex flex-col gap-4 rounded-xl items-center  bg-center bg-cover px-10">
                            {/* <div className="mb-4">
                        <label className="block text-gray-700 font-medium mb-2">Quiz Code</label>
                        <input
                            type="text"
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-center uppercase text-2xl tracking-wider"
                            placeholder="ENTER CODE"
                            maxLength="6"
                            required
                        />
                    </div> */}


                            <InputField
                                placeholder={languageText.QuizCode}
                                iconValue="solar:code-scan-bold"
                                icon="solar:code-scan-broken"
                                type="text"
                                language={language}
                                languageText={languageText}
                                required={true}
                                setValue={setCode}
                                regex={null}
                                value={code}
                            />
                            <InputField
                                placeholder={languageText.GroupName}
                                iconValue="mingcute:group-3-fill"
                                icon="mingcute:group-3-line"
                                type="text"
                                language={language}
                                languageText={languageText}
                                required={true}
                                setValue={setGroupName}
                                regex={null}
                                value={groupName}
                            />
                            {/* <div className="mb-6">
                        <label className="block text-gray-700 font-medium mb-2">Group Name</label>
                        <input
                            type="text"
                            value={groupName}
                            onChange={(e) => setGroupName(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter your group name"
                            required
                        />
                    </div> */}
                            <AnimatePresence mode="popLayout">
                                <div className="m-auto w-full flex justify-center">
                                    {error &&
                                        <ErrorContainer error={error} setError={setError} />}
                                </div>
                            </AnimatePresence>

                            <FormButton icon="hugeicons:quiz-02" text={languageText.JoinQuizButton} />
                            {/* <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 transition text-lg font-medium"
                        disabled={loading}
                    >
                        {loading ? "Joining..." : "Join Quiz"}
                    </button> */}
                        </motion.form>
                    </AnimatePresence>
                </motion.div>
            )}
        </div>
    )
}

export default JoinQuiz

