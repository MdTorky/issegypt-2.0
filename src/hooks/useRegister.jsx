import { useState } from 'react'
import { useAuthContext } from './useAuthContext'
import { useSuccessMessage } from "../contexts/successMessageContext";

export const useRegister = (api, languageText) => {
    const [registerError, setRegisterError] = useState(null)
    const [registerLoading, setRegisterLoading] = useState(null)
    const [registerSuccess, setRegisterSuccess] = useState(null)
    const { showSuccessMessage } = useSuccessMessage();

    const { dispatch } = useAuthContext()

    const register = async (email, password, committee, type) => {
        setRegisterLoading(true)
        setRegisterError(null)
        const response = await fetch(`${api}/api/user/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password, committee, type })
        })
        const json = await response.json()
        if (!response.ok) {
            setRegisterLoading(false)
            setRegisterError(json.error)
        }

        if (response.ok) {
            localStorage.setItem('user', JSON.stringify(json))

            dispatch({ type: 'LOGIN', payload: json })
            // setRegisterSuccess(languageText.RegisterSuccesMessage)
            showSuccessMessage(languageText.RegisterSuccesMessage);

            setRegisterLoading(false)
        }
    }

    return { register, registerLoading, setRegisterError, registerError, }
}