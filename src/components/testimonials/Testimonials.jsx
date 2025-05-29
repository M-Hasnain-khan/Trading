"use client"

import { useState, useEffect, useRef } from "react"
import { Star, ArrowRight, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function TestimonialsSection() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const containerRef = useRef(null)
  const intervalRef = useRef(null)

  const testimonials = [
    {
      id: 1,
      name: "Alex Thompson",
      role: "Day Trader",
      initials: "AT",
      content:
        "The execution speed on CRYPTOTRADE is unmatched. I've tried several platforms, but none come close to the reliability and performance I get here. My trading strategies have become 3x more effective.",
      rating: 5,
      tradingPair: "BTC/USDT",
      profit: "+187%",
      tradingSince: "2019",
    },
    {
      id: 2,
      name: "Sarah Chen",
      role: "Crypto Investor",
      initials: "SC",
      content:
        "The security features give me peace of mind. Two-factor authentication, cold storage, and insurance protection make this the safest platform I've used. I sleep well knowing my assets are protected.",
      rating: 5,
      tradingPair: "ETH/USDT",
      profit: "+215%",
      tradingSince: "2020",
    },
    {
      id: 3,
      name: "Michael Rodriguez",
      role: "Institutional Trader",
      initials: "MR",
      content:
        "The API integration is seamless and the documentation is comprehensive. Our trading algorithms perform exceptionally well on this platform. We've reduced latency by 40% compared to other exchanges.",
      rating: 4,
      tradingPair: "SOL/USDT",
      profit: "+163%",
      tradingSince: "2018",
    },
    {
      id: 4,
      name: "Emma Wilson",
      role: "Retail Investor",
      initials: "EW",
      content:
        "As a beginner, I found the interface intuitive and the educational resources incredibly helpful. The customer support team is always ready to assist. I've learned so much in just a few months.",
      rating: 5,
      tradingPair: "ADA/USDT",
      profit: "+92%",
      tradingSince: "2021",
    },
    {
      id: 5,
      name: "David Park",
      role: "Crypto Analyst",
      initials: "DP",
      content:
        "The depth of market data and analytical tools available on CRYPTOTRADE gives me everything I need to make informed decisions. The platform's stability during high volatility is impressive.",
      rating: 5,
      tradingPair: "XRP/USDT",
      profit: "+145%",
      tradingSince: "2017",
    },
  ]

  const renderStars = (rating) => {
    return Array(5)
      .fill(0)
      .map((_, i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${
            i < rating ? "fill-yellow-500 text-yellow-500" : "text-gray-600"
          } transition-all duration-300`}
        />
      ))
  }

  // Auto-rotate testimonials
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      if (!isAnimating) {
        nextTestimonial()
      }
    }, 8000)

    return () => clearInterval(intervalRef.current)
  }, [activeIndex, isAnimating])

  const nextTestimonial = () => {
    if (isAnimating) return

    setIsAnimating(true)
    setActiveIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1))

    setTimeout(() => {
      setIsAnimating(false)
    }, 600)
  }

  const prevTestimonial = () => {
    if (isAnimating) return

    setIsAnimating(true)
    setActiveIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1))

    setTimeout(() => {
      setIsAnimating(false)
    }, 600)
  }

  // Random floating particles animation
  const ParticleAnimation = () => {
    const canvasRef = useRef(null)

    useEffect(() => {
      const canvas = canvasRef.current
      if (!canvas) return

      const ctx = canvas.getContext("2d")
      const particles = []

      // Create particles
      for (let i = 0; i < 30; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          radius: Math.random() * 3 + 1,
          color: i % 3 === 0 ? "rgba(255, 204, 0, 0.2)" : "rgba(255, 255, 255, 0.1)",
          speedX: Math.random() * 0.5 - 0.25,
          speedY: Math.random() * 0.5 - 0.25,
          opacity: Math.random() * 0.5 + 0.2,
        })
      }

      const animate = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height)

        particles.forEach((particle) => {
          // Update position
          particle.x += particle.speedX
          particle.y += particle.speedY

          // Wrap around edges
          if (particle.x < 0) particle.x = canvas.width
          if (particle.x > canvas.width) particle.x = 0
          if (particle.y < 0) particle.y = canvas.height
          if (particle.y > canvas.height) particle.y = 0

          // Draw particle
          ctx.beginPath()
          ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2)
          ctx.fillStyle = particle.color
          ctx.globalAlpha = particle.opacity
          ctx.fill()
        })

        requestAnimationFrame(animate)
      }

      animate()

      return () => {
        // Cleanup if needed
      }
    }, [])

    return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full -z-10" width={1000} height={600} />
  }

  // Animated initials circle
  const InitialsCircle = ({ initials, index }) => {
    const colors = [
      "from-yellow-500 to-amber-600",
      "from-blue-500 to-cyan-600",
      "from-green-500 to-emerald-600",
      "from-purple-500 to-violet-600",
      "from-red-500 to-rose-600",
    ]

    const colorClass = colors[index % colors.length]

    return (
      <div className="relative flex-shrink-0">
        {/* Outer rotating ring */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-yellow-500 to-yellow-300 animate-spin-slow opacity-70 blur-[1px]"></div>

        {/* Inner circle with gradient */}
        <div
          className={`relative flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br ${colorClass} z-10 border-2 border-gray-800`}
        >
          <span className="text-xl font-bold text-white">{initials}</span>
        </div>

        {/* Pulsing glow effect */}
        <div className="absolute inset-0 rounded-full bg-yellow-500 opacity-30 blur-md animate-pulse"></div>
      </div>
    )
  }

  // Trading stats mini-component
  const TradingStats = ({ pair, profit, since }) => {
    return (
      <div className="mt-4 bg-gray-800/50 rounded-lg p-3 text-xs border border-gray-700">
        <div className="flex justify-between items-center mb-2">
          <span className="text-gray-400">Favorite Pair</span>
          <span className="font-medium text-white">{pair}</span>
        </div>
        <div className="flex justify-between items-center mb-2">
          <span className="text-gray-400">Portfolio Growth</span>
          <span className="font-medium text-green-500">{profit}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-400">Trading Since</span>
          <span className="font-medium text-white">{since}</span>
        </div>
      </div>
    )
  }

  return (
    <section className="py-20 relative overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-bold mb-4 relative inline-block">
            <span className="relative z-10 text-transparent bg-gradient-to-r from-yellow-300 via-yellow-500 to-yellow-700 bg-clip-text drop-shadow-[0_0_10px_rgba(234,179,8,0.7)]">What Our Traders Say</span>
            <span className="absolute -bottom-2 left-0 right-0 h-3 bg-yellow-500/20 -z-10 transform -rotate-1"></span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Don't just take our word for it. Here's what our community of traders has to say about their experience.
          </p>
        </div>

        {/* Testimonial Carousel */}
        <div className="relative max-w-4xl mx-auto" ref={containerRef}>
          <ParticleAnimation />

          {/* Navigation Buttons */}
          <div className="absolute top-1/2 -left-4 md:-left-12 transform -translate-y-1/2 z-20">
            <Button
              onClick={prevTestimonial}
              variant="outline"
              size="icon"
              className="rounded-full border-gray-700 bg-gray-800/70 backdrop-blur-sm hover:bg-gray-700 hover:text-yellow-500"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </div>

          <div className="absolute top-1/2 -right-4 md:-right-12 transform -translate-y-1/2 z-20">
            <Button
              onClick={nextTestimonial}
              variant="outline"
              size="icon"
              className="rounded-full border-gray-700 bg-gray-800/70 backdrop-blur-sm hover:bg-gray-700 hover:text-yellow-500"
            >
              <ArrowRight className="h-5 w-5" />
            </Button>
          </div>

          {/* Testimonial Cards */}
          <div className="relative h-[500px] md:h-[400px]">
            {testimonials.map((testimonial, index) => (
              <div
                key={testimonial.id}
                className={`absolute inset-0 transition-all duration-500 ease-in-out ${
                  index === activeIndex
                    ? "opacity-100 translate-x-0 z-10"
                    : index < activeIndex || (activeIndex === 0 && index === testimonials.length - 1)
                      ? "opacity-0 -translate-x-full z-0"
                      : "opacity-0 translate-x-full z-0"
                }`}
              >
                <div className="bg-gray-900/70 backdrop-blur-md border border-gray-800 rounded-xl p-6 md:p-8 h-full shadow-xl shadow-yellow-500/5 transition-all duration-300 hover:shadow-yellow-500/10 hover:border-gray-700 relative overflow-hidden">
                  {/* Background glow */}
                  <div className="absolute top-0 right-0 w-40 h-40 bg-yellow-500/5 rounded-full blur-3xl"></div>
                  <div className="absolute bottom-0 left-0 w-40 h-40 bg-blue-500/5 rounded-full blur-3xl"></div>

                  {/* Grid pattern */}
                  <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMyMDIwMjAiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDM0aDR2MWgtNHYtMXptMC0yaDF2NGgtMXYtNHptMi0yaDF2MWgtMXYtMXptLTIgMmgxdjFoLTF2LTF6bS0yLTJoMXYxaC0xdi0xem0yLTJoMXYxaC0xdi0xem0tMiAyaDF2MWgtMXYtMXptLTItMmgxdjFoLTF2LTF6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-10"></div>

                  <div className="relative z-10 h-full flex flex-col md:flex-row">
                    {/* Left side - User info */}
                    <div className="md:w-1/3 mb-6 md:mb-0 md:pr-6 flex flex-col items-center md:items-start">
                      <InitialsCircle initials={testimonial.initials} index={index} />

                      <div className="mt-4 text-center md:text-left">
                        <h3 className="font-bold text-lg">{testimonial.name}</h3>
                        <p className="text-gray-400 text-sm">{testimonial.role}</p>
                        <div className="flex mt-2 justify-center md:justify-start">
                          {renderStars(testimonial.rating)}
                        </div>
                      </div>

                      <TradingStats
                        pair={testimonial.tradingPair}
                        profit={testimonial.profit}
                        since={testimonial.tradingSince}
                      />
                    </div>

                    {/* Right side - Testimonial content */}
                    <div className="md:w-2/3 flex flex-col justify-center">
                      <div className="relative">
                        <div className="absolute -top-6 -left-6 text-6xl text-yellow-500/20 font-serif">"</div>
                        <p className="text-gray-300 text-lg relative z-10 leading-relaxed">{testimonial.content}</p>
                        <div className="absolute -bottom-10 -right-6 text-6xl text-yellow-500/20 font-serif">"</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination dots */}
          <div className="flex justify-center mt-6 space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  if (!isAnimating) {
                    setIsAnimating(true)
                    setActiveIndex(index)
                    setTimeout(() => setIsAnimating(false), 600)
                  }
                }}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === activeIndex ? "bg-yellow-500 w-6" : "bg-gray-600 hover:bg-gray-500"
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>

        <div className="mt-16 text-center">
          <div className="inline-flex items-center space-x-2 bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg py-3 px-6">
            <span className="text-yellow-500 font-bold text-2xl">4.9</span>
            <div className="flex">{renderStars(5)}</div>
            <span className="text-gray-400">from 10,000+ reviews</span>
          </div>
        </div>

        {/* Mobile App Promo */}
        <div className="mt-20 bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-8 border border-gray-700 shadow-xl shadow-yellow-500/5 relative overflow-hidden">
          <div className="flex flex-col md:flex-row items-center">
            <div className="w-full md:w-1/2 mb-8 md:mb-0 relative z-10">
              <h3 className="text-2xl md:text-3xl font-bold mb-4">
                Trade On The Go With Our{" "}
                <span className="text-yellow-500 relative">
                  Mobile App
                  <span className="absolute bottom-0 left-0 right-0 h-2 bg-yellow-500/20"></span>
                </span>
              </h3>
              <p className="text-gray-300 mb-6">
                Download our mobile app to trade anytime, anywhere. Get real-time notifications, manage your portfolio,
                and never miss a trading opportunity.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="flex items-center justify-center bg-black hover:bg-gray-900 text-white py-3 px-6 rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-yellow-500/20 group">
                  <svg
                    className="w-6 h-6 mr-2 transition-transform duration-300 group-hover:scale-110"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M17.5,2H8.5L3,7V22H21V7L17.5,2M16.5,3.5L19.5,7H16.5V3.5M12,17.5A2.5,2.5 0 0,1 9.5,15A2.5,2.5 0 0,1 12,12.5A2.5,2.5 0 0,1 14.5,15A2.5,2.5 0 0,1 12,17.5M12,11A4,4 0 0,0 8,15A4,4 0 0,0 12,19A4,4 0 0,0 16,15A4,4 0 0,0 12,11Z" />
                  </svg>
                  App Store
                </button>
                <button className="flex items-center justify-center bg-black hover:bg-gray-900 text-white py-3 px-6 rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-yellow-500/20 group">
                  <svg
                    className="w-6 h-6 mr-2 transition-transform duration-300 group-hover:scale-110"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z" />
                  </svg>
                  Google Play
                </button>
              </div>
            </div>
            <div className="w-full md:w-1/2 flex justify-center">
              <div className="relative">
                <div className="w-64 h-96 bg-black rounded-3xl border-4 border-gray-700 shadow-xl overflow-hidden">
                  {/* Phone screen animation */}
                  <div className="absolute inset-0 bg-gradient-to-b from-yellow-500/20 to-blue-500/20 opacity-50 animate-pulse"></div>
                  <div className="absolute top-0 left-0 right-0 h-6 bg-black rounded-t-3xl flex justify-center items-center">
                    <div className="w-20 h-1 bg-gray-700 rounded-full"></div>
                  </div>
                  <div className="pt-8 px-4">
                    <div className="bg-gray-900 rounded-xl p-3 mb-3 animate-float">
                      <div className="flex justify-between items-center mb-2">
                        <div className="text-xs text-white font-bold">BTC/USDT</div>
                        <div className="text-xs text-green-500">+2.45%</div>
                      </div>
                      <div className="h-24 bg-gray-800 rounded-lg mb-2 overflow-hidden relative">
                        {/* Mini chart animation */}
                        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                          <path
                            d="M0,50 L10,45 L20,55 L30,40 L40,60 L50,35 L60,50 L70,30 L80,45 L90,25 L100,40"
                            fill="none"
                            stroke="#4ADE80"
                            strokeWidth="2"
                            className="animate-draw-line"
                          />
                        </svg>
                      </div>
                      <div className="flex justify-between text-xs text-gray-400">
                        <div>$68,472</div>
                        <div>24h</div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3 mb-3">
                      <div className="bg-green-500 text-black text-center py-2 rounded-lg text-sm font-bold animate-pulse-subtle">
                        BUY
                      </div>
                      <div className="bg-red-500 text-white text-center py-2 rounded-lg text-sm font-bold">SELL</div>
                    </div>
                    <div className="bg-gray-900 rounded-xl p-3 animate-float-delayed">
                      <div className="text-xs text-white font-bold mb-2">Markets</div>
                      <div className="space-y-2">
                        {["BTC/USDT", "ETH/USDT", "SOL/USDT"].map((pair, index) => (
                          <div key={index} className="flex justify-between items-center">
                            <div className="text-xs text-white">{pair}</div>
                            <div className="text-xs text-green-500">+{(Math.random() * 5).toFixed(2)}%</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                {/* Phone glow effects */}
                <div className="absolute -bottom-4 -right-4 w-40 h-40 bg-yellow-500/20 rounded-full blur-xl animate-pulse"></div>
                <div className="absolute -top-4 -left-4 w-40 h-40 bg-blue-500/20 rounded-full blur-xl animate-pulse-delayed"></div>
              </div>
            </div>
          </div>

          {/* Background elements */}
          <div className="absolute top-1/2 right-0 w-64 h-64 bg-yellow-500/5 rounded-full blur-3xl -z-10"></div>
          <div className="absolute bottom-0 left-1/4 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl -z-10"></div>
        </div>
      </div>

      {/* Background elements */}
      <div className="absolute top-1/3 right-0 w-64 h-64 bg-yellow-500/5 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl -z-10"></div>
    </section>
  )
}
