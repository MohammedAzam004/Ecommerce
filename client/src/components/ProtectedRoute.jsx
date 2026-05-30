import { Navigate, Outlet } from "react-router-dom";
import { useEffect } from "react";
import { toast } from "react-toastify";

const ProtectedRoute = () => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));

    useEffect(() => {
        if (!userInfo) {
            toast.warning("Please login to continue");
        }
    }, [userInfo]);

    return userInfo ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
