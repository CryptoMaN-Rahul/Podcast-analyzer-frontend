"use client"

import { useEffect, useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts"
import { getInsights, getChannels, getCategories } from "@/lib/api"
import { LoadingSpinner } from "@/components/loading-spinner"
import { ErrorMessage } from "@/components/error-message"

interface AnalyticsChartsProps {
  type: "category" | "channel"
}

export function AnalyticsCharts({ type }: AnalyticsChartsProps) {
  const [chartData, setChartData] = useState<any[]>([])

  const {
    data: insights,
    isLoading: insightsLoading,
    isError: insightsError,
  } = useQuery({
    queryKey: ["insights", { limit: 1000 }],
    queryFn: () => getInsights({ limit: 1000 }),
  })

  const { data: channels = [], isLoading: channelsLoading } = useQuery({
    queryKey: ["channels"],
    queryFn: getChannels,
    enabled: type === "channel",
  })

  const { data: categories = [], isLoading: categoriesLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
    enabled: type === "category",
  })

  const isLoading =
    insightsLoading || (type === "channel" && channelsLoading) || (type === "category" && categoriesLoading)

  useEffect(() => {
    if (!insights?.data) return

    if (type === "category") {
      // Group insights by category
      const categoryMap = new Map<string, number>()

      insights.data.forEach((insight) => {
        const category = insight.category || "Uncategorized"
        categoryMap.set(category, (categoryMap.get(category) || 0) + 1)
      })

      const data = Array.from(categoryMap.entries())
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 10) // Top 10 categories

      setChartData(data)
    } else if (type === "channel") {
      // Group insights by channel
      const channelMap = new Map<string, number>()

      insights.data.forEach((insight) => {
        const channelName = insight.source_context.podcast_name || "Unknown"
        channelMap.set(channelName, (channelMap.get(channelName) || 0) + 1)
      })

      const data = Array.from(channelMap.entries())
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 10) // Top 10 channels

      setChartData(data)
    }
  }, [insights, type])

  if (isLoading) {
    return <LoadingSpinner />
  }

  if (insightsError) {
    return (
      <ErrorMessage title="Failed to load analytics data" message="There was an error loading the analytics data." />
    )
  }

  if (chartData.length === 0) {
    return <div className="flex h-full items-center justify-center">No data available</div>
  }

  // Colors for the charts
  const COLORS = [
    "#8884d8",
    "#83a6ed",
    "#8dd1e1",
    "#82ca9d",
    "#a4de6c",
    "#d0ed57",
    "#ffc658",
    "#ff8042",
    "#ff6361",
    "#bc5090",
  ]

  if (type === "category") {
    return (
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => [`${value} insights`, "Count"]} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    )
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <XAxis type="number" />
        <YAxis type="category" dataKey="name" width={150} tick={{ fontSize: 12 }} />
        <Tooltip formatter={(value) => [`${value} insights`, "Count"]} />
        <Bar dataKey="value" fill="#8884d8">
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
