"use client"

import { useState } from "react"
import { Download, Filter, Search, Calendar, X } from "lucide-react"
import { cn } from "@/components/lib/utils"

export default function OrderHistory({ orderHistory, isLoading }) {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [sideFilter, setSideFilter] = useState("all")
  const [dateRange, setDateRange] = useState({ from: null, to: null })
  const [showFilters, setShowFilters] = useState(false)

  // Format currency
  const formatCurrency = (value, symbol = "$") => {
    if (!value && value !== 0) return `${symbol}0.00`
    return `${symbol}${Number(value).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`
  }

  // Format date
  const formatDate = (date) => {
    if (!date) return ""
    return new Date(date).toLocaleString([], {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  // Filter orders
  const filteredOrders = orderHistory.filter((order) => {
    // Search term filter
    if (
      searchTerm &&
      !order.market.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !order.id.toLowerCase().includes(searchTerm.toLowerCase())
    ) {
      return false
    }

    // Status filter
    if (statusFilter !== "all" && order.status !== statusFilter) {
      return false
    }

    // Side filter
    if (sideFilter !== "all" && order.side !== sideFilter) {
      return false
    }

    // Date range filter
    if (dateRange.from && new Date(order.created) < new Date(dateRange.from)) {
      return false
    }
    if (dateRange.to && new Date(order.created) > new Date(dateRange.to)) {
      return false
    }

    return true
  })

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm("")
    setStatusFilter("all")
    setSideFilter("all")
    setDateRange({ from: null, to: null })
  }

  // Export to CSV
  const exportToCsv = () => {
    // In a real app, this would generate and download a CSV file
    alert("CSV export would happen here")
  }

  return (
    <div className="p-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
        <h3 className="text-lg font-medium">Order History</h3>

        <div className="flex items-center space-x-2 w-full sm:w-auto">
          {/* Search */}
          <div className="relative flex-grow sm:flex-grow-0 sm:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search market or order ID..."
              className="w-full bg-gray-800 border-none rounded-md pl-10 pr-4 py-2 text-sm focus:ring-1 focus:ring-yellow-500 focus:outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-white"
                onClick={() => setSearchTerm("")}
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Filter button */}
          <button
            className={cn(
              "p-2 rounded-md transition-colors",
              showFilters || statusFilter !== "all" || sideFilter !== "all" || dateRange.from || dateRange.to
                ? "bg-yellow-500/20 text-yellow-500"
                : "bg-gray-800 text-gray-400 hover:text-white",
            )}
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="h-5 w-5" />
          </button>

          {/* Export button */}
          <button
            className="p-2 bg-gray-800 rounded-md text-gray-400 hover:text-white transition-colors"
            onClick={exportToCsv}
            title="Export to CSV"
          >
            <Download className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="bg-gray-800/50 rounded-lg p-4 mb-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {/* Status filter */}
          <div>
            <label className="block text-sm text-gray-400 mb-1">Status</label>
            <select
              className="w-full bg-gray-800 border-none rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-yellow-500 focus:outline-none"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Statuses</option>
              <option value="filled">Filled</option>
              <option value="canceled">Canceled</option>
              <option value="rejected">Rejected</option>
              <option value="expired">Expired</option>
            </select>
          </div>

          {/* Side filter */}
          <div>
            <label className="block text-sm text-gray-400 mb-1">Side</label>
            <select
              className="w-full bg-gray-800 border-none rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-yellow-500 focus:outline-none"
              value={sideFilter}
              onChange={(e) => setSideFilter(e.target.value)}
            >
              <option value="all">All Sides</option>
              <option value="buy">Buy</option>
              <option value="sell">Sell</option>
            </select>
          </div>

          {/* Date from */}
          <div>
            <label className="block text-sm text-gray-400 mb-1">From Date</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
              <input
                type="date"
                className="w-full bg-gray-800 border-none rounded-md pl-10 pr-4 py-2 text-sm focus:ring-1 focus:ring-yellow-500 focus:outline-none"
                value={dateRange.from || ""}
                onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })}
              />
            </div>
          </div>

          {/* Date to */}
          <div>
            <label className="block text-sm text-gray-400 mb-1">To Date</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
              <input
                type="date"
                className="w-full bg-gray-800 border-none rounded-md pl-10 pr-4 py-2 text-sm focus:ring-1 focus:ring-yellow-500 focus:outline-none"
                value={dateRange.to || ""}
                onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
              />
            </div>
          </div>

          {/* Clear filters button */}
          <div className="col-span-1 sm:col-span-2 md:col-span-4 flex justify-end">
            <button
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white text-sm rounded-md transition-colors"
              onClick={clearFilters}
            >
              Clear Filters
            </button>
          </div>
        </div>
      )}

      {/* Order history table */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="w-10 h-10 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : filteredOrders.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-xs text-gray-500 border-b border-gray-800">
                <th className="px-4 py-2 text-left">Date</th>
                <th className="px-4 py-2 text-left">Market</th>
                <th className="px-4 py-2 text-left">Type</th>
                <th className="px-4 py-2 text-left">Side</th>
                <th className="px-4 py-2 text-right">Price</th>
                <th className="px-4 py-2 text-right">Amount</th>
                <th className="px-4 py-2 text-right">Filled</th>
                <th className="px-4 py-2 text-right">Total</th>
                <th className="px-4 py-2 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order.id} className="text-sm border-b border-gray-800/50 hover:bg-gray-800/30">
                  <td className="px-4 py-3 text-gray-400">{formatDate(order.created)}</td>
                  <td className="px-4 py-3 font-medium">{order.market}</td>
                  <td className="px-4 py-3 capitalize">{order.type}</td>
                  <td className="px-4 py-3">
                    <span className={order.side === "buy" ? "text-green-500" : "text-red-500"}>
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
                    {order.filled} ({((order.filled / order.amount) * 100).toFixed(0)}%)
                  </td>
                  <td className="px-4 py-3 text-right">{formatCurrency(order.total)}</td>
                  <td className="px-4 py-3">
                    <span
                      className={cn(
                        "px-2 py-1 text-xs rounded-full",
                        order.status === "filled"
                          ? "bg-green-500/20 text-green-500"
                          : order.status === "canceled"
                            ? "bg-gray-500/20 text-gray-400"
                            : order.status === "rejected"
                              ? "bg-red-500/20 text-red-500"
                              : "bg-yellow-500/20 text-yellow-500",
                      )}
                    >
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="py-12 text-center">
          <p className="text-gray-500">No orders found matching your filters.</p>
          {(searchTerm || statusFilter !== "all" || sideFilter !== "all" || dateRange.from || dateRange.to) && (
            <button
              className="mt-4 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white text-sm rounded-md transition-colors"
              onClick={clearFilters}
            >
              Clear Filters
            </button>
          )}
        </div>
      )}
    </div>
  )
}
