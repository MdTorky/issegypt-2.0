import { useAuthContext } from "./useAuthContext"
import { useState } from "react";

export const useLogout = (languageText) => {

    const { dispatch } = useAuthContext()
    const [logoutSuccess, setLogoutSuccess] = useState(null)

    const logout = () => {
        localStorage.removeItem('user')


        dispatch({
            type: 'LOGOUT',
        })
        setLogoutSuccess(languageText.LogoutSuccesMessage)

    }

    return { logout, logoutSuccess, setLogoutSuccess }

}

