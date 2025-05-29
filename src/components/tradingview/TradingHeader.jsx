"use client"

import { useState, useEffect, useRef } from "react"
import { Search, ChevronDown, RefreshCw, Clock, Wallet, Settings } from "lucide-react"
import { cn } from "@/components/lib/utils"

export default function TradingHeader({
  market,
  marketData,
  markets,
  isLoading,
  onMarketChange,
  accountBalance,
  tradingMode,
  onTradingModeChange,
  leverage,
  onLeverageChange,
  refreshTradingData,
  lastUpdated,
}) {
  const [isMarketSelectorOpen, setIsMarketSelectorOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)

  const marketSelectorRef = useRef(null)
  const searchInputRef = useRef(null)
  const settingsRef = useRef(null)

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (marketSelectorRef.current && !marketSelectorRef.current.contains(event.target)) {
        setIsMarketSelectorOpen(false)
      }
      if (settingsRef.current && !settingsRef.current.contains(event.target)) {
        setIsSettingsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Focus search input when market selector opens
  useEffect(() => {
    if (isMarketSelectorOpen && searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }, [isMarketSelectorOpen])

  // Filter markets based on search term
  const filteredMarkets = markets.filter(
    (m) =>
      m.id.toLowerCase().includes(searchTerm.toLowerCase()) || m.name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Group markets by category
  const groupedMarkets = filteredMarkets.reduce((acc, market) => {
    if (!acc[market.category]) {
      acc[market.category] = []
    }
    acc[market.category].push(market)
    return acc
  }, {})

  // Format currency
  const formatCurrency = (value, symbol = "$") => {
    if (value === undefined || value === null) return `${symbol}0.00`
    return `${symbol}${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  }

  // Format percentage
  const formatPercentage = (value) => {
    if (value === undefined || value === null) return "0.00%"
    return `${value > 0 ? "+" : ""}${value.toFixed(2)}%`
  }

  // Format last updated time
  const formatLastUpdated = (date) => {
    if (!date) return ""
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })
  }

  // Get current market data
  const currentMarket = markets.find((m) => m.id === market) || {}

  return (
    <div className="border-b border-gray-800 bg-gray-900/70 backdrop-blur-md sticky top-0 z-20">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Market selector */}
          <div className="relative" ref={marketSelectorRef}>
            <button
              className="flex items-center space-x-2 bg-gray-800/50 hover:bg-gray-800 px-4 py-2 rounded-lg transition-colors"
              onClick={() => setIsMarketSelectorOpen(!isMarketSelectorOpen)}
            >
              <div className="flex items-center">
                <span className="w-8 h-8 flex items-center justify-center bg-gray-700 rounded-full mr-2 text-yellow-500 font-bold">
                  {currentMarket.icon || market.substring(0, 1)}
                </span>
                <div className="flex flex-col items-start">
                  <span className="font-semibold">{market}</span>
                  <span className="text-xs text-gray-400">{currentMarket.name}</span>
                </div>
              </div>
              <ChevronDown
                className={cn(
                  "h-5 w-5 text-gray-400 transition-transform",
                  isMarketSelectorOpen && "transform rotate-180",
                )}
              />
            </button>

            {/* Market selector dropdown */}
            {isMarketSelectorOpen && (
              <div className="absolute top-full left-0 mt-2 w-80 max-h-96 overflow-y-auto bg-gray-900 border border-gray-800 rounded-lg shadow-xl z-30 animate-scale-in">
                <div className="p-3 border-b border-gray-800">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                    <input
                      ref={searchInputRef}
                      type="text"
                      placeholder="Search markets..."
                      className="w-full bg-gray-800 border-none rounded-md pl-10 pr-4 py-2 text-sm focus:ring-1 focus:ring-yellow-500 focus:outline-none"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>

                <div className="p-2">
                  {Object.keys(groupedMarkets).length > 0 ? (
                    Object.entries(groupedMarkets).map(([category, markets]) => (
                      <div key={category} className="mb-3">
                        <h3 className="text-xs font-semibold text-gray-500 px-2 mb-1">{category}</h3>
                        <div className="space-y-1">
                          {markets.map((m) => (
                            <button
                              key={m.id}
                              className={cn(
                                "w-full flex items-center justify-between px-3 py-2 rounded-md hover:bg-gray-800 transition-colors",
                                market === m.id && "bg-gray-800 text-yellow-500",
                              )}
                              onClick={() => {
                                onMarketChange(m.id)
                                setIsMarketSelectorOpen(false)
                                setSearchTerm("")
                              }}
                            >
                              <div className="flex items-center">
                                <span className="w-6 h-6 flex items-center justify-center bg-gray-700 rounded-full mr-2 text-yellow-500 text-xs font-bold">
                                  {m.icon || m.id.substring(0, 1)}
                                </span>
                                <div className="flex flex-col items-start">
                                  <span className="font-medium">{m.id}</span>
                                  <span className="text-xs text-gray-400">{m.name}</span>
                                </div>
                              </div>
                              <div className="flex flex-col items-end">
                                <span className="text-sm">{formatCurrency(m.price, "")}</span>
                                <span className={m.change24h >= 0 ? "text-green-500 text-xs" : "text-red-500 text-xs"}>
                                  {formatPercentage(m.change24h)}
                                </span>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="py-8 text-center text-gray-500">
                      <p>No markets found</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Account balance */}
          <div className="flex items-center space-x-6">
            <div className="flex flex-col">
              <div className="flex items-center text-xs text-gray-400 mb-1">
                <Wallet className="h-3.5 w-3.5 mr-1" />
                <span>Total Balance</span>
              </div>
              <div className="flex items-baseline">
                <span className="text-lg font-bold">
                  {isLoading ? (
                    <div className="h-6 w-24 bg-gray-800 animate-pulse rounded"></div>
                  ) : (
                    formatCurrency(accountBalance.total)
                  )}
                </span>
                <span
                  className={cn(
                    "ml-2 text-xs font-medium",
                    !isLoading && accountBalance.pnlPercentage > 0 ? "text-green-500" : "text-red-500",
                  )}
                >
                  {isLoading ? (
                    <div className="h-4 w-16 bg-gray-800 animate-pulse rounded"></div>
                  ) : (
                    formatPercentage(accountBalance.pnlPercentage)
                  )}
                </span>
              </div>
            </div>

            {/* Available balance */}
            <div className="hidden md:flex flex-col">
              <span className="text-xs text-gray-400 mb-1">Available</span>
              <span className="font-medium">
                {isLoading ? (
                  <div className="h-5 w-20 bg-gray-800 animate-pulse rounded"></div>
                ) : (
                  formatCurrency(accountBalance.available)
                )}
              </span>
            </div>

            {/* In orders */}
            <div className="hidden md:flex flex-col">
              <span className="text-xs text-gray-400 mb-1">In Orders</span>
              <span className="font-medium">
                {isLoading ? (
                  <div className="h-5 w-20 bg-gray-800 animate-pulse rounded"></div>
                ) : (
                  formatCurrency(accountBalance.inOrders)
                )}
              </span>
            </div>

            {/* PnL */}
            <div className="hidden md:flex flex-col">
              <span className="text-xs text-gray-400 mb-1">Unrealized P&L</span>
              <span
                className={cn("font-medium", !isLoading && accountBalance.pnl > 0 ? "text-green-500" : "text-red-500")}
              >
                {isLoading ? (
                  <div className="h-5 w-20 bg-gray-800 animate-pulse rounded"></div>
                ) : (
                  formatCurrency(accountBalance.pnl)
                )}
              </span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center space-x-3">
            {/* Last updated time */}
            {lastUpdated && (
              <div className="hidden md:flex items-center text-xs text-gray-400 mr-2">
                <Clock className="h-3.5 w-3.5 mr-1" />
                <span>Updated: {formatLastUpdated(lastUpdated)}</span>
              </div>
            )}

            {/* Refresh button */}
            <button
              className="p-2 rounded-full bg-gray-800 text-gray-400 hover:text-white transition-colors"
              onClick={refreshTradingData}
              title="Refresh trading data"
            >
              <RefreshCw className="h-5 w-5" />
            </button>

            {/* Trading settings */}
            <div className="relative" ref={settingsRef}>
              <button
                className="p-2 rounded-full bg-gray-800 text-gray-400 hover:text-white transition-colors"
                onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                title="Trading settings"
              >
                <Settings className="h-5 w-5" />
              </button>

              {isSettingsOpen && (
                <div className="absolute top-full right-0 mt-2 w-64 bg-gray-900 border border-gray-800 rounded-lg shadow-xl z-30 animate-scale-in">
                  <div className="p-3 border-b border-gray-800">
                    <h3 className="text-sm font-medium">Trading Settings</h3>
                  </div>

                  <div className="p-4 space-y-4">
                    {/* Trading mode selector */}
                    <div>
                      <label className="block text-xs text-gray-400 mb-2">Trading Mode</label>
                      <div className="grid grid-cols-3 gap-2">
                        <button
                          className={cn(
                            "py-2 text-xs font-medium rounded-md transition-colors",
                            tradingMode === "spot"
                              ? "bg-yellow-500 text-black"
                              : "bg-gray-800 text-gray-400 hover:bg-gray-700",
                          )}
                          onClick={() => onTradingModeChange("spot")}
                        >
                          Spot
                        </button>
                        <button
                          className={cn(
                            "py-2 text-xs font-medium rounded-md transition-colors",
                            tradingMode === "margin"
                              ? "bg-yellow-500 text-black"
                              : "bg-gray-800 text-gray-400 hover:bg-gray-700",
                          )}
                          onClick={() => onTradingModeChange("margin")}
                        >
                          Margin
                        </button>
                        <button
                          className={cn(
                            "py-2 text-xs font-medium rounded-md transition-colors",
                            tradingMode === "futures"
                              ? "bg-yellow-500 text-black"
                              : "bg-gray-800 text-gray-400 hover:bg-gray-700",
                          )}
                          onClick={() => onTradingModeChange("futures")}
                        >
                          Futures
                        </button>
                      </div>
                    </div>

                    {/* Leverage slider (only for margin and futures) */}
                    {tradingMode !== "spot" && (
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <label className="text-xs text-gray-400">Leverage</label>
                          <span className="text-xs font-medium">{leverage}x</span>
                        </div>
                        <input
                          type="range"
                          min="1"
                          max={tradingMode === "margin" ? "10" : "100"}
                          step={tradingMode === "margin" ? "1" : "5"}
                          value={leverage}
                          onChange={(e) => onLeverageChange(Number(e.target.value))}
                          className="w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-yellow-500"
                        />
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-xs text-gray-500">1x</span>
                          <span className="text-xs text-gray-500">{tradingMode === "margin" ? "10x" : "100x"}</span>
                        </div>
                      </div>
                    )}

                    {/* Other settings could go here */}
                    <div className="pt-2 border-t border-gray-800">
                      <button className="w-full py-2 text-sm bg-yellow-500 hover:bg-yellow-400 text-black rounded-md transition-colors">
                        Apply Settings
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
