import { useState } from 'react'
import { useAuthContext } from './useAuthContext'
import { useSuccessMessage } from "../contexts/successMessageContext";

export const useLogin = (api, languageText) => {
    const [loginError, setLoginError] = useState(null)
    const [loginLoading, setLoginLoading] = useState(null)
    // const [loginSuccess, setLoginSuccess] = useState(null)
    const { showSuccessMessage } = useSuccessMessage();

    const { dispatch } = useAuthContext()

    const login = async (email, password) => {
        setLoginLoading(true)
        setLoginError(null)
        const response = await fetch(`${api}/api/user/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        })
        const json = await response.json()
        if (!response.ok) {
            setLoginLoading(false)
            setLoginError(json.error)
        }

        if (response.ok) {
            localStorage.setItem('user', JSON.stringify(json))

            dispatch({ type: 'LOGIN', payload: json })
            showSuccessMessage(languageText.LoginSuccesMessage);
            setLoginLoading(false)
        }
    }

    return { login, loginLoading, loginError, setLoginError }
}