import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import api from "../services/api"
import DeleteConfirmModal from "../components/DeleteConfirmModal"
import StreakCard from "../components/StreakCard"
import LongestStreakCard from "../components/LongestStreakCard"
import MissedDayIndicator from "../components/MissedDayIndicator"
import Charts from "../components/Charts"
import { EmptyDashboard, EmptyLogs, EmptyCharts } from "../components/EmptyStates"
import { SkeletonCard, SkeletonChart, SkeletonLogCard, FullPageLoader } from "../components/LoadingStates"
import ErrorBoundary from "../components/ErrorBoundary"
import { useApi } from "../hooks/useApi"
import ThemeToggle from "../components/ThemeToggle"

export default function Dashboard() {
    const [stats, setStats] = useState(null)
    const [logs, setLogs] = useState([])
    const [deleteModal, setDeleteModal] = useState({ isOpen: false, logId: null, logTitle: "" })
    const [initialLoading, setInitialLoading] = useState(true)
    const navigate = useNavigate()
    const { execute: deleteLog, loading: deleteLoading } = useApi()

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
            } finally {
                setInitialLoading(false)
            }
        }

        fetchData()
    }, [navigate])

    const handleLogout = () => {
        localStorage.removeItem("token")
        navigate("/")
    }

    const handleDelete = async (logId) => {
        try {
            await deleteLog(() => api.delete(`/logs/${logId}`))
            setLogs(logs.filter(log => log._id !== logId))
            // Refresh stats
            const statsRes = await api.get("/logs/stats")
            setStats(statsRes.data)
        } catch (error) {
            console.error("Failed to delete log:", error)
        }
    }

    const openDeleteModal = (logId, logTitle) => {
        setDeleteModal({ isOpen: true, logId, logTitle })
    }

    const closeDeleteModal = () => {
        setDeleteModal({ isOpen: false, logId: null, logTitle: "" })
    }

    if (initialLoading) {
        return (
            <div className="dashboard-container">
                <div className="dashboard-header">
                    <h1 className="dashboard-title">Problem Solving Dashboard</h1>
                    <div className="dashboard-actions">
                        <button onClick={() => navigate("/add-log")} className="btn btn-success">
                            Add Problem
                        </button>
                        <ThemeToggle />
                        <button onClick={handleLogout} className="btn btn-danger">
                            Logout
                        </button>
                    </div>
                </div>

                <div className="stats-grid">
                    <SkeletonCard />
                    <SkeletonCard />
                    <SkeletonCard />
                    <SkeletonCard />
                    <SkeletonCard />
                    <SkeletonCard />
                </div>

                <div className="charts-grid">
                    <SkeletonChart />
                    <SkeletonChart />
                    <SkeletonChart />
                </div>

                <div>
                    <h2 className="section-title">Recent Problems</h2>
                    <div className="logs-grid">
                        <SkeletonLogCard />
                        <SkeletonLogCard />
                        <SkeletonLogCard />
                    </div>
                </div>
            </div>
        )
    }

    if (!stats) {
        return <FullPageLoader />
    }

    // Check if user has no data
    const hasNoData = stats.total === 0 && logs.length === 0
    const hasNoLogs = logs.length === 0

    return (
        <ErrorBoundary>
            <div className="dashboard-container">
                <div className="dashboard-header">
                    <h1 className="dashboard-title">Problem Solving Dashboard</h1>
                    <div className="dashboard-actions">
                        <button onClick={() => navigate("/add-log")} className="btn btn-success">
                            Add Problem
                        </button>
                        <ThemeToggle />
                        <button onClick={handleLogout} className="btn btn-danger">
                            Logout
                        </button>
                    </div>
                </div>

                {hasNoData ? (
                    <EmptyDashboard />
                ) : (
                    <>
                        <div className="stats-grid">
                            <div className="stat-card">
                                <div className="stat-label">Total Problems</div>
                                <div className="stat-value">{stats.total}</div>
                            </div>

                            <StreakCard />
                            <LongestStreakCard />
                            <MissedDayIndicator />

                            {Object.entries(stats.difficulty || {}).map(([difficulty, count]) => (
                                <div key={difficulty} className="stat-card">
                                    <div className="stat-label">{difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}</div>
                                    <div className={`stat-value ${difficulty}`}>
                                        {count}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {hasNoLogs ? (
                            <EmptyCharts />
                        ) : (
                            <Charts />
                        )}

                        <div>
                            <h2 className="section-title">Recent Problems</h2>
                            {hasNoLogs ? (
                                <EmptyLogs />
                            ) : (
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
                                            <div className="log-actions" style={{ marginTop: "12px", display: "flex", gap: "8px" }}>
                                                <button
                                                    onClick={() => navigate(`/edit-log/${log._id}`)}
                                                    className="btn btn-primary"
                                                    style={{ padding: "6px 12px", fontSize: "0.875rem" }}
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => openDeleteModal(log._id, log.title)}
                                                    className="btn btn-danger"
                                                    disabled={deleteLoading}
                                                    style={{ padding: "6px 12px", fontSize: "0.875rem" }}
                                                >
                                                    {deleteLoading ? "Deleting..." : "Delete"}
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </>
                )}

                <DeleteConfirmModal
                    isOpen={deleteModal.isOpen}
                    onClose={closeDeleteModal}
                    onConfirm={() => handleDelete(deleteModal.logId)}
                    logTitle={deleteModal.logTitle}
                />
            </div>
        </ErrorBoundary>
    )
}
