"use client"

import { useState, useEffect, useRef } from "react"
import { Search, ChevronDown, Bell, Star, AlertTriangle, ArrowUp, ArrowDown, X, RefreshCw, Clock } from "lucide-react"
import { cn } from "@/components/lib/utils"

export default function MarketHeader({
  market,
  marketData,
  markets,
  isLoading,
  onMarketChange,
  priceRef,
  onSetAlert,
  currentAlert,
  refreshMarketData,
  lastUpdated,
}) {
  const [isMarketSelectorOpen, setIsMarketSelectorOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false)
  const [alertPrice, setAlertPrice] = useState("")
  const [alertType, setAlertType] = useState("above")
  const [isFavorite, setIsFavorite] = useState(false)

  const marketSelectorRef = useRef(null)
  const searchInputRef = useRef(null)

  // Close market selector when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (marketSelectorRef.current && !marketSelectorRef.current.contains(event.target)) {
        setIsMarketSelectorOpen(false)
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

  // Format price with appropriate decimals
  const formatPrice = (price) => {
    if (!price) return "0.00"
    return price < 1 ? price.toFixed(6) : price.toFixed(2)
  }

  // Format percentage change
  const formatChange = (change) => {
    if (!change) return "0.00%"
    return `${change > 0 ? "+" : ""}${change.toFixed(2)}%`
  }

  // Format last updated time
  const formatLastUpdated = (date) => {
    if (!date) return ""
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })
  }

  // Handle setting price alert
  const handleSetAlert = () => {
    if (!alertPrice || isNaN(Number.parseFloat(alertPrice))) return

    onSetAlert(Number.parseFloat(alertPrice), alertType)
    setIsAlertModalOpen(false)
    setAlertPrice("")
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
                              {market === m.id && <div className="h-2 w-2 rounded-full bg-yellow-500"></div>}
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

          {/* Price and stats */}
          <div className="flex items-center space-x-6">
            {/* Current price */}
            <div className="flex flex-col">
              <div className="flex items-baseline">
                <span ref={priceRef} className="text-2xl font-bold transition-colors duration-300">
                  {isLoading ? (
                    <div className="h-8 w-24 bg-gray-800 animate-pulse rounded"></div>
                  ) : (
                    formatPrice(marketData?.price)
                  )}
                </span>
                <span className="ml-2 text-sm font-medium text-gray-400">{market.split("/")[1]}</span>
              </div>
              <div
                className={cn(
                  "text-sm font-medium",
                  !isLoading && marketData?.change24h > 0 ? "text-green-500" : "text-red-500",
                )}
              >
                {isLoading ? (
                  <div className="h-4 w-16 bg-gray-800 animate-pulse rounded mt-1"></div>
                ) : (
                  formatChange(marketData?.change24h)
                )}
              </div>
            </div>

            {/* 24h stats */}
            <div className="hidden md:grid grid-cols-3 gap-6">
              <div className="flex flex-col">
                <span className="text-xs text-gray-400">24h High</span>
                <span className="font-medium">
                  {isLoading ? (
                    <div className="h-5 w-16 bg-gray-800 animate-pulse rounded mt-1"></div>
                  ) : (
                    formatPrice(marketData?.high24h)
                  )}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-gray-400">24h Low</span>
                <span className="font-medium">
                  {isLoading ? (
                    <div className="h-5 w-16 bg-gray-800 animate-pulse rounded mt-1"></div>
                  ) : (
                    formatPrice(marketData?.low24h)
                  )}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-gray-400">24h Volume</span>
                <span className="font-medium">
                  {isLoading ? (
                    <div className="h-5 w-16 bg-gray-800 animate-pulse rounded mt-1"></div>
                  ) : (
                    `$${(marketData?.volume24h / 1000000).toFixed(2)}M`
                  )}
                </span>
              </div>
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

            <button
              className="p-2 rounded-full bg-gray-800 text-gray-400 hover:text-white transition-colors"
              onClick={refreshMarketData}
              title="Refresh market data"
            >
              <RefreshCw className="h-5 w-5" />
            </button>

            <button
              className={cn(
                "p-2 rounded-full transition-colors",
                isFavorite ? "bg-yellow-500/20 text-yellow-500" : "bg-gray-800 text-gray-400 hover:text-white",
              )}
              onClick={() => setIsFavorite(!isFavorite)}
              title={isFavorite ? "Remove from favorites" : "Add to favorites"}
            >
              <Star className={cn("h-5 w-5", isFavorite && "fill-yellow-500")} />
            </button>

            <button
              className={cn(
                "p-2 rounded-full transition-colors",
                currentAlert ? "bg-yellow-500/20 text-yellow-500" : "bg-gray-800 text-gray-400 hover:text-white",
              )}
              onClick={() => setIsAlertModalOpen(true)}
              title="Set price alert"
            >
              <Bell className="h-5 w-5" />
            </button>

            <button className="hidden md:flex items-center space-x-2 bg-yellow-500 hover:bg-yellow-400 text-black px-4 py-2 rounded-lg transition-colors">
              <span className="font-medium">Trade Now</span>
            </button>
          </div>
        </div>
      </div>

      {/* Price alert modal */}
      {isAlertModalOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-gray-900 border border-gray-800 rounded-xl w-full max-w-md p-6 animate-scale-in">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">Set Price Alert</h3>
              <button className="text-gray-400 hover:text-white" onClick={() => setIsAlertModalOpen(false)}>
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-400 mb-1">Alert me when price is</label>
              <div className="flex space-x-2 mb-4">
                <button
                  className={cn(
                    "flex-1 flex items-center justify-center space-x-1 py-2 rounded-md border",
                    alertType === "above"
                      ? "bg-green-500/20 border-green-500 text-green-500"
                      : "bg-gray-800 border-gray-700 text-gray-400",
                  )}
                  onClick={() => setAlertType("above")}
                >
                  <ArrowUp className="h-4 w-4" />
                  <span>Above</span>
                </button>
                <button
                  className={cn(
                    "flex-1 flex items-center justify-center space-x-1 py-2 rounded-md border",
                    alertType === "below"
                      ? "bg-red-500/20 border-red-500 text-red-500"
                      : "bg-gray-800 border-gray-700 text-gray-400",
                  )}
                  onClick={() => setAlertType("below")}
                >
                  <ArrowDown className="h-4 w-4" />
                  <span>Below</span>
                </button>
              </div>

              <div className="relative">
                <input
                  type="text"
                  placeholder={`Enter price in ${market.split("/")[1]}`}
                  className="w-full bg-gray-800 border border-gray-700 rounded-md px-4 py-2 focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500 focus:outline-none"
                  value={alertPrice}
                  onChange={(e) => setAlertPrice(e.target.value)}
                />
                {marketData && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
                    <button
                      className="text-xs bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded"
                      onClick={() => setAlertPrice(formatPrice(marketData.price * 1.01))}
                    >
                      +1%
                    </button>
                    <button
                      className="text-xs bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded"
                      onClick={() => setAlertPrice(formatPrice(marketData.price * 0.99))}
                    >
                      -1%
                    </button>
                  </div>
                )}
              </div>

              {currentAlert && (
                <div className="mt-4 flex items-start space-x-2 bg-yellow-500/10 border border-yellow-500/30 rounded-md p-3">
                  <AlertTriangle className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-yellow-500">
                      You already have an alert set for when price goes {currentAlert.type}{" "}
                      {formatPrice(currentAlert.price)}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">Setting a new alert will replace the existing one.</p>
                  </div>
                </div>
              )}
            </div>

            <div className="flex space-x-3">
              <button
                className="flex-1 bg-gray-800 hover:bg-gray-700 text-white py-2 rounded-md transition-colors"
                onClick={() => setIsAlertModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="flex-1 bg-yellow-500 hover:bg-yellow-400 text-black py-2 rounded-md transition-colors"
                onClick={handleSetAlert}
              >
                Set Alert
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
