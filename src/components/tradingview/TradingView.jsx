"use client"

import { useState, useEffect } from "react"
import { cn } from "@/components/lib/utils"
import TradingHeader from "@/components/tradingview/TradingHeader"
import OrderEntry from "@/components/tradingview/OrderEntry"
import PositionManager from "@/components/tradingview/PositionManager"
import OrderHistory from "@/components/tradingview/OrderHistory"
import TradingStrategies from "@/components/tradingview/TradingStrategies"
import RiskCalculator from "@/components/tradingview/RiskCalculator"
import TradeAnalytics from "@/components/tradingview/TradeAnalytics"
import { generatePositions, generateOrders, generateStrategies } from "@/components/tradingview/TradingDataGenerator"

export default function TradingView() {
  // Trading state
  const [selectedMarket, setSelectedMarket] = useState("BTC/USDT")
  const [marketData, setMarketData] = useState(null)
  const [positions, setPositions] = useState([])
  const [orders, setOrders] = useState([])
  const [orderHistory, setOrderHistory] = useState([])
  const [strategies, setStrategies] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("positions")
  const [tradingMode, setTradingMode] = useState("spot") // spot, margin, futures
  const [leverage, setLeverage] = useState(1)
  const [lastUpdated, setLastUpdated] = useState(null)
  const [accountBalance, setAccountBalance] = useState({
    total: 50000,
    available: 35000,
    inOrders: 15000,
    pnl: 2350,
    pnlPercentage: 4.7,
  })

  // Markets data
  const markets = [
    { id: "BTC/USDT", name: "Bitcoin", icon: "₿", category: "Crypto", price: 63500, change24h: 2.3 },
    { id: "ETH/USDT", name: "Ethereum", icon: "Ξ", category: "Crypto", price: 3450, change24h: 1.7 },
    { id: "SOL/USDT", name: "Solana", icon: "◎", category: "Crypto", price: 148, change24h: -0.8 },
    { id: "AAPL/USD", name: "Apple Inc", icon: "", category: "Stocks", price: 185, change24h: 0.5 },
    { id: "MSFT/USD", name: "Microsoft", icon: "", category: "Stocks", price: 415, change24h: 1.2 },
    { id: "EUR/USD", name: "Euro/USD", icon: "€", category: "Forex", price: 1.08, change24h: -0.3 },
    { id: "XAU/USD", name: "Gold", icon: "Au", category: "Commodities", price: 2350, change24h: 0.9 },
  ]

  // Fetch initial trading data
  useEffect(() => {
    const fetchTradingData = async () => {
      setIsLoading(true)

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Get current market
      const currentMarket = markets.find((m) => m.id === selectedMarket) || markets[0]
      setMarketData(currentMarket)

      // Generate mock data
      const mockPositions = generatePositions(selectedMarket, 5, tradingMode, leverage)
      const mockOrders = generateOrders(selectedMarket, 8)
      const mockOrderHistory = generateOrders(selectedMarket, 15, true)
      const mockStrategies = generateStrategies(3)

      setPositions(mockPositions)
      setOrders(mockOrders)
      setOrderHistory(mockOrderHistory)
      setStrategies(mockStrategies)
      setIsLoading(false)
      setLastUpdated(new Date())
    }

    fetchTradingData()

    return () => {
      // Cleanup if needed
    }
  }, [selectedMarket, tradingMode, leverage])

  // Refresh trading data
  const refreshTradingData = async () => {
    setIsLoading(true)

    // Get current market
    const currentMarket = markets.find((m) => m.id === selectedMarket) || markets[0]
    setMarketData(currentMarket)

    // Generate mock data
    const mockPositions = generatePositions(selectedMarket, 5, tradingMode, leverage)
    const mockOrders = generateOrders(selectedMarket, 8)
    const mockOrderHistory = generateOrders(selectedMarket, 15, true)
    const mockStrategies = generateStrategies(3)

    setPositions(mockPositions)
    setOrders(mockOrders)
    setOrderHistory(mockOrderHistory)
    setStrategies(mockStrategies)
    setIsLoading(false)
    setLastUpdated(new Date())
  }

  // Handle market change
  const handleMarketChange = (market) => {
    setSelectedMarket(market)
  }

  // Handle trading mode change
  const handleTradingModeChange = (mode) => {
    setTradingMode(mode)

    // Reset leverage when switching to spot
    if (mode === "spot") {
      setLeverage(1)
    }
  }

  // Handle leverage change
  const handleLeverageChange = (value) => {
    setLeverage(value)
  }

  // Place order
  const placeOrder = (orderData) => {
    // In a real app, this would send the order to an API
    console.log("Placing order:", orderData)

    // For demo, add to orders
    const newOrder = {
      id: Date.now().toString(),
      market: selectedMarket,
      type: orderData.type,
      side: orderData.side,
      price: orderData.price,
      amount: orderData.amount,
      total: orderData.price * orderData.amount,
      status: "open",
      filled: 0,
      created: new Date(),
    }

    setOrders((prev) => [newOrder, ...prev])

    // Update account balance
    setAccountBalance((prev) => ({
      ...prev,
      available: prev.available - newOrder.total,
      inOrders: prev.inOrders + newOrder.total,
    }))

    return newOrder
  }

  // Cancel order
  const cancelOrder = (orderId) => {
    // Find the order
    const order = orders.find((o) => o.id === orderId)
    if (!order) return false

    // Update account balance
    setAccountBalance((prev) => ({
      ...prev,
      available: prev.available + (order.total - order.filled * order.price),
      inOrders: prev.inOrders - (order.total - order.filled * order.price),
    }))

    // Remove from active orders and add to history
    setOrders((prev) => prev.filter((o) => o.id !== orderId))
    setOrderHistory((prev) => [
      {
        ...order,
        status: "canceled",
        updated: new Date(),
      },
      ...prev,
    ])

    return true
  }

  // Close position
  const closePosition = (positionId) => {
    // Find the position
    const position = positions.find((p) => p.id === positionId)
    if (!position) return false

    // Update account balance with realized PnL
    setAccountBalance((prev) => ({
      ...prev,
      total: prev.total + position.unrealizedPnl,
      available: prev.available + position.size + position.unrealizedPnl,
    }))

    // Remove from positions
    setPositions((prev) => prev.filter((p) => p.id !== positionId))

    // Add to order history
    setOrderHistory((prev) => [
      {
        id: Date.now().toString(),
        market: position.market,
        type: "market",
        side: position.side === "long" ? "sell" : "buy",
        price: position.markPrice,
        amount: position.size / position.markPrice,
        total: position.size,
        status: "filled",
        filled: position.size / position.markPrice,
        created: new Date(),
        updated: new Date(),
      },
      ...prev,
    ])

    return true
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

       <h2 className=" text-center pt-12 pb-12 text-5xl md:text-6xl font-bold text-transparent bg-gradient-to-r from-yellow-300 via-yellow-500 to-yellow-700 bg-clip-text drop-shadow-[0_0_10px_rgba(234,179,8,0.7)]">
  Trading View
</h2>




      <div className="relative z-10">
        {/* Trading header with account info and market selector */}
        <TradingHeader
          market={selectedMarket}
          marketData={marketData}
          markets={markets}
          isLoading={isLoading}
          onMarketChange={handleMarketChange}
          accountBalance={accountBalance}
          tradingMode={tradingMode}
          onTradingModeChange={handleTradingModeChange}
          leverage={leverage}
          onLeverageChange={handleLeverageChange}
          refreshTradingData={refreshTradingData}
          lastUpdated={lastUpdated}
        />

        {/* Main content area */}
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-12 gap-6 py-6">
          {/* Left side - Order entry and risk calculator */}
          <div className="lg:col-span-4 space-y-6">
            {/* Order entry form */}
            <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl overflow-hidden">
              <OrderEntry
                market={selectedMarket}
                marketData={marketData}
                isLoading={isLoading}
                tradingMode={tradingMode}
                leverage={leverage}
                accountBalance={accountBalance}
                onPlaceOrder={placeOrder}
              />
            </div>

            {/* Risk calculator */}
            <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl overflow-hidden">
              <RiskCalculator
                market={selectedMarket}
                marketData={marketData}
                accountBalance={accountBalance}
                tradingMode={tradingMode}
                leverage={leverage}
              />
            </div>
          </div>

          

          {/* Right side - Positions, orders, history, etc. */}
          <div className="lg:col-span-8 space-y-6">
            {/* Tabs */}
            <div className="flex border-b border-gray-800">
              <button
                className={cn(
                  "px-4 py-2 text-sm font-medium border-b-2 transition-colors",
                  activeTab === "positions"
                    ? "border-yellow-500 text-yellow-500"
                    : "border-transparent text-gray-400 hover:text-white",
                )}
                onClick={() => setActiveTab("positions")}
              >
                Positions & Orders
              </button>
              <button
                className={cn(
                  "px-4 py-2 text-sm font-medium border-b-2 transition-colors",
                  activeTab === "history"
                    ? "border-yellow-500 text-yellow-500"
                    : "border-transparent text-gray-400 hover:text-white",
                )}
                onClick={() => setActiveTab("history")}
              >
                Order History
              </button>
              <button
                className={cn(
                  "px-4 py-2 text-sm font-medium border-b-2 transition-colors",
                  activeTab === "strategies"
                    ? "border-yellow-500 text-yellow-500"
                    : "border-transparent text-gray-400 hover:text-white",
                )}
                onClick={() => setActiveTab("strategies")}
              >
                Trading Strategies
              </button>
              <button
                className={cn(
                  "px-4 py-2 text-sm font-medium border-b-2 transition-colors",
                  activeTab === "analytics"
                    ? "border-yellow-500 text-yellow-500"
                    : "border-transparent text-gray-400 hover:text-white",
                )}
                onClick={() => setActiveTab("analytics")}
              >
                Analytics
              </button>
            </div>

            {/* Tab content */}
            <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl overflow-hidden">
              {activeTab === "positions" && (
                <div>
                  <PositionManager
                    positions={positions}
                    orders={orders}
                    isLoading={isLoading}
                    onCancelOrder={cancelOrder}
                    onClosePosition={closePosition}
                    tradingMode={tradingMode}
                  />
                </div>
              )}

              {activeTab === "history" && (
                <div>
                  <OrderHistory orderHistory={orderHistory} isLoading={isLoading} />
                </div>
              )}

              {activeTab === "strategies" && (
                <div>
                  <TradingStrategies
                    strategies={strategies}
                    isLoading={isLoading}
                    market={selectedMarket}
                    marketData={marketData}
                  />
                </div>
              )}

              {activeTab === "analytics" && (
                <div>
                  <TradeAnalytics orderHistory={orderHistory} positions={positions} isLoading={isLoading} />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
