"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Card } from "@/components/ui/card"

interface QRScanAttempt {
  createdAt: number
  qrScanStatus: string
}

interface HourData {
  hour: string
  total: number
}

export function QRScansByHour({ scanAttempts }: { scanAttempts: QRScanAttempt[] }) {
  // Group scans by hour in Buenos Aires timezone
  const hourMap: Record<string, number> = {}

  scanAttempts.forEach((attempt) => {
    // Convert Unix timestamp to Buenos Aires time
    const date = new Date(attempt.createdAt * 1000)
    const bsAsTime = new Date(date.toLocaleString("en-US", { timeZone: "America/Argentina/Buenos_Aires" }))
    const hour = bsAsTime.getHours().toString().padStart(2, "0")
    const hourLabel = `${hour}:00`

    hourMap[hourLabel] = (hourMap[hourLabel] || 0) + 1
  })

  // Create sorted array of all hours (0-23)
  const chartData: HourData[] = Array.from({ length: 24 }, (_, i) => {
    const hour = i.toString().padStart(2, "0")
    const hourLabel = `${hour}:00`
    return {
      hour: hourLabel,
      total: hourMap[hourLabel] || 0,
    }
  })

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-slate-900 mb-6">Escaneos por hora</h2>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey="hour" stroke="#64748b" style={{ fontSize: "12px" }} />
          <YAxis stroke="#64748b" />
          <Tooltip
            contentStyle={{
              backgroundColor: "#1e293b",
              border: "1px solid #475569",
              borderRadius: "8px",
              color: "#f1f5f9",
            }}
            formatter={(value) => [`${value} escaneos`, "Total"]}
          />
          <Bar dataKey="total" fill="#3b82f6" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
