import { Navigate, Outlet } from "react-router-dom";
import { useEffect } from "react";
import { toast } from "react-toastify";

const AdminRoute = () => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));

    useEffect(() => {
        if (!userInfo) {
            toast.warning("Please login to continue");
        } else if (!userInfo.user || !userInfo.user.isAdmin) {
            toast.error("Unauthorized access");
        }
    }, [userInfo]);

    return userInfo && userInfo.user && userInfo.user.isAdmin ? (
        <Outlet />
    ) : userInfo ? (
        <Navigate to="/" replace />
    ) : (
        <Navigate to="/login" replace />
    );
};

export default AdminRoute;
