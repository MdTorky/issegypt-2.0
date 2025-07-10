import { useState } from "react"
import axios from "axios"

const CreateQuiz = ({ api }) => {
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [showAnswersAfterEach, setShowAnswersAfterEach] = useState(false)
    const [questions, setQuestions] = useState([
        {
            text: "",
            correctAnswer: "",
            timeLimit: 60,
            questionType: "open",
            options: []
        }
    ])
    const [loading, setLoading] = useState(false)
    const [quiz, setQuiz] = useState(null)
    const [error, setError] = useState("")

    const colors = ["red", "blue", "green", "yellow"]

    const handleQuestionChange = (index, field, value) => {
        const updatedQuestions = [...questions]
        updatedQuestions[index][field] = value
        setQuestions(updatedQuestions)
    }

    const handleQuestionTypeChange = (index, value) => {
        const updatedQuestions = [...questions]
        updatedQuestions[index].questionType = value

        // Initialize options for multiple choice questions
        if (value === "multiple_choice" && (!updatedQuestions[index].options || updatedQuestions[index].options.length === 0)) {
            updatedQuestions[index].options = colors.map((color) => ({
                text: "",
                color
            }))
        }

        setQuestions(updatedQuestions)
    }

    const handleOptionChange = (questionIndex, optionIndex, value) => {
        const updatedQuestions = [...questions]
        updatedQuestions[questionIndex].options[optionIndex].text = value
        setQuestions(updatedQuestions)
    }

    const setCorrectOption = (questionIndex, optionIndex) => {
        const updatedQuestions = [...questions]
        const optionText = updatedQuestions[questionIndex].options[optionIndex].text
        updatedQuestions[questionIndex].correctAnswer = optionText
        setQuestions(updatedQuestions)
    }

    const addQuestion = () => {
        setQuestions([...questions, {
            text: "",
            correctAnswer: "",
            timeLimit: 60,
            questionType: "open",
            options: []
        }])
    }

    const removeQuestion = (index) => {
        if (questions.length > 1) {
            const updatedQuestions = [...questions]
            updatedQuestions.splice(index, 1)
            setQuestions(updatedQuestions)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError("")
        try {
            const response = await axios.post(`${api}/api/welcome/create`, {
                title,
                description,
                questions,
                showAnswersAfterEach
            })
            setQuiz(response.data)
            setLoading(false)
        } catch (err) {
            setError(err.response?.data?.error || "Failed to create quiz")
            setLoading(false)
        }
    }

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6">Create a New Quiz</h1>
            {quiz ? (
                <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
                    <h2 className="text-xl font-semibold mb-2">Quiz Created Successfully!</h2>
                    <p className="mb-2">
                        Title: <span className="font-medium">{quiz.title}</span>
                    </p>
                    <p className="mb-4">
                        Join Code: <span className="font-bold text-xl bg-blue-100 px-2 py-1 rounded">{quiz.code}</span>
                    </p>
                    <p>Share this code with participants to join your quiz.</p>
                    <div className="mt-4">
                        <a
                            href={`/host/${quiz.code}`}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                        >
                            Go to Host Screen
                        </a>
                    </div>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
                    {error && <div className="bg-red-50 text-red-600 p-3 rounded-md mb-4">{error}</div>}
                    <div className="mb-4">
                        <label className="block text-gray-700 font-medium mb-2">Quiz Title</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-700 font-medium mb-2">Description (Optional)</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            rows="2"
                        />
                    </div>
                    <div className="mb-6">
                        <label className="inline-flex items-center">
                            <input
                                type="checkbox"
                                checked={showAnswersAfterEach}
                                onChange={(e) => setShowAnswersAfterEach(e.target.checked)}
                                className="form-checkbox h-5 w-5 text-blue-600"
                            />
                            <span className="ml-2 text-gray-700">Show correct answer after each question</span>
                        </label>
                    </div>
                    <h2 className="text-xl font-semibold mb-4">Questions</h2>
                    {questions.map((question, index) => (
                        <div key={index} className="mb-8 p-4 border border-gray-200 rounded-lg bg-gray-50">
                            <div className="flex justify-between items-center mb-3">
                                <h3 className="font-medium">Question {index + 1}</h3>
                                <button
                                    type="button"
                                    onClick={() => removeQuestion(index)}
                                    className="text-red-600 hover:text-red-800"
                                    disabled={questions.length === 1}
                                >
                                    Remove
                                </button>
                            </div>
                            <div className="mb-3">
                                <label className="block text-gray-700 mb-1">Question Type</label>
                                <select
                                    value={question.questionType}
                                    onChange={(e) => handleQuestionTypeChange(index, e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="open">Open-ended</option>
                                    <option value="multiple_choice">Multiple Choice</option>
                                </select>
                            </div>
                            <div className="mb-3">
                                <label className="block text-gray-700 mb-1">Question Text</label>
                                <input
                                    type="text"
                                    value={question.text}
                                    onChange={(e) => handleQuestionChange(index, "text", e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>

                            {question.questionType === "open" ? (
                                <div className="mb-3">
                                    <label className="block text-gray-700 mb-1">Correct Answer</label>
                                    <input
                                        type="text"
                                        value={question.correctAnswer}
                                        onChange={(e) => handleQuestionChange(index, "correctAnswer", e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                </div>
                            ) : (
                                <div className="mb-3">
                                    <label className="block text-gray-700 mb-1">Options</label>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        {question.options.map((option, optionIndex) => (
                                            <div
                                                key={optionIndex}
                                                className={`p-3 rounded-md border-2 ${question.correctAnswer === option.text && option.text !== ""
                                                    ? "border-green-500"
                                                    : "border-gray-200"
                                                    }`}
                                                style={{ backgroundColor: `${option.color}30` }}
                                            >
                                                <div className="flex items-center">
                                                    <div
                                                        className={`w-4 h-4 rounded-full mr-2`}
                                                        style={{ backgroundColor: option.color }}
                                                    ></div>
                                                    <input
                                                        type="text"
                                                        value={option.text}
                                                        onChange={(e) => handleOptionChange(index, optionIndex, e.target.value)}
                                                        className="flex-1 px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                                                        placeholder={`Option ${optionIndex + 1}`}
                                                        required={question.questionType === "multiple_choice"}
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => setCorrectOption(index, optionIndex)}
                                                        className={`ml-2 px-2 py-1 rounded-md text-xs ${question.correctAnswer === option.text && option.text !== ""
                                                            ? "bg-green-500 text-white"
                                                            : "bg-gray-200 text-gray-700"
                                                            }`}
                                                    >
                                                        Correct
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    {!question.correctAnswer && question.options.some(o => o.text) && (
                                        <p className="text-red-500 text-sm mt-2">Please select a correct answer</p>
                                    )}
                                </div>
                            )}

                            <div>
                                <label className="block text-gray-700 mb-1">Time Limit (seconds)</label>
                                <input
                                    type="number"
                                    value={question.timeLimit}
                                    onChange={(e) => handleQuestionChange(index, "timeLimit", Number.parseInt(e.target.value))}
                                    min="10"
                                    max="300"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={addQuestion}
                        className="mb-6 px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition"
                    >
                        + Add Question
                    </button>
                    <div>
                        <button
                            type="submit"
                            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition"
                            disabled={loading}
                        >
                            {loading ? "Creating..." : "Create Quiz"}
                        </button>
                    </div>
                </form>
            )}
        </div>
    )
}

export default CreateQuiz