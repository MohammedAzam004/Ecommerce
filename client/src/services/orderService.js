import axios from "axios";
import { API_BASE_URL } from "../utils/config";

const API_URL = `${API_BASE_URL}/api/orders`;

export const placeOrder = async (
    orderData,
    token
) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };

    const response = await axios.post(
        API_URL,
        orderData,
        config
    );

    return response.data;
};

export const getMyOrders = async (token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };

    const response = await axios.get(
        `${API_URL}/myorders`,
        config
    );

    return response.data;
};