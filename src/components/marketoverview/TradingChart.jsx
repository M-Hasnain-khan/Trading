"use client"

import { useState, useEffect, useRef } from "react"
import {
  BarChart,
  CandlestickChart,
  LineChart,
  TrendingUp,
  ChevronDown,
  Maximize2,
  Minimize2,
  ZoomIn,
  ZoomOut,
  MoveHorizontal,
  Undo2,
  PenLine,
  MousePointer,
  Crosshair,
} from "lucide-react"
import { cn } from "@/components/lib/utils"

// Timeframe options
const timeframes = [
  { value: "1m", label: "1m" },
  { value: "5m", label: "5m" },
  { value: "15m", label: "15m" },
  { value: "30m", label: "30m" },
  { value: "1h", label: "1h" },
  { value: "4h", label: "4h" },
  { value: "1d", label: "1D" },
  { value: "1w", label: "1W" },
]

// Chart type options
const chartTypes = [
  { value: "candlestick", label: "Candlestick", icon: <CandlestickChart className="h-4 w-4" /> },
  { value: "line", label: "Line", icon: <LineChart className="h-4 w-4" /> },
  { value: "bar", label: "Bar", icon: <BarChart className="h-4 w-4" /> },
]

// Technical indicators
const indicators = [
  { value: "ma", label: "Moving Average", color: "#3a7bd5" },
  { value: "ema", label: "EMA", color: "#00c3ff" },
  { value: "bb", label: "Bollinger Bands", color: "#f5a623" },
  { value: "rsi", label: "RSI", color: "#7b68ee" },
  { value: "macd", label: "MACD", color: "#00b894" },
  { value: "volume", label: "Volume", color: "#6c5ce7" },
]

// Drawing tools
const drawingTools = [
  { value: "line", label: "Line", icon: <PenLine className="h-4 w-4" /> },
  { value: "horizontal", label: "Horizontal Line", icon: <MoveHorizontal className="h-4 w-4" /> },
  { value: "fibonacci", label: "Fibonacci", icon: <TrendingUp className="h-4 w-4" /> },
]

