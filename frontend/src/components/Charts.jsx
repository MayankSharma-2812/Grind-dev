import { useEffect, useState } from "react"
import api from "../services/api"
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell
} from "recharts"

export default function Charts() {
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await api.get("/logs")
        setLogs(res.data)
      } catch (error) {
        console.error("Failed to fetch logs:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchLogs()
  }, [])

  if (loading) {
    return (
      <div className="charts-container">
        <div className="chart-card">
          <div className="loading">Loading charts...</div>
        </div>
      </div>
    )
  }

  // Bar Chart Data - Difficulty Distribution
  const difficultyData = logs.reduce((acc, log) => {
    const difficulty = log.difficulty || 'unknown'
    acc[difficulty] = (acc[difficulty] || 0) + 1
    return acc
  }, {})

  const barChartData = Object.entries(difficultyData).map(([difficulty, count]) => ({
    name: difficulty.charAt(0).toUpperCase() + difficulty.slice(1),
    count: count
  }))

  // Pie Chart Data - Topics Distribution
  const topicData = logs.reduce((acc, log) => {
    const topic = log.topic || 'unknown'
    acc[topic] = (acc[topic] || 0) + 1
    return acc
  }, {})

  const pieChartData = Object.entries(topicData)
    .map(([topic, count]) => ({
      name: topic,
      value: count
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 8) // Top 8 topics

  // Line Chart Data - Problems per week
  const weeklyData = logs.reduce((acc, log) => {
    const date = new Date(log.date)
    const weekStart = new Date(date)
    weekStart.setDate(date.getDate() - date.getDay())
    const weekKey = weekStart.toISOString().split('T')[0]
    
    if (!acc[weekKey]) {
      acc[weekKey] = { week: weekKey, count: 0 }
    }
    acc[weekKey].count += 1
    return acc
  }, {})

  const lineChartData = Object.values(weeklyData)
    .sort((a, b) => new Date(a.week) - new Date(b.week))
    .slice(-12) // Last 12 weeks
    .map(item => ({
      week: new Date(item.week).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      problems: item.count
    }))

  // Colors for charts
  const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316']

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="chart-tooltip">
          <p className="tooltip-label">{`${label}`}</p>
          {payload.map((entry, index) => (
            <p key={index} className="tooltip-value" style={{ color: entry.color }}>
              {`${entry.name}: ${entry.value}`}
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  return (
    <div className="charts-container">
      <div className="charts-header">
        <h2 className="section-title">Analytics Dashboard</h2>
      </div>

      <div className="charts-grid">
        {/* Bar Chart - Difficulty */}
        <div className="chart-card">
          <h3 className="chart-title">Difficulty Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar dataKey="count" fill="#6366f1" radius={[8, 8, 0, 0]}>
                {barChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart - Topics */}
        <div className="chart-card">
          <h3 className="chart-title">Popular Topics</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieChartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {pieChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Line Chart - Weekly Progress */}
        <div className="chart-card">
          <h3 className="chart-title">Weekly Progress</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={lineChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="problems" 
                stroke="#6366f1" 
                strokeWidth={3}
                dot={{ fill: '#6366f1', r: 6 }}
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
