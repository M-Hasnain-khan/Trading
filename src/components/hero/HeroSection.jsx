"use client"

import { useEffect, useRef, useState } from "react"

export default function HeroSection() {
  const canvasRef = useRef(null)

  // Animation for the candlestick chart
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")

    // Set canvas dimensions to match display size
    const handleResize = () => {
      const displayWidth = canvas.clientWidth
      const displayHeight = canvas.clientHeight

      if (canvas.width !== displayWidth || canvas.height !== displayHeight) {
        canvas.width = displayWidth
        canvas.height = displayHeight
      }
    }

    handleResize()
    window.addEventListener("resize", handleResize)

    // Generate random candlestick data - REDUCED NUMBER for better performance
    const generateCandlesticks = (count) => {
      const candlesticks = []
      let price = 45000 + Math.random() * 5000

      for (let i = 0; i < count; i++) {
        const change = (Math.random() - 0.5) * 500
        const open = price
        const close = price + change
        price = close

        const high = Math.max(open, close) + Math.random() * 200
        const low = Math.min(open, close) - Math.random() * 200

        candlesticks.push({ open, close, high, low })
      }

      return candlesticks
    }

    // REDUCED from 50 to 30 candlesticks for better performance
    const candlesticks = generateCandlesticks(30)

    // Animation variables
    let animationFrame
    let currentFrame = 0
    let lastFrameTime = 0
    const FPS_LIMIT = 30 // Limit frames per second for better performance

    const drawChart = (timestamp) => {
      // Throttle frame rate for better performance
      if (timestamp - lastFrameTime < 1000 / FPS_LIMIT) {
        animationFrame = requestAnimationFrame(drawChart)
        return
      }

      lastFrameTime = timestamp

      const width = canvas.width
      const height = canvas.height

      ctx.clearRect(0, 0, width, height)

      // Draw simplified background grid (fewer lines)
      ctx.strokeStyle = "rgba(255, 255, 255, 0.05)"
      ctx.beginPath()
      for (let i = 0; i < width; i += 100) {
        ctx.moveTo(i, 0)
        ctx.lineTo(i, height)
      }
      for (let i = 0; i < height; i += 100) {
        ctx.moveTo(0, i)
        ctx.lineTo(width, i)
      }
      ctx.stroke()

      // Calculate scale
      const maxPrice = Math.max(...candlesticks.map((c) => c.high))
      const minPrice = Math.min(...candlesticks.map((c) => c.low))
      const priceRange = maxPrice - minPrice
      const candleWidth = width / candlesticks.length
      const scaleFactor = height / priceRange

      // Draw visible candlesticks (with animation)
      const visibleCount = Math.min(candlesticks.length, Math.ceil(currentFrame))

      for (let i = 0; i < visibleCount; i++) {
        const candle = candlesticks[i]
        const x = i * candleWidth

        // Scale prices to canvas height
        const scaledOpen = height - (candle.open - minPrice) * scaleFactor
        const scaledClose = height - (candle.close - minPrice) * scaleFactor
        const scaledHigh = height - (candle.high - minPrice) * scaleFactor
        const scaledLow = height - (candle.low - minPrice) * scaleFactor

        // Make candles bigger by increasing width multiplier (from 0.6 to 0.8)
        const candleBodyWidth = candleWidth * 0.8

        // Add glow effect
        const isGreen = candle.open <= candle.close
        const color = isGreen ? "#0ECB81" : "#F6465D"
        const glowColor = isGreen ? "rgba(14, 203, 129, 0.5)" : "rgba(246, 70, 93, 0.5)"

        // Draw candle body with glow
        ctx.shadowColor = glowColor
        ctx.shadowBlur = 10
        ctx.fillStyle = color
        ctx.fillRect(
          x + (candleWidth - candleBodyWidth) / 2,
          Math.min(scaledOpen, scaledClose),
          candleBodyWidth,
          Math.abs(scaledClose - scaledOpen) || 2, // Minimum height of 2px
        )

        // Reset shadow for wick
        ctx.shadowBlur = 0

        // Draw wick with increased width
        ctx.strokeStyle = color
        ctx.lineWidth = 2 // Increased from default 1
        ctx.beginPath()
        ctx.moveTo(x + candleWidth / 2, scaledHigh)
        ctx.lineTo(x + candleWidth / 2, Math.min(scaledOpen, scaledClose))
        ctx.moveTo(x + candleWidth / 2, Math.max(scaledOpen, scaledClose))
        ctx.lineTo(x + candleWidth / 2, scaledLow)
        ctx.stroke()
      }

      // Animate at a slower rate for better performance
      if (currentFrame < candlesticks.length) {
        currentFrame += 0.15 // Reduced from 0.3 to 0.15 for slower animation
        animationFrame = requestAnimationFrame(drawChart)
      } else {
        // Once animation completes, redraw at a much lower frame rate
        setTimeout(() => {
          currentFrame = 0
          animationFrame = requestAnimationFrame(drawChart)
        }, 5000) // Wait 5 seconds before restarting animation
      }
    }

    // Start animation
    animationFrame = requestAnimationFrame(drawChart)

    return () => {
      cancelAnimationFrame(animationFrame)
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  // Animated counter hook
  const AnimatedCounter = ({ value, duration = 5000, prefix = "", suffix = "" }) => {
    const [count, setCount] = useState(0)
    const countRef = useRef(0)
    const prevCountRef = useRef(0)

    useEffect(() => {
      let startTime
      let animationFrame
      const finalValue = Number.parseFloat(value.replace(/[^0-9.-]+/g, ""))

      const step = (timestamp) => {
        if (!startTime) startTime = timestamp
        const progress = Math.min((timestamp - startTime) / duration, 1)

        // Smoother easing function for slower animation
        const easeOutCubic = 1 - Math.pow(1 - progress, 3)
        const currentCount = Math.floor(prevCountRef.current + (finalValue - prevCountRef.current) * easeOutCubic)

        if (countRef.current !== currentCount) {
          countRef.current = currentCount
          setCount(currentCount)
        }

        if (progress < 1) {
          animationFrame = requestAnimationFrame(step)
        } else {
          prevCountRef.current = finalValue
        }
      }

      animationFrame = requestAnimationFrame(step)

      return () => cancelAnimationFrame(animationFrame)
    }, [value, duration])

    // Format the number with commas
    const formattedCount = count.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")

    return (
      <span>
        {prefix}
        {formattedCount}
        {suffix}
      </span>
    )
  }

  return (
    <section className="relative overflow-hidden pt-20 pb-16">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-gray-900 to-black opacity-80 z-0"></div>

      {/* Animated chart background */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full opacity-20 z-0"></canvas>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-24 pb-8">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold sm:text-5xl md:text-6xl">
            <span className="block">Trade with confidence on</span>
            <span className="block text-yellow-500 mt-2">the world's fastest platform</span>
          </h1>
          <p className="mt-6 max-w-lg mx-auto text-xl text-gray-300">
            Experience the future of trading with advanced charts, real-time data, and powerful tools.
          </p>

          {/* Stats */}
          <div className="mt-12 cursor-pointer grid grid-cols-2 gap-5 sm:grid-cols-4 max-w-4xl mx-auto">
            {[
              { label: "24h Volume", value: "$76.4B" },
              { label: "Users", value: "28M+" },
              { label: "Markets", value: "600+" },
              { label: "Countries", value: "175+" },
            ].map((stat, index) => (
              <div
                key={index}
                className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-5 transform hover:scale-105 transition-transform"
              >
                <p className="text-2xl sm:text-3xl font-bold text-yellow-500">
                  <AnimatedCounter value={stat.value} duration={5000} />
                </p>
                <p className="text-gray-400 text-sm sm:text-base">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Profit Counter */}
          <div className="mt-10 bg-gray-800/70 backdrop-blur-md rounded-xl p-6 max-w-md mx-auto">
            <h3 className="text-xl font-semibold text-white mb-2">Total Platform Profit</h3>
            <div className="flex items-center justify-center">
              <span className="text-3xl sm:text-4xl font-bold text-yellow-500">
                <AnimatedCounter value="$1,458,976,321" duration={8000} />
              </span>
            </div>
            <p className="text-gray-400 text-sm mt-2">Average user profit: +27.8% yearly</p>
          </div>

          {/* CTA Buttons */}
          <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
            <button className="px-8 py-3 bg-yellow-500 text-black font-medium rounded-md hover:bg-yellow-400 transition-colors">
              Start Trading
            </button>
            <button className="px-8 py-3 border border-yellow-500 text-yellow-500 font-medium rounded-md hover:bg-yellow-500/10 transition-colors">
              Learn More
            </button>
          </div>
        </div>
      </div>

      {/* Floating elements - decorative */}
      <div className="absolute top-1/4 left-10 w-20 h-20 bg-yellow-500/20 rounded-full blur-xl"></div>
      <div className="absolute bottom-1/3 right-10 w-32 h-32 bg-yellow-500/10 rounded-full blur-xl"></div>
    </section>
  )
}
