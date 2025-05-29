"use client"

import Image from "next/image"
import { useState, useEffect, useRef } from "react"
import { BarChart2, TrendingUp, Shield, Zap, Globe, Smartphone, Award, Clock } from "lucide-react"
import { cn } from "@/components/lib/utils"

// IMAGE












export default function FeaturesSection() {
  const [activeFeature, setActiveFeature] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef(null)

  // Observer for scroll animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 },
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current)
      }
    }
  }, [])

  // Auto-rotate features
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % features.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  // Features data
  const features = [
    {
      title: "Advanced Trading Tools",
      description:
        "Access professional-grade charts, technical indicators, and drawing tools to analyze market trends and make informed decisions.",
      icon: <BarChart2 className="h-10 w-10" />,
      image: "",
      stats: [
        { label: "Technical Indicators", value: "100+" },
        { label: "Chart Types", value: "12" },
        { label: "Timeframes", value: "21" },
      ],
    },
    {
      title: "Lightning-Fast Execution",
      description:
        "Execute trades with millisecond precision on our high-performance trading engine designed for professional traders.",
      icon: <Zap className="h-10 w-10" />,
      image: "/images/fast-execution.png",
      stats: [
        { label: "Execution Speed", value: "<10ms" },
        { label: "Uptime", value: "99.99%" },
        { label: "Orders/sec", value: "100K+" },
      ],
    },
    {
      title: "Institutional-Grade Security",
      description:
        "Your assets are protected by military-grade encryption, multi-signature wallets, and regular security audits.",
      icon: <Shield className="h-10 w-10" />,
      image: "/images/security.png",
      stats: [
        { label: "Cold Storage", value: "95%" },
        { label: "Insurance Fund", value: "$200M" },
        { label: "Security Team", value: "24/7" },
      ],
    },
    {
      title: "Global Market Access",
      description:
        "Trade thousands of markets including cryptocurrencies, stocks, forex, and commodities from a single unified platform.",
      icon: <Globe className="h-10 w-10" />,
      image: "/images/global-markets.png",
      stats: [
        { label: "Markets", value: "10,000+" },
        { label: "Asset Classes", value: "6" },
        { label: "Liquidity Sources", value: "50+" },
      ],
    },
  ]

  return (
    <section ref={sectionRef} className="relative py-20 overflow-hidden bg-black">
      {/* Background elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900 to-black opacity-80 z-0"></div>
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-yellow-500/50 to-transparent"></div>
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-yellow-500/50 to-transparent"></div>

      {/* Glowing orbs */}
      <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-yellow-500/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/3 left-1/5 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-16">
          <h2
            className={cn(
              "text-3xl font-bold sm:text-4xl mb-4 transition-all duration-700",
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10",
            )}
          >
            <span className="bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
              Powerful Features
            </span>{" "}
            for Serious Traders
          </h2>
          <p
            className={cn(
              "max-w-2xl mx-auto text-gray-400 text-lg transition-all duration-700 delay-300",
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10",
            )}
          >
            Our platform combines cutting-edge technology with an intuitive interface to give you the edge in today's
            volatile markets.
          </p>
        </div>

        {/* Features tabs and content */}
        <div className="grid md:grid-cols-12 gap-8 items-center">
          {/* Feature tabs */}
          <div className="md:col-span-4">
            <div
              className={cn(
                "space-y-4 transition-all duration-700 delay-500",
                isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10",
              )}
            >
              {features.map((feature, index) => (
                <div
                  key={index}
                  className={cn(
                    "p-4 rounded-lg cursor-pointer transition-all duration-300",
                    activeFeature === index
                      ? "bg-gray-800/80 border border-yellow-500/30 shadow-lg shadow-yellow-500/5"
                      : "hover:bg-gray-900/50",
                  )}
                  onClick={() => setActiveFeature(index)}
                >
                  <div className="flex items-center">
                    <div
                      className={cn(
                        "p-2 rounded-full mr-4 transition-colors",
                        activeFeature === index ? "bg-yellow-500/20 text-yellow-500" : "bg-gray-800 text-gray-400",
                      )}
                    >
                      {feature.icon}
                    </div>
                    <div>
                      <h3
                        className={cn(
                          "font-semibold transition-colors",
                          activeFeature === index ? "text-yellow-500" : "text-white",
                        )}
                      >
                        {feature.title}
                      </h3>
                      <p className="text-sm text-gray-400 mt-1 line-clamp-1">{feature.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Feature content */}
          <div className="md:col-span-8">
            <div
              className={cn(
                "bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-6 transition-all duration-700 delay-700",
                isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10",
              )}
            >
              {features.map((feature, index) => (
                <div
                  key={index}
                  className={cn(
                    "transition-opacity duration-500",
                    activeFeature === index ? "block opacity-100" : "hidden opacity-0",
                  )}
                >
                  <div className="flex items-center mb-6">
                    <div className="p-3 bg-yellow-500/20 rounded-full mr-4 text-yellow-500">{feature.icon}</div>
                    <h3 className="text-2xl font-bold text-white">{feature.title}</h3>
                  </div>

                  <p className="text-gray-300 mb-8">{feature.description}</p>

                  {/* Feature illustration */}
                  <div className="relative h-64 mb-8 overflow-hidden rounded-xl bg-gray-800/50">
                    <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-60 z-10"></div>
                    <img
                      src={feature.image || "/placeholder.svg"}
                      alt={feature.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Feature stats */}
                  <div className="grid grid-cols-3 gap-4">
                    {feature.stats.map((stat, statIndex) => (
                      <div
                        key={statIndex}
                        className="bg-gray-800/70 rounded-lg p-4 text-center transform hover:scale-105 transition-transform"
                      >
                        <p className="text-xl font-bold text-yellow-500">{stat.value}</p>
                        <p className="text-gray-400 text-sm">{stat.label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Additional features */}
        <div
          className={cn(
            "mt-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 transition-all duration-700 delay-1000",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10",
          )}
        >
          {[
            {
              icon: <TrendingUp className="h-6 w-6" />,
              title: "AI-Powered Insights",
              description:
                "Get personalized trading recommendations based on market analysis and your trading history.",
              image: "/images/ai-insights.png",
            },
            {
              icon: <Smartphone className="h-6 w-6" />,
              title: "Mobile Trading",
              description: "Trade on the go with our powerful mobile app available for iOS and Android devices.",
              image: "/images/mobile-trading.png",
            },
            {
              icon: <Clock className="h-6 w-6" />,
              title: "24/7 Support",
              description: "Our dedicated support team is available around the clock to assist with any questions.",
              image: "/images/support.png",
            },
            {
              icon: <Award className="h-6 w-6" />,
              title: "Rewards Program",
              description: "Earn points for trading activity and redeem them for fee discounts and exclusive benefits.",
              image: "/images/rewards.png",
            },
          ].map((item, index) => (
            <div
              key={index}
              className="bg-gray-900/30 backdrop-blur-sm border border-gray-800 rounded-xl p-6 hover:border-yellow-500/30 transition-colors overflow-hidden group"
            >
              <div className="p-3 bg-yellow-500/10 rounded-full w-fit mb-4 text-yellow-500">{item.icon}</div>
              <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
              <p className="text-gray-400 text-sm mb-4">{item.description}</p>
              <div className="h-32 w-full overflow-hidden rounded-lg">
                <img
                  src={item.image || "/placeholder.svg"}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div
          className={cn(
            "mt-16 text-center transition-all duration-700 delay-1200",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10",
          )}
        >
          <button className="px-8 py-3 bg-yellow-500 text-black font-medium rounded-md hover:bg-yellow-400 transition-colors">
            Explore All Features
          </button>
        </div>
      </div>
    </section>
  )
}