export default function TradingChart({
  market,
  marketData,
  timeframe,
  chartType,
  showIndicators,
  isLoading,
  onTimeframeChange,
  onChartTypeChange,
  onToggleIndicators,
}) {
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [activeIndicators, setActiveIndicators] = useState(["ma", "volume"])
  const [isIndicatorMenuOpen, setIsIndicatorMenuOpen] = useState(false)
  const [isChartTypeMenuOpen, setIsChartTypeMenuOpen] = useState(false)
  const [activeTool, setActiveTool] = useState("crosshair")
  const [chartData, setChartData] = useState([])
  const [hoveredCandle, setHoveredCandle] = useState(null)
  const [chartScale, setChartScale] = useState(1)

  const chartRef = useRef(null)
  const canvasRef = useRef(null)
  const indicatorMenuRef = useRef(null)
  const chartTypeMenuRef = useRef(null)

  // Generate chart data
  useEffect(() => {
    if (!marketData || isLoading) return

    // Generate mock candles based on current price
    const generateCandles = (count, basePrice) => {
      const candles = []
      let price = basePrice
      const now = new Date()

      // Determine time increment based on timeframe
      let timeIncrement = 60 * 1000 // 1 minute in milliseconds
      switch (timeframe) {
        case "5m":
          timeIncrement = 5 * 60 * 1000
          break
        case "15m":
          timeIncrement = 15 * 60 * 1000
          break
        case "30m":
          timeIncrement = 30 * 60 * 1000
          break
        case "1h":
          timeIncrement = 60 * 60 * 1000
          break
        case "4h":
          timeIncrement = 4 * 60 * 60 * 1000
          break
        case "1d":
          timeIncrement = 24 * 60 * 60 * 1000
          break
        case "1w":
          timeIncrement = 7 * 24 * 60 * 60 * 1000
          break
      }

      for (let i = count - 1; i >= 0; i--) {
        const time = new Date(now.getTime() - i * timeIncrement)
        const volatility = basePrice * 0.02 // 2% volatility

        // Generate random price movement
        const change = (Math.random() - 0.5) * volatility
        const open = price
        const close = price + change

        // High and low with some randomness
        const high = Math.max(open, close) + Math.random() * volatility * 0.5
        const low = Math.min(open, close) - Math.random() * volatility * 0.5

        // Volume with some correlation to price change
        const volume = basePrice * (0.5 + Math.random() * 1.5) * (1 + Math.abs(change / basePrice) * 10)

        candles.push({
          time,
          open,
          high,
          low,
          close,
          volume,
        })

        price = close
      }

      return candles
    }

    setChartData(generateCandles(100, marketData.price))
  }, [marketData, isLoading, timeframe])

  // Draw chart on canvas
  useEffect(() => {
    if (!canvasRef.current || chartData.length === 0) return

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
    ctx.fillStyle = "rgba(17, 24, 39, 0.7)"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Draw grid
    ctx.strokeStyle = "rgba(75, 85, 99, 0.2)"
    ctx.lineWidth = 1

    // Horizontal grid lines
    for (let i = 0; i <= 5; i++) {
      const y = (canvas.height / 5) * i
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(canvas.width, y)
      ctx.stroke()
    }

    // Vertical grid lines
    const candleCount = chartData.length
    const candleWidth = canvas.width / candleCount

    for (let i = 0; i <= candleCount; i += 10) {
      const x = i * candleWidth
      ctx.beginPath()
      ctx.moveTo(x, 0)
      ctx.lineTo(x, canvas.height)
      ctx.stroke()
    }

    // Calculate price range
    const prices = chartData.flatMap((candle) => [candle.high, candle.low])
    const maxPrice = Math.max(...prices) * 1.05
    const minPrice = Math.min(...prices) * 0.95
    const priceRange = maxPrice - minPrice

    // Calculate scale for drawing
    const scaleY = (price) => {
      return canvas.height - ((price - minPrice) / priceRange) * canvas.height
    }

    // Draw volume
    if (activeIndicators.includes("volume")) {
      const volumes = chartData.map((candle) => candle.volume)
      const maxVolume = Math.max(...volumes)

      chartData.forEach((candle, i) => {
        const x = i * candleWidth
        const volumeHeight = (candle.volume / maxVolume) * (canvas.height * 0.2)
        const y = canvas.height - volumeHeight

        ctx.fillStyle =
          candle.close >= candle.open
            ? "rgba(16, 185, 129, 0.3)" // Green for up
            : "rgba(239, 68, 68, 0.3)" // Red for down

        ctx.fillRect(x + candleWidth * 0.1, y, candleWidth * 0.8, volumeHeight)
      })
    }

    // Draw moving average if active
    if (activeIndicators.includes("ma")) {
      const period = 20
      const ma = []

      for (let i = 0; i < chartData.length; i++) {
        if (i < period - 1) {
          ma.push(null)
        } else {
          const sum = chartData.slice(i - period + 1, i + 1).reduce((acc, candle) => acc + candle.close, 0)
          ma.push(sum / period)
        }
      }

      ctx.strokeStyle = "#3a7bd5"
      ctx.lineWidth = 2
      ctx.beginPath()

      ma.forEach((value, i) => {
        if (value === null) return

        const x = i * candleWidth + candleWidth / 2
        const y = scaleY(value)

        if (i === period - 1 || ma[i - 1] === null) {
          ctx.moveTo(x, y)
        } else {
          ctx.lineTo(x, y)
        }
      })

      ctx.stroke()
    }

    // Draw EMA if active
    if (activeIndicators.includes("ema")) {
      const period = 20
      const multiplier = 2 / (period + 1)
      const ema = []

      // Calculate initial SMA
      const initialSMA = chartData.slice(0, period).reduce((acc, candle) => acc + candle.close, 0) / period

      ema.push(initialSMA)

      for (let i = 1; i < chartData.length; i++) {
        if (i < period) {
          ema.push(null)
        } else {
          const currentEMA = (chartData[i].close - ema[i - 1]) * multiplier + ema[i - 1]
          ema.push(currentEMA)
        }
      }

      ctx.strokeStyle = "#00c3ff"
      ctx.lineWidth = 2
      ctx.beginPath()

      ema.forEach((value, i) => {
        if (value === null) return

        const x = i * candleWidth + candleWidth / 2
        const y = scaleY(value)

        if (i === 0 || ema[i - 1] === null) {
          ctx.moveTo(x, y)
        } else {
          ctx.lineTo(x, y)
        }
      })

      ctx.stroke()
    }

    // Draw Bollinger Bands if active
    if (activeIndicators.includes("bb")) {
      const period = 20
      const stdDevMultiplier = 2
      const sma = []
      const upperBand = []
      const lowerBand = []

      for (let i = 0; i < chartData.length; i++) {
        if (i < period - 1) {
          sma.push(null)
          upperBand.push(null)
          lowerBand.push(null)
        } else {
          const slice = chartData.slice(i - period + 1, i + 1)
          const sum = slice.reduce((acc, candle) => acc + candle.close, 0)
          const avg = sum / period
          sma.push(avg)

          // Calculate standard deviation
          const squaredDiffs = slice.map((candle) => Math.pow(candle.close - avg, 2))
          const variance = squaredDiffs.reduce((acc, val) => acc + val, 0) / period
          const stdDev = Math.sqrt(variance)

          upperBand.push(avg + stdDevMultiplier * stdDev)
          lowerBand.push(avg - stdDevMultiplier * stdDev)
        }
      }

      // Draw middle band (SMA)
      ctx.strokeStyle = "#f5a623"
      ctx.lineWidth = 1
      ctx.beginPath()

      sma.forEach((value, i) => {
        if (value === null) return

        const x = i * candleWidth + candleWidth / 2
        const y = scaleY(value)

        if (i === period - 1 || sma[i - 1] === null) {
          ctx.moveTo(x, y)
        } else {
          ctx.lineTo(x, y)
        }
      })

      ctx.stroke()

      // Draw upper band
      ctx.strokeStyle = "rgba(245, 166, 35, 0.5)"
      ctx.beginPath()

      upperBand.forEach((value, i) => {
        if (value === null) return

        const x = i * candleWidth + candleWidth / 2
        const y = scaleY(value)

        if (i === period - 1 || upperBand[i - 1] === null) {
          ctx.moveTo(x, y)
        } else {
          ctx.lineTo(x, y)
        }
      })

      ctx.stroke()

      // Draw lower band
      ctx.beginPath()

      lowerBand.forEach((value, i) => {
        if (value === null) return

        const x = i * candleWidth + candleWidth / 2
        const y = scaleY(value)

        if (i === period - 1 || lowerBand[i - 1] === null) {
          ctx.moveTo(x, y)
        } else {
          ctx.lineTo(x, y)
        }
      })

      ctx.stroke()

      // Fill area between bands
      ctx.fillStyle = "rgba(245, 166, 35, 0.1)"
      ctx.beginPath()

      for (let i = period - 1; i < chartData.length; i++) {
        const x = i * candleWidth + candleWidth / 2

        if (i === period - 1) {
          ctx.moveTo(x, scaleY(upperBand[i]))
        } else {
          ctx.lineTo(x, scaleY(upperBand[i]))
        }
      }

      for (let i = chartData.length - 1; i >= period - 1; i--) {
        const x = i * candleWidth + candleWidth / 2
        ctx.lineTo(x, scaleY(lowerBand[i]))
      }

      ctx.closePath()
      ctx.fill()
    }

    // Draw RSI if active
    if (activeIndicators.includes("rsi")) {
      const period = 14
      const rsi = []

      for (let i = 0; i < chartData.length; i++) {
        if (i < period) {
          rsi.push(null)
        } else {
          const gains = []
          const losses = []

          for (let j = i - period + 1; j <= i; j++) {
            const change = chartData[j].close - chartData[j].open
            if (change >= 0) {
              gains.push(change)
              losses.push(0)
            } else {
              gains.push(0)
              losses.push(Math.abs(change))
            }
          }

          const avgGain = gains.reduce((acc, val) => acc + val, 0) / period
          const avgLoss = losses.reduce((acc, val) => acc + val, 0) / period

          if (avgLoss === 0) {
            rsi.push(100)
          } else {
            const rs = avgGain / avgLoss
            rsi.push(100 - 100 / (1 + rs))
          }
        }
      }

      // Draw RSI in a separate panel at the bottom
      const rsiHeight = canvas.height * 0.15
      const rsiTop = canvas.height - rsiHeight

      // Draw RSI background
      ctx.fillStyle = "rgba(17, 24, 39, 0.9)"
      ctx.fillRect(0, rsiTop, canvas.width, rsiHeight)

      // Draw RSI grid lines
      ctx.strokeStyle = "rgba(75, 85, 99, 0.2)"
      ctx.lineWidth = 1

      // Horizontal lines at 30 and 70 (overbought/oversold)
      const rsi30Y = rsiTop + rsiHeight * 0.7
      const rsi70Y = rsiTop + rsiHeight * 0.3

      ctx.beginPath()
      ctx.moveTo(0, rsi30Y)
      ctx.lineTo(canvas.width, rsi30Y)
      ctx.stroke()

      ctx.beginPath()
      ctx.moveTo(0, rsi70Y)
      ctx.lineTo(canvas.width, rsi70Y)
      ctx.stroke()

      // Draw RSI line
      ctx.strokeStyle = "#7b68ee"
      ctx.lineWidth = 2
      ctx.beginPath()

      rsi.forEach((value, i) => {
        if (value === null) return

        const x = i * candleWidth + candleWidth / 2
        // Scale RSI (0-100) to fit in the RSI panel
        const y = rsiTop + (100 - value) * (rsiHeight / 100)

        if (i === period || rsi[i - 1] === null) {
          ctx.moveTo(x, y)
        } else {
          ctx.lineTo(x, y)
        }
      })

      ctx.stroke()

      // Draw RSI labels
      ctx.fillStyle = "rgba(255, 255, 255, 0.7)"
      ctx.font = "10px sans-serif"
      ctx.fillText("RSI (14)", 5, rsiTop + 12)
      ctx.fillText("70", 5, rsi70Y - 5)
      ctx.fillText("30", 5, rsi30Y - 5)
    }

    // Draw MACD if active
    if (activeIndicators.includes("macd")) {
      // MACD calculation would go here
      // This is a simplified version
      const fastPeriod = 12
      const slowPeriod = 26
      const signalPeriod = 9

      // Draw MACD placeholder
      const macdHeight = canvas.height * 0.15
      const macdTop = canvas.height - macdHeight

      ctx.fillStyle = "rgba(17, 24, 39, 0.9)"
      ctx.fillRect(0, macdTop, canvas.width, macdHeight)

      ctx.fillStyle = "rgba(255, 255, 255, 0.7)"
      ctx.font = "10px sans-serif"
      ctx.fillText("MACD (12, 26, 9)", 5, macdTop + 12)
    }

    // Draw candlesticks
    chartData.forEach((candle, i) => {
      const x = i * candleWidth
      const open = scaleY(candle.open)
      const close = scaleY(candle.close)
      const high = scaleY(candle.high)
      const low = scaleY(candle.low)

      // Determine if candle is up or down
      const isUp = candle.close >= candle.open

      // Draw candle body
      ctx.fillStyle = isUp ? "rgba(16, 185, 129, 0.9)" : "rgba(239, 68, 68, 0.9)"
      ctx.fillRect(x + candleWidth * 0.2, Math.min(open, close), candleWidth * 0.6, Math.abs(close - open) || 1)

      // Draw candle wick
      ctx.strokeStyle = isUp ? "rgba(16, 185, 129, 0.9)" : "rgba(239, 68, 68, 0.9)"
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(x + candleWidth / 2, high)
      ctx.lineTo(x + candleWidth / 2, Math.min(open, close))
      ctx.moveTo(x + candleWidth / 2, Math.max(open, close))
      ctx.lineTo(x + candleWidth / 2, low)
      ctx.stroke()
    })

    // Draw price scale on the right
    ctx.fillStyle = "rgba(17, 24, 39, 0.7)"
    ctx.fillRect(canvas.width - 60, 0, 60, canvas.height)

    ctx.fillStyle = "rgba(255, 255, 255, 0.7)"
    ctx.font = "10px sans-serif"

    for (let i = 0; i <= 5; i++) {
      const y = (canvas.height / 5) * i
      const price = maxPrice - (i / 5) * priceRange
      ctx.fillText(price.toFixed(2), canvas.width - 55, y + 4)
    }

    // Draw time scale at the bottom
    ctx.fillStyle = "rgba(17, 24, 39, 0.7)"
    ctx.fillRect(0, canvas.height - 20, canvas.width, 20)

    // Draw time labels
    const timeLabels = []
    for (let i = 0; i < chartData.length; i += 20) {
      const time = chartData[i].time
      timeLabels.push({
        index: i,
        label: time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      })
    }

    timeLabels.forEach(({ index, label }) => {
      const x = index * candleWidth
      ctx.fillStyle = "rgba(255, 255, 255, 0.7)"
      ctx.fillText(label, x, canvas.height - 6)
    })

    // Draw hover info if a candle is hovered
    if (hoveredCandle !== null) {
      const candle = chartData[hoveredCandle]
      const x = hoveredCandle * candleWidth

      // Draw vertical line at hovered candle
      ctx.strokeStyle = "rgba(255, 255, 255, 0.5)"
      ctx.setLineDash([5, 3])
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(x + candleWidth / 2, 0)
      ctx.lineTo(x + candleWidth / 2, canvas.height)
      ctx.stroke()
      ctx.setLineDash([])

      // Draw info box
      const infoWidth = 150
      const infoHeight = 100
      let infoX = x + candleWidth + 10

      // Make sure info box stays within canvas
      if (infoX + infoWidth > canvas.width) {
        infoX = x - infoWidth - 10
      }

      ctx.fillStyle = "rgba(17, 24, 39, 0.9)"
      ctx.fillRect(infoX, 10, infoWidth, infoHeight)
      ctx.strokeStyle = "rgba(75, 85, 99, 0.5)"
      ctx.strokeRect(infoX, 10, infoWidth, infoHeight)

      // Draw info text
      ctx.fillStyle = "rgba(255, 255, 255, 0.9)"
      ctx.font = "12px sans-serif"

      const time = candle.time.toLocaleString([], {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })

      ctx.fillText(time, infoX + 10, 30)
      ctx.fillText(`O: ${candle.open.toFixed(2)}`, infoX + 10, 50)
      ctx.fillText(`H: ${candle.high.toFixed(2)}`, infoX + 10, 65)
      ctx.fillText(`L: ${candle.low.toFixed(2)}`, infoX + 10, 80)
      ctx.fillText(`C: ${candle.close.toFixed(2)}`, infoX + 10, 95)

      // Color the close price based on candle direction
      ctx.fillStyle = candle.close >= candle.open ? "rgba(16, 185, 129, 0.9)" : "rgba(239, 68, 68, 0.9)"
      ctx.fillText(`C: ${candle.close.toFixed(2)}`, infoX + 10, 95)
    }

    return () => {
      window.removeEventListener("resize", setCanvasDimensions)
    }
  }, [hoveredCandle, activeIndicators, chartScale])

  // Handle mouse move to show candle info
  const handleMouseMove = (e) => {
    if (!canvasRef.current || chartData.length === 0) return

    const canvas = canvasRef.current
    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left

    const candleWidth = canvas.width / chartData.length
    const candleIndex = Math.floor(x / candleWidth)

    if (candleIndex >= 0 && candleIndex < chartData.length) {
      setHoveredCandle(candleIndex)
    } else {
      setHoveredCandle(null)
    }
  }

  // Handle mouse leave
  const handleMouseLeave = () => {
    setHoveredCandle(null)
  }

  // Toggle indicator
  const toggleIndicator = (indicator) => {
    setActiveIndicators((prev) => {
      if (prev.includes(indicator)) {
        return prev.filter((i) => i !== indicator)
      } else {
        return [...prev, indicator]
      }
    })
  }

  // Handle zoom in/out
  const handleZoom = (direction) => {
    setChartScale((prev) => {
      const newScale = direction === "in" ? prev * 1.2 : prev / 1.2
      return Math.max(0.5, Math.min(newScale, 3))
    })
  }

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (indicatorMenuRef.current && !indicatorMenuRef.current.contains(event.target)) {
        setIsIndicatorMenuOpen(false)
      }

      if (chartTypeMenuRef.current && !chartTypeMenuRef.current.contains(event.target)) {
        setIsChartTypeMenuOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <div
      ref={chartRef}
      className={cn("relative h-full flex flex-col", isFullscreen && "fixed inset-0 z-50 bg-gray-900")}
    >
      {/* Chart toolbar */}
      <div className="flex items-center justify-between border-b border-gray-800 p-3">
        <div className="flex items-center space-x-4">
          {/* Timeframe selector */}
          <div className="flex items-center space-x-1">
            {timeframes.map((tf) => (
              <button
                key={tf.value}
                className={cn(
                  "px-2 py-1 text-xs font-medium rounded",
                  timeframe === tf.value ? "bg-yellow-500 text-black" : "bg-gray-800 text-gray-400 hover:bg-gray-700",
                )}
                onClick={() => onTimeframeChange(tf.value)}
              >
                {tf.label}
              </button>
            ))}
          </div>

          {/* Chart type selector */}
          <div className="relative" ref={chartTypeMenuRef}>
            <button
              className="flex items-center space-x-1 bg-gray-800 hover:bg-gray-700 px-2 py-1 rounded text-sm"
              onClick={() => setIsChartTypeMenuOpen(!isChartTypeMenuOpen)}
            >
              <span className="text-gray-400">Chart</span>
              <ChevronDown className="h-4 w-4 text-gray-400" />
            </button>

            {isChartTypeMenuOpen && (
              <div className="absolute top-full left-0 mt-1 bg-gray-900 border border-gray-800 rounded-md shadow-lg z-10 w-40 py-1 animate-scale-in">
                {chartTypes.map((type) => (
                  <button
                    key={type.value}
                    className={cn(
                      "flex items-center space-x-2 w-full px-3 py-2 text-sm hover:bg-gray-800",
                      chartType === type.value ? "text-yellow-500" : "text-gray-400",
                    )}
                    onClick={() => {
                      onChartTypeChange(type.value)
                      setIsChartTypeMenuOpen(false)
                    }}
                  >
                    {type.icon}
                    <span>{type.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Indicators */}
          <div className="relative" ref={indicatorMenuRef}>
            <button
              className={cn(
                "flex items-center space-x-1 px-2 py-1 rounded text-sm",
                showIndicators ? "bg-yellow-500/20 text-yellow-500" : "bg-gray-800 text-gray-400 hover:bg-gray-700",
              )}
              onClick={() => setIsIndicatorMenuOpen(!isIndicatorMenuOpen)}
            >
              <TrendingUp className="h-4 w-4" />
              <span>Indicators</span>
              <ChevronDown className="h-4 w-4" />
            </button>

            {isIndicatorMenuOpen && (
              <div className="absolute top-full left-0 mt-1 bg-gray-900 border border-gray-800 rounded-md shadow-lg z-10 w-48 py-1 animate-scale-in">
                <div className="px-3 py-2 border-b border-gray-800">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-300">Indicators</span>
                    <button
                      className="text-xs bg-gray-800 hover:bg-gray-700 px-2 py-1 rounded"
                      onClick={() => onToggleIndicators(!showIndicators)}
                    >
                      {showIndicators ? "Hide All" : "Show All"}
                    </button>
                  </div>
                </div>

                <div className="py-1">
                  {indicators.map((indicator) => (
                    <button
                      key={indicator.value}
                      className="flex items-center justify-between w-full px-3 py-2 text-sm hover:bg-gray-800"
                      onClick={() => toggleIndicator(indicator.value)}
                    >
                      <div className="flex items-center space-x-2">
                        <span style={{ color: indicator.color }}>●</span>
                        <span className="text-gray-300">{indicator.label}</span>
                      </div>
                      <div
                        className={cn(
                          "w-4 h-4 rounded-sm border",
                          activeIndicators.includes(indicator.value)
                            ? "bg-yellow-500 border-yellow-500"
                            : "bg-gray-800 border-gray-700",
                        )}
                      ></div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {/* Drawing tools */}
          <div className="flex items-center space-x-1 bg-gray-800 rounded-md p-1">
            <button
              className={cn("p-1 rounded", activeTool === "crosshair" && "bg-gray-700")}
              title="Crosshair"
              onClick={() => setActiveTool("crosshair")}
            >
              <Crosshair className="h-4 w-4 text-gray-400" />
            </button>
            <button
              className={cn("p-1 rounded", activeTool === "pointer" && "bg-gray-700")}
              title="Pointer"
              onClick={() => setActiveTool("pointer")}
            >
              <MousePointer className="h-4 w-4 text-gray-400" />
            </button>
            {drawingTools.map((tool) => (
              <button
                key={tool.value}
                className={cn("p-1 rounded", activeTool === tool.value && "bg-gray-700")}
                title={tool.label}
                onClick={() => setActiveTool(tool.value)}
              >
                {tool.icon}
              </button>
            ))}
          </div>

          {/* Zoom controls */}
          <div className="flex items-center space-x-1 bg-gray-800 rounded-md p-1">
            <button className="p-1 rounded hover:bg-gray-700" title="Zoom In" onClick={() => handleZoom("in")}>
              <ZoomIn className="h-4 w-4 text-gray-400" />
            </button>
            <button className="p-1 rounded hover:bg-gray-700" title="Zoom Out" onClick={() => handleZoom("out")}>
              <ZoomOut className="h-4 w-4 text-gray-400" />
            </button>
            <button className="p-1 rounded hover:bg-gray-700" title="Reset Zoom" onClick={() => setChartScale(1)}>
              <Undo2 className="h-4 w-4 text-gray-400" />
            </button>
          </div>

          {/* Fullscreen toggle */}
          <button
            className="p-1 bg-gray-800 rounded hover:bg-gray-700"
            title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
            onClick={() => setIsFullscreen(!isFullscreen)}
          >
            {isFullscreen ? (
              <Minimize2 className="h-4 w-4 text-gray-400" />
            ) : (
              <Maximize2 className="h-4 w-4 text-gray-400" />
            )}
          </button>
        </div>
      </div>

      {/* Chart canvas */}
      <div className="flex-1 relative">
        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900/50">
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
              <span className="mt-2 text-sm text-gray-400">Loading chart data...</span>
            </div>
          </div>
        ) : (
          <canvas
            ref={canvasRef}
            className="w-full h-full cursor-crosshair"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          />
        )}
      </div>
    </div>
  )
}
