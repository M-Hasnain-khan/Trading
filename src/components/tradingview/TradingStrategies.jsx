"use client"

import { useState } from "react"
import { Play, Pause, Settings, ChevronDown, ChevronUp, Edit, Trash, Plus, AlertTriangle } from "lucide-react"
import { cn } from "@/components/lib/utils"

export default function TradingStrategies({ strategies, isLoading, market, marketData }) {
  const [expandedStrategy, setExpandedStrategy] = useState(null)
  const [showNewStrategy, setShowNewStrategy] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null)

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
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  // Toggle strategy active state
  const toggleStrategyActive = (strategyId) => {
    // In a real app, this would update the strategy in the database
    console.log(`Toggling strategy ${strategyId} active state`)
  }

  // Delete strategy
  const deleteStrategy = (strategyId) => {
    // In a real app, this would delete the strategy from the database
    console.log(`Deleting strategy ${strategyId}`)
    setShowDeleteConfirm(null)
  }

  // Edit strategy
  const editStrategy = (strategyId) => {
    // In a real app, this would open a strategy editor
    console.log(`Editing strategy ${strategyId}`)
  }

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-medium">Trading Strategies</h3>
        <button
          className="flex items-center space-x-1 px-3 py-1.5 bg-yellow-500 hover:bg-yellow-400 text-black rounded-md transition-colors text-sm"
          onClick={() => setShowNewStrategy(!showNewStrategy)}
        >
          <Plus className="h-4 w-4" />
          <span>New Strategy</span>
        </button>
      </div>

      {/* New strategy form (placeholder) */}
      {showNewStrategy && (
        <div className="mb-6 p-4 bg-gray-800/50 border border-gray-700 rounded-lg">
          <h4 className="text-md font-medium mb-4">Create New Strategy</h4>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Strategy Name</label>
              <input
                type="text"
                className="w-full bg-gray-800 border border-gray-700 rounded-md px-4 py-2 focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500 focus:outline-none"
                placeholder="My Trading Strategy"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Description</label>
              <textarea
                className="w-full bg-gray-800 border border-gray-700 rounded-md px-4 py-2 focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500 focus:outline-none"
                placeholder="Strategy description..."
                rows={3}
              ></textarea>
            </div>
            <div className="flex items-center justify-between py-2 px-3 bg-yellow-500/10 border border-yellow-500/30 rounded-md">
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
              <span className="text-sm text-yellow-500 ml-2">
                Strategy builder would be implemented here in a real application
              </span>
            </div>
            <div className="flex justify-end space-x-3">
              <button
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-md transition-colors"
                onClick={() => setShowNewStrategy(false)}
              >
                Cancel
              </button>
              <button className="px-4 py-2 bg-yellow-500 hover:bg-yellow-400 text-black rounded-md transition-colors">
                Create Strategy
              </button>
            </div>
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="w-10 h-10 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : strategies.length > 0 ? (
        <div className="space-y-4">
          {strategies.map((strategy) => (
            <div key={strategy.id} className="bg-gray-800/50 border border-gray-700 rounded-lg overflow-hidden">
              {/* Strategy header */}
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center">
                  <button
                    className={cn(
                      "p-2 rounded-full mr-3 transition-colors",
                      strategy.active ? "bg-green-500/20 text-green-500" : "bg-gray-700 text-gray-400",
                    )}
                    onClick={() => toggleStrategyActive(strategy.id)}
                    title={strategy.active ? "Pause strategy" : "Activate strategy"}
                  >
                    {strategy.active ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                  </button>
                  <div>
                    <h4 className="font-medium">{strategy.name}</h4>
                    <p className="text-sm text-gray-400">Created {formatDate(strategy.created)}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="text-right mr-4">
                    <div className={cn("font-medium", strategy.performance > 0 ? "text-green-500" : "text-red-500")}>
                      {formatPercentage(strategy.performance)}
                    </div>
                    <div className="text-xs text-gray-400">{strategy.trades} trades</div>
                  </div>
                  <button
                    className="p-2 bg-gray-700 rounded-md text-gray-400 hover:text-white transition-colors"
                    onClick={() => editStrategy(strategy.id)}
                    title="Edit strategy"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    className="p-2 bg-gray-700 rounded-md text-gray-400 hover:text-white transition-colors"
                    onClick={() => setShowDeleteConfirm(strategy.id)}
                    title="Delete strategy"
                  >
                    <Trash className="h-4 w-4" />
                  </button>
                  <button
                    className="p-2 bg-gray-700 rounded-md text-gray-400 hover:text-white transition-colors"
                    onClick={() => setExpandedStrategy(expandedStrategy === strategy.id ? null : strategy.id)}
                    title="Show details"
                  >
                    {expandedStrategy === strategy.id ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Strategy details */}
              {expandedStrategy === strategy.id && (
                <div className="px-4 pb-4 pt-2 border-t border-gray-700">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h5 className="text-sm font-medium text-gray-300 mb-2">Strategy Details</h5>
                      <p className="text-sm text-gray-400 mb-4">{strategy.description}</p>

                      <h5 className="text-sm font-medium text-gray-300 mb-2">Parameters</h5>
                      <div className="space-y-2">
                        {strategy.parameters.map((param, index) => (
                          <div key={index} className="flex justify-between">
                            <span className="text-sm text-gray-400">{param.name}:</span>
                            <span className="text-sm">{param.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h5 className="text-sm font-medium text-gray-300 mb-2">Performance</h5>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-400">Win Rate:</span>
                          <span className="text-sm">{strategy.winRate}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-400">Profit Factor:</span>
                          <span className="text-sm">{strategy.profitFactor}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-400">Avg. Profit:</span>
                          <span className="text-sm text-green-500">{formatCurrency(strategy.avgProfit)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-400">Avg. Loss:</span>
                          <span className="text-sm text-red-500">{formatCurrency(strategy.avgLoss)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-400">Max Drawdown:</span>
                          <span className="text-sm text-red-500">{formatPercentage(strategy.maxDrawdown)}</span>
                        </div>
                      </div>

                      <div className="mt-4 pt-4 border-t border-gray-700">
                        <button className="w-full py-2 bg-yellow-500 hover:bg-yellow-400 text-black rounded-md transition-colors text-sm">
                          View Detailed Report
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Delete confirmation */}
              {showDeleteConfirm === strategy.id && (
                <div className="px-4 pb-4 pt-2 border-t border-gray-700 bg-red-500/10">
                  <div className="flex items-center justify-between">
                    <div className="flex items-start space-x-2">
                      <AlertTriangle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm text-red-500">Are you sure you want to delete this strategy?</p>
                        <p className="text-xs text-gray-400 mt-1">This action cannot be undone.</p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        className="px-3 py-1 bg-gray-700 text-white text-sm rounded"
                        onClick={() => setShowDeleteConfirm(null)}
                      >
                        Cancel
                      </button>
                      <button
                        className="px-3 py-1 bg-red-500 text-white text-sm rounded"
                        onClick={() => deleteStrategy(strategy.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="py-12 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-800 mb-4">
            <Settings className="h-8 w-8 text-gray-500" />
          </div>
          <h3 className="text-lg font-medium text-gray-300 mb-2">No strategies yet</h3>
          <p className="text-gray-500 max-w-md mx-auto mb-6">
            Create your first trading strategy to automate your trading and improve your results.
          </p>
          <button
            className="px-4 py-2 bg-yellow-500 hover:bg-yellow-400 text-black rounded-md transition-colors"
            onClick={() => setShowNewStrategy(true)}
          >
            Create Your First Strategy
          </button>
        </div>
      )}
    </div>
  )
}
