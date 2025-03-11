import { useAuthContext } from '../hooks/useAuthContext';


const UserType = (number) => {
    const { user } = useAuthContext()

    if (number === "Secretary") {

        return (user && (user.committee === "Secretary" || user.committee === "Admin"));
    }
    else if (number === "All") {
        return (user && (user.committee === "ISS Egypt" || user.committee === "Vice" || user.committee === "Treauerer" || user.committee === "Secretary" || user.committee === "Admin"));

    } else if (number === "Admin") {
        return (user && (user.committee === "Admin"));

    } else if (number === "Social") {

        return (user && (user.committee === "Social" || user.committee === "Admin"));
    }
};

export default UserType;