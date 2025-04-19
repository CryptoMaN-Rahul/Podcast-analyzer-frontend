"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Download, FileText, Share2, Clipboard, FileJson, FileIcon as FilePdf } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Insight } from "@/lib/types"
import { jsPDF } from "jspdf"
import { unparse } from "papaparse"
import { toast } from "sonner"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"

interface PremiumExportButtonsProps {
  insight: Insight
}

export function PremiumExportButtons({ insight }: PremiumExportButtonsProps) {
  const [isExporting, setIsExporting] = useState<"pdf" | "csv" | "json" | "clipboard" | null>(null)

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

      toast.success("PDF Exported", {
        description: "Your insight has been exported as a PDF file.",
        icon: <FilePdf className="h-4 w-4" />,
      })
    } catch (error) {
      console.error("Error exporting to PDF:", error)
      toast.error("Export Failed", {
        description: "Failed to export to PDF. Please try again.",
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

      toast.success("CSV Exported", {
        description: "Your insight has been exported as a CSV file.",
        icon: <Download className="h-4 w-4" />,
      })
    } catch (error) {
      console.error("Error exporting to CSV:", error)
      toast.error("Export Failed", {
        description: "Failed to export to CSV. Please try again.",
      })
    } finally {
      setIsExporting(null)
    }
  }

  const exportToJSON = () => {
    setIsExporting("json")

    try {
      const data = {
        id: insight._id,
        title: insight.title,
        problem_addressed: insight.problem_addressed,
        description: insight.description,
        category: insight.category,
        tags: insight.tags,
        source: {
          podcast_name: insight.source_context.podcast_name,
          episode_title: insight.source_context.episode_title,
        },
        created_at: insight.createdAt,
      }

      const json = JSON.stringify(data, null, 2)
      const blob = new Blob([json], { type: "application/json;charset=utf-8;" })
      const url = URL.createObjectURL(blob)

      const link = document.createElement("a")
      link.setAttribute("href", url)
      link.setAttribute("download", `insight-${insight._id}.json`)
      link.style.visibility = "hidden"

      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      toast.success("JSON Exported", {
        description: "Your insight has been exported as a JSON file.",
        icon: <FileJson className="h-4 w-4" />,
      })
    } catch (error) {
      console.error("Error exporting to JSON:", error)
      toast.error("Export Failed", {
        description: "Failed to export to JSON. Please try again.",
      })
    } finally {
      setIsExporting(null)
    }
  }

  const copyToClipboard = () => {
    setIsExporting("clipboard")

    try {
      const text = `
Title: ${insight.title}
Category: ${insight.category || "N/A"}
Problem Addressed: ${insight.problem_addressed}
Description: ${insight.description}
Tags: ${insight.tags.join(", ")}
Source: ${insight.source_context.podcast_name} - ${insight.source_context.episode_title}
      `.trim()

      navigator.clipboard.writeText(text)

      toast.success("Copied to Clipboard", {
        description: "Insight details have been copied to your clipboard.",
        icon: <Clipboard className="h-4 w-4" />,
      })
    } catch (error) {
      console.error("Error copying to clipboard:", error)
      toast.error("Copy Failed", {
        description: "Failed to copy to clipboard. Please try again.",
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
        {isExporting === "pdf" ? (
          <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
            Exporting...
          </motion.span>
        ) : (
          "Export to PDF"
        )}
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" disabled={isExporting !== null} className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            {isExporting ? (
              <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
                Exporting...
              </motion.span>
            ) : (
              "More Options"
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem onClick={exportToCSV}>
            <Download className="h-4 w-4 mr-2" />
            Export to CSV
          </DropdownMenuItem>
          <DropdownMenuItem onClick={exportToJSON}>
            <FileJson className="h-4 w-4 mr-2" />
            Export to JSON
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={copyToClipboard}>
            <Clipboard className="h-4 w-4 mr-2" />
            Copy to Clipboard
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <Share2 className="h-4 w-4 mr-2" />
            Share Insight
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
