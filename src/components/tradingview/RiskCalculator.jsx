"use client"

import { useState, useEffect } from "react"
import { AlertTriangle, HelpCircle } from "lucide-react"
import { cn } from "@/components/lib/utils"

export default function RiskCalculator({ market, marketData, accountBalance, tradingMode, leverage }) {
  // Risk calculator state
  const [entryPrice, setEntryPrice] = useState("")
  const [stopLossPrice, setStopLossPrice] = useState("")
  const [takeProfitPrice, setTakeProfitPrice] = useState("")
  const [positionSize, setPositionSize] = useState("")
  const [riskAmount, setRiskAmount] = useState("")
  const [riskPercentage, setRiskPercentage] = useState("1")
  const [side, setSide] = useState("long")
  const [showTooltip, setShowTooltip] = useState(null)

  // Update entry price when market data changes
  useEffect(() => {
    if (marketData && marketData.price) {
      setEntryPrice(marketData.price.toFixed(2))

      // Set default stop loss and take profit based on side
      if (side === "long") {
        setStopLossPrice((marketData.price * 0.95).toFixed(2))
        setTakeProfitPrice((marketData.price * 1.1).toFixed(2))
      } else {
        setStopLossPrice((marketData.price * 1.05).toFixed(2))
        setTakeProfitPrice((marketData.price * 0.9).toFixed(2))
      }
    }
  }, [marketData, side])

  // Calculate position size based on risk
  useEffect(() => {
    if (entryPrice && stopLossPrice && accountBalance.total) {
      // Calculate risk amount based on percentage
      const riskAmt = accountBalance.total * (Number(riskPercentage) / 100)
      setRiskAmount(riskAmt.toFixed(2))

      // Calculate position size
      const priceDifference = Math.abs(Number(entryPrice) - Number(stopLossPrice))
      if (priceDifference > 0) {
        const size = (riskAmt / priceDifference) * Number(entryPrice)
        // Apply leverage if in margin or futures mode
        const leveragedSize = tradingMode !== "spot" ? size * leverage : size
        setPositionSize(leveragedSize.toFixed(2))
      }
    }
  }, [entryPrice, stopLossPrice, accountBalance.total, riskPercentage, tradingMode, leverage])

  // Format currency
  const formatCurrency = (value, symbol = "$") => {
    if (!value) return `${symbol}0.00`
    return `${symbol}${Number(value).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`
  }

  // Calculate risk/reward ratio
  const calculateRiskRewardRatio = () => {
    if (!entryPrice || !stopLossPrice || !takeProfitPrice) return "—"

    const entry = Number(entryPrice)
    const sl = Number(stopLossPrice)
    const tp = Number(takeProfitPrice)

    // For long positions
    if (side === "long") {
      if (sl >= entry || tp <= entry) return "Invalid"
      const risk = entry - sl
      const reward = tp - entry
      return (reward / risk).toFixed(2)
    }
    // For short positions
    else {
      if (sl <= entry || tp >= entry) return "Invalid"
      const risk = sl - entry
      const reward = entry - tp
      return (reward / risk).toFixed(2)
    }
  }

  // Calculate potential profit
  const calculatePotentialProfit = () => {
    if (!entryPrice || !takeProfitPrice || !positionSize) return "—"

    const entry = Number(entryPrice)
    const tp = Number(takeProfitPrice)
    const size = Number(positionSize)

    // For long positions
    if (side === "long") {
      if (tp <= entry) return "Invalid"
      const profitPercentage = ((tp - entry) / entry) * 100
      const profit = (size / entry) * (tp - entry)
      return {
        amount: profit.toFixed(2),
        percentage: profitPercentage.toFixed(2),
      }
    }
    // For short positions
    else {
      if (tp >= entry) return "Invalid"
      const profitPercentage = ((entry - tp) / entry) * 100
      const profit = (size / entry) * (entry - tp)
      return {
        amount: profit.toFixed(2),
        percentage: profitPercentage.toFixed(2),
      }
    }
  }

  // Calculate potential loss
  const calculatePotentialLoss = () => {
    if (!entryPrice || !stopLossPrice || !positionSize) return "—"

    const entry = Number(entryPrice)
    const sl = Number(stopLossPrice)
    const size = Number(positionSize)

    // For long positions
    if (side === "long") {
      if (sl >= entry) return "Invalid"
      const lossPercentage = ((entry - sl) / entry) * 100
      const loss = (size / entry) * (entry - sl)
      return {
        amount: loss.toFixed(2),
        percentage: lossPercentage.toFixed(2),
      }
    }
    // For short positions
    else {
      if (sl <= entry) return "Invalid"
      const lossPercentage = ((sl - entry) / entry) * 100
      const loss = (size / entry) * (sl - entry)
      return {
        amount: loss.toFixed(2),
        percentage: lossPercentage.toFixed(2),
      }
    }
  }

  // Get tooltip content
  const getTooltipContent = (type) => {
    switch (type) {
      case "riskReward":
        return "Risk/Reward Ratio is the potential profit divided by the potential loss. A higher ratio means a better trade setup."
      case "positionSize":
        return "Position Size is calculated based on your risk tolerance and the distance between your entry and stop loss."
      case "riskPercentage":
        return "Risk Percentage is how much of your total account balance you're willing to risk on this trade."
      default:
        return ""
    }
  }

  // Potential profit and loss calculations
  const potentialProfit = calculatePotentialProfit()
  const potentialLoss = calculatePotentialLoss()
  const riskRewardRatio = calculateRiskRewardRatio()

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium">Risk Calculator</h3>

        {/* Long/Short toggle */}
        <div className="flex bg-gray-800 rounded-lg p-1">
          <button
            className={cn(
              "px-3 py-1 text-sm font-medium rounded-md transition-colors",
              side === "long" ? "bg-green-500 text-black" : "text-gray-400 hover:text-white",
            )}
            onClick={() => setSide("long")}
          >
            Long
          </button>
          <button
            className={cn(
              "px-3 py-1 text-sm font-medium rounded-md transition-colors",
              side === "short" ? "bg-red-500 text-black" : "text-gray-400 hover:text-white",
            )}
            onClick={() => setSide("short")}
          >
            Short
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {/* Entry price */}
        <div>
          <label className="block text-sm text-gray-400 mb-1">Entry Price</label>
          <div className="relative">
            <input
              type="text"
              className="w-full bg-gray-800 border border-gray-700 rounded-md px-4 py-2 focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500 focus:outline-none"
              value={entryPrice}
              onChange={(e) => setEntryPrice(e.target.value)}
              placeholder="0.00"
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <span className="text-sm text-gray-500">{market.split("/")[1]}</span>
            </div>
          </div>
        </div>

        {/* Stop Loss price */}
        <div>
          <label className="block text-sm text-gray-400 mb-1">Stop Loss Price</label>
          <div className="relative">
            <input
              type="text"
              className={cn(
                "w-full bg-gray-800 border rounded-md px-4 py-2 focus:ring-1 focus:outline-none",
                side === "long" && Number(stopLossPrice) >= Number(entryPrice)
                  ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                  : side === "short" && Number(stopLossPrice) <= Number(entryPrice)
                    ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                    : "border-gray-700 focus:ring-yellow-500 focus:border-yellow-500",
              )}
              value={stopLossPrice}
              onChange={(e) => setStopLossPrice(e.target.value)}
              placeholder="0.00"
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <span className="text-sm text-gray-500">{market.split("/")[1]}</span>
            </div>
          </div>
          {side === "long" && Number(stopLossPrice) >= Number(entryPrice) && (
            <p className="text-xs text-red-500 mt-1">Stop loss must be below entry price for long positions</p>
          )}
          {side === "short" && Number(stopLossPrice) <= Number(entryPrice) && (
            <p className="text-xs text-red-500 mt-1">Stop loss must be above entry price for short positions</p>
          )}
        </div>

        {/* Take Profit price */}
        <div>
          <label className="block text-sm text-gray-400 mb-1">Take Profit Price</label>
          <div className="relative">
            <input
              type="text"
              className={cn(
                "w-full bg-gray-800 border rounded-md px-4 py-2 focus:ring-1 focus:outline-none",
                side === "long" && Number(takeProfitPrice) <= Number(entryPrice)
                  ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                  : side === "short" && Number(takeProfitPrice) >= Number(entryPrice)
                    ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                    : "border-gray-700 focus:ring-yellow-500 focus:border-yellow-500",
              )}
              value={takeProfitPrice}
              onChange={(e) => setTakeProfitPrice(e.target.value)}
              placeholder="0.00"
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <span className="text-sm text-gray-500">{market.split("/")[1]}</span>
            </div>
          </div>
          {side === "long" && Number(takeProfitPrice) <= Number(entryPrice) && (
            <p className="text-xs text-red-500 mt-1">Take profit must be above entry price for long positions</p>
          )}
          {side === "short" && Number(takeProfitPrice) >= Number(entryPrice) && (
            <p className="text-xs text-red-500 mt-1">Take profit must be below entry price for short positions</p>
          )}
        </div>

        {/* Risk percentage slider */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-sm text-gray-400 flex items-center">
              Risk Percentage
              <button
                className="ml-1 text-gray-500 hover:text-gray-300"
                onClick={() => setShowTooltip(showTooltip === "riskPercentage" ? null : "riskPercentage")}
              >
                <HelpCircle className="h-3.5 w-3.5" />
              </button>
            </label>
            <span className="text-sm font-medium">{riskPercentage}%</span>
          </div>
          {showTooltip === "riskPercentage" && (
            <div className="mb-2 p-2 bg-gray-800 rounded-md text-xs text-gray-300">
              {getTooltipContent("riskPercentage")}
            </div>
          )}
          <input
            type="range"
            min="0.1"
            max="5"
            step="0.1"
            value={riskPercentage}
            onChange={(e) => setRiskPercentage(e.target.value)}
            className="w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-yellow-500"
          />
          <div className="flex items-center justify-between mt-1">
            <span className="text-xs text-gray-500">0.1%</span>
            <span className="text-xs text-gray-500">5%</span>
          </div>
        </div>

        {/* Risk amount */}
        <div className="flex items-center justify-between py-2 px-3 bg-gray-800/70 rounded-md">
          <span className="text-sm text-gray-400">Risk Amount:</span>
          <span className="text-sm font-medium">{formatCurrency(riskAmount)}</span>
        </div>

        {/* Position size */}
        <div className="flex items-center justify-between py-2 px-3 bg-gray-800/70 rounded-md relative">
          <div className="flex items-center">
            <span className="text-sm text-gray-400">Position Size:</span>
            <button
              className="ml-1 text-gray-500 hover:text-gray-300"
              onClick={() => setShowTooltip(showTooltip === "positionSize" ? null : "positionSize")}
            >
              <HelpCircle className="h-3.5 w-3.5" />
            </button>
          </div>
          <span className="text-sm font-medium">{formatCurrency(positionSize, "")}</span>
          {showTooltip === "positionSize" && (
            <div className="absolute top-full left-0 mt-2 p-2 bg-gray-800 rounded-md text-xs text-gray-300 z-10 w-full">
              {getTooltipContent("positionSize")}
            </div>
          )}
        </div>

        {/* Risk/Reward ratio */}
        <div className="flex items-center justify-between py-2 px-3 bg-gray-800/70 rounded-md relative">
          <div className="flex items-center">
            <span className="text-sm text-gray-400">Risk/Reward Ratio:</span>
            <button
              className="ml-1 text-gray-500 hover:text-gray-300"
              onClick={() => setShowTooltip(showTooltip === "riskReward" ? null : "riskReward")}
            >
              <HelpCircle className="h-3.5 w-3.5" />
            </button>
          </div>
          <span
            className={cn(
              "text-sm font-medium",
              riskRewardRatio === "Invalid"
                ? "text-red-500"
                : Number(riskRewardRatio) >= 2
                  ? "text-green-500"
                  : Number(riskRewardRatio) >= 1
                    ? "text-yellow-500"
                    : "text-red-500",
            )}
          >
            {riskRewardRatio === "—" ? "—" : riskRewardRatio === "Invalid" ? "Invalid" : `1:${riskRewardRatio}`}
          </span>
          {showTooltip === "riskReward" && (
            <div className="absolute top-full left-0 mt-2 p-2 bg-gray-800 rounded-md text-xs text-gray-300 z-10 w-full">
              {getTooltipContent("riskReward")}
            </div>
          )}
        </div>

        {/* Potential profit */}
        <div className="flex items-center justify-between py-2 px-3 bg-green-500/10 border border-green-500/30 rounded-md">
          <span className="text-sm text-green-500">Potential Profit:</span>
          <div className="text-right">
            <div className="text-sm font-medium text-green-500">
              {potentialProfit === "—" || potentialProfit === "Invalid"
                ? potentialProfit
                : formatCurrency(potentialProfit.amount)}
            </div>
            {potentialProfit !== "—" && potentialProfit !== "Invalid" && (
              <div className="text-xs text-green-500">{potentialProfit.percentage}%</div>
            )}
          </div>
        </div>

        {/* Potential loss */}
        <div className="flex items-center justify-between py-2 px-3 bg-red-500/10 border border-red-500/30 rounded-md">
          <span className="text-sm text-red-500">Potential Loss:</span>
          <div className="text-right">
            <div className="text-sm font-medium text-red-500">
              {potentialLoss === "—" || potentialLoss === "Invalid"
                ? potentialLoss
                : formatCurrency(potentialLoss.amount)}
            </div>
            {potentialLoss !== "—" && potentialLoss !== "Invalid" && (
              <div className="text-xs text-red-500">{potentialLoss.percentage}%</div>
            )}
          </div>
        </div>

        {/* Risk warning */}
        <div className="flex items-start space-x-2 bg-yellow-500/10 border border-yellow-500/30 rounded-md p-3">
          <AlertTriangle className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-yellow-500">Trading involves significant risk</p>
            <p className="text-xs text-gray-400 mt-1">
              This calculator is for informational purposes only. Always manage your risk carefully.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
