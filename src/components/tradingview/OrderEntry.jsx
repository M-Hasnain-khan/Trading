"use client"

import { useState, useEffect } from "react"
import { AlertTriangle, Info, ArrowRight } from "lucide-react"
import { cn } from "@/components/lib/utils"

export default function OrderEntry({
  market,
  marketData,
  isLoading,
  tradingMode,
  leverage,
  accountBalance,
  onPlaceOrder,
}) {
  // Order state
  const [orderType, setOrderType] = useState("limit") // limit, market, stop, stopLimit, oco
  const [side, setSide] = useState("buy") // buy, sell
  const [price, setPrice] = useState("")
  const [stopPrice, setStopPrice] = useState("")
  const [amount, setAmount] = useState("")
  const [total, setTotal] = useState("")
  const [sliderValue, setSliderValue] = useState(0)
  const [timeInForce, setTimeInForce] = useState("GTC") // GTC, IOC, FOK
  const [postOnly, setPostOnly] = useState(false)
  const [reduceOnly, setReduceOnly] = useState(false)
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [orderError, setOrderError] = useState("")

  // Update price when market data changes
  useEffect(() => {
    if (marketData && marketData.price) {
      setPrice(marketData.price.toFixed(2))
      setStopPrice((marketData.price * (side === "buy" ? 1.05 : 0.95)).toFixed(2))
    }
  }, [marketData, side])

  // Calculate total when price or amount changes
  useEffect(() => {
    if (price && amount) {
      const calculatedTotal = Number(price) * Number(amount)
      setTotal(calculatedTotal.toFixed(2))
    } else {
      setTotal("")
    }
  }, [price, amount])

  // Update amount when total changes
  const handleTotalChange = (value) => {
    setTotal(value)
    if (value && price && Number(price) > 0) {
      const calculatedAmount = Number(value) / Number(price)
      setAmount(calculatedAmount.toFixed(8))
    } else {
      setAmount("")
    }
  }

  // Handle slider change
  const handleSliderChange = (value) => {
    setSliderValue(value)

    // Calculate percentage of balance
    const percentage = value / 100

    if (side === "buy") {
      // For buy orders, use available balance
      const maxAmount = accountBalance.available
      const totalAmount = maxAmount * percentage
      handleTotalChange(totalAmount.toFixed(2))
    } else {
      // For sell orders, this would typically be based on the asset balance
      // For demo purposes, we'll use a mock value
      const maxAssetAmount = 1.5 // Example BTC balance
      const assetAmount = maxAssetAmount * percentage
      setAmount(assetAmount.toFixed(8))
    }
  }

  // Format currency
  const formatCurrency = (value, symbol = "$") => {
    if (!value) return `${symbol}0.00`
    return `${symbol}${Number(value).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`
  }

  // Validate order
  const validateOrder = () => {
    // Clear previous errors
    setOrderError("")

    // Check if price is valid for limit orders
    if (orderType !== "market" && (!price || Number(price) <= 0)) {
      setOrderError("Please enter a valid price")
      return false
    }

    // Check if stop price is valid for stop orders
    if (
      (orderType === "stop" || orderType === "stopLimit" || orderType === "oco") &&
      (!stopPrice || Number(stopPrice) <= 0)
    ) {
      setOrderError("Please enter a valid stop price")
      return false
    }

    // Check if amount is valid
    if (!amount || Number(amount) <= 0) {
      setOrderError("Please enter a valid amount")
      return false
    }

    // Check if total is within available balance for buy orders
    if (side === "buy" && Number(total) > accountBalance.available) {
      setOrderError("Insufficient balance")
      return false
    }

    return true
  }

  // Place order
  const handlePlaceOrder = () => {
    if (!validateOrder()) return

    const orderData = {
      market,
      type: orderType,
      side,
      price: orderType === "market" ? null : Number(price),
      stopPrice: ["stop", "stopLimit", "oco"].includes(orderType) ? Number(stopPrice) : null,
      amount: Number(amount),
      total: Number(total),
      timeInForce,
      postOnly,
      reduceOnly,
      leverage: tradingMode !== "spot" ? leverage : 1,
    }

    const result = onPlaceOrder(orderData)

    if (result) {
      // Reset form
      setAmount("")
      setTotal("")
      setSliderValue(0)
      setOrderError("")
    }
  }

  // Get max button text based on side
  const getMaxButtonText = () => {
    if (side === "buy") {
      return `Max: ${formatCurrency(accountBalance.available, "")}`
    } else {
      // In a real app, this would be the user's asset balance
      return "Max: 1.5 BTC"
    }
  }

  return (
    <div className="p-4">
      <div className="mb-4">
        <h3 className="text-lg font-medium mb-4">Place Order</h3>

        <div className="space-y-4">
          {/* Buy/Sell toggle */}
          <div className="grid grid-cols-2 bg-gray-800 rounded-lg p-1">
            <button
              className={cn(
                "py-2 rounded-md font-medium transition-colors",
                side === "buy" ? "bg-green-500 text-black" : "text-gray-400 hover:text-white",
              )}
              onClick={() => setSide("buy")}
            >
              Buy
            </button>
            <button
              className={cn(
                "py-2 rounded-md font-medium transition-colors",
                side === "sell" ? "bg-red-500 text-black" : "text-gray-400 hover:text-white",
              )}
              onClick={() => setSide("sell")}
            >
              Sell
            </button>
          </div>

          {/* Order type tabs */}
          <div className="flex border-b border-gray-800 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-800 scrollbar-track-transparent">
            {["limit", "market", "stop", "stopLimit", "oco"].map((type) => (
              <button
                key={type}
                className={cn(
                  "px-3 py-2 text-sm font-medium whitespace-nowrap border-b-2 transition-colors",
                  orderType === type
                    ? "border-yellow-500 text-yellow-500"
                    : "border-transparent text-gray-400 hover:text-white",
                )}
                onClick={() => setOrderType(type)}
              >
                {type === "oco" ? "OCO" : type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>

          {/* Order form fields */}
          <div className="space-y-4">
            {/* Price field (not shown for market orders) */}
            {orderType !== "market" && (
              <div>
                <label className="block text-sm text-gray-400 mb-1">Price</label>
                <div className="relative">
                  <input
                    type="text"
                    className="w-full bg-gray-800 border border-gray-700 rounded-md px-4 py-2 focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500 focus:outline-none"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="0.00"
                    disabled={isLoading}
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <span className="text-sm text-gray-500">{market.split("/")[1]}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Stop price (for stop, stopLimit, and OCO orders) */}
            {(orderType === "stop" || orderType === "stopLimit" || orderType === "oco") && (
              <div>
                <label className="block text-sm text-gray-400 mb-1">
                  {orderType === "oco" ? "Stop Price" : "Trigger Price"}
                </label>
                <div className="relative">
                  <input
                    type="text"
                    className="w-full bg-gray-800 border border-gray-700 rounded-md px-4 py-2 focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500 focus:outline-none"
                    value={stopPrice}
                    onChange={(e) => setStopPrice(e.target.value)}
                    placeholder="0.00"
                    disabled={isLoading}
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <span className="text-sm text-gray-500">{market.split("/")[1]}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Amount field */}
            <div>
              <label className="block text-sm text-gray-400 mb-1">Amount</label>
              <div className="relative">
                <input
                  type="text"
                  className="w-full bg-gray-800 border border-gray-700 rounded-md px-4 py-2 focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500 focus:outline-none"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  disabled={isLoading}
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <span className="text-sm text-gray-500">{market.split("/")[0]}</span>
                </div>
              </div>
            </div>

            {/* Total field */}
            <div>
              <label className="block text-sm text-gray-400 mb-1">Total</label>
              <div className="relative">
                <input
                  type="text"
                  className="w-full bg-gray-800 border border-gray-700 rounded-md px-4 py-2 focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500 focus:outline-none"
                  value={total}
                  onChange={(e) => handleTotalChange(e.target.value)}
                  placeholder="0.00"
                  disabled={isLoading || orderType === "market"}
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <span className="text-sm text-gray-500">{market.split("/")[1]}</span>
                </div>
              </div>
            </div>

            {/* Amount slider */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-gray-400">0%</span>
                <button
                  className="text-xs text-yellow-500 hover:text-yellow-400"
                  onClick={() => handleSliderChange(100)}
                >
                  {getMaxButtonText()}
                </button>
                <span className="text-xs text-gray-400">100%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={sliderValue}
                onChange={(e) => handleSliderChange(Number(e.target.value))}
                className="w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-yellow-500"
                disabled={isLoading}
              />
              <div className="flex items-center justify-between mt-1">
                <span className="text-xs text-gray-400">Amount: {sliderValue}%</span>
              </div>
            </div>

            {/* Advanced options toggle */}
            <div>
              <button
                className="text-sm text-yellow-500 hover:text-yellow-400 flex items-center"
                onClick={() => setShowAdvanced(!showAdvanced)}
              >
                {showAdvanced ? "Hide" : "Show"} Advanced Options
                <ArrowRight
                  className={cn("h-4 w-4 ml-1 transition-transform", showAdvanced && "transform rotate-90")}
                />
              </button>
            </div>

            {/* Advanced options */}
            {showAdvanced && (
              <div className="space-y-3 pt-2 border-t border-gray-800">
                {/* Time in force */}
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Time In Force</label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      className={cn(
                        "py-1 text-xs font-medium rounded-md transition-colors",
                        timeInForce === "GTC"
                          ? "bg-yellow-500 text-black"
                          : "bg-gray-800 text-gray-400 hover:bg-gray-700",
                      )}
                      onClick={() => setTimeInForce("GTC")}
                    >
                      GTC
                    </button>
                    <button
                      className={cn(
                        "py-1 text-xs font-medium rounded-md transition-colors",
                        timeInForce === "IOC"
                          ? "bg-yellow-500 text-black"
                          : "bg-gray-800 text-gray-400 hover:bg-gray-700",
                      )}
                      onClick={() => setTimeInForce("IOC")}
                    >
                      IOC
                    </button>
                    <button
                      className={cn(
                        "py-1 text-xs font-medium rounded-md transition-colors",
                        timeInForce === "FOK"
                          ? "bg-yellow-500 text-black"
                          : "bg-gray-800 text-gray-400 hover:bg-gray-700",
                      )}
                      onClick={() => setTimeInForce("FOK")}
                    >
                      FOK
                    </button>
                  </div>
                </div>

                {/* Post only checkbox */}
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="postOnly"
                    checked={postOnly}
                    onChange={(e) => setPostOnly(e.target.checked)}
                    className="h-4 w-4 rounded border-gray-700 text-yellow-500 focus:ring-yellow-500"
                  />
                  <label htmlFor="postOnly" className="ml-2 text-sm text-gray-300">
                    Post Only
                  </label>
                </div>

                {/* Reduce only checkbox (for margin/futures) */}
                {tradingMode !== "spot" && (
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="reduceOnly"
                      checked={reduceOnly}
                      onChange={(e) => setReduceOnly(e.target.checked)}
                      className="h-4 w-4 rounded border-gray-700 text-yellow-500 focus:ring-yellow-500"
                    />
                    <label htmlFor="reduceOnly" className="ml-2 text-sm text-gray-300">
                      Reduce Only
                    </label>
                  </div>
                )}
              </div>
            )}

            {/* Leverage indicator (for margin/futures) */}
            {tradingMode !== "spot" && (
              <div className="flex items-center justify-between py-2 px-3 bg-yellow-500/10 border border-yellow-500/30 rounded-md">
                <div className="flex items-center text-sm text-yellow-500">
                  <Info className="h-4 w-4 mr-2" />
                  <span>Trading with {leverage}x leverage</span>
                </div>
                <div className="text-sm font-medium text-yellow-500">
                  {tradingMode === "margin" ? "Margin" : "Futures"}
                </div>
              </div>
            )}

            {/* Error message */}
            {orderError && (
              <div className="flex items-start space-x-2 bg-red-500/10 border border-red-500/30 rounded-md p-3">
                <AlertTriangle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-red-500">{orderError}</p>
                </div>
              </div>
            )}

            {/* Order button */}
            <button
              className={cn(
                "w-full py-3 rounded-md font-medium transition-colors",
                isLoading
                  ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                  : side === "buy"
                    ? "bg-green-500 hover:bg-green-600 text-black"
                    : "bg-red-500 hover:bg-red-600 text-black",
              )}
              disabled={isLoading}
              onClick={handlePlaceOrder}
            >
              {isLoading ? "Loading..." : `${side === "buy" ? "Buy" : "Sell"} ${market.split("/")[0]}`}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
