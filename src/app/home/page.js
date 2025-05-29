import Header from "@/components/header/Header"
import HeroSection from "@/components/hero/HeroSection"
import FeaturesSection from "@/components/features/FeaturesSection"
import MarketView from "@/components/marketoverview/MarketView"
import TradingView from "@/components/tradingview/TradingView"
import Testimonials from "@/components/testimonials/Testimonials"
import Contact from "@/components/contact/Contact"
import Footer from "@/components/footer/Footer"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <Header />
      <HeroSection />
      <FeaturesSection />
      <MarketView />
      <TradingView />
      <Testimonials />
  
      <Contact />
      {/* Add more sections as needed */}
      <main className="max-w-7xl mx-auto px-4 py-16">{/* Additional content will go here */}</main>
      <Footer />
    </div>
  )
}
