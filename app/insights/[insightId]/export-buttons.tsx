"use client"

import { useState } from "react"
import { Download, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Insight } from "@/lib/types"
import { jsPDF } from "jspdf"
import { unparse } from "papaparse"
import { toast } from "@/components/ui/use-toast"

interface ExportButtonsProps {
  insight: Insight
}

export function ExportButtons({ insight }: ExportButtonsProps) {
  const [isExporting, setIsExporting] = useState<"pdf" | "csv" | null>(null)

  const exportToPDF = () => {
    setIsExporting("pdf")

    try {
      const doc = new jsPDF()

      // Add title
      doc.setFontSize(16)
      doc.text(insight.title, 20, 20)

      // Add metadata
      doc.setFontSize(12)
      doc.text(`Category: ${insight.category || "N/A"}`, 20, 30)
      doc.text(`Source: ${insight.source_context.podcast_name}`, 20, 40)
      doc.text(`Episode: ${insight.source_context.episode_title}`, 20, 50)

      // Add content
      doc.setFontSize(14)
      doc.text("Problem Addressed:", 20, 70)
      doc.setFontSize(12)

      const problemLines = doc.splitTextToSize(insight.problem_addressed, 170)
      doc.text(problemLines, 20, 80)

      doc.setFontSize(14)
      doc.text("Description:", 20, 100 + problemLines.length * 7)
      doc.setFontSize(12)

      const descriptionLines = doc.splitTextToSize(insight.description, 170)
      doc.text(descriptionLines, 20, 110 + problemLines.length * 7)

      // Add tags
      doc.setFontSize(12)
      doc.text(`Tags: ${insight.tags.join(", ")}`, 20, 130 + problemLines.length * 7 + descriptionLines.length * 7)

      // Save the PDF
      doc.save(`insight-${insight._id}.pdf`)

      toast({
        title: "PDF Exported",
        description: "Your insight has been exported as a PDF file.",
      })
    } catch (error) {
      console.error("Error exporting to PDF:", error)
      toast({
        title: "Export Failed",
        description: "Failed to export to PDF. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsExporting(null)
    }
  }

  const exportToCSV = () => {
    setIsExporting("csv")

    try {
      const data = [
        {
          id: insight._id,
          title: insight.title,
          problem_addressed: insight.problem_addressed,
          description: insight.description,
          category: insight.category,
          tags: insight.tags.join(", "),
          podcast_name: insight.source_context.podcast_name,
          episode_title: insight.source_context.episode_title,
          created_at: insight.createdAt,
        },
      ]

      const csv = unparse(data)
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
      const url = URL.createObjectURL(blob)

      const link = document.createElement("a")
      link.setAttribute("href", url)
      link.setAttribute("download", `insight-${insight._id}.csv`)
      link.style.visibility = "hidden"

      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      toast({
        title: "CSV Exported",
        description: "Your insight has been exported as a CSV file.",
      })
    } catch (error) {
      console.error("Error exporting to CSV:", error)
      toast({
        title: "Export Failed",
        description: "Failed to export to CSV. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsExporting(null)
    }
  }

  return (
    <div className="grid grid-cols-2 gap-4">
      <Button
        variant="outline"
        onClick={exportToPDF}
        disabled={isExporting !== null}
        className="flex items-center gap-2"
      >
        <FileText className="h-4 w-4" />
        {isExporting === "pdf" ? "Exporting..." : "Export to PDF"}
      </Button>
      <Button
        variant="outline"
        onClick={exportToCSV}
        disabled={isExporting !== null}
        className="flex items-center gap-2"
      >
        <Download className="h-4 w-4" />
        {isExporting === "csv" ? "Exporting..." : "Export to CSV"}
      </Button>
    </div>
  )
}
