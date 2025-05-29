"use client"

import { useState, useEffect, useRef } from "react"
import { cn } from "@/components/lib/utils"
import MarketHeader from "@/components/marketoverview/MarketHeader"
import TradingChart from "@/components/marketoverview/TradingChart"
import OrderBook from "@/components/marketoverview/OrderBook"
import MarketDepth from "@/components/marketoverview/MarketDepth"
import RecentTrades from "@/components/marketoverview/RecentTrades"
import MarketStats from "@/components/marketoverview/MarketStats"

import {
  generateMarketData,
  generateOrderBook,
  generateTrades,
} from "@/components/marketoverview/MarketDataGenerator"

export default function MarketView() {
  const [selectedMarket, setSelectedMarket] = useState("BTC/USDT")
  const [marketData, setMarketData] = useState(null)
  const [orderBook, setOrderBook] = useState({ bids: [], asks: [] })
  const [trades, setTrades] = useState([])
  const [timeframe, setTimeframe] = useState("1h")
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("orderBook")
  const [chartType, setChartType] = useState("candlestick")
  const [showIndicators, setShowIndicators] = useState(true)
  const [priceAlert, setPriceAlert] = useState(null)
  const [layout, setLayout] = useState("default")
  const [theme, setTheme] = useState("dark")
  const [lastUpdated, setLastUpdated] = useState(null)

  const priceRef = useRef(null)
  const volumeRef = useRef(null)

  const markets = [
    { id: "BTC/USDT", name: "Bitcoin", icon: "₿", category: "Crypto" },
    { id: "ETH/USDT", name: "Ethereum", icon: "Ξ", category: "Crypto" },
    { id: "SOL/USDT", name: "Solana", icon: "◎", category: "Crypto" },
    { id: "AAPL/USD", name: "Apple Inc", icon: "", category: "Stocks" },
    { id: "MSFT/USD", name: "Microsoft", icon: "", category: "Stocks" },
    { id: "EUR/USD", name: "Euro/USD", icon: "€", category: "Forex" },
    { id: "XAU/USD", name: "Gold", icon: "Au", category: "Commodities" },
  ]

  useEffect(() => {
    const fetchMarketData = async () => {
      setIsLoading(true)
      await new Promise((resolve) => setTimeout(resolve, 1000))
      const data = generateMarketData(selectedMarket)
      const orders = generateOrderBook(data.price)
      const recentTrades = generateTrades(data.price, 50)
      setMarketData(data)
      setOrderBook(orders)
      setTrades(recentTrades)
      setIsLoading(false)
      setLastUpdated(new Date())
    }

    fetchMarketData()
    return () => {}
  }, [selectedMarket])

  const refreshMarketData = async () => {
    setIsLoading(true)
    const data = generateMarketData(selectedMarket)
    const orders = generateOrderBook(data.price)
    const recentTrades = generateTrades(data.price, 50)

    if (marketData && priceRef.current) {
      const priceChange = data.price - marketData.price
      priceRef.current.classList.remove("text-green-500", "text-red-500")
      priceRef.current.classList.add(
        priceChange >= 0 ? "text-green-500" : "text-red-500"
      )
      setTimeout(() => {
        priceRef.current?.classList.remove("text-green-500", "text-red-500")
      }, 1000)
    }

    setMarketData(data)
    setOrderBook(orders)
    setTrades(recentTrades)
    setIsLoading(false)
    setLastUpdated(new Date())
  }

  const handleMarketChange = (market) => {
    setSelectedMarket(market)
    setIsLoading(true)
    setPriceAlert(null)
  }

  const handleSetAlert = (price, type) => {
    setPriceAlert({ price, type })
  }

  const refreshTrades = async () => {
    if (!marketData) return
    const newTrades = generateTrades(marketData.price, 50)
    setTrades(newTrades)
  }

  return (
    <section className="bg-black text-white min-h-screen relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900 to-black opacity-80 z-0"></div>
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-yellow-500/50 to-transparent"></div>

      {/* Animated background elements */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-yellow-500/5 rounded-full blur-3xl animate-pulse"></div>
      <div
        className="absolute bottom-1/3 left-1/5 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl animate-pulse"
        style={{ animationDelay: "1s" }}
      ></div>

      <div className="relative z-10">
        {/* Gradient Heading */}


        <div className="text-center pb-12 pt-12">
          <h2 className="text-5xl md:text-6xl font-bold">
            <span className=" text-transparent bg-gradient-to-r from-yellow-300 via-yellow-500 to-yellow-700 bg-clip-text drop-shadow-[0_0_10px_rgba(234,179,8,0.7)]">
              Market View
            </span>
          </h2>
        </div>

        {/* Market header */}
        <MarketHeader
          market={selectedMarket}
          marketData={marketData}
          markets={markets}
          isLoading={isLoading}
          onMarketChange={handleMarketChange}
          priceRef={priceRef}
          onSetAlert={handleSetAlert}
          currentAlert={priceAlert}
          refreshMarketData={refreshMarketData}
          lastUpdated={lastUpdated}
        />

        {/* Main content */}
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-12 gap-6 py-6">
          {/* Left - Chart + Stats */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl overflow-hidden h-[500px]">
              <TradingChart
                market={selectedMarket}
                marketData={marketData}
                timeframe={timeframe}
                chartType={chartType}
                showIndicators={showIndicators}
                isLoading={isLoading}
                onTimeframeChange={setTimeframe}
                onChartTypeChange={setChartType}
                onToggleIndicators={setShowIndicators}
              />
            </div>

            <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl overflow-hidden">
              <MarketStats
                market={selectedMarket}
                marketData={marketData}
                isLoading={isLoading}
                volumeRef={volumeRef}
              />
            </div>
          </div>

          {/* Right - Tabs and Content */}
          <div className="lg:col-span-4 space-y-6">
            <div className="flex lg:hidden border-b border-gray-800">
              {["orderBook", "marketDepth", "recentTrades"].map((tab) => (
                <button
                  key={tab}
                  className={cn(
                    "flex-1 py-2 text-sm font-medium",
                    activeTab === tab
                      ? "text-yellow-500 border-b-2 border-yellow-500"
                      : "text-gray-400"
                  )}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab === "orderBook"
                    ? "Order Book"
                    : tab === "marketDepth"
                    ? "Depth"
                    : "Trades"}
                </button>
              ))}
            </div>

            <div
              className={cn(
                "bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl overflow-hidden",
                activeTab !== "orderBook" && "lg:block hidden"
              )}
            >
              <OrderBook
                market={selectedMarket}
                orderBook={orderBook}
                currentPrice={marketData?.price}
                isLoading={isLoading}
              />
            </div>

            <div
              className={cn(
                "bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl overflow-hidden",
                activeTab !== "marketDepth" && "lg:block hidden"
              )}
            >
              <MarketDepth
                market={selectedMarket}
                orderBook={orderBook}
                currentPrice={marketData?.price}
                isLoading={isLoading}
              />
            </div>

            <div
              className={cn(
                "bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl overflow-hidden",
                activeTab !== "recentTrades" && "lg:block hidden"
              )}
            >
              <RecentTrades
                market={selectedMarket}
                trades={trades}
                isLoading={isLoading}
                onRefresh={refreshTrades}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
