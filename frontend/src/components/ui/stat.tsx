import React from 'react'

interface StatProps {
  title: string
  value: React.ReactNode
}

export function Stat({ title, value }: StatProps) {
  return (
    <div className="flex flex-col items-center">
      <h3 className="text-lg font-medium text-gray-700">{title}</h3>
      <div className="text-2xl font-bold text-gray-900 mt-2">{value}</div>
    </div>
  )
} 