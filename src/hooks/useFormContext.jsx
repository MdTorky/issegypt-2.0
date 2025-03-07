import { FormsContext } from "../contexts/formContext"
import { useContext } from "react"

export const useFormsContext = () => {
    const context = useContext(FormsContext)

    if (!context) {
        throw Error('useFormsContext must be used inside an FormsContextProvider')
    }

    return context
}