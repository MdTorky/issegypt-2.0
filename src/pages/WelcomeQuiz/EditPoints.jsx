import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import axios from "axios"
import Loader from "../../components/loaders/Loader"

const EditPoints = ({ api, languageText }) => {
    const { code } = useParams()
    const navigate = useNavigate()
    const [quiz, setQuiz] = useState(null)
    const [groups, setGroups] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    const [sortColumn, setSortColumn] = useState(null)
    const [sortOrder, setSortOrder] = useState("asc")

    useEffect(() => {
        fetchQuizAndGroups()
    }, [code])

    const fetchQuizAndGroups = async () => {
        try {
            const [quizResponse, groupsResponse] = await Promise.all([
                axios.get(`${api}/api/welcome/code/${code}`),
                axios.get(`${api}/api/welcome/results/${code}`),
            ])
            setQuiz(quizResponse.data)
            setGroups(groupsResponse.data)
            setLoading(false)
        } catch (err) {
            setError("Failed to load quiz data")
            setLoading(false)
        }
    }

    const handlePointChange = (groupId, questionIndex, points) => {
        setGroups((prevGroups) =>
            prevGroups.map((group) =>
                group._id === groupId
                    ? {
                        ...group,
                        answers: group.answers.map((answer, index) =>
                            index === questionIndex ? { ...answer, points: Number.parseInt(points) || 0 } : answer,
                        ),
                    }
                    : group,
            ),
        )
    }

    const savePoints = async () => {
        try {
            await axios.put(`${api}/api/welcome/edit-points/${code}`, { groups })
            navigate(`/editpoints/${code}`)
        } catch (err) {
            setError("Failed to save points")
        }
    }


    const handleSort = (questionIndex) => {
        const currentOrder = sortOrder[questionIndex] || "asc";
        const newOrder = currentOrder === "asc" ? "desc" : "asc";

        const sortedGroups = [...groups].sort((a, b) => {
            const timeA = a.answers[questionIndex]?.timeTaken || Infinity;
            const timeB = b.answers[questionIndex]?.timeTaken || Infinity;

            return newOrder === "asc" ? timeA - timeB : timeB - timeA;
        });

        setGroups(sortedGroups);
        setSortOrder({ ...sortOrder, [questionIndex]: newOrder });
    };


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

    return (
        <div className="min-h-screen p-6">
            <div className="w-fit mt-50 mx-auto">
                <h1 className="text-3xl font-bold mb-6 dark:text-whitetheme">Edit Points - {quiz.title}</h1>
                <div className=" bg-gradient-to-b from-whitetheme/50 to-whitetheme2/50 dark:from-darktheme/50 dark:to-darktheme2/50 dark:text-whitetheme rounded-lg shadow-md p-6">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-gray-50 dark:bg-darktheme">
                                <th className="px-4 py-2 text-left m-auto">Group</th>
                                {quiz.questions.map((question, index) => (
                                    <th
                                        key={index}
                                        className="px-4 py-2 text-center cursor-pointer hover:bg-gray-200 dark:hover:bg-darktheme2 transition m-auto "
                                        onClick={() => handleSort(index)}
                                    >
                                        <p>{question.text}</p>
                                        <p className="text-redtheme font-modernpro">{question.correctAnswer}</p>
                                        <p className="text-sm text-gray-500 flex items-center m-auto justify-center ">
                                            {sortOrder[index] === "asc" ? "▲" : "▼"}
                                        </p>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {groups.map((group) => (
                                <tr key={group._id} className="border-t">
                                    <td className="px-4 py-3 text-center">{group.name}</td>
                                    {quiz.questions.map((_, index) => (
                                        <td key={index} className="px-4 py-3 text-center m-auto">
                                            <p className="text-redtheme font-modernpro">{group.answers[index]?.answer}</p>
                                            <p className="text-emerald-600 font-modernpro">
                                                {group.answers[index]?.timeTaken
                                                    ? (group.answers[index].timeTaken / 1000).toFixed(2) + " sec"
                                                    : ""}
                                            </p>
                                            <input
                                                type="number"
                                                value={group.answers[index]?.points || 0}
                                                onChange={(e) => handlePointChange(group._id, index, e.target.value)}
                                                className="w-16 text-center border rounded"
                                            />
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="mt-6 flex justify-end">
                    <button
                        onClick={savePoints}
                        className="px-6 py-2 bg-redtheme text-white rounded-md hover:bg-redtheme2 duration-300 transition"
                    >
                        Save Points
                    </button>
                </div>
            </div>
        </div>
    )
}

export default EditPoints

