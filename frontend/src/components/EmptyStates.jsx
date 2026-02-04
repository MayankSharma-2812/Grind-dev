import { useNavigate } from "react-router-dom"

export function EmptyDashboard() {
  const navigate = useNavigate()

  return (
    <div className="empty-state-container">
      <div className="empty-state-content">
        <div className="empty-icon">📚</div>
        <h2 className="empty-title">No problems logged yet</h2>
        <p className="empty-description">
          Start tracking your problem-solving journey by adding your first problem!
        </p>
        <button 
          onClick={() => navigate("/add-log")}
          className="btn btn-primary empty-action-btn"
        >
          Add Your First Problem
        </button>
      </div>
    </div>
  )
}

export function EmptyLogs() {
  const navigate = useNavigate()

  return (
    <div className="empty-state-section">
      <div className="empty-state-content">
        <div className="empty-icon">🔍</div>
        <h3 className="empty-title">No problems found</h3>
        <p className="empty-description">
          Start by adding your first problem to see it here!
        </p>
        <button 
          onClick={() => navigate("/add-log")}
          className="btn btn-primary empty-action-btn"
        >
          Add Problem
        </button>
      </div>
    </div>
  )
}

export function EmptyCharts() {
  return (
    <div className="empty-state-section">
      <div className="empty-state-content">
        <div className="empty-icon">📊</div>
        <h3 className="empty-title">No data to visualize</h3>
        <p className="empty-description">
          Add some problems to see beautiful charts and analytics!
        </p>
      </div>
    </div>
  )
}

export function EmptyStreak() {
  return (
    <div className="empty-streak">
      <div className="empty-streak-icon">🔥</div>
      <div className="empty-streak-text">Start your streak!</div>
    </div>
  )
}

export function EmptyStats() {
  return (
    <div className="empty-stats">
      <div className="empty-stats-icon">📈</div>
      <div className="empty-stats-text">No stats yet</div>
    </div>
  )
}
