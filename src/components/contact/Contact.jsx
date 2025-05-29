"use client"

import { useState, useEffect, useRef } from "react"
import { Send, Phone, Mail, MapPin, MessageSquare, Clock, ArrowRight, Check } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function ContactSection() {
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [activeTab, setActiveTab] = useState("general")
  const formRef = useRef(null)
  const globeRef = useRef(null)

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormState((prev) => ({ ...prev, [name]: value }))
  }

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      setIsSubmitted(true)

      // Reset form after 3 seconds
      setTimeout(() => {
        setIsSubmitted(false)
        setFormState({
          name: "",
          email: "",
          subject: "",
          message: "",
        })
      }, 3000)
    }, 1500)
  }

  // Animated background
  const ParticleNetwork = () => {
    const canvasRef = useRef(null)

    useEffect(() => {
      const canvas = canvasRef.current
      if (!canvas) return

      const ctx = canvas.getContext("2d")
      const particles = []
      const connections = []
      const particleCount = 50
      const connectionDistance = 100
      const width = canvas.width
      const height = canvas.height

      // Create particles
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          radius: Math.random() * 2 + 1,
          color: i % 5 === 0 ? "rgba(255, 204, 0, 0.5)" : "rgba(255, 255, 255, 0.3)",
          speedX: Math.random() * 0.5 - 0.25,
          speedY: Math.random() * 0.5 - 0.25,
        })
      }

      // Animation loop
      const animate = () => {
        ctx.clearRect(0, 0, width, height)

        // Update and draw particles
        particles.forEach((particle, index) => {
          // Update position
          particle.x += particle.speedX
          particle.y += particle.speedY

          // Bounce off edges
          if (particle.x < 0 || particle.x > width) particle.speedX *= -1
          if (particle.y < 0 || particle.y > height) particle.speedY *= -1

          // Draw particle
          ctx.beginPath()
          ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2)
          ctx.fillStyle = particle.color
          ctx.fill()

          // Find connections
          for (let j = index + 1; j < particles.length; j++) {
            const dx = particles[j].x - particle.x
            const dy = particles[j].y - particle.y
            const distance = Math.sqrt(dx * dx + dy * dy)

            if (distance < connectionDistance) {
              // Draw connection
              ctx.beginPath()
              ctx.moveTo(particle.x, particle.y)
              ctx.lineTo(particles[j].x, particles[j].y)
              ctx.strokeStyle = `rgba(255, 204, 0, ${0.1 * (1 - distance / connectionDistance)})`
              ctx.lineWidth = 0.5
              ctx.stroke()
            }
          }
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

  // Globe animation
  useEffect(() => {
    const canvas = globeRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    const width = canvas.width
    const height = canvas.height
    const centerX = width / 2
    const centerY = height / 2
    const radius = Math.min(width, height) * 0.4
    let rotation = 0

    // Create grid points for the globe
    const createGlobe = () => {
      const points = []
      const latitudes = 15
      const longitudes = 30

      for (let lat = 0; lat <= latitudes; lat++) {
        const phi = (Math.PI * lat) / latitudes
        const sinPhi = Math.sin(phi)
        const cosPhi = Math.cos(phi)

        for (let long = 0; long <= longitudes; long++) {
          const theta = (2 * Math.PI * long) / longitudes + rotation
          const sinTheta = Math.sin(theta)
          const cosTheta = Math.cos(theta)

          // 3D coordinates
          const x = radius * sinPhi * cosTheta
          const y = radius * cosPhi
          const z = radius * sinPhi * sinTheta

          // Only show points on the front half of the globe (z > -10)
          if (z > -10) {
            // Perspective projection
            const scale = 400 / (400 + z)
            const projectedX = centerX + x * scale
            const projectedY = centerY + y * scale

            points.push({
              x: projectedX,
              y: projectedY,
              z,
              size: 1 + (z + radius) / (2 * radius), // Size based on z-position
              opacity: 0.3 + (z + radius) / (2 * radius) / 2, // Opacity based on z-position
            })
          }
        }
      }

      return points
    }

    // Draw connections between nearby points
    const drawConnections = (points) => {
      const maxDistance = radius * 0.5

      for (let i = 0; i < points.length; i++) {
        for (let j = i + 1; j < points.length; j++) {
          const dx = points[j].x - points[i].x
          const dy = points[j].y - points[i].y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < maxDistance) {
            ctx.beginPath()
            ctx.moveTo(points[i].x, points[i].y)
            ctx.lineTo(points[j].x, points[j].y)
            ctx.strokeStyle = `rgba(255, 204, 0, ${0.1 * (1 - distance / maxDistance)})`
            ctx.lineWidth = 0.5
            ctx.stroke()
          }
        }
      }
    }

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, width, height)

      // Rotate the globe
      rotation += 0.005

      // Create and draw the globe
      const points = createGlobe()

      // Draw connections
      drawConnections(points)

      // Draw points
      points.forEach((point) => {
        ctx.beginPath()
        ctx.arc(point.x, point.y, point.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255, 204, 0, ${point.opacity})`
        ctx.fill()
      })

      // Draw a few random "data transfer" lines
      if (Math.random() > 0.95) {
        const startPoint = points[Math.floor(Math.random() * points.length)]
        const endPoint = {
          x: centerX + (Math.random() * radius * 2 - radius) * 0.8,
          y: centerY + (Math.random() * radius * 2 - radius) * 0.8,
        }

        ctx.beginPath()
        ctx.moveTo(startPoint.x, startPoint.y)
        ctx.lineTo(endPoint.x, endPoint.y)
        ctx.strokeStyle = "rgba(255, 204, 0, 0.6)"
        ctx.lineWidth = 1
        ctx.setLineDash([2, 2])
        ctx.stroke()
        ctx.setLineDash([])

        // Draw pulse at end point
        ctx.beginPath()
        ctx.arc(endPoint.x, endPoint.y, 3, 0, Math.PI * 2)
        ctx.fillStyle = "rgba(255, 204, 0, 0.8)"
        ctx.fill()
      }

      requestAnimationFrame(animate)
    }

    animate()

    return () => {
      // Cleanup if needed
    }
  }, [])

  // Floating label animation
  const FloatingLabel = ({ htmlFor, children }) => {
    return (
      <label
        htmlFor={htmlFor}
        className="absolute left-3 -top-2.5 bg-gray-900 px-1 text-xs text-gray-400 transition-all duration-200"
      >
        {children}
      </label>
    )
  }

  // Animated icon
  const AnimatedIcon = ({ icon: Icon, delay = 0 }) => {
    return (
      <div className="relative">
        <div
          className="absolute inset-0 bg-yellow-500/20 rounded-full blur-md animate-pulse"
          style={{ animationDelay: `${delay}ms` }}
        ></div>
        <div className="relative bg-gray-800 p-3 rounded-full">
          <Icon className="h-6 w-6 text-yellow-500" />
        </div>
      </div>
    )
  }

  return (
    <section className="py-20 relative overflow-hidden" id="contact">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 relative inline-block">
            <span className="relative z-10">Get In Touch</span>
            <span className="absolute -bottom-2 left-0 right-0 h-3 bg-yellow-500/20 -z-10 transform -rotate-1"></span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Have questions about our platform? Our team is here to help you 24/7. Reach out to us through any of the
            channels below.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Left side - Contact form */}
          <div className="relative">
            <div className="bg-gray-900/70 backdrop-blur-md border border-gray-800 rounded-xl p-8 shadow-xl shadow-yellow-500/5 transition-all duration-300 hover:shadow-yellow-500/10 hover:border-gray-700 h-full">
              <ParticleNetwork />

              {/* Form tabs */}
              <div className="flex mb-6 bg-gray-800/50 rounded-lg p-1">
                {[
                  { id: "general", label: "General Inquiry" },
                  { id: "support", label: "Technical Support" },
                  { id: "business", label: "Business" },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 ${
                      activeTab === tab.id
                        ? "bg-yellow-500 text-black shadow-lg"
                        : "text-gray-400 hover:text-white hover:bg-gray-700/50"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Contact form */}
              <form ref={formRef} onSubmit={handleSubmit} className="space-y-6 relative z-10">
                {!isSubmitted ? (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="relative">
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formState.name}
                          onChange={handleChange}
                          required
                          className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500 transition-all duration-200 peer pt-6"
                          placeholder=" "
                        />
                        <FloatingLabel htmlFor="name">Your Name</FloatingLabel>
                      </div>

                      <div className="relative">
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formState.email}
                          onChange={handleChange}
                          required
                          className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500 transition-all duration-200 peer pt-6"
                          placeholder=" "
                        />
                        <FloatingLabel htmlFor="email">Email Address</FloatingLabel>
                      </div>
                    </div>

                    <div className="relative">
                      <input
                        type="text"
                        id="subject"
                        name="subject"
                        value={formState.subject}
                        onChange={handleChange}
                        required
                        className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500 transition-all duration-200 peer pt-6"
                        placeholder=" "
                      />
                      <FloatingLabel htmlFor="subject">Subject</FloatingLabel>
                    </div>

                    <div className="relative">
                      <textarea
                        id="message"
                        name="message"
                        value={formState.message}
                        onChange={handleChange}
                        required
                        rows="4"
                        className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500 transition-all duration-200 peer pt-6"
                        placeholder=" "
                      ></textarea>
                      <FloatingLabel htmlFor="message">Your Message</FloatingLabel>
                    </div>

                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="terms"
                        className="w-4 h-4 bg-gray-800 border-gray-700 rounded focus:ring-yellow-500 text-yellow-500"
                        required
                      />
                      <label htmlFor="terms" className="text-sm text-gray-400">
                        I agree to the{" "}
                        <a href="#" className="text-yellow-500 hover:underline">
                          Terms of Service
                        </a>{" "}
                        and{" "}
                        <a href="#" className="text-yellow-500 hover:underline">
                          Privacy Policy
                        </a>
                      </label>
                    </div>

                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className={`w-full bg-yellow-500 hover:bg-yellow-400 text-black font-medium py-3 px-6 rounded-lg transition-all duration-300 ${
                        isSubmitting ? "opacity-70" : ""
                      } group`}
                    >
                      {isSubmitting ? (
                        <span className="flex items-center justify-center">
                          <svg
                            className="animate-spin -ml-1 mr-2 h-4 w-4 text-black"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          Sending Message...
                        </span>
                      ) : (
                        <span className="flex items-center justify-center">
                          Send Message{" "}
                          <Send className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                        </span>
                      )}
                    </Button>
                  </>
                ) : (
                  <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-6 text-center animate-fade-in">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500/20 rounded-full mb-4">
                      <Check className="h-8 w-8 text-green-500" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">Message Sent Successfully!</h3>
                    <p className="text-gray-300">
                      Thank you for reaching out. Our team will get back to you within 24 hours.
                    </p>
                  </div>
                )}
              </form>
            </div>

            {/* Decorative elements */}
            <div className="absolute -top-10 -left-10 w-40 h-40 bg-yellow-500/10 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl"></div>
          </div>

          {/* Right side - Contact info and globe */}
          <div className="relative">
            <div className="bg-gray-900/70 backdrop-blur-md border border-gray-800 rounded-xl p-8 shadow-xl shadow-yellow-500/5 transition-all duration-300 hover:shadow-yellow-500/10 hover:border-gray-700 h-full flex flex-col">
              {/* Globe visualization */}
              <div className="mb-8 relative h-64">
                <canvas ref={globeRef} className="w-full h-full" width={500} height={300}></canvas>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-xl font-bold text-white mb-1">Global Support</div>
                    <div className="text-yellow-500">24/7 Assistance</div>
                  </div>
                </div>
              </div>

              {/* Contact information */}
              <div className="space-y-6 flex-grow">
                <h3 className="text-xl font-bold mb-4">Contact Information</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-start space-x-4">
                    <AnimatedIcon icon={Phone} />
                    <div>
                      <div className="text-sm text-gray-400 mb-1">Phone Support</div>
                      <div className="font-medium">+1 (888) 123-4567</div>
                      <div className="text-xs text-gray-500 mt-1">24/7 Trading Support</div>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <AnimatedIcon icon={Mail} delay={200} />
                    <div>
                      <div className="text-sm text-gray-400 mb-1">Email Us</div>
                      <div className="font-medium">support@cryptotrade.com</div>
                      <div className="text-xs text-gray-500 mt-1">We reply within 24 hours</div>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <AnimatedIcon icon={MessageSquare} delay={400} />
                    <div>
                      <div className="text-sm text-gray-400 mb-1">Live Chat</div>
                      <div className="font-medium">Available in App</div>
                      <div className="text-xs text-gray-500 mt-1">Instant responses</div>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <AnimatedIcon icon={Clock} delay={600} />
                    <div>
                      <div className="text-sm text-gray-400 mb-1">Working Hours</div>
                      <div className="font-medium">24/7/365</div>
                      <div className="text-xs text-gray-500 mt-1">Always available</div>
                    </div>
                  </div>
                </div>

                {/* Office locations */}
                <div className="mt-8">
                  <h3 className="text-xl font-bold mb-4">Our Offices</h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700 hover:border-yellow-500/30 transition-all duration-300 group">
                      <div className="flex items-center mb-3">
                        <MapPin className="h-5 w-5 text-yellow-500 mr-2" />
                        <span className="font-medium">New York</span>
                      </div>
                      <p className="text-sm text-gray-400">350 Fifth Avenue, 21st Floor, New York, NY 10118, USA</p>
                      <button className="mt-3 text-sm text-yellow-500 flex items-center group-hover:text-yellow-400 transition-colors">
                        View on map{" "}
                        <ArrowRight className="ml-1 h-3 w-3 transition-transform duration-300 group-hover:translate-x-1" />
                      </button>
                    </div>

                    <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700 hover:border-yellow-500/30 transition-all duration-300 group">
                      <div className="flex items-center mb-3">
                        <MapPin className="h-5 w-5 text-yellow-500 mr-2" />
                        <span className="font-medium">London</span>
                      </div>
                      <p className="text-sm text-gray-400">One Canada Square, Canary Wharf, London E14 5AB, UK</p>
                      <button className="mt-3 text-sm text-yellow-500 flex items-center group-hover:text-yellow-400 transition-colors">
                        View on map{" "}
                        <ArrowRight className="ml-1 h-3 w-3 transition-transform duration-300 group-hover:translate-x-1" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Social proof */}
              <div className="mt-8 pt-6 border-t border-gray-800">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-400">Trusted by traders worldwide</div>
                  <div className="flex space-x-3">
                    <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center">
                      <svg className="h-4 w-4 text-white" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                      </svg>
                    </div>
                    <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center">
                      <svg className="h-4 w-4 text-white" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                      </svg>
                    </div>
                    <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center">
                      <svg className="h-4 w-4 text-white" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Background elements */}
      <div className="absolute top-1/3 left-0 w-64 h-64 bg-yellow-500/5 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl -z-10"></div>
    </section>
  )
}
