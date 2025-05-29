"use client"

import { useState, useEffect } from "react"
import { Calendar, Download, BarChart2, PieChart, TrendingUp, DollarSign } from "lucide-react"
import { cn } from "@/components/lib/utils"

export default function TradeAnalytics({ orderHistory, positions, isLoading }) {
  const [timeRange, setTimeRange] = useState("1m") // 1d, 1w, 1m, 3m, 1y, all
  const [customDateRange, setCustomDateRange] = useState({ from: null, to: null })
  const [showCustomRange, setShowCustomRange] = useState(false)

  // Analytics data (would be calculated from order history and positions)
  const [analytics, setAnalytics] = useState({
    totalTrades: 0,
    winRate: 0,
    profitFactor: 0,
    averageProfit: 0,
    averageLoss: 0,
    largestProfit: 0,
    largestLoss: 0,
    totalProfit: 0,
    totalLoss: 0,
    netProfit: 0,
    profitPercentage: 0,
    maxDrawdown: 0,
    sharpeRatio: 0,
    tradesPerDay: 0,
    bestDay: { date: null, profit: 0 },
    worstDay: { date: null, loss: 0 },
    profitByMarket: [],
    profitByDay: [],
    winLossByDay: [],
  })

  // Calculate analytics when order history changes
  useEffect(() => {
    if (isLoading || !orderHistory.length) return

    // In a real app, this would calculate actual analytics from the order history
    // For demo purposes, we'll use mock data

    // Filter orders by time range
    const filteredOrders = filterOrdersByTimeRange(orderHistory, timeRange, customDateRange)

    // Calculate analytics
    const calculatedAnalytics = {
      totalTrades: filteredOrders.length,
      winRate: 62.5,
      profitFactor: 1.85,
      averageProfit: 320.45,
      averageLoss: -175.3,
      largestProfit: 1250.75,
      largestLoss: -850.2,
      totalProfit: 8750.25,
      totalLoss: -4725.8,
      netProfit: 4024.45,
      profitPercentage: 8.05,
      maxDrawdown: 12.3,
      sharpeRatio: 1.65,
      tradesPerDay: 3.2,
      bestDay: { date: new Date("2023-04-15"), profit: 1450.25 },
      worstDay: { date: new Date("2023-04-22"), loss: -980.5 },
      profitByMarket: [
        { market: "BTC/USDT", profit: 2250.75, percentage: 55.9 },
        { market: "ETH/USDT", profit: 1150.3, percentage: 28.6 },
        { market: "SOL/USDT", profit: 625.4, percentage: 15.5 },
        { market: "AAPL/USD", profit: -125.5, percentage: -3.1 },
        { market: "EUR/USD", profit: 123.5, percentage: 3.1 },
      ],
      profitByDay: [
        { day: "Mon", profit: 850.25 },
        { day: "Tue", profit: 1250.75 },
        { day: "Wed", profit: -350.5 },
        { day: "Thu", profit: 725.3 },
        { day: "Fri", profit: 1550.65 },
        { day: "Sat", profit: 125.5 },
        { day: "Sun", profit: -125.5 },
      ],
      winLossByDay: [
        { day: "Mon", wins: 12, losses: 8 },
        { day: "Tue", wins: 15, losses: 5 },
        { day: "Wed", wins: 8, losses: 10 },
        { day: "Thu", wins: 10, losses: 6 },
        { day: "Fri", wins: 18, losses: 7 },
        { day: "Sat", wins: 5, losses: 3 },
        { day: "Sun", wins: 4, losses: 5 },
      ],
    }

    setAnalytics(calculatedAnalytics)
  }, [orderHistory, timeRange, customDateRange, isLoading])

  // Filter orders by time range
  const filterOrdersByTimeRange = (orders, range, customRange) => {
    if (range === "custom" && customRange.from && customRange.to) {
      const fromDate = new Date(customRange.from)
      const toDate = new Date(customRange.to)
      return orders.filter((order) => {
        const orderDate = new Date(order.created)
        return orderDate >= fromDate && orderDate <= toDate
      })
    }

    const now = new Date()
    let fromDate = new Date()

    switch (range) {
      case "1d":
        fromDate.setDate(now.getDate() - 1)
        break
      case "1w":
        fromDate.setDate(now.getDate() - 7)
        break
      case "1m":
        fromDate.setMonth(now.getMonth() - 1)
        break
      case "3m":
        fromDate.setMonth(now.getMonth() - 3)
        break
      case "1y":
        fromDate.setFullYear(now.getFullYear() - 1)
        break
      case "all":
        fromDate = new Date(0) // Beginning of time
        break
      default:
        fromDate.setMonth(now.getMonth() - 1) // Default to 1 month
    }

    return orders.filter((order) => new Date(order.created) >= fromDate)
  }

  // Format currency
  const formatCurrency = (value, symbol = "$") => {
    if (!value && value !== 0) return `${symbol}0.00`
    return `${symbol}${Math.abs(value).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`
  }

  // Format percentage
  const formatPercentage = (value) => {
    if (!value && value !== 0) return "0.00%"
    return `${value > 0 ? "+" : ""}${value.toFixed(2)}%`
  }

  // Format date
  const formatDate = (date) => {
    if (!date) return ""
    return new Date(date).toLocaleDateString([], {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  // Export analytics
  const exportAnalytics = () => {
    // In a real app, this would generate and download a CSV or PDF file
    alert("Analytics export would happen here")
  }

  return (
    <div className="p-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h3 className="text-lg font-medium">Trading Analytics</h3>

        <div className="flex items-center space-x-2 w-full sm:w-auto">
          {/* Time range selector */}
          <div className="flex bg-gray-800 rounded-md p-1 text-xs">
            {["1d", "1w", "1m", "3m", "1y", "all"].map((range) => (
              <button
                key={range}
                className={cn(
                  "px-2 py-1 rounded",
                  timeRange === range ? "bg-yellow-500 text-black" : "text-gray-400 hover:text-white",
                )}
                onClick={() => {
                  setTimeRange(range)
                  setShowCustomRange(false)
                }}
              >
                {range === "all" ? "All" : range.toUpperCase()}
              </button>
            ))}
            <button
              className={cn(
                "px-2 py-1 rounded flex items-center",
                showCustomRange ? "bg-yellow-500 text-black" : "text-gray-400 hover:text-white",
              )}
              onClick={() => setShowCustomRange(!showCustomRange)}
            >
              <Calendar className="h-3 w-3 mr-1" />
              <span>Custom</span>
            </button>
          </div>

          {/* Export button */}
          <button
            className="p-2 bg-gray-800 rounded-md text-gray-400 hover:text-white transition-colors"
            onClick={exportAnalytics}
            title="Export analytics"
          >
            <Download className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Custom date range */}
      {showCustomRange && (
        <div className="bg-gray-800/50 rounded-lg p-4 mb-6 flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm text-gray-400 mb-1">From Date</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
              <input
                type="date"
                className="w-full bg-gray-800 border-none rounded-md pl-10 pr-4 py-2 text-sm focus:ring-1 focus:ring-yellow-500 focus:outline-none"
                value={customDateRange.from || ""}
                onChange={(e) => setCustomDateRange({ ...customDateRange, from: e.target.value })}
              />
            </div>
          </div>
          <div className="flex-1">
            <label className="block text-sm text-gray-400 mb-1">To Date</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
              <input
                type="date"
                className="w-full bg-gray-800 border-none rounded-md pl-10 pr-4 py-2 text-sm focus:ring-1 focus:ring-yellow-500 focus:outline-none"
                value={customDateRange.to || ""}
                onChange={(e) => setCustomDateRange({ ...customDateRange, to: e.target.value })}
              />
            </div>
          </div>
          <div className="flex items-end">
            <button
              className="px-4 py-2 bg-yellow-500 hover:bg-yellow-400 text-black rounded-md transition-colors"
              onClick={() => setTimeRange("custom")}
            >
              Apply
            </button>
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="w-10 h-10 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : analytics.totalTrades > 0 ? (
        <div className="space-y-6">
          {/* Summary cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Net profit */}
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-800 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm text-gray-400">Net Profit</h4>
                <DollarSign className="h-5 w-5 text-yellow-500" />
              </div>
              <div className="flex items-baseline">
                <span className={cn("text-xl font-bold", analytics.netProfit >= 0 ? "text-green-500" : "text-red-500")}>
                  {formatCurrency(analytics.netProfit)}
                </span>
                <span
                  className={cn("ml-2 text-sm", analytics.profitPercentage >= 0 ? "text-green-500" : "text-red-500")}
                >
                  {formatPercentage(analytics.profitPercentage)}
                </span>
              </div>
            </div>

            {/* Win rate */}
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-800 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm text-gray-400">Win Rate</h4>
                <BarChart2 className="h-5 w-5 text-blue-500" />
              </div>
              <div className="flex items-baseline">
                <span className="text-xl font-bold">{analytics.winRate}%</span>
                <span className="ml-2 text-sm text-gray-400">
                  ({Math.round((analytics.totalTrades * analytics.winRate) / 100)}/{analytics.totalTrades} trades)
                </span>
              </div>
            </div>

            {/* Profit factor */}
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-800 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm text-gray-400">Profit Factor</h4>
                <TrendingUp className="h-5 w-5 text-green-500" />
              </div>
              <div className="flex items-baseline">
                <span
                  className={cn(
                    "text-xl font-bold",
                    analytics.profitFactor >= 2
                      ? "text-green-500"
                      : analytics.profitFactor >= 1
                        ? "text-yellow-500"
                        : "text-red-500",
                  )}
                >
                  {analytics.profitFactor.toFixed(2)}
                </span>
                <span className="ml-2 text-sm text-gray-400">(Profit/Loss ratio)</span>
              </div>
            </div>

            {/* Max drawdown */}
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-800 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm text-gray-400">Max Drawdown</h4>
                <PieChart className="h-5 w-5 text-red-500" />
              </div>
              <div className="flex items-baseline">
                <span className="text-xl font-bold text-red-500">{formatPercentage(-analytics.maxDrawdown)}</span>
                <span className="ml-2 text-sm text-gray-400">(Peak to trough)</span>
              </div>
            </div>
          </div>

          {/* Detailed stats */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left column */}
            <div className="space-y-6">
              {/* Trade statistics */}
              <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-800 rounded-xl p-4">
                <h4 className="text-sm font-medium text-gray-300 mb-4">Trade Statistics</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-xs text-gray-400 mb-1">Total Trades</div>
                    <div className="text-sm font-medium">{analytics.totalTrades}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-400 mb-1">Trades Per Day</div>
                    <div className="text-sm font-medium">{analytics.tradesPerDay.toFixed(1)}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-400 mb-1">Average Profit</div>
                    <div className="text-sm font-medium text-green-500">{formatCurrency(analytics.averageProfit)}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-400 mb-1">Average Loss</div>
                    <div className="text-sm font-medium text-red-500">{formatCurrency(analytics.averageLoss)}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-400 mb-1">Largest Profit</div>
                    <div className="text-sm font-medium text-green-500">{formatCurrency(analytics.largestProfit)}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-400 mb-1">Largest Loss</div>
                    <div className="text-sm font-medium text-red-500">{formatCurrency(analytics.largestLoss)}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-400 mb-1">Best Day</div>
                    <div className="text-sm font-medium">
                      {formatDate(analytics.bestDay.date)}:{" "}
                      <span className="text-green-500">{formatCurrency(analytics.bestDay.profit)}</span>
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-400 mb-1">Worst Day</div>
                    <div className="text-sm font-medium">
                      {formatDate(analytics.worstDay.date)}:{" "}
                      <span className="text-red-500">{formatCurrency(analytics.worstDay.loss)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Profit by market */}
              <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-800 rounded-xl p-4">
                <h4 className="text-sm font-medium text-gray-300 mb-4">Profit by Market</h4>
                <div className="space-y-3">
                  {analytics.profitByMarket.map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div
                          className="w-3 h-3 rounded-full mr-2"
                          style={{ backgroundColor: getMarketColor(index) }}
                        ></div>
                        <span className="text-sm">{item.market}</span>
                      </div>
                      <div className="flex items-baseline">
                        <span
                          className={cn("text-sm font-medium", item.profit >= 0 ? "text-green-500" : "text-red-500")}
                        >
                          {formatCurrency(item.profit)}
                        </span>
                        <span className="text-xs text-gray-400 ml-2">({item.percentage}%)</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Visualization */}
                <div className="mt-4 h-4 bg-gray-700 rounded-full overflow-hidden flex">
                  {analytics.profitByMarket.map((item, index) => (
                    <div
                      key={index}
                      className="h-full"
                      style={{
                        width: `${Math.abs(item.percentage)}%`,
                        backgroundColor: getMarketColor(index),
                        marginLeft: item.profit < 0 ? "auto" : "0",
                      }}
                      title={`${item.market}: ${formatCurrency(item.profit)} (${item.percentage}%)`}
                    ></div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right column */}
            <div className="space-y-6">
              {/* Profit by day of week */}
              <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-800 rounded-xl p-4">
                <h4 className="text-sm font-medium text-gray-300 mb-4">Profit by Day of Week</h4>
                <div className="h-40 flex items-end justify-between">
                  {analytics.profitByDay.map((item, index) => (
                    <div key={index} className="flex flex-col items-center">
                      <div
                        className={cn("w-8 rounded-t transition-all", item.profit >= 0 ? "bg-green-500" : "bg-red-500")}
                        style={{
                          height: `${Math.min(Math.abs(item.profit) / 20, 100)}%`,
                          minHeight: "4px",
                        }}
                      ></div>
                      <div className="text-xs text-gray-400 mt-2">{item.day}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Win/Loss by day of week */}
              <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-800 rounded-xl p-4">
                <h4 className="text-sm font-medium text-gray-300 mb-4">Win/Loss by Day of Week</h4>
                <div className="space-y-3">
                  {analytics.winLossByDay.map((item, index) => {
                    const total = item.wins + item.losses
                    const winPercentage = (item.wins / total) * 100
                    const lossPercentage = (item.losses / total) * 100

                    return (
                      <div key={index} className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">{item.day}</span>
                          <span className="text-xs text-gray-400">
                            {item.wins} wins, {item.losses} losses ({winPercentage.toFixed(0)}% win rate)
                          </span>
                        </div>
                        <div className="h-2 bg-gray-700 rounded-full overflow-hidden flex">
                          <div className="h-full bg-green-500" style={{ width: `${winPercentage}%` }}></div>
                          <div className="h-full bg-red-500" style={{ width: `${lossPercentage}%` }}></div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Additional metrics */}
              <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-800 rounded-xl p-4">
                <h4 className="text-sm font-medium text-gray-300 mb-4">Additional Metrics</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-xs text-gray-400 mb-1">Sharpe Ratio</div>
                    <div
                      className={cn(
                        "text-sm font-medium",
                        analytics.sharpeRatio >= 2
                          ? "text-green-500"
                          : analytics.sharpeRatio >= 1
                            ? "text-yellow-500"
                            : "text-red-500",
                      )}
                    >
                      {analytics.sharpeRatio.toFixed(2)}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-400 mb-1">Total Profit</div>
                    <div className="text-sm font-medium text-green-500">{formatCurrency(analytics.totalProfit)}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-400 mb-1">Total Loss</div>
                    <div className="text-sm font-medium text-red-500">{formatCurrency(analytics.totalLoss)}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-400 mb-1">Avg. Holding Time</div>
                    <div className="text-sm font-medium">2.3 days</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="py-12 text-center">
          <p className="text-gray-500">No trading data available for the selected time period.</p>
          <button
            className="mt-4 px-4 py-2 bg-yellow-500 hover:bg-yellow-400 text-black rounded-md transition-colors"
            onClick={() => setTimeRange("all")}
          >
            View All Time
          </button>
        </div>
      )}
    </div>
  )
}

// Helper function to get color for market visualization
function getMarketColor(index) {
  const colors = [
    "#10B981", // green
    "#3B82F6", // blue
    "#F59E0B", // yellow
    "#EF4444", // red
    "#8B5CF6", // purple
    "#EC4899", // pink
    "#06B6D4", // cyan
    "#F97316", // orange
  ]

  return colors[index % colors.length]
}
