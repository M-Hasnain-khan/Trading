"use client"

import { useState, useEffect, useRef } from "react"
import { Settings } from "lucide-react"
import { cn } from "@/components/lib/utils"

export default function OrderBook({ market, orderBook, currentPrice, isLoading }) {
  const [precision, setPrecision] = useState(2)
  const [grouping, setGrouping] = useState(0.1)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [displayMode, setDisplayMode] = useState("both") // both, bids, asks

  const settingsRef = useRef(null)
  const lastPriceRef = useRef(null)
  const prevPriceRef = useRef(null)

  // Close settings when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (settingsRef.current && !settingsRef.current.contains(event.target)) {
        setIsSettingsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Flash price animation when price changes
  useEffect(() => {
    if (!currentPrice || !prevPriceRef.current) return

    const priceChanged = currentPrice !== prevPriceRef.current

    if (priceChanged && lastPriceRef.current) {
      lastPriceRef.current.classList.remove("text-green-500", "text-red-500")
      lastPriceRef.current.classList.add(currentPrice > prevPriceRef.current ? "text-green-500" : "text-red-500")

      setTimeout(() => {
        if (lastPriceRef.current) {
          lastPriceRef.current.classList.remove("text-green-500", "text-red-500")
        }
      }, 1000)
    }

    prevPriceRef.current = currentPrice
  }, [currentPrice])

  // Group orders by price level
  const groupOrders = (orders, isAsk) => {
    if (!orders || orders.length === 0) return []

    const grouped = {}

    orders.forEach((order) => {
      // Round price to nearest grouping
      const roundedPrice = Math.round(order.price / grouping) * grouping

      if (!grouped[roundedPrice]) {
        grouped[roundedPrice] = {
          price: roundedPrice,
          amount: 0,
          total: 0,
        }
      }

      grouped[roundedPrice].amount += order.amount
    })

    // Convert to array and sort
    let result = Object.values(grouped)

    // Sort asks ascending, bids descending
    result = isAsk ? result.sort((a, b) => a.price - b.price) : result.sort((a, b) => b.price - a.price)

    // Calculate cumulative total
    let runningTotal = 0
    result.forEach((level) => {
      runningTotal += level.amount
      level.total = runningTotal
    })

    return result
  }

  // Format price with appropriate precision
  const formatPrice = (price) => {
    if (!price) return "0.00"
    return price.toFixed(precision)
  }

  // Format amount
  const formatAmount = (amount) => {
    if (!amount) return "0.00"
    return amount.toFixed(4)
  }

  // Get max total for depth visualization
  const getMaxTotal = () => {
    const bids = groupOrders(orderBook.bids, false)
    const asks = groupOrders(orderBook.asks, true)

    const maxBidTotal = bids.length > 0 ? bids[bids.length - 1].total : 0
    const maxAskTotal = asks.length > 0 ? asks[asks.length - 1].total : 0

    return Math.max(maxBidTotal, maxAskTotal)
  }

  const maxTotal = getMaxTotal()
  const groupedBids = groupOrders(orderBook.bids, false)
  const groupedAsks = groupOrders(orderBook.asks, true)

  // Limit number of visible rows
  const visibleRows = 15
  const visibleBids = groupedBids.slice(0, visibleRows)
  const visibleAsks = groupedAsks.slice(0, visibleRows)

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between border-b border-gray-800 p-3">
        <h3 className="text-sm font-medium">Order Book</h3>

        <div className="flex items-center space-x-2">
          {/* Display mode toggle */}
          <div className="flex items-center space-x-1 bg-gray-800 rounded-md p-1">
            <button
              className={cn("text-xs px-2 py-0.5 rounded", displayMode === "both" && "bg-gray-700")}
              onClick={() => setDisplayMode("both")}
            >
              All
            </button>
            <button
              className={cn("text-xs px-2 py-0.5 rounded", displayMode === "bids" && "bg-gray-700")}
              onClick={() => setDisplayMode("bids")}
            >
              Bids
            </button>
            <button
              className={cn("text-xs px-2 py-0.5 rounded", displayMode === "asks" && "bg-gray-700")}
              onClick={() => setDisplayMode("asks")}
            >
              Asks
            </button>
          </div>

          {/* Settings */}
          <div className="relative" ref={settingsRef}>
            <button
              className="p-1 bg-gray-800 rounded hover:bg-gray-700"
              onClick={() => setIsSettingsOpen(!isSettingsOpen)}
            >
              <Settings className="h-4 w-4 text-gray-400" />
            </button>

            {isSettingsOpen && (
              <div className="absolute top-full right-0 mt-1 bg-gray-900 border border-gray-800 rounded-md shadow-lg z-10 w-48 py-1 animate-scale-in">
                <div className="px-3 py-2 border-b border-gray-800">
                  <span className="text-sm font-medium text-gray-300">Order Book Settings</span>
                </div>

                <div className="p-3 space-y-3">
                  {/* Precision selector */}
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Price Precision</label>
                    <div className="flex items-center space-x-1">
                      {[0, 1, 2, 3, 4].map((p) => (
                        <button
                          key={p}
                          className={cn(
                            "flex-1 text-xs py-1 rounded",
                            precision === p
                              ? "bg-yellow-500 text-black"
                              : "bg-gray-800 text-gray-400 hover:bg-gray-700",
                          )}
                          onClick={() => setPrecision(p)}
                        >
                          {p}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Grouping selector */}
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Group By</label>
                    <div className="flex items-center space-x-1">
                      {[0.01, 0.1, 1, 10, 100].map((g) => (
                        <button
                          key={g}
                          className={cn(
                            "flex-1 text-xs py-1 rounded",
                            grouping === g ? "bg-yellow-500 text-black" : "bg-gray-800 text-gray-400 hover:bg-gray-700",
                          )}
                          onClick={() => setGrouping(g)}
                        >
                          {g < 1 ? g.toFixed(2) : g}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-hidden flex flex-col">
        {isLoading ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <>
            {/* Column headers */}
            <div className="grid grid-cols-3 text-xs text-gray-500 px-3 py-2 border-b border-gray-800">
              <div>Price</div>
              <div className="text-right">Amount</div>
              <div className="text-right">Total</div>
            </div>

            {/* Order book content */}
            <div className="flex-1 overflow-hidden flex flex-col">
              {/* Asks (sell orders) */}
              {(displayMode === "both" || displayMode === "asks") && (
                <div className="overflow-y-auto scrollbar-thin scrollbar-thumb-gray-800 scrollbar-track-transparent max-h-[40%]">
                  {visibleAsks.map((ask, index) => (
                    <div
                      key={`ask-${ask.price}-${index}`}
                      className="grid grid-cols-3 text-xs px-3 py-1 relative hover:bg-gray-800/50"
                    >
                      {/* Depth visualization */}
                      <div
                        className="absolute top-0 right-0 h-full bg-red-500/20"
                        style={{ width: `${(ask.total / maxTotal) * 100}%` }}
                      ></div>

                      {/* Price */}
                      <div className="text-red-500 z-10">{formatPrice(ask.price)}</div>

                      {/* Amount */}
                      <div className="text-right z-10">{formatAmount(ask.amount)}</div>

                      {/* Total */}
                      <div className="text-right z-10">{formatAmount(ask.total)}</div>
                    </div>
                  ))}
                </div>
              )}

              {/* Current price */}
              {displayMode === "both" && (
                <div className="border-y border-gray-800 px-3 py-2 bg-gray-800/30">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400">Last Price</span>
                    <span ref={lastPriceRef} className="text-sm font-medium transition-colors duration-300">
                      {formatPrice(currentPrice)}
                    </span>
                  </div>
                </div>
              )}

              {/* Bids (buy orders) */}
              {(displayMode === "both" || displayMode === "bids") && (
                <div className="overflow-y-auto scrollbar-thin scrollbar-thumb-gray-800 scrollbar-track-transparent max-h-[40%]">
                  {visibleBids.map((bid, index) => (
                    <div
                      key={`bid-${bid.price}-${index}`}
                      className="grid grid-cols-3 text-xs px-3 py-1 relative hover:bg-gray-800/50"
                    >
                      {/* Depth visualization */}
                      <div
                        className="absolute top-0 right-0 h-full bg-green-500/20"
                        style={{ width: `${(bid.total / maxTotal) * 100}%` }}
                      ></div>

                      {/* Price */}
                      <div className="text-green-500 z-10">{formatPrice(bid.price)}</div>

                      {/* Amount */}
                      <div className="text-right z-10">{formatAmount(bid.amount)}</div>

                      {/* Total */}
                      <div className="text-right z-10">{formatAmount(bid.total)}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
