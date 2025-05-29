"use client"

import { useEffect } from "react"
import { TrendingUp, TrendingDown, Clock, DollarSign, BarChart3, Activity } from "lucide-react"
import { cn } from "@/components/lib/utils"

export default function MarketStats({ market, marketData, isLoading, volumeRef }) {
  // Format currency
  const formatCurrency = (value, symbol = "$") => {
    if (!value) return `${symbol}0.00`
    if (value >= 1000000000) return `${symbol}${(value / 1000000000).toFixed(2)}B`
    if (value >= 1000000) return `${symbol}${(value / 1000000).toFixed(2)}M`
    if (value >= 1000) return `${symbol}${(value / 1000).toFixed(2)}K`
    return `${symbol}${value.toFixed(2)}`
  }

  // Format percentage
  const formatPercentage = (value) => {
    if (!value) return "0.00%"
    return `${value > 0 ? "+" : ""}${value.toFixed(2)}%`
  }

  // Format number with commas
  const formatNumber = (value) => {
    if (!value) return "0"
    return value.toLocaleString()
  }

  // Animate volume when it changes
  useEffect(() => {
    if (!volumeRef?.current || !marketData) return
    // No animation logic here - just display the data
  }, [marketData, volumeRef])

  // Stats data
  const stats = [
    {
      label: "24h Change",
      value: marketData?.change24h,
      format: formatPercentage,
      icon: marketData?.change24h >= 0 ? TrendingUp : TrendingDown,
      color: marketData?.change24h >= 0 ? "text-green-500" : "text-red-500",
    },
    {
      label: "24h High",
      value: marketData?.high24h,
      format: (v) => formatCurrency(v, ""),
      icon: TrendingUp,
      color: "text-green-500",
    },
    {
      label: "24h Low",
      value: marketData?.low24h,
      format: (v) => formatCurrency(v, ""),
      icon: TrendingDown,
      color: "text-red-500",
    },
    {
      label: "24h Volume",
      value: marketData?.volume24h,
      format: formatCurrency,
      icon: BarChart3,
      color: "text-blue-500",
      ref: volumeRef,
    },
    {
      label: "Market Cap",
      value: marketData?.marketCap,
      format: formatCurrency,
      icon: DollarSign,
      color: "text-purple-500",
    },
    {
      label: "All-Time High",
      value: marketData?.allTimeHigh,
      format: (v) => formatCurrency(v, ""),
      icon: Activity,
      color: "text-yellow-500",
    },
    {
      label: "Circulating Supply",
      value: marketData?.supply,
      format: formatNumber,
      icon: Clock,
      color: "text-cyan-500",
      suffix: ` ${market.split("/")[0]}`,
    },
  ]

  return (
    <div className="p-4">
      <h3 className="text-sm font-medium mb-4">Market Stats</h3>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-gray-800/50 rounded-lg p-3 hover:bg-gray-800 transition-colors min-w-[60px] max-w-[100px]"
          >
            <div className="flex items-center mb-2">
              <div className={cn("p-1.5 rounded-full mr-2", `bg-${stat.color.split("-")[1]}-500/20`)}>
                <stat.icon className={cn("h-4 w-4", stat.color)} />
              </div>
              <span className="text-xs text-gray-400 truncate">{stat.label}</span>
            </div>

            <div className="text-sm font-medium overflow-hidden">
              {isLoading ? (
                <div className="h-5 w-20 bg-gray-700 animate-pulse rounded"></div>
              ) : (
                <span
                  ref={stat.ref}
                  className="block text-ellipsis overflow-hidden whitespace-nowrap word-break"
                >
                  {stat.format(stat.value)}
                  {stat.suffix && (
                    <span className="text-xs text-gray-400 ml-1">{stat.suffix}</span>
                  )}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      <style jsx>{`
        .word-break {
          word-break: break-word;
        }
        .text-ellipsis {
          text-overflow: ellipsis;
        }
      `}</style>
    </div>
  )
}