import axios from "axios";

const API_URL = "http://localhost:5000/api/payments";

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
