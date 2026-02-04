import { useEffect, useState } from "react"
import api from "../services/api"

export default function MissedDayIndicator() {
  const [streak, setStreak] = useState({ missedDays: [], lastMissedDay: null })
  const [loading, setLoading] = useState(true)
  const [showDetails, setShowDetails] = useState(false)

  useEffect(() => {
    const fetchStreak = async () => {
      try {
        const res = await api.get("/logs/streak")
        setStreak(res.data)
      } catch (error) {
        console.error("Failed to fetch streak:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchStreak()
  }, [])

  if (loading) {
    return (
      <div className="stat-card">
        <div className="stat-label">Consistency</div>
        <div className="stat-value">...</div>
      </div>
    )
  }

  const getMissedEmoji = (missedCount) => {
    if (missedCount === 0) return "✅"
    if (missedCount <= 2) return "⚠️"
    if (missedCount <= 5) return "😟"
    if (missedCount <= 10) return "😔"
    return "💔"
  }

  const getConsistencyMessage = (missedCount) => {
    if (missedCount === 0) return "Perfect!"
    if (missedCount === 1) return "Almost perfect!"
    if (missedCount <= 3) return "Good effort!"
    if (missedCount <= 7) return "Keep trying!"
    if (missedCount <= 14) return "Stay focused!"
    return "Time to reset!"
  }

  const getConsistencyColor = (missedCount) => {
    if (missedCount === 0) return "#10b981"
    if (missedCount <= 2) return "#f59e0b"
    if (missedCount <= 5) return "#ef4444"
    return "#991b1b"
  }

  const missedCount = streak.missedDays.length
  const today = new Date().toDateString()
  const missedToday = streak.missedDays.includes(today)

  return (
    <div className="stat-card missed-day-card">
      <div className="stat-label">Consistency</div>
      <div 
        className="stat-value consistency-value" 
        style={{ color: getConsistencyColor(missedCount) }}
      >
        {getMissedEmoji(missedCount)} {missedCount === 0 ? "0" : missedCount}
      </div>
      <div className="consistency-message">{getConsistencyMessage(missedCount)}</div>
      
      {missedCount > 0 && (
        <div className="missed-info">
          <button 
            onClick={() => setShowDetails(!showDetails)}
            className="missed-details-btn"
          >
            {showDetails ? "Hide" : "Show"} Details
          </button>
          
          {showDetails && (
            <div className="missed-details">
              <div className="last-missed">
                {streak.lastMissedDay && (
                  <p>
                    Last missed: <strong>
                      {new Date(streak.lastMissedDay).toLocaleDateString()}
                    </strong>
                  </p>
                )}
              </div>
              
              {missedToday && (
                <div className="missed-today">
                  <p>⚠️ You missed today! Solve a problem to keep your streak!</p>
                </div>
              )}
              
              <div className="recent-missed">
                <h4>Recent Missed Days:</h4>
                <div className="missed-days-list">
                  {streak.missedDays.slice(0, 7).map((date, index) => (
                    <span key={index} className="missed-day-item">
                      {new Date(date).toLocaleDateString()}
                    </span>
                  ))}
                </div>
                {streak.missedDays.length > 7 && (
                  <p className="more-missed">
                    ...and {streak.missedDays.length - 7} more
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
