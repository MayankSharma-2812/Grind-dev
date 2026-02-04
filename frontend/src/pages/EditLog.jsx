import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import api from "../services/api"

export default function EditLog() {
  const [formData, setFormData] = useState({
    platform: "",
    title: "",
    difficulty: "easy",
    topic: "",
    notes: "",
    date: ""
  })
  const [loading, setLoading] = useState(true)
  const { id } = useParams()
  const navigate = useNavigate()

  useEffect(() => {
    const fetchLog = async () => {
      try {
        const res = await api.get(`/logs`)
        const log = res.data.find(l => l._id === id)
        if (log) {
          setFormData({
            platform: log.platform,
            title: log.title,
            difficulty: log.difficulty,
            topic: log.topic,
            notes: log.notes || "",
            date: new Date(log.date).toISOString().split('T')[0]
          })
        } else {
          navigate("/dashboard")
        }
      } catch (error) {
        console.error("Failed to fetch log:", error)
        navigate("/dashboard")
      } finally {
        setLoading(false)
      }
    }

    fetchLog()
  }, [id, navigate])

  const submit = async (e) => {
    e.preventDefault()
    try {
      await api.put(`/logs/${id}`, formData)
      navigate("/dashboard")
    } catch (error) {
      alert("Failed to update log")
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  if (loading) return <div className="loading">Loading...</div>

  return (
    <div className="add-log-container">
      <div className="add-log-header">
        <h1 className="add-log-title">Edit Problem Log</h1>
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
            Update Log
          </button>
          <button type="button" onClick={() => navigate("/dashboard")} className="btn btn-secondary">
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}
