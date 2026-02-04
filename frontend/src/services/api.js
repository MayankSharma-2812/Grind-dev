import axios from "axios"

const api = axios.create({
    baseURL: "http://localhost:5000/api",
    timeout: 10000, // 10 second timeout
})

api.interceptors.request.use(config => {
    const token = localStorage.getItem("token")
    if (token) config.headers.Authorization = token
    return config
}, error => {
    return Promise.reject(error)
})

api.interceptors.response.use(
    response => response,
    error => {
        // Handle different error types
        if (error.code === 'ECONNABORTED') {
            error.message = "Request timed out. Please check your connection."
        } else if (error.response) {
            // Server responded with error status
            switch (error.response.status) {
                case 401:
                    error.message = "Unauthorized. Please login again."
                    localStorage.removeItem("token")
                    window.location.href = "/"
                    break
                case 403:
                    error.message = "Access denied."
                    break
                case 404:
                    error.message = "Resource not found."
                    break
                case 500:
                    error.message = "Server error. Please try again later."
                    break
                default:
                    error.message = error.response.data?.message || "Something went wrong"
            }
        } else if (error.request) {
            // Network error
            error.message = "Network error. Please check your connection."
        }

        return Promise.reject(error)
    }
)

export default api
