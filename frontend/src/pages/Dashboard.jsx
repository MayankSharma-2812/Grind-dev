import { useEffect, useState } from "react"
import api from "../services/api"

export default function Dashboard() {
  const [stats, setStats] = useState(null)

  useEffect(() => {
    api.get("/logs/stats").then(res => setStats(res.data))
  }, [])

  if (!stats) return null

  return (
    <div>
      <h1>{stats.total}</h1>
      <pre>{JSON.stringify(stats.difficulty)}</pre>
    </div>
  )
}
