import React from "react"

export function SkeletonLoader({ width = "100%", height = "20px", className = "" }) {
  return (
    <div 
      className={`skeleton ${className}`}
      style={{ width, height }}
    />
  )
}

export function SkeletonCard() {
  return (
    <div className="stat-card skeleton-card">
      <SkeletonLoader height="16px" width="60%" />
      <SkeletonLoader height="40px" width="40%" style={{ margin: "12px 0" }} />
      <SkeletonLoader height="14px" width="80%" />
    </div>
  )
}

export function SkeletonChart() {
  return (
    <div className="chart-card">
      <SkeletonLoader height="24px" width="40%" style={{ margin: "0 0 20px 0" }} />
      <div style={{ height: "300px", position: "relative" }}>
        <div className="chart-skeleton">
          <SkeletonLoader height="200px" width="100%" />
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: "20px" }}>
            <SkeletonLoader height="12px" width="60px" />
            <SkeletonLoader height="12px" width="60px" />
            <SkeletonLoader height="12px" width="60px" />
            <SkeletonLoader height="12px" width="60px" />
          </div>
        </div>
      </div>
    </div>
  )
}

export function SkeletonLogCard() {
  return (
    <div className="log-card skeleton-log-card">
      <div className="log-header">
        <div style={{ flex: 1 }}>
          <SkeletonLoader height="20px" width="70%" style={{ marginBottom: "8px" }} />
          <SkeletonLoader height="14px" width="90%" />
        </div>
        <SkeletonLoader height="14px" width="80px" />
      </div>
      <SkeletonLoader height="12px" width="100%" style={{ marginTop: "12px" }} />
      <div style={{ display: "flex", gap: "8px", marginTop: "12px" }}>
        <SkeletonLoader height="32px" width="60px" />
        <SkeletonLoader height="32px" width="60px" />
      </div>
    </div>
  )
}

export function FullPageLoader() {
  return (
    <div className="full-page-loader">
      <div className="loader-content">
        <div className="loader-spinner"></div>
        <p className="loader-text">Loading your data...</p>
      </div>
    </div>
  )
}

export function LoadingButton({ children, loading, disabled, ...props }) {
  return (
    <button 
      className={`btn ${props.className || ""} ${loading ? "loading" : ""}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <>
          <span className="btn-spinner"></span>
          {children}
        </>
      ) : (
        children
      )}
    </button>
  )
}
