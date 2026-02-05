import { useState, useEffect } from "react"
import api from "../services/api"
import { LoadingButton } from "./LoadingStates"
import { useApi } from "../hooks/useApi"

export default function GitHubSync() {
  const [syncStatus, setSyncStatus] = useState(null)
  const [loading, setLoading] = useState(true)
  const [syncing, setSyncing] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const { execute: syncCommits, loading: syncLoading } = useApi()

  useEffect(() => {
    const fetchSyncStatus = async () => {
      try {
        setLoading(true)
        const res = await api.get("/github/status")
        setSyncStatus(res.data)
      } catch (error) {
        console.error("Failed to fetch sync status:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchSyncStatus()
  }, [])

  const handleSync = async () => {
    try {
      setSyncing(true)
      setShowResults(false)
      
      const res = await syncCommits(() => api.post("/github/sync"))
      
      setSyncStatus(prev => ({
        ...prev,
        lastSyncedCommitSha: res.data.lastSyncedCommitSha,
        hasSyncedBefore: true
      }))
      
      setShowResults(true)
    } catch (error) {
      console.error("Sync failed:", error)
      alert("Sync failed: " + (error.response?.data?.message || error.message))
    } finally {
      setSyncing(false)
    }
  }

  if (loading) {
    return (
      <div className="github-sync-card">
        <div className="sync-header">
          <h3>🔄 GitHub Sync</h3>
        </div>
        <div className="sync-content">
          <div className="sync-loading">
            <div className="spinner"></div>
            <p>Loading sync status...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!syncStatus?.configured) {
    return (
      <div className="github-sync-card">
        <div className="sync-header">
          <h3>🔄 GitHub Sync</h3>
        </div>
        <div className="sync-content">
          <div className="sync-error">
            <div className="error-icon">⚠️</div>
            <h4>GitHub Sync Not Configured</h4>
            <p>Please configure GitHub environment variables to enable sync functionality.</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="github-sync-card">
      <div className="sync-header">
        <h3>🔄 GitHub Sync</h3>
        <div className="sync-status">
          {syncStatus.hasSyncedBefore ? (
            <span className="status-badge synced">✅ Configured</span>
          ) : (
            <span className="status-badge not-synced">⏳ Not Synced</span>
          )}
        </div>
      </div>

      <div className="sync-content">
        <div className="sync-info">
          <div className="info-item">
            <span className="info-label">Repository:</span>
            <span className="info-value">{syncStatus.githubUsername || 'N/A'}/{process.env.REACT_APP_GITHUB_REPO || 'leetcode-solutions'}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Last Sync:</span>
            <span className="info-value">
              {syncStatus.lastSyncedCommitSha ? 
                `${syncStatus.lastSyncedCommitSha.substring(0, 7)}...` : 
                'Never'
              }
            </span>
          </div>
        </div>

        <div className="sync-description">
          <p>Sync your LeetCode solutions from GitHub commits with format:</p>
          <code className="sync-example">leetcode: solved Problem Name (Difficulty)</code>
        </div>

        <div className="sync-actions">
          <LoadingButton
            onClick={handleSync}
            loading={syncing || syncLoading}
            className="btn btn-primary sync-button"
          >
            {syncing || syncLoading ? "Syncing..." : "🔄 Sync Now"}
          </LoadingButton>
        </div>

        {showResults && (
          <div className="sync-results">
            <h4>🎉 Sync Complete!</h4>
            <p>Your LeetCode solutions have been synced from GitHub.</p>
          </div>
        )}
      </div>
    </div>
  )
}
