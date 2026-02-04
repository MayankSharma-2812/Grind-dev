import { useState } from "react"
import api from "../services/api"

export default function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const submit = async () => {
    const res = await api.post("/auth/login", { email, password })
    localStorage.setItem("token", res.data.token)
    location.href = "/dashboard"
  }

  return (
  <div style={{ minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
    <div style={{ display: "flex", gap: "10px" }}>
      <input placeholder="Email" onChange={e => setEmail(e.target.value)} />
      <input placeholder="Password" type="password" onChange={e => setPassword(e.target.value)} />
      <button onClick={submit}>Login</button>
    </div>
  </div>
)

}
