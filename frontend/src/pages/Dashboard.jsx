import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import api from "../services/api"

export default function Dashboard() {
    const [stats, setStats] = useState(null)
    const [logs, setLogs] = useState([])
    const navigate = useNavigate()

    useEffect(() => {
        if (!localStorage.getItem("token")) {
            navigate("/")
            return
        }

        const fetchData = async () => {
            try {
                const [statsRes, logsRes] = await Promise.all([
                    api.get("/logs/stats"),
                    api.get("/logs")
                ])
                setStats(statsRes.data)
                setLogs(logsRes.data)
            } catch (error) {
                console.error("Failed to fetch data:", error)
            }
        }

        fetchData()
    }, [navigate])

    const handleLogout = () => {
        localStorage.removeItem("token")
        navigate("/")
    }

    if (!stats) return <div className="loading">Loading...</div>

    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <h1 className="dashboard-title">Problem Solving Dashboard</h1>
                <div className="dashboard-actions">
                    <button onClick={() => navigate("/add-log")} className="btn btn-success">
                        Add Problem
                    </button>
                    <button onClick={handleLogout} className="btn btn-danger">
                        Logout
                    </button>
                </div>
            </div>

            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-label">Total Problems</div>
                    <div className="stat-value">{stats.total}</div>
                </div>

                {Object.entries(stats.difficulty || {}).map(([difficulty, count]) => (
                    <div key={difficulty} className="stat-card">
                        <div className="stat-label">{difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}</div>
                        <div className={`stat-value ${difficulty}`}>
                            {count}
                        </div>
                    </div>
                ))}
            </div>

            <div>
                <h2 className="section-title">Recent Problems</h2>
                <div className="logs-grid">
                    {logs.slice(0, 10).map(log => (
                        <div key={log._id} className={`log-card ${log.difficulty}`}>
                            <div className="log-header">
                                <div>
                                    <h4 className="log-title">{log.title}</h4>
                                    <div className="log-meta">
                                        <span className="log-meta-item">{log.platform}</span>
                                        <span className="log-meta-item">•</span>
                                        <span className="log-meta-item">{log.difficulty}</span>
                                        <span className="log-meta-item">•</span>
                                        <span className="log-meta-item">{log.topic}</span>
                                    </div>
                                </div>
                                <div className="log-date">
                                    {new Date(log.date).toLocaleDateString()}
                                </div>
                            </div>
                            {log.notes && (
                                <div className="log-notes">
                                    {log.notes}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
