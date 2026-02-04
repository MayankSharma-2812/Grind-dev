import { useState } from "react"
import { useNavigate } from "react-router-dom"
import api from "../services/api"
import { LoadingButton } from "../components/LoadingStates"
import { useApi } from "../hooks/useApi"

export default function Login() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const navigate = useNavigate()
    const { execute: login, loading, error } = useApi()

    const submit = async () => {
        try {
            const res = await login(() => api.post("/auth/login", { email, password }))
            localStorage.setItem("token", res.token)
            navigate("/dashboard")
        } catch (error) {
            // Error is handled by useApi hook
        }
    }

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h2>Login</h2>
                <form className="auth-form" onSubmit={(e) => { e.preventDefault(); submit(); }}>
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            id="email"
                            type="email"
                            placeholder="Enter your email"
                            onChange={e => setEmail(e.target.value)}
                            className="form-input"
                            required
                            disabled={loading}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            id="password"
                            type="password"
                            placeholder="Enter your password"
                            onChange={e => setPassword(e.target.value)}
                            className="form-input"
                            required
                            disabled={loading}
                        />
                    </div>
                    {error && (
                        <div className="error-message">
                            {error}
                        </div>
                    )}
                    <LoadingButton
                        type="submit"
                        className="btn btn-primary"
                        loading={loading}
                        disabled={!email || !password}
                    >
                        Login
                    </LoadingButton>
                </form>
                <div className="auth-links">
                    <p>Don't have an account? <a href="/register">Register</a></p>
                </div>
            </div>
        </div>
    )
}
