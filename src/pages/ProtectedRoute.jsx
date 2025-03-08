import { useEffect } from "react";
import { useAuthContext } from "../hooks/useAuthContext"; // Adjust path
import { useLocation, useNavigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
    const { user } = useAuthContext();
    const navigate = useNavigate();
    const location = useLocation(); // Get the current URL

    useEffect(() => {
        if (!user) {
            // Save the last route before redirecting to login
            localStorage.setItem("lastRoute", location.pathname);
            navigate("/auth/login", { replace: true });
        }
    }, [user, navigate, location]);

    return user ? children : null;
};

export default ProtectedRoute;
