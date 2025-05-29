// Helper functions to generate realistic trading data for demo purposes

// Generate positions
export function generatePositions(market, count = 5, tradingMode = "spot", leverage = 1) {
  const positions = []
  const basePrice = getBasePrice(market)

  for (let i = 0; i < count; i++) {
    // Randomize position data
    const side = Math.random() > 0.5 ? "long" : "short"
    const entryPrice = basePrice * (1 + (Math.random() * 0.1 - 0.05)) // +/- 5% from base price
    const markPrice = basePrice * (1 + (Math.random() * 0.1 - 0.05)) // +/- 5% from base price
    const size = 1000 * (1 + Math.random()) // Position size between $1000-$2000
    const amount = size / entryPrice // Amount of the asset

    // Calculate PnL
    let unrealizedPnl = 0
    if (side === "long") {
      unrealizedPnl = amount * (markPrice - entryPrice)
    } else {
      unrealizedPnl = amount * (entryPrice - markPrice)
    }

    // Apply leverage for margin/futures
    if (tradingMode !== "spot") {
      unrealizedPnl *= leverage
    }

    // Calculate ROE (Return on Equity)
    const roe = (unrealizedPnl / (size / leverage)) * 100

    // Calculate liquidation price (only for margin/futures)
    let liquidationPrice = null
    if (tradingMode !== "spot") {
      const liqDistance = entryPrice * (0.8 / leverage) // Simplified calculation
      liquidationPrice = side === "long" ? entryPrice - liqDistance : entryPrice + liqDistance
    }

    positions.push({
      id: `pos-${Date.now()}-${i}`,
      market,
      side,
      entryPrice,
      markPrice,
      size,
      amount,
      leverage: tradingMode !== "spot" ? leverage : 1,
      unrealizedPnl,
      unrealizedPnlPercentage: (unrealizedPnl / size) * 100,
      roe,
      liquidationPrice,
      created: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000), // Random date within last 30 days
    })
  }

  return positions
}

// Generate orders
export function generateOrders(market, count = 8, isHistory = false) {
  const orders = []
  const basePrice = getBasePrice(market)

  for (let i = 0; i < count; i++) {
    // Randomize order data
    const side = Math.random() > 0.5 ? "buy" : "sell"
    const type = getRandomOrderType()
    const price = type === "market" ? null : basePrice * (1 + (Math.random() * 0.1 - 0.05)) // +/- 5% from base price
    const amount = 0.1 + Math.random() * 2 // Amount between 0.1 and 2.1
    const total = price ? price * amount : basePrice * amount

    // For order history, randomize status and filled amount
    let status = "open"
    let filled = 0

    if (isHistory) {
      status = getRandomOrderStatus()
      filled = status === "filled" ? amount : Math.random() * amount
    } else {
      filled = Math.random() * 0.3 * amount // For open orders, fill up to 30%
    }

    orders.push({
      id: `ord-${Date.now()}-${i}`,
      market,
      type,
      side,
      price,
      amount,
      total,
      status,
      filled,
      created: new Date(Date.now() - Math.random() * 60 * 24 * 60 * 60 * 1000), // Random date within last 60 days
      updated: isHistory ? new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000) : null, // For history orders
    })
  }

  // Sort by date, newest first
  return orders.sort((a, b) => b.created - a.created)
}

// Generate trading strategies
export function generateStrategies(count = 3) {
  const strategies = []

  const strategyNames = [
    "Moving Average Crossover",
    "RSI Divergence",
    "Bollinger Band Breakout",
    "MACD Momentum",
    "Fibonacci Retracement",
    "Ichimoku Cloud",
    "Harmonic Patterns",
    "Volume Profile",
  ]

  const strategyDescriptions = [
    "Identifies trend changes using moving average crossovers. Buys when fast MA crosses above slow MA, sells when it crosses below.",
    "Detects divergences between price and RSI indicator to identify potential reversals in the market.",
    "Trades breakouts from Bollinger Bands to capture volatility expansion moves.",
    "Uses MACD histogram to identify momentum shifts and potential trend changes.",
    "Identifies potential support and resistance levels using Fibonacci retracement levels.",
    "Comprehensive strategy using Ichimoku Cloud components to identify trend direction and potential entry/exit points.",
    "Identifies harmonic price patterns to predict potential reversal points with high accuracy.",
    "Analyzes trading volume at different price levels to identify significant support and resistance zones.",
  ]

  for (let i = 0; i < count; i++) {
    const nameIndex = Math.floor(Math.random() * strategyNames.length)
    const name = strategyNames[nameIndex]
    const description = strategyDescriptions[nameIndex]

    // Generate random performance metrics
    const performance = Math.random() * 40 - 10 // -10% to +30%
    const trades = 20 + Math.floor(Math.random() * 100) // 20-120 trades
    const winRate = 40 + Math.random() * 40 // 40-80% win rate
    const profitFactor = 0.8 + Math.random() * 2.2 // 0.8-3.0 profit factor
    const avgProfit = 100 + Math.random() * 400 // $100-$500 avg profit
    const avgLoss = -(50 + Math.random() * 200) // -$50 to -$250 avg loss
    const maxDrawdown = -(5 + Math.random() * 25) // -5% to -30% max drawdown

    // Generate random parameters
    const parameters = [
      { name: "Fast MA Period", value: Math.floor(Math.random() * 20) + 5 },
      { name: "Slow MA Period", value: Math.floor(Math.random() * 30) + 20 },
      { name: "RSI Period", value: Math.floor(Math.random() * 10) + 7 },
      { name: "Take Profit", value: `${(Math.random() * 5 + 1).toFixed(1)}%` },
      { name: "Stop Loss", value: `${(Math.random() * 3 + 0.5).toFixed(1)}%` },
    ]

    strategies.push({
      id: `strat-${Date.now()}-${i}`,
      name,
      description,
      active: Math.random() > 0.3, // 70% chance of being active
      performance,
      trades,
      winRate,
      profitFactor,
      avgProfit,
      avgLoss,
      maxDrawdown,
      parameters,
      created: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000), // Random date within last 90 days
    })
  }

  return strategies
}

// Helper function to get base price for a market
function getBasePrice(market) {
  const basePrices = {
    "BTC/USDT": 63500,
    "ETH/USDT": 3450,
    "SOL/USDT": 148,
    "AAPL/USD": 185,
    "MSFT/USD": 415,
    "EUR/USD": 1.08,
    "XAU/USD": 2350,
  }

  return basePrices[market] || 1000 // Default to 1000 if market not found
}

// Helper function to get random order type
function getRandomOrderType() {
  const types = ["limit", "market", "stop", "stopLimit"]
  const weights = [0.6, 0.2, 0.1, 0.1] // 60% limit, 20% market, 10% stop, 10% stop limit

  const random = Math.random()
  let cumulativeWeight = 0

  for (let i = 0; i < types.length; i++) {
    cumulativeWeight += weights[i]
    if (random <= cumulativeWeight) {
      return types[i]
    }
  }

  return "limit" // Default to limit
}

// Helper function to get random order status for history
function getRandomOrderStatus() {
  const statuses = ["filled", "canceled", "rejected", "expired"]
  const weights = [0.7, 0.25, 0.03, 0.02] // 70% filled, 25% canceled, 3% rejected, 2% expired

  const random = Math.random()
  let cumulativeWeight = 0

  for (let i = 0; i < statuses.length; i++) {
    cumulativeWeight += weights[i]
    if (random <= cumulativeWeight) {
      return statuses[i]
    }
  }

  return "filled" // Default to filled
}
