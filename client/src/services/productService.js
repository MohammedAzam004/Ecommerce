import axios from "axios";
import { API_BASE_URL } from "../utils/config";

const API_URL = `${API_BASE_URL}/api/products`;

export const getProducts = async (
    keyword = "",
    category = "",
    min = "",
    max = "",
    pageNumber = "",
    random = "",
    limit = ""
) => {
    const response = await axios.get(
        `${API_URL}?keyword=${keyword}&category=${category}&minPrice=${min}&maxPrice=${max}&pageNumber=${pageNumber}&random=${random}&limit=${limit}`
    );

    return response.data;
};

export const getProductById = async (id) => {
    const response = await axios.get(
        `${API_BASE_URL}/api/products/${id}`
    );

    return response.data;
};