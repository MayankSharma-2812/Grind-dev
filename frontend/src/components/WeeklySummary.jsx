import { useState, useEffect } from "react"
import api from "../services/api"
import { SkeletonCard } from "./LoadingStates"

export default function WeeklySummary() {
  const [summary, setSummary] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        setLoading(true)
        const res = await api.get("/logs/weekly-summary")
        setSummary(res.data)
      } catch (error) {
        console.error("Failed to fetch weekly summary:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchSummary()
  }, [])

  if (loading) {
    return (
      <div className="weekly-summary-card">
        <div className="weekly-summary-header">
          <h3>Weekly Summary</h3>
        </div>
        <div className="weekly-summary-content">
          <SkeletonCard />
        </div>
      </div>
    )
  }

  if (!summary) {
    return null
  }

  const { message, weeklyStats } = summary

  return (
    <div className="weekly-summary-card">
      <div className="weekly-summary-header">
        <h3>📅 Weekly Summary</h3>
        <p className="week-range">{weeklyStats.weekRange.start} - {weeklyStats.weekRange.end}</p>
      </div>
      
      <div className="weekly-summary-content">
        <div className="weekly-message">
          <p className="weekly-highlight">{message}</p>
        </div>

        <div className="weekly-stats">
          <div className="weekly-stat-item">
            <div className="weekly-stat-value">{weeklyStats.problemsSolved}</div>
            <div className="weekly-stat-label">Problems Solved</div>
          </div>

          <div className="weekly-stat-item">
            <div className="weekly-stat-value">{weeklyStats.streakInfo.currentStreak} 🔥</div>
            <div className="weekly-stat-label">Current Streak</div>
          </div>

          <div className="weekly-stat-item">
            <div className="weekly-stat-value">{weeklyStats.streakInfo.longestStreak} 🏆</div>
            <div className="weekly-stat-label">Longest Streak</div>
          </div>
        </div>

        {weeklyStats.difficultyTrend.length > 0 && (
          <div className="weekly-section">
            <h4>Difficulty Trend</h4>
            <div className="difficulty-trend">
              {weeklyStats.difficultyTrend.map(({ difficulty, count, percentage }) => (
                <div key={difficulty} className="trend-item">
                  <div className="trend-info">
                    <span className="trend-difficulty">{difficulty}</span>
                    <span className="trend-count">{count}</span>
                  </div>
                  <div className="trend-bar">
                    <div 
                      className={`trend-fill ${difficulty}`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {weeklyStats.topTopics.length > 0 && (
          <div className="weekly-section">
            <h4>Top Topics</h4>
            <div className="topics-list">
              {weeklyStats.topTopics.map(({ topic, count }) => (
                <div key={topic} className="topic-item">
                  <span className="topic-name">{topic}</span>
                  <span className="topic-count">{count}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {weeklyStats.platformsUsed.length > 0 && (
          <div className="weekly-section">
            <h4>Platforms Used</h4>
            <div className="platforms-list">
              {weeklyStats.platformsUsed.map(({ platform, count }) => (
                <div key={platform} className="platform-item">
                  <span className="platform-name">{platform}</span>
                  <span className="platform-count">{count}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
