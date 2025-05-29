// Helper functions to generate realistic market data for demo purposes

// Generate market data
export function generateMarketData(market) {
  // Base prices for different markets
  const basePrices = {
    "BTC/USDT": 63500,
    "ETH/USDT": 3450,
    "SOL/USDT": 148,
    "AAPL/USD": 185,
    "MSFT/USD": 415,
    "EUR/USD": 1.08,
    "XAU/USD": 2350,
  }

  // Default to BTC if market not found
  const basePrice = basePrices[market] || 50000

  // Add some randomness
  const price = basePrice + (Math.random() - 0.5) * basePrice * 0.01

  return {
    price,
    change24h: Math.random() * 6 - 3, // -3% to +3%
    high24h: price * (1 + Math.random() * 0.03),
    low24h: price * (1 - Math.random() * 0.03),
    volume24h: basePrice * 10000 * (0.5 + Math.random()),
    marketCap: basePrice * 1000000 * (10 + Math.random() * 5),
    allTimeHigh: price * (1.5 + Math.random() * 0.5),
    allTimeLow: price * (0.3 + Math.random() * 0.2),
    supply: 19000000 + Math.random() * 1000000,
    maxSupply: market.startsWith("BTC") ? 21000000 : null,
  }
}

// Generate order book
export function generateOrderBook(currentPrice) {
  const bids = []
  const asks = []

  // Generate 50 bid orders below current price
  for (let i = 0; i < 50; i++) {
    const priceDrop = Math.random() * 0.1 * (i / 10)
    const price = currentPrice * (1 - priceDrop)

    bids.push({
      price,
      amount: Math.random() * 10 * (1 + Math.random() * 5),
    })
  }

  // Generate 50 ask orders above current price
  for (let i = 0; i < 50; i++) {
    const priceIncrease = Math.random() * 0.1 * (i / 10)
    const price = currentPrice * (1 + priceIncrease)

    asks.push({
      price,
      amount: Math.random() * 10 * (1 + Math.random() * 5),
    })
  }

  // Sort bids descending, asks ascending
  bids.sort((a, b) => b.price - a.price)
  asks.sort((a, b) => a.price - b.price)

  return { bids, asks }
}

// Generate trades
export function generateTrades(currentPrice, count = 20) {
  const trades = []
  const now = new Date()

  for (let i = 0; i < count; i++) {
    const priceVariation = currentPrice * 0.005 * (Math.random() - 0.5)
    const price = currentPrice + priceVariation
    const amount = Math.random() * 2
    const time = new Date(now.getTime() - i * 30000) // 30 seconds apart

    trades.push({
      id: Date.now() - i,
      price,
      amount,
      time,
      type: Math.random() > 0.5 ? "buy" : "sell",
    })
  }

  return trades
}
