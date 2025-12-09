"use client"

import { Card } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts"
import { QRScansByHour } from "@/components/qr-scan-by-hour";
export interface QRScanAttempt {
  createdAt: number
  qrScanStatus: string
}

interface QRScanSummaryProps {
  scanAttempts: QRScanAttempt[]
}

export function QRScanSummary({ scanAttempts }: QRScanSummaryProps) {
  // Count by status type
  const statusCounts: Record<string, number> = {}
  scanAttempts.forEach((attempt) => {
    const status = attempt.qrScanStatus
    statusCounts[status] = (statusCounts[status] || 0) + 1
  })

  const totalScans = scanAttempts.length

  // Define colors and labels for each status
  const statusConfig: Record<string, { color: string; label: string; isError: boolean }> = {
    SUCCESS: { color: "#10b981", label: "Exitosos", isError: false },
    INVALID_QR: { color: "#ef4444", label: "QR Inválido", isError: true },
    ALREADY_USED: { color: "#ef4444", label: "Ya Utilizado", isError: true },
  }

  // Prepare data for chart
  const chartData = Object.entries(statusCounts).map(([status, count]) => ({
    status: statusConfig[status]?.label || status,
    count,
    percentage: ((count / totalScans) * 100).toFixed(2),
    color: statusConfig[status]?.color || "#6b7280",
  }))

  const successCount = statusCounts["SUCCESS"] || 0
  const errorCount = (statusCounts["INVALID_QR"] || 0) + (statusCounts["ALREADY_USED"] || 0)

  return (
    <div className="space-y-6">
      <Card className="p-6 shadow-lg">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50 mb-8">Resumen de Intentos de Escaneo QR</h2>

        <div className="mb-8 p-6 bg-blue-50 dark:bg-blue-950 rounded-lg border-2 border-blue-500">
          <p className="text-sm font-semibold text-blue-700 dark:text-blue-300 mb-2">TOTAL DE ESCANEOS</p>
          <p className="text-5xl font-bold text-slate-900 dark:text-slate-50">{totalScans}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Success Card */}
          <div className="p-6 rounded-lg border-2 bg-green-50 dark:bg-green-950 border-green-500">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-4 h-4 rounded-full bg-green-500" />
              <p className="text-sm font-semibold text-green-700 dark:text-green-300">EXITOSOS</p>
            </div>
            <p className="text-4xl font-bold text-slate-900 dark:text-slate-50 mb-1">{successCount}</p>
            <p className="text-lg text-slate-600 dark:text-slate-400">
              ({((successCount / totalScans) * 100).toFixed(2)}%)
            </p>
          </div>

          {/* Errors Card */}
          <div className="p-6 rounded-lg border-2 bg-red-50 dark:bg-red-950 border-red-500">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-4 h-4 rounded-full bg-red-500" />
              <p className="text-sm font-semibold text-red-700 dark:text-red-300">ERRORES</p>
            </div>
            <p className="text-4xl font-bold text-slate-900 dark:text-slate-50 mb-1">{errorCount}</p>
            <p className="text-lg text-slate-600 dark:text-slate-400">
              ({((errorCount / totalScans) * 100).toFixed(2)}%)
            </p>
          </div>
        </div>

        <div className="w-full h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="status" />
              <YAxis />
              <Tooltip
                formatter={(value: any) => [`${value} intentos`, "Cantidad"]}
                contentStyle={{
                  backgroundColor: "#1f2937",
                  border: "1px solid #374151",
                  borderRadius: "8px",
                  color: "#fff",
                }}
                itemStyle={{
                  color: "#fff",
                }}
                labelStyle={{
                  color: "#fff",
                }}
              />
              <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <QRScansByHour scanAttempts={scanAttempts} />
      </Card>
    </div>
  )
}
