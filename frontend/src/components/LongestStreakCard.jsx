import { useEffect, useState } from "react"
import api from "../services/api"

export default function LongestStreakCard() {
  const [streak, setStreak] = useState({ longestStreak: 0 })
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
        <div className="stat-label">Longest Streak</div>
        <div className="stat-value">...</div>
      </div>
    )
  }

  if (streak.longestStreak === 0) {
    return (
      <div className="stat-card">
        <div className="stat-label">Longest Streak</div>
        <div className="empty-streak">
          <div className="empty-streak-icon">🏆</div>
          <div className="empty-streak-text">No record yet</div>
        </div>
      </div>
    )
  }

  const getLongestStreakEmoji = (days) => {
    if (days === 0) return "🏆"
    if (days >= 100) return "🏆🏆🏆🏆"
    if (days >= 60) return "🏆🏆🏆"
    if (days >= 30) return "🏆🏆"
    if (days >= 14) return "🏆"
    return "🏆"
  }

  const getLongestStreakMessage = (days) => {
    if (days === 0) return "Start your journey!"
    if (days >= 100) return "God Mode!"
    if (days >= 60) return "Elite!"
    if (days >= 30) return "Master!"
    if (days >= 14) return "Expert!"
    if (days >= 7) return "Skilled!"
    if (days >= 3) return "Rising!"
    return "Beginner!"
  }

  return (
    <div className="stat-card longest-streak-card">
      <div className="stat-label">Longest Streak</div>
      <div className="stat-value longest-streak-value">
        {getLongestStreakEmoji(streak.longestStreak)} {streak.longestStreak}
      </div>
      <div className="longest-streak-message">{getLongestStreakMessage(streak.longestStreak)}</div>
      <div className="achievement-badge">
        {streak.longestStreak >= 30 && "⭐ Achievement Unlocked!"}
        {streak.longestStreak >= 60 && " ⭐⭐ Elite Status!"}
        {streak.longestStreak >= 100 && " ⭐⭐⭐ Legendary!"}
      </div>
    </div>
  )
}
