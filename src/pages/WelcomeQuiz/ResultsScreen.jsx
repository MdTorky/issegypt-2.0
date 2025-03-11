"use client"

import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import axios from "axios"
import Loader from "../../components/loaders/Loader"
import { AnimatePresence, motion } from "motion/react"

const ResultsScreen = ({ api, languageText }) => {
    const { code } = useParams()
    const [quiz, setQuiz] = useState(null)
    const [groups, setGroups] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    useEffect(() => {
        const fetchResults = async () => {
            try {
                // Fetch quiz details
                const quizResponse = await axios.get(`${api}/api/welcome/code/${code}`)
                setQuiz(quizResponse.data)

                // Fetch results
                const resultsResponse = await axios.get(`${api}/api/welcome/results/${code}`)
                setGroups(resultsResponse.data.sort((a, b) => b.totalPoints - a.totalPoints))

                setLoading(false)
            } catch (err) {
                setError("Failed to load results")
                setLoading(false)
            }
        }

        fetchResults()
    }, [code])

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader text={languageText.Loading} />
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
        <div className="min-h-screen py-30">
            <div className="max-w-4xl mx-auto">
                <div className=" bg-gradient-to-b from-whitetheme/60 to-whitetheme/60 dark:from-darktheme/50 dark:to-darktheme2/50 rounded-lg shadow-md p-6 mb-6">
                    <h1 className="text-6xl font-bold text-center mb-2 text-redtheme">{quiz.title}</h1>
                    <p className="text-center text-2xl text-gray-600 mb-8">Finally, Final Results</p>

                    {groups.length === 0 ? (
                        <p className="text-center text-gray-600">No groups participated in this quiz.</p>
                    ) : (
                        <div className="space-y-6">
                            {/* Top 3 Winners */}
                            <div className="flex justify-center items-end space-x-4 mb-12">
                                {groups.length > 1 && (
                                    <motion.div

                                        initial={{ y: 100, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{ duration: 0.5, type: "spring", stiffness: 100, delay: 4 }}
                                        className="text-center">
                                        <div className="w-20 h-20 flex items-center justify-center bg-[#b5b7bb] ring-4 ring-[#B5B7bb] border-2 border-whitetheme dark:border-darktheme2 rounded-full mx-auto mb-4">
                                            <span className="text-2xl font-bold">{groups[1].name.charAt(0)}</span>
                                        </div>
                                        <div className="w-24 h-32 bg-[#B5B7bb] ring-4 ring-[#B5B7bb] border-2 border-whitetheme dark:border-darktheme2 rounded-t-lg flex items-center justify-center relative">
                                            <div className="absolute m-auto flex justify-center right-0 bottom-34 rounded-full bg-[#757575] w-fit left-0  text-center ">
                                                <div className="inline-block bg-silver text-white text-xs px-3 py-1 rounded-full">2nd</div>
                                            </div>
                                            <div className="text-center">
                                                <div className="font-bold truncate px-2">{groups[1].name}</div>
                                                <div className="text-2xl font-bold">{groups[1].totalPoints}</div>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                                {/* 1st Place */}
                                <motion.div
                                    initial={{ scale: 0, rotate: 180, opacity: 0 }}
                                    animate={{ scale: 1, rotate: 0, opacity: 1 }}
                                    transition={{ duration: 0.5, type: "spring", stiffness: 100, delay: 7 }}

                                    className="text-center">
                                    <div className="w-24 h-24 flex items-center justify-center bg-[#FFBF00] ring-4 ring-[#FFBF00] border-2 border-whitetheme dark:border-darktheme2 rounded-full mx-auto mb-4">
                                        <span className="text-4xl font-bold">{groups[0].name.charAt(0)}</span>
                                    </div>
                                    <div className="w-32 h-40  bg-[#FFBF00] ring-4 ring-[#FFBF00] border-2 border-whitetheme dark:border-darktheme2 rounded-t-lg flex items-center justify-center relative">
                                        <div className="absolute top-0 left-0 w-full text-center -mt-9">
                                            <div className="inline-block bg-yellow-500 text-white text-sm px-4 py-1 rounded-full">1st</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="font-bold truncate px-2">{groups[0].name}</div>
                                            <div className="text-5xl font-bold">{groups[0].totalPoints}</div>
                                        </div>
                                    </div>
                                </motion.div>

                                {/* 3rd Place */}
                                {groups.length > 2 && (
                                    <motion.div
                                        initial={{ y: -100, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{ duration: 0.5, type: "spring", stiffness: 100, delay: 2 }}
                                        className="text-center">
                                        <div className="w-16 h-16 flex items-center justify-center  bg-amber-700 ring-4 ring-amber-700 border-2 border-whitetheme dark:border-darktheme2 rounded-full mx-auto mb-4">
                                            <span className="text-xl font-bold">{groups[2].name.charAt(0)}</span>
                                        </div>
                                        <div className="w-20 h-24 bg-amber-700 ring-4 ring-amber-700 border-2 border-whitetheme dark:border-darktheme2  rounded-t-lg flex items-center justify-center relative">
                                            <div className="absolute top-0 left-0 w-full text-center -mt-9">
                                                <div className="inline-block bg-amber-800 text-white text-xs px-3 py-1 rounded-full">3rd</div>
                                            </div>
                                            <div className="text-center">
                                                <div className="font-bold truncate px-1">{groups[2].name}</div>
                                                <div className="text-xl font-bold">{groups[2].totalPoints}</div>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </div>

                            {/* All Results */}
                            <motion.div
                                initial={{ y: -100, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ duration: 0.5, type: "spring", stiffness: 100, delay: 9 }}
                            >
                                <h2 className="text-xl text-end font-modernpro font-semibold mb-4 dark:text-whitetheme text-redtheme">دي كل نقطكم اللي تكسف</h2>
                                <div className="overflow-hidden rounded-lg border border-gray-200 dark:text-whitetheme">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="bg-gray-50 dark:text-darktheme2">
                                                <th className="px-4 py-3 text-left">Rank</th>
                                                <th className="px-4 py-3 text-left">Group</th>
                                                <th className="px-4 py-3 text-right">Points</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {groups.map((group, index) => (
                                                <tr key={group._id} className="border-t">
                                                    <td className="px-4 py-3 font-medium">{index + 1}</td>
                                                    <td className="px-4 py-3">{group.name}</td>
                                                    <td className="px-4 py-3 text-right font-bold">{group.totalPoints}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </motion.div>
                        </div>
                    )}

                    {/* <div className="mt-8 text-center">
                        <Link
                            to="/"
                            className="inline-block py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                        >
                            Back to Home
                        </Link>
                    </div> */}
                </div>
            </div>
        </div>
    )
}

export default ResultsScreen

