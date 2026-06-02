import axios from "axios";
import { API_BASE_URL } from "../utils/config";

const API_URL = `${API_BASE_URL}/api/payments`;

export const createPaymentOrder = async (amount) => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    const token = userInfo ? userInfo.token : "";
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };

    const response = await axios.post(
        `${API_URL}/create`,
        { amount },
        config
    );

    return response.data;
};
