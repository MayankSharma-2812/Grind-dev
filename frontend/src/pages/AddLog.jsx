import { useState } from "react"
import { useNavigate } from "react-router-dom"
import api from "../services/api"

export default function AddLog() {
  const [formData, setFormData] = useState({
    platform: "",
    title: "",
    difficulty: "easy",
    topic: "",
    notes: "",
    date: new Date().toISOString().split('T')[0]
  })
  const navigate = useNavigate()

  const submit = async (e) => {
    e.preventDefault()
    try {
      await api.post("/logs", formData)
      navigate("/dashboard")
    } catch (error) {
      alert("Failed to add log")
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div className="add-log-container">
      <div className="add-log-header">
        <h1 className="add-log-title">Add Problem Log</h1>
      </div>
      <form onSubmit={submit} className="add-log-form">
        <div className="form-group">
          <label htmlFor="platform">Platform</label>
          <input
            type="text"
            id="platform"
            name="platform"
            value={formData.platform}
            onChange={handleChange}
            required
            className="form-input"
            placeholder="e.g., LeetCode, HackerRank, Codeforces"
          />
        </div>

        <div className="form-group">
          <label htmlFor="title">Problem Title</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="form-input"
            placeholder="Enter problem title"
          />
        </div>

        <div className="form-group">
          <label htmlFor="difficulty">Difficulty</label>
          <select
            id="difficulty"
            name="difficulty"
            value={formData.difficulty}
            onChange={handleChange}
            className="form-select"
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="topic">Topic</label>
          <input
            type="text"
            id="topic"
            name="topic"
            value={formData.topic}
            onChange={handleChange}
            required
            className="form-input"
            placeholder="e.g., Arrays, Dynamic Programming, Graphs"
          />
        </div>

        <div className="form-group">
          <label htmlFor="notes">Notes</label>
          <textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            className="form-input form-textarea"
            placeholder="Add any notes about your solution approach, challenges faced, etc."
          />
        </div>

        <div className="form-group">
          <label htmlFor="date">Date</label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
            className="form-input"
          />
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary">
            Add Log
          </button>
          <button type="button" onClick={() => navigate("/dashboard")} className="btn btn-secondary">
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}
