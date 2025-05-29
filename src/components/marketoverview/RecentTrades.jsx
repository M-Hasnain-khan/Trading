"use client"

import { useState } from "react"
import { ArrowUp, ArrowDown, RefreshCw } from "lucide-react"
import { cn } from "@/components/lib/utils"

export default function RecentTrades({ market, trades, isLoading, onRefresh }) {
  const [filter, setFilter] = useState("all") // all, buys, sells
  const [displayCount, setDisplayCount] = useState(10) // Number of trades to display
  const [showFullTable, setShowFullTable] = useState(false) // Toggle between compact and full view

  // Format price with appropriate precision
  const formatPrice = (price) => {
    if (!price) return "0.00"
    return price < 1 ? price.toFixed(6) : price.toFixed(2)
  }

  // Format amount
  const formatAmount = (amount) => {
    if (!amount) return "0.00"
    return amount.toFixed(4)
  }

  // Format time
  const formatTime = (time) => {
    if (!time) return ""
    return time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })
  }

  // Filter trades
  const filteredTrades = trades.filter((trade) => {
    if (filter === "all") return true
    if (filter === "buys") return trade.type === "buy"
    if (filter === "sells") return trade.type === "sell"
    return true
  })

  // Get visible trades based on display count
  const visibleTrades = filteredTrades.slice(0, displayCount)

  // Toggle between compact and full view
  const toggleView = () => {
    setShowFullTable(!showFullTable)
    setDisplayCount(showFullTable ? 10 : 20)
  }

  return (
    <div className={cn("flex flex-col transition-all duration-300", showFullTable ? "h-[500px]" : "h-[300px]")}>
      <div className="flex items-center justify-between border-b border-gray-800 p-3">
        <h3 className="text-sm font-medium">Recent Trades</h3>

        <div className="flex items-center space-x-2">
          {/* Filter buttons */}
          <div className="flex items-center space-x-1 bg-gray-800 rounded-md p-1">
            <button
              className={cn("text-xs px-2 py-0.5 rounded", filter === "all" && "bg-gray-700")}
              onClick={() => setFilter("all")}
            >
              All
            </button>
            <button
              className={cn("text-xs px-2 py-0.5 rounded", filter === "buys" && "bg-gray-700")}
              onClick={() => setFilter("buys")}
            >
              Buys
            </button>
            <button
              className={cn("text-xs px-2 py-0.5 rounded", filter === "sells" && "bg-gray-700")}
              onClick={() => setFilter("sells")}
            >
              Sells
            </button>
          </div>

          {/* Refresh button */}
          {onRefresh && (
            <button
              className="p-1 bg-gray-800 rounded hover:bg-gray-700 text-gray-400"
              onClick={onRefresh}
              title="Refresh trades"
            >
              <RefreshCw className="h-3.5 w-3.5" />
            </button>
          )}

          {/* Toggle view button */}
          <button className="text-xs bg-gray-800 hover:bg-gray-700 px-2 py-1 rounded" onClick={toggleView}>
            {showFullTable ? "Compact" : "Expand"}
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        {isLoading ? (
          <div className="h-full flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <>
            {/* Column headers */}
            <div className="grid grid-cols-7 text-xs text-gray-500 px-3 py-2 border-b border-gray-800">
              <div className="col-span-1">Type</div>
              <div className="col-span-2">Price</div>
              <div className="col-span-2 text-right">Amount</div>
              <div className="col-span-2 text-right">Time</div>
            </div>

            {/* Trades list */}
            <div className="overflow-y-auto scrollbar-thin scrollbar-thumb-gray-800 scrollbar-track-transparent h-full">
              {filteredTrades.length > 0 ? (
                visibleTrades.map((trade) => (
                  <div
                    key={trade.id}
                    className="grid grid-cols-7 text-xs px-3 py-1.5 hover:bg-gray-800/50 border-b border-gray-800/30"
                  >
                    <div className="col-span-1">
                      {trade.type === "buy" ? (
                        <div className="flex items-center">
                          <ArrowUp className="h-3 w-3 text-green-500 mr-1" />
                          <span className="text-green-500">Buy</span>
                        </div>
                      ) : (
                        <div className="flex items-center">
                          <ArrowDown className="h-3 w-3 text-red-500 mr-1" />
                          <span className="text-red-500">Sell</span>
                        </div>
                      )}
                    </div>
                    <div className={cn("col-span-2", trade.type === "buy" ? "text-green-500" : "text-red-500")}>
                      {formatPrice(trade.price)}
                    </div>
                    <div className="col-span-2 text-right">{formatAmount(trade.amount)}</div>
                    <div className="col-span-2 text-right text-gray-400">{formatTime(trade.time)}</div>
                  </div>
                ))
              ) : (
                <div className="h-full flex items-center justify-center text-gray-500 text-sm">No trades found</div>
              )}
            </div>

            {/* Show more button */}
            {filteredTrades.length > displayCount && (
              <div className="p-2 text-center border-t border-gray-800">
                <button
                  className="text-xs text-yellow-500 hover:text-yellow-400"
                  onClick={() => setDisplayCount((prev) => prev + 10)}
                >
                  Show more trades
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
