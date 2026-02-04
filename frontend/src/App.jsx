import { BrowserRouter, Routes, Route } from "react-router-dom"
import Login from "./pages/Login"
import Dashboard from "./pages/Dashboard"
import Register from "./pages/Register"
import AddLog from "./pages/AddLog"
import EditLog from "./pages/EditLog"

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/register" element={<Register />} />
        <Route path="/add-log" element={<AddLog />} />
        <Route path="/edit-log/:id" element={<EditLog />} />
      </Routes>
    </BrowserRouter>
  )
}
