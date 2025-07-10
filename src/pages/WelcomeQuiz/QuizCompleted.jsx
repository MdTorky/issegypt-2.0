import { Link } from "react-router-dom"

const QuizCompleted = ({ languageText }) => {
    return (
        <div className="min-h-screen flex items-center justify-center  ">
            <div className="bg-gradient-to-b from-whitetheme/50 to-whitetheme2/50 dark:from-darktheme/50 dark:to-darktheme2/50  py-10 p-3 rounded-lg shadow-md text-center w-[80%] m-auto">
                <h1 className="text-5xl font-bold mb-4 text-redtheme">{languageText.QuizCompleted}</h1>
                <p className="mb-3 text-xl dark:text-whitetheme">{languageText.ThanksForAnswers}</p>
                {/* <p className="mb-8 text-sm w-[80%] m-auto text-gray-700 dark:text-gray-400">{languageText.ResultsReleased}</p> */}
                <Link to="/" className="bg-redtheme text-white px-6 py-2 rounded hover:bg-redtheme2 transition-colors duration-300 ease-in-out">
                    {languageText.ExploreNewWebsite}
                </Link>
            </div>
        </div>
    )
}

export default QuizCompleted

