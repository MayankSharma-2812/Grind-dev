import { useState } from "react"
import api from "../services/api"
import { LoadingButton } from "./LoadingStates"

export default function ExportButtons() {
  const [exporting, setExporting] = useState({ csv: false, pdf: false })

  const handleExportCSV = async () => {
    try {
      setExporting(prev => ({ ...prev, csv: true }))
      const response = await api.get("/logs/export/csv", {
        responseType: "blob"
      })
      
      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement("a")
      link.href = url
      link.setAttribute("download", `problem_solving_progress_${new Date().toISOString().split('T')[0]}.csv`)
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error("Error exporting CSV:", error)
      alert("Failed to export CSV. Please try again.")
    } finally {
      setExporting(prev => ({ ...prev, csv: false }))
    }
  }

  const handleExportPDF = async () => {
    try {
      setExporting(prev => ({ ...prev, pdf: true }))
      const response = await api.get("/logs/export/pdf", {
        responseType: "blob"
      })
      
      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement("a")
      link.href = url
      link.setAttribute("download", `problem_solving_progress_${new Date().toISOString().split('T')[0]}.html`)
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error("Error exporting PDF:", error)
      alert("Failed to export PDF. Please try again.")
    } finally {
      setExporting(prev => ({ ...prev, pdf: false }))
    }
  }

  return (
    <div className="export-buttons">
      <LoadingButton
        onClick={handleExportCSV}
        loading={exporting.csv}
        className="btn btn-secondary"
        disabled={exporting.pdf}
      >
        📊 Export CSV
      </LoadingButton>
      <LoadingButton
        onClick={handleExportPDF}
        loading={exporting.pdf}
        className="btn btn-secondary"
        disabled={exporting.csv}
      >
        📄 Export PDF
      </LoadingButton>
    </div>
  )
}
