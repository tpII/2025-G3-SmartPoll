"use client"

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"

interface Candidate {
  id: string
  name: string
  team: string
  votes: number
  percentage: number
  color: string
}

interface VotePieChartProps {
  data: Candidate[]
}

export function VotePieChart({ data }: VotePieChartProps) {
  const chartData = data.map((candidate) => ({
    name: candidate.name,
    value: candidate.votes,
    percentage: candidate.percentage,
    color: candidate.color,
  }))

  return (
    <ResponsiveContainer width="100%" height={400}>
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={(props) => {
            type LabelProps = typeof props & { percentage: number };
            const percentage = (props as LabelProps).percentage;
            return `${percentage.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}%`;
          }}
          outerRadius={120}
          fill="#8884d8"
          dataKey="value"
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip
          formatter={(value: number) => `${value.toLocaleString('es-AR')} votos`}
          contentStyle={{
            backgroundColor: "rgba(255, 255, 255, 0.95)",
            border: "1px solid #e2e8f0",
            borderRadius: "8px",
            padding: "12px",
          }}
        />
        <Legend
          verticalAlign="bottom"
          height={36}
          formatter={(value) => value}
          wrapperStyle={{
            fontSize: "14px",
          }}
        />
      </PieChart>
    </ResponsiveContainer>
  )
}
