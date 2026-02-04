import { useEffect, useState } from "react"
import api from "../services/api"

export default function StreakCard() {
  const [streak, setStreak] = useState({ currentStreak: 0, longestStreak: 0 })
  const [loading, setLoading] = useState(true)

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
        <div className="stat-label">Current Streak</div>
        <div className="stat-value">...</div>
      </div>
    )
  }

  const getStreakEmoji = (days) => {
    if (days === 0) return "🔥"
    if (days >= 30) return "🔥🔥🔥"
    if (days >= 14) return "🔥🔥"
    if (days >= 7) return "🔥"
    return "🔥"
  }

  const getStreakMessage = (days) => {
    if (days === 0) return "Keep going!"
    if (days >= 30) return "Legendary!"
    if (days >= 14) return "Amazing!"
    if (days >= 7) return "Great job!"
    if (days >= 3) return "Keep it up!"
    return "Good start!"
  }

  return (
    <div className="stat-card streak-card">
      <div className="stat-label">Current Streak</div>
      <div className="stat-value streak-value">
        {getStreakEmoji(streak.currentStreak)} {streak.currentStreak}
      </div>
      <div className="streak-message">{getStreakMessage(streak.currentStreak)}</div>
      <div className="longest-streak">
        Longest: <span className="streak-number">{streak.longestStreak}</span> days
      </div>
    </div>
  )
}
