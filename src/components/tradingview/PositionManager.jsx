"use client"

import { useState } from "react"
import { ArrowUp, ArrowDown, X, TrendingUp, Clock, Wallet } from "lucide-react"
import { cn } from "@/components/lib/utils"

export default function PositionManager({ positions, orders, isLoading, onCancelOrder, onClosePosition, tradingMode }) {
  const [activeTab, setActiveTab] = useState("positions")
  const [showClosingConfirm, setShowClosingConfirm] = useState(null)
  const [showCancelConfirm, setShowCancelConfirm] = useState(null)

  // Format currency
  const formatCurrency = (value, symbol = "$") => {
    if (!value && value !== 0) return `${symbol}0.00`
    return `${symbol}${Number(value).toLocaleString(undefined, {
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
    return new Date(date).toLocaleString([], {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  // Handle position close
  const handleClosePosition = (positionId) => {
    const result = onClosePosition(positionId)
    if (result) {
      setShowClosingConfirm(null)
    }
  }

  // Handle order cancel
  const handleCancelOrder = (orderId) => {
    const result = onCancelOrder(orderId)
    if (result) {
      setShowCancelConfirm(null)
    }
  }

  return (
    <div className="p-4">
      {/* Tabs */}
      <div className="flex border-b border-gray-800 mb-4">
        <button
          className={cn(
            "px-4 py-2 text-sm font-medium border-b-2 transition-colors",
            activeTab === "positions"
              ? "border-yellow-500 text-yellow-500"
              : "border-transparent text-gray-400 hover:text-white",
          )}
          onClick={() => setActiveTab("positions")}
        >
          {tradingMode === "spot" ? "Holdings" : "Positions"}
        </button>
        <button
          className={cn(
            "px-4 py-2 text-sm font-medium border-b-2 transition-colors",
            activeTab === "orders"
              ? "border-yellow-500 text-yellow-500"
              : "border-transparent text-gray-400 hover:text-white",
          )}
          onClick={() => setActiveTab("orders")}
        >
          Open Orders
        </button>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="w-10 h-10 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <>
          {/* Positions tab */}
          {activeTab === "positions" && (
            <div>
              {positions.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="text-xs text-gray-500 border-b border-gray-800">
                        <th className="px-4 py-2 text-left">Market</th>
                        <th className="px-4 py-2 text-left">Side</th>
                        <th className="px-4 py-2 text-right">Size</th>
                        <th className="px-4 py-2 text-right">Entry Price</th>
                        <th className="px-4 py-2 text-right">Mark Price</th>
                        <th className="px-4 py-2 text-right">Liquidation</th>
                        <th className="px-4 py-2 text-right">PnL</th>
                        <th className="px-4 py-2 text-right">ROE</th>
                        <th className="px-4 py-2 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {positions.map((position) => (
                        <tr key={position.id} className="text-sm border-b border-gray-800/50 hover:bg-gray-800/30">
                          <td className="px-4 py-3">
                            <div className="font-medium">{position.market}</div>
                            {tradingMode !== "spot" && (
                              <div className="text-xs text-gray-400">{position.leverage}x</div>
                            )}
                          </td>
                          <td className="px-4 py-3">
                            <div
                              className={cn(
                                "flex items-center",
                                position.side === "long" ? "text-green-500" : "text-red-500",
                              )}
                            >
                              {position.side === "long" ? (
                                <>
                                  <ArrowUp className="h-4 w-4 mr-1" />
                                  <span>Long</span>
                                </>
                              ) : (
                                <>
                                  <ArrowDown className="h-4 w-4 mr-1" />
                                  <span>Short</span>
                                </>
                              )}
                            </div>
                          </td>
                          <td className="px-4 py-3 text-right">
                            <div>{formatCurrency(position.size, "")}</div>
                            <div className="text-xs text-gray-400">
                              {position.amount} {position.market.split("/")[0]}
                            </div>
                          </td>
                          <td className="px-4 py-3 text-right">{formatCurrency(position.entryPrice, "")}</td>
                          <td className="px-4 py-3 text-right">{formatCurrency(position.markPrice, "")}</td>
                          <td className="px-4 py-3 text-right">
                            {tradingMode !== "spot" ? (
                              formatCurrency(position.liquidationPrice, "")
                            ) : (
                              <span className="text-gray-500">—</span>
                            )}
                          </td>
                          <td
                            className={cn(
                              "px-4 py-3 text-right",
                              position.unrealizedPnl > 0 ? "text-green-500" : "text-red-500",
                            )}
                          >
                            <div>{formatCurrency(position.unrealizedPnl)}</div>
                            <div className="text-xs">{formatPercentage(position.unrealizedPnlPercentage)}</div>
                          </td>
                          <td
                            className={cn("px-4 py-3 text-right", position.roe > 0 ? "text-green-500" : "text-red-500")}
                          >
                            {tradingMode !== "spot" ? (
                              formatPercentage(position.roe)
                            ) : (
                              <span className="text-gray-500">—</span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-center">
                            {showClosingConfirm === position.id ? (
                              <div className="flex items-center space-x-2">
                                <button
                                  className="px-2 py-1 bg-red-500 text-white text-xs rounded"
                                  onClick={() => handleClosePosition(position.id)}
                                >
                                  Confirm
                                </button>
                                <button
                                  className="px-2 py-1 bg-gray-700 text-white text-xs rounded"
                                  onClick={() => setShowClosingConfirm(null)}
                                >
                                  Cancel
                                </button>
                              </div>
                            ) : (
                              <button
                                className="px-3 py-1 bg-gray-800 hover:bg-gray-700 text-white text-xs rounded"
                                onClick={() => setShowClosingConfirm(position.id)}
                              >
                                Close
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="py-12 text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-800 mb-4">
                    {tradingMode === "spot" ? (
                      <Wallet className="h-8 w-8 text-gray-500" />
                    ) : (
                      <TrendingUp className="h-8 w-8 text-gray-500" />
                    )}
                  </div>
                  <h3 className="text-lg font-medium text-gray-300 mb-2">
                    No {tradingMode === "spot" ? "holdings" : "positions"} yet
                  </h3>
                  <p className="text-gray-500 max-w-md mx-auto">
                    {tradingMode === "spot"
                      ? "Your portfolio holdings will appear here once you make a purchase."
                      : "Open a position to start trading with leverage."}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Orders tab */}
          {activeTab === "orders" && (
            <div>
              {orders.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="text-xs text-gray-500 border-b border-gray-800">
                        <th className="px-4 py-2 text-left">Market</th>
                        <th className="px-4 py-2 text-left">Type</th>
                        <th className="px-4 py-2 text-left">Side</th>
                        <th className="px-4 py-2 text-right">Price</th>
                        <th className="px-4 py-2 text-right">Amount</th>
                        <th className="px-4 py-2 text-right">Filled</th>
                        <th className="px-4 py-2 text-right">Total</th>
                        <th className="px-4 py-2 text-left">Time</th>
                        <th className="px-4 py-2 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((order) => (
                        <tr key={order.id} className="text-sm border-b border-gray-800/50 hover:bg-gray-800/30">
                          <td className="px-4 py-3 font-medium">{order.market}</td>
                          <td className="px-4 py-3 capitalize">{order.type}</td>
                          <td className="px-4 py-3">
                            <span className={cn(order.side === "buy" ? "text-green-500" : "text-red-500")}>
                              {order.side.charAt(0).toUpperCase() + order.side.slice(1)}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-right">
                            {order.type === "market" ? (
                              <span className="text-gray-500">Market</span>
                            ) : (
                              formatCurrency(order.price, "")
                            )}
                          </td>
                          <td className="px-4 py-3 text-right">{order.amount}</td>
                          <td className="px-4 py-3 text-right">
                            <div className="flex items-center justify-end">
                              <div
                                className="h-1 w-16 bg-gray-800 rounded-full overflow-hidden mr-2"
                                title={`${((order.filled / order.amount) * 100).toFixed(0)}% filled`}
                              >
                                <div
                                  className="h-full bg-yellow-500"
                                  style={{ width: `${(order.filled / order.amount) * 100}%` }}
                                ></div>
                              </div>
                              <span>{((order.filled / order.amount) * 100).toFixed(0)}%</span>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-right">{formatCurrency(order.total)}</td>
                          <td className="px-4 py-3 text-gray-400">{formatDate(order.created)}</td>
                          <td className="px-4 py-3 text-center">
                            {showCancelConfirm === order.id ? (
                              <div className="flex items-center space-x-2">
                                <button
                                  className="px-2 py-1 bg-red-500 text-white text-xs rounded"
                                  onClick={() => handleCancelOrder(order.id)}
                                >
                                  Confirm
                                </button>
                                <button
                                  className="px-2 py-1 bg-gray-700 text-white text-xs rounded"
                                  onClick={() => setShowCancelConfirm(null)}
                                >
                                  Cancel
                                </button>
                              </div>
                            ) : (
                              <button
                                className="p-1 text-gray-400 hover:text-white"
                                onClick={() => setShowCancelConfirm(order.id)}
                                title="Cancel order"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="py-12 text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-800 mb-4">
                    <Clock className="h-8 w-8 text-gray-500" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-300 mb-2">No open orders</h3>
                  <p className="text-gray-500 max-w-md mx-auto">
                    You don't have any open orders at the moment. Place an order to start trading.
                  </p>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  )
}
