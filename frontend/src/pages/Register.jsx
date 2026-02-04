import { useState } from "react"
import { useNavigate } from "react-router-dom"
import api from "../services/api"

export default function Register() {
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const navigate = useNavigate()

    const submit = async () => {
        try {
            await api.post("/auth/register", { name, email, password })
            navigate("/")
        } catch (error) {
            alert("Registration failed")
        }
    }

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h2>Register</h2>
                <form className="auth-form" onSubmit={(e) => { e.preventDefault(); submit(); }}>
                    <div className="form-group">
                        <label htmlFor="name">Name</label>
                        <input
                            id="name"
                            type="text"
                            placeholder="Enter your name"
                            onChange={e => setName(e.target.value)}
                            className="form-input"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            id="email"
                            type="email"
                            placeholder="Enter your email"
                            onChange={e => setEmail(e.target.value)}
                            className="form-input"
                            required
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
                        />
                    </div>
                    <button type="submit" className="btn btn-primary">
                        Register
                    </button>
                </form>
                <div className="auth-links">
                    <p>Already have an account? <a href="/">Login</a></p>
                </div>
            </div>
        </div>
    )
}
