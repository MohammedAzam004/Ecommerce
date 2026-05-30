export const extractErrorMessage = (error, fallback = "Something went wrong. Please try again later.") => {
    if (error.response && error.response.data) {
        return error.response.data.message || error.response.data.error || fallback;
    }
    if (error.request) {
        return "Unable to connect to server. Please check your internet connection or try again later.";
    }
    return error.message || fallback;
};
