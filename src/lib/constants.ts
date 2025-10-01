// Power grid data for NYC over 3 months (July - September 2024)
// Daily average readings in Gigawatts (GW)

export interface PowerDataPoint {
  time: string
  predicted: number
  actual: number
}

// Helper function to generate realistic power data
function generatePowerData(): PowerDataPoint[] {
  const data: PowerDataPoint[] = []
  const startDate = new Date('2024-07-01')
  const days = 92 // ~3 months

  // Random events to inject realism
  const events: { day: number; type: 'spike' | 'drop'; magnitude: number }[] = [
    { day: 12, type: 'spike', magnitude: 2.8 },  // Data center offline
    { day: 15, type: 'drop', magnitude: -2.5 },  // Power plant issue
    { day: 28, type: 'spike', magnitude: 3.2 },  // Solar transition spike
    { day: 35, type: 'spike', magnitude: 1.8 },  // Heat wave
    { day: 42, type: 'drop', magnitude: -1.5 },   // Grid maintenance
    { day: 56, type: 'spike', magnitude: 2.2 },  // Evening surge
    { day: 67, type: 'drop', magnitude: -1.8 },  // Outage recovery
    { day: 78, type: 'spike', magnitude: 2.0 },  // Unexpected demand
  ]

  for (let day = 0; day < days; day++) {
    const currentDate = new Date(startDate)
    currentDate.setDate(startDate.getDate() + day)

    const dayOfWeek = currentDate.getDay()
    const month = currentDate.getMonth() + 1

    // Daily average base load
    // Summer (July/Aug) has higher AC load
    const summerBoost = month <= 8 ? 1.2 : 0.3
    // Weekday vs weekend
    const weekdayBoost = dayOfWeek >= 1 && dayOfWeek <= 5 ? 1.0 : -0.5

    const baseLoad = 9.5 + summerBoost + weekdayBoost + (Math.random() - 0.5) * 0.8
    const predicted = Math.round(baseLoad * 10) / 10

    // Actual is usually close to predicted, with small variance
    let variance = (Math.random() - 0.5) * 0.6 // ±0.3 GW typical variance

    // Check for events
    const event = events.find(e => e.day === day)
    if (event) {
      variance += event.magnitude
    }

    // Add occasional random over/undershoots (5% chance of larger variance)
    if (Math.random() < 0.05) {
      variance += (Math.random() - 0.5) * 2.0
    }

    const actual = Math.round((predicted + variance) * 10) / 10

    // Format date
    const timeStr = currentDate.toISOString().slice(0, 10)

    data.push({
      time: timeStr,
      predicted,
      actual,
    })
  }

  return data
}

export const powerUsageData = generatePowerData()
