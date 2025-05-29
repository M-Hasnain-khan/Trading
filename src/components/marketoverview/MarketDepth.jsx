"use client"

import { useEffect, useRef } from "react"

export default function MarketDepth({ market, orderBook, currentPrice, isLoading }) {
  const canvasRef = useRef(null)

  // Draw market depth chart
  useEffect(() => {
    if (!canvasRef.current || !orderBook || isLoading) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")

    // Set canvas dimensions
    const setCanvasDimensions = () => {
      const rect = canvas.getBoundingClientRect()
      canvas.width = rect.width
      canvas.height = rect.height
    }

    setCanvasDimensions()
    window.addEventListener("resize", setCanvasDimensions)

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Draw background
    ctx.fillStyle = "rgba(17, 24, 39, 0.3)"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Process order book data
    const processOrderBook = () => {
      const bids = []
      const asks = []

      let bidTotal = 0
      let askTotal = 0

      // Process bids (buy orders)
      orderBook.bids
        .sort((a, b) => b.price - a.price)
        .forEach((bid) => {
          bidTotal += bid.amount
          bids.push({
            price: bid.price,
            total: bidTotal,
          })
        })

      // Process asks (sell orders)
      orderBook.asks
        .sort((a, b) => a.price - b.price)
        .forEach((ask) => {
          askTotal += ask.amount
          asks.push({
            price: ask.price,
            total: askTotal,
          })
        })

      return { bids, asks, maxTotal: Math.max(bidTotal, askTotal) }
    }

    const { bids, asks, maxTotal } = processOrderBook()

    // Find min and max prices for scaling
    const allPrices = [...bids.map((b) => b.price), ...asks.map((a) => a.price)]
    const minPrice = Math.min(...allPrices) * 0.99
    const maxPrice = Math.max(...allPrices) * 1.01
    const priceRange = maxPrice - minPrice

    // Scale functions
    const scaleX = (price) => {
      return ((price - minPrice) / priceRange) * canvas.width
    }

    const scaleY = (total) => {
      return canvas.height - (total / maxTotal) * canvas.height
    }

    // Draw axes
    ctx.strokeStyle = "rgba(75, 85, 99, 0.3)"
    ctx.lineWidth = 1

    // X-axis (bottom)
    ctx.beginPath()
    ctx.moveTo(0, canvas.height)
    ctx.lineTo(canvas.width, canvas.height)
    ctx.stroke()

    // Y-axis (left)
    ctx.beginPath()
    ctx.moveTo(0, 0)
    ctx.lineTo(0, canvas.height)
    ctx.stroke()

    // Draw price labels
    ctx.fillStyle = "rgba(255, 255, 255, 0.7)"
    ctx.font = "10px sans-serif"

    // X-axis labels (prices)
    const priceLabels = 5
    for (let i = 0; i <= priceLabels; i++) {
      const price = minPrice + priceRange * (i / priceLabels)
      const x = scaleX(price)

      ctx.fillText(price.toFixed(2), x - 15, canvas.height - 5)

      // Vertical grid line
      ctx.strokeStyle = "rgba(75, 85, 99, 0.1)"
      ctx.beginPath()
      ctx.moveTo(x, 0)
      ctx.lineTo(x, canvas.height)
      ctx.stroke()
    }

    // Y-axis labels (volume)
    const volumeLabels = 4
    for (let i = 0; i <= volumeLabels; i++) {
      const volume = maxTotal * (i / volumeLabels)
      const y = scaleY(volume)

      ctx.fillText(volume.toFixed(1), 5, y + 3)

      // Horizontal grid line
      ctx.strokeStyle = "rgba(75, 85, 99, 0.1)"
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(canvas.width, y)
      ctx.stroke()
    }

    // Draw bids (buy orders)
    ctx.beginPath()
    ctx.moveTo(scaleX(bids[0]?.price || minPrice), canvas.height)

    bids.forEach((bid) => {
      ctx.lineTo(scaleX(bid.price), scaleY(bid.total))
    })

    ctx.lineTo(scaleX(bids[bids.length - 1]?.price || minPrice), canvas.height)
    ctx.closePath()

    // Fill bids area
    const bidGradient = ctx.createLinearGradient(0, 0, 0, canvas.height)
    bidGradient.addColorStop(0, "rgba(16, 185, 129, 0.7)")
    bidGradient.addColorStop(1, "rgba(16, 185, 129, 0.1)")
    ctx.fillStyle = bidGradient
    ctx.fill()

    // Draw asks (sell orders)
    ctx.beginPath()
    ctx.moveTo(scaleX(asks[0]?.price || maxPrice), canvas.height)

    asks.forEach((ask) => {
      ctx.lineTo(scaleX(ask.price), scaleY(ask.total))
    })

    ctx.lineTo(scaleX(asks[asks.length - 1]?.price || maxPrice), canvas.height)
    ctx.closePath()

    // Fill asks area
    const askGradient = ctx.createLinearGradient(0, 0, 0, canvas.height)
    askGradient.addColorStop(0, "rgba(239, 68, 68, 0.7)")
    askGradient.addColorStop(1, "rgba(239, 68, 68, 0.1)")
    ctx.fillStyle = askGradient
    ctx.fill()

    // Draw current price line
    if (currentPrice) {
      const currentPriceX = scaleX(currentPrice)

      ctx.strokeStyle = "rgba(255, 255, 255, 0.8)"
      ctx.lineWidth = 1
      ctx.setLineDash([5, 3])
      ctx.beginPath()
      ctx.moveTo(currentPriceX, 0)
      ctx.lineTo(currentPriceX, canvas.height)
      ctx.stroke()
      ctx.setLineDash([])

      // Current price label
      ctx.fillStyle = "rgba(17, 24, 39, 0.8)"
      ctx.fillRect(currentPriceX - 30, 10, 60, 20)
      ctx.strokeStyle = "rgba(255, 255, 255, 0.3)"
      ctx.strokeRect(currentPriceX - 30, 10, 60, 20)

      ctx.fillStyle = "rgba(255, 255, 255, 0.9)"
      ctx.textAlign = "center"
      ctx.fillText(currentPrice.toFixed(2), currentPriceX, 24)
      ctx.textAlign = "left"
    }

    return () => {
      window.removeEventListener("resize", setCanvasDimensions)
    }
  }, [orderBook, currentPrice, isLoading])

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between border-b border-gray-800 p-3">
        <h3 className="text-sm font-medium">Market Depth</h3>
      </div>

      <div className="flex-1 relative">
        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <canvas ref={canvasRef} className="w-full h-full" />
        )}
      </div>
    </div>
  )
}
