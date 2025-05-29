"use client"

import { useState, useEffect, useRef } from "react"
import {
  Menu,
  X,
  ChevronDown,
  Bell,
  User,
  Moon,
  Sun,
  Search,
  BarChart2,
  Settings,
  LogOut,
  Heart,
  Wallet,
  HelpCircle,
} from "lucide-react"
import { cn } from "../lib/utils"
import { Button } from "../ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/DropDownMenu"

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(true)
  const [activeDropdown, setActiveDropdown] = useState(null)

  // Refs for dropdown positioning
  const notificationsButtonRef = useRef(null)
  const userProfileButtonRef = useRef(null)
  const searchButtonRef = useRef(null)

  const notificationsRef = useRef(null)
  const userProfileRef = useRef(null)
  const searchRef = useRef(null)

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Handle click outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        activeDropdown === "notifications" &&
        notificationsRef.current &&
        !notificationsRef.current.contains(event.target) &&
        !notificationsButtonRef.current.contains(event.target)
      ) {
        setActiveDropdown(null)
      }
      if (
        activeDropdown === "profile" &&
        userProfileRef.current &&
        !userProfileRef.current.contains(event.target) &&
        !userProfileButtonRef.current.contains(event.target)
      ) {
        setActiveDropdown(null)
      }
      if (
        activeDropdown === "search" &&
        searchRef.current &&
        !searchRef.current.contains(event.target) &&
        !searchButtonRef.current.contains(event.target)
      ) {
        setActiveDropdown(null)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [activeDropdown])

  // Toggle theme
  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode)
    // In a real app, you would implement actual theme switching here
  }

  // Toggle dropdown
  const toggleDropdown = (dropdown) => {
    setActiveDropdown(activeDropdown === dropdown ? null : dropdown)
  }

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out h-16",
        isScrolled ? "bg-black/90 backdrop-blur-md border-b border-yellow-500/20" : "bg-black/50 backdrop-blur-sm",
        isDarkMode ? "text-white" : "text-gray-900",
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <a href="/" className="flex items-center">
              <BarChart2 className="h-8 w-8 text-yellow-500" />
              <span className="ml-2 text-xl cursor-pointer font-bold bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
                TradePro
              </span>
            </a>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-1">
            {["Markets", "Trade", "Derivatives", "Earn", "NFT", "Learn"].map((item) => (
              <DropdownMenu key={item}>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="text-sm group relative px-3 py-2 rounded-md"
                    onClick={(e) => {
                      // Prevent default to avoid page jumps
                      e.preventDefault()
                    }}
                  >
                    <span>{item}</span>
                    <ChevronDown className="ml-1 h-4 w-4 opacity-70 group-hover:opacity-100 transition-opacity" />
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-yellow-500 group-hover:w-full transition-all duration-300"></span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="center"
                  side="bottom" // Added to force dropdown below the button
                  sideOffset={8}
                  className="bg-gray-900/95 backdrop-blur-sm border border-gray-800 text-white w-48 overflow-hidden shadow-lg shadow-black/20"
                >
                  <DropdownMenuItem className="hover:bg-gray-800 cursor-pointer">Option 1</DropdownMenuItem>
                  <DropdownMenuItem className="hover:bg-gray-800 cursor-pointer">Option 2</DropdownMenuItem>
                  <DropdownMenuItem className="hover:bg-gray-800 cursor-pointer">Option 3</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ))}
          </nav>

          {/* Desktop Right Side */}
          <div className="hidden md:flex items-center space-x-4">
            <Button variant="ghost" size="icon" onClick={toggleTheme} className="text-gray-400 hover:text-white">
              {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>

            {/* Search Dropdown */}
            <div className="relative">
              <Button
                ref={searchButtonRef}
                variant="ghost"
                size="icon"
                className={cn(
                  "text-gray-400 hover:text-white cursor-pointer transition-colors",
                  activeDropdown === "search" && "text-white bg-gray-800",
                )}
                onClick={() => toggleDropdown("search")}
              >
                <Search className="h-5 w-5" />
              </Button>

              {activeDropdown === "search" && (
                <div
                  ref={searchRef}
                  className="absolute right-0 top-full mt-2 w-80 bg-gray-900/95 backdrop-blur-sm border border-gray-800 rounded-md shadow-lg shadow-black/20 overflow-hidden animate-scale-in z-50"
                >
                  <div className="p-3 ">
                    <div className="flex items-center bg-gray-800 rounded-md px-3 py-2">
                      <Search className="h-4 w-4  text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search markets..."
                        className="bg-transparent border-none focus:outline-none text-white ml-2 w-full"
                      />
                    </div>
                    <div className="mt-2 cursor-pointer">
                      <h4 className="text-xs text-gray-500 uppercase font-semibold mb-1 px-2">Popular Searches</h4>
                      <div className="space-y-1">
                        <div className="px-2 py-1 hover:bg-gray-800 rounded-md cursor-pointer flex items-center animate-fade-in stagger-1">
                          <span className="text-sm text-gray-300">BTC/USDT</span>
                        </div>
                        <div className="px-2 py-1 hover:bg-gray-800 rounded-md cursor-pointer flex items-center animate-fade-in stagger-2">
                          <span className="text-sm text-gray-300">ETH/USDT</span>
                        </div>
                        <div className="px-2 py-1 hover:bg-gray-800 rounded-md cursor-pointer flex items-center animate-fade-in stagger-3">
                          <span className="text-sm text-gray-300">SOL/USDT</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Notifications Dropdown */}
            <div className="relative">
              <Button
                ref={notificationsButtonRef}
                variant="ghost"
                size="icon"
                className={cn(
                  "text-gray-400 cursor-pointer hover:text-white transition-colors",
                  activeDropdown === "notifications" && "text-white bg-gray-800",
                )}
                onClick={() => toggleDropdown("notifications")}
              >
                <div className="relative">
                  <Bell className="h-5 w-5" />
                  <span className="absolute -top-1 -right-1 bg-red-500 rounded-full w-2 h-2"></span>
                </div>
              </Button>

              {activeDropdown === "notifications" && (
                <div
                  ref={notificationsRef}
                  className="absolute right-0 top-full mt-2 w-80 cursor-pointer bg-gray-900/95 backdrop-blur-sm border border-gray-800 rounded-md shadow-lg shadow-black/20 overflow-hidden animate-scale-in z-50"
                >
                  <div className="p-2">
                    <h3 className="text-sm font-medium text-gray-300 px-2 py-1 border-b border-gray-800">
                      Notifications
                    </h3>
                    <div className="mt-1 cursor-pointer max-h-60 overflow-y-auto">
                      <div className="px-2 py-2 hover:bg-gray-800 rounded-md cursor-pointer border-b border-gray-800/50 animate-fade-in stagger-1">
                        <div className="flex items-start">
                          <div className="flex-shrink-0 bg-green-500/20 p-1 rounded-full">
                            <Wallet className="h-4 w-4 text-green-500" />
                          </div>
                          <div className="ml-2">
                            <p className="text-sm text-white">Deposit confirmed</p>
                            <p className="text-xs text-gray-400">Your deposit of 0.5 BTC has been confirmed.</p>
                            <p className="text-xs text-gray-500 mt-1">10 minutes ago</p>
                          </div>
                        </div>
                      </div>
                      <div className="px-2 py-2 hover:bg-gray-800 rounded-md cursor-pointer border-b border-gray-800/50 animate-fade-in stagger-2">
                        <div className="flex items-start">
                          <div className="flex-shrink-0 bg-blue-500/20 p-1 rounded-full">
                            <Bell className="h-4 w-4 text-blue-500" />
                          </div>
                          <div className="ml-2">
                            <p className="text-sm text-white">Price Alert</p>
                            <p className="text-xs text-gray-400">BTC just reached your target price of $60,000.</p>
                            <p className="text-xs text-gray-500 mt-1">1 hour ago</p>
                          </div>
                        </div>
                      </div>
                      <div className="px-2 py-2 hover:bg-gray-800 rounded-md cursor-pointer animate-fade-in stagger-3">
                        <div className="flex items-start">
                          <div className="flex-shrink-0 bg-yellow-500/20 p-1 rounded-full">
                            <Settings className="h-4 w-4 text-yellow-500" />
                          </div>
                          <div className="ml-2">
                            <p className="text-sm text-white">Account Security</p>
                            <p className="text-xs text-gray-400">Please enable 2FA for enhanced security.</p>
                            <p className="text-xs text-gray-500 mt-1">2 days ago</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="mt-1 pt-1 border-t border-gray-800">
                      <button className="w-full text-center text-xs text-yellow-500 hover:text-yellow-400 py-1">
                        View all notifications
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* User Profile Dropdown */}
            <div className="relative">
              <Button
                ref={userProfileButtonRef}
                variant="ghost"
                size="icon"
                className={cn(
                  "text-gray-400 hover:text-white transition-colors",
                  activeDropdown === "profile" && "text-white bg-gray-800",
                )}
                onClick={() => toggleDropdown("profile")}
              >
                <User className="h-5 w-5" />
              </Button>

              {activeDropdown === "profile" && (
                <div
                  ref={userProfileRef}
                  className="absolute right-0 top-full mt-2 w-56 bg-gray-900/95 backdrop-blur-sm border border-gray-800 rounded-md shadow-lg shadow-black/20 overflow-hidden animate-scale-in z-50"
                >
                  <div className="p-2 cursor-pointer" >
                    <div className="px-3 py-2 border-b border-gray-800">
                      <p className="text-sm font-medium text-white">Guest User</p>
                      <p className="text-xs text-gray-400">guest@example.com</p>
                    </div>
                    <div className="mt-1 cursor-pointer">
                      <a
                        href="#"
                        className="flex items-center px-3 py-2 text-sm text-gray-300 hover:bg-gray-800 rounded-md animate-fade-in stagger-1"
                      >
                        <User className="h-4 w-4 mr-2" />
                        Profile
                      </a>
                      <a
                        href="#"
                        className="flex items-center px-3 py-2 text-sm text-gray-300 hover:bg-gray-800 rounded-md animate-fade-in stagger-2"
                      >
                        <Wallet className="h-4 w-4 mr-2" />
                        Wallet
                      </a>
                      <a
                        href="#"
                        className="flex items-center px-3 py-2 text-sm text-gray-300 hover:bg-gray-800 rounded-md animate-fade-in stagger-3"
                      >
                        <Heart className="h-4 w-4 mr-2" />
                        Favorites
                      </a>
                      <a
                        href="#"
                        className="flex items-center px-3 py-2 text-sm text-gray-300 hover:bg-gray-800 rounded-md animate-fade-in stagger-4"
                      >
                        <Settings className="h-4 w-4 mr-2" />
                        Settings
                      </a>
                      <a
                        href="#"
                        className="flex items-center px-3 py-2 text-sm text-gray-300 hover:bg-gray-800 rounded-md animate-fade-in stagger-5"
                      >
                        <HelpCircle className="h-4 w-4 mr-2" />
                        Help Center
                      </a>
                    </div>
                    <div className="mt-1 pt-1 border-t border-gray-800">
                      <a
                        href="#"
                        className="flex items-center px-3 py-2 text-sm text-red-400 hover:bg-gray-800 rounded-md"
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        Sign Out
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <Button
              variant="outline"
              className="border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-black transition-colors"
            >
              Log In
            </Button>
            <Button className="bg-yellow-500 text-black hover:bg-yellow-400 transition-colors">Register</Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-4">
            <Button variant="ghost" size="icon" onClick={toggleTheme} className="text-gray-400 hover:text-white">
              {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-400 hover:text-white"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={cn(
          "md:hidden transition-all duration-300 ease-in-out overflow-hidden fixed left-0 right-0 z-40 bg-gray-900 border-t border-gray-800",
          mobileMenuOpen ? "max-h-[calc(100vh-4rem)] opacity-100" : "max-h-0 opacity-0",
        )}
        style={{ top: "64px" }} // Fixed position below header
      >
        <div className="px-2 pt-2 pb-3 space-y-1 max-h-[calc(100vh-4rem)] overflow-y-auto">
          {["Markets", "Trade", "Derivatives", "Earn", "NFT", "Learn"].map((item) => (
            <a
              key={item}
              href="#"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-gray-800 hover:text-white"
              onClick={(e) => {
                e.preventDefault() // Prevent default to avoid page jumps
              }}
            >
              <div className="flex justify-between items-center">
                <span>{item}</span>
                <ChevronDown className="h-4 w-4" />
              </div>
            </a>
          ))}
          <div className="pt-4 pb-3 border-t border-gray-800">
            <div className="flex items-center justify-center space-x-4 mt-4">
              <Button
                variant="outline"
                className="border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-black transition-colors w-full"
              >
                Log In
              </Button>
              <Button className="bg-yellow-500 text-black hover:bg-yellow-400 transition-colors w-full">
                Register
              </Button>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}