import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import api from "../services/api"
import { SkeletonCard, SkeletonChart, SkeletonLogCard } from "../components/LoadingStates"
import ThemeToggle from "../components/ThemeToggle"

export default function PublicProfile() {
  const { username } = useParams()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true)
        setError(null)
        const res = await api.get(`/logs/profile/${username}`)
        setProfile(res.data)
      } catch (err) {
        setError(err.response?.data?.message || "Profile not found")
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [username])

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="dashboard-header">
          <h1 className="dashboard-title">Loading Profile...</h1>
          <div className="dashboard-actions">
            <ThemeToggle />
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

  if (error) {
    return (
      <div className="dashboard-container">
        <div className="dashboard-header">
          <h1 className="dashboard-title">Profile Not Found</h1>
          <div className="dashboard-actions">
            <ThemeToggle />
            <Link to="/" className="btn btn-primary">
              Back to Dashboard
            </Link>
          </div>
        </div>
        <div className="empty-state-container">
          <div className="empty-state-content">
            <div className="empty-icon">👤</div>
            <h2 className="empty-title">Profile Not Found</h2>
            <p className="empty-description">
              The user "{username}" doesn't exist or has no public profile.
            </p>
            <Link to="/" className="btn btn-primary">
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    )
  }

  if (!profile) {
    return null
  }

  const { user, stats } = profile

  const shareableLink = `${window.location.origin}/profile/${username}`
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareableLink)
      alert("Profile link copied to clipboard!")
    } catch (err) {
      // Fallback for browsers that don't support clipboard API
      const textArea = document.createElement("textarea")
      textArea.value = shareableLink
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand("copy")
      document.body.removeChild(textArea)
      alert("Profile link copied to clipboard!")
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString()
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1 className="dashboard-title">@{username}</h1>
        <div className="dashboard-actions">
          <button onClick={copyToClipboard} className="btn btn-secondary">
            Share Profile
          </button>
          <ThemeToggle />
          <Link to="/dashboard" className="btn btn-primary">
            Dashboard
          </Link>
        </div>
      </div>

      <div className="profile-header">
        <div className="profile-info">
          <div className="profile-avatar">
            <div className="avatar-circle">
              {user.name.charAt(0).toUpperCase()}
            </div>
          </div>
          <div className="profile-details">
            <h2 className="profile-name">{user.name}</h2>
            <p className="profile-email">{user.email}</p>
            <p className="profile-joined">
              Joined {formatDate(user.joinedAt)}
            </p>
          </div>
        </div>
      </div>

      <div className="profile-stats">
        <h2 className="section-title">Statistics</h2>
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-label">Total Problems</div>
            <div className="stat-value">{stats.totalProblems}</div>
          </div>

          <div className="stat-card">
            <div className="stat-label">Current Streak</div>
            <div className="stat-value">{stats.currentStreak} 🔥</div>
          </div>

          <div className="stat-card">
            <div className="stat-label">Longest Streak</div>
            <div className="stat-value">{stats.longestStreak} 🏆</div>
          </div>
        </div>
      </div>

      <div className="profile-sections">
        <div className="profile-section">
          <h3 className="section-title">Difficulty Breakdown</h3>
          <div className="stats-grid">
            {Object.entries(stats.difficulty || {}).map(([difficulty, count]) => (
              <div key={difficulty} className="stat-card">
                <div className="stat-label">{difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}</div>
                <div className={`stat-value ${difficulty}`}>{count}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="profile-section">
          <h3 className="section-title">Popular Topics</h3>
          <div className="topics-grid">
            {Object.entries(stats.topics || {}).slice(0, 6).map(([topic, count]) => (
              <div key={topic} className="topic-tag">
                {topic} ({count})
              </div>
            ))}
          </div>
        </div>

        <div className="profile-section">
          <h3 className="section-title">Platforms Used</h3>
          <div className="platforms-grid">
            {Object.entries(stats.platforms || {}).map(([platform, count]) => (
              <div key={platform} className="platform-tag">
                {platform} ({count})
              </div>
            ))}
          </div>
        </div>

        <div className="profile-section">
          <h3 className="section-title">Recent Activity</h3>
          <div className="recent-activity">
            {stats.recentActivity.map((activity, index) => (
              <div key={index} className="activity-item">
                <div className="activity-info">
                  <h4 className="activity-title">{activity.title}</h4>
                  <div className="activity-meta">
                    <span className="activity-meta-item">{activity.platform}</span>
                    <span className="activity-meta-item">{activity.difficulty}</span>
                    <span className="activity-meta-item">{activity.topic}</span>
                  </div>
                </div>
                <div className="activity-date">
                  {formatDate(activity.date)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="profile-footer">
        <div className="share-section">
          <h3>Share this profile</h3>
          <div className="share-link-container">
            <input
              type="text"
              value={shareableLink}
              readOnly
              className="share-link-input"
              onClick={(e) => e.target.select()}
            />
            <button onClick={copyToClipboard} className="btn btn-primary">
              Copy Link
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
