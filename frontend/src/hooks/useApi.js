import { useState } from "react"
import api from "../services/api"

export function useApi() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const execute = async (apiCall, options = {}) => {
    const { 
      onSuccess, 
      onError, 
      showLoading = true, 
      showError = true,
      errorMessage = "Something went wrong" 
    } = options

    try {
      if (showLoading) {
        setLoading(true)
        setError(null)
      }

      const response = await apiCall()
      
      if (onSuccess) {
        onSuccess(response.data)
      }
      
      return response.data
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || errorMessage
      setError(errorMsg)
      
      if (showError) {
        if (onError) {
          onError(errorMsg)
        } else {
          // Default error handling - could show toast or alert
          console.error("API Error:", errorMsg)
        }
      }
      
      throw err
    } finally {
      if (showLoading) {
        setLoading(false)
      }
    }
  }

  const clearError = () => setError(null)

  return { execute, loading, error, clearError }
}
