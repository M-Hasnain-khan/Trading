import { Facebook, Twitter, Instagram, Linkedin, Youtube } from "lucide-react"

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-[#0d1117] text-gray-400 pt-16 pb-10 border-t border-[#1a1f2c] mt-24">
      <div className="container mx-auto px-4">
        {/* Top Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          {/* Brand Info */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-white mb-4">
              <span className="text-yellow-500">TRADE</span>PRO
            </h2>
            <p className="mb-6 max-w-md">
              The world's leading cryptocurrency trading platform. Trade with confidence on our secure, reliable, and user-friendly platform.
            </p>
            <div className="flex space-x-4">
              {[Facebook, Twitter, Instagram, Linkedin, Youtube].map((Icon, idx) => (
                <a key={idx} href="#" className="hover:text-yellow-500 transition-colors">
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Products */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Products</h3>
            <ul className="space-y-2">
              {["Spot Trading", "Margin Trading", "Futures", "Options", "Staking", "Launchpad"].map((item, idx) => (
                <li key={idx}>
                  <a href="#" className="hover:text-yellow-500 transition-colors">{item}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Services</h3>
            <ul className="space-y-2">
              {["Institutional & VIP", "API Documentation", "Referral Program", "Mobile App", "Trading Bots", "OTC Trading"].map((item, idx) => (
                <li key={idx}>
                  <a href="#" className="hover:text-yellow-500 transition-colors">{item}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Support</h3>
            <ul className="space-y-2">
              {["Help Center", "User Guides", "Fee Schedule", "Security", "Contact Us", "Bug Bounty"].map((item, idx) => (
                <li key={idx}>
                  <a href="#" className="hover:text-yellow-500 transition-colors">{item}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-[#1a1f2c] pt-6 flex flex-col md:flex-row justify-between items-center text-sm">
          <p className="mb-4 md:mb-0">© {currentYear} CRYPTOTRADE. All rights reserved.</p>
          <div className="flex flex-wrap justify-center gap-4">
            {["Terms of Service", "Privacy Policy", "Risk Disclosure", "Trading Rules", "Cookie Preferences"].map((item, idx) => (
              <a key={idx} href="#" className="hover:text-yellow-500 transition-colors">
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
