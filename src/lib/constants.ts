// Power grid data for NYC over 3 months (July - September 2024)
// Daily average readings in Gigawatts (GW)

export interface PowerDataPoint {
  time: string;
  predicted: number;
  actual: number;
}

// Helper function to generate realistic power data
function generatePowerData(): PowerDataPoint[] {
  const data: PowerDataPoint[] = [];
  const startDate = new Date("2024-07-01");
  const days = 92; // ~3 months

  // Random events to inject realism
  const events: { day: number; type: "spike" | "drop"; magnitude: number }[] = [
    { day: 12, type: "spike", magnitude: 2.8 }, // Data center offline
    { day: 15, type: "drop", magnitude: -2.5 }, // Power plant issue
    { day: 28, type: "spike", magnitude: 3.2 }, // Solar transition spike
    { day: 35, type: "spike", magnitude: 1.8 }, // Heat wave
    { day: 42, type: "drop", magnitude: -1.5 }, // Grid maintenance
    { day: 56, type: "spike", magnitude: 2.2 }, // Evening surge
    { day: 67, type: "drop", magnitude: -1.8 }, // Outage recovery
    { day: 78, type: "spike", magnitude: 2.0 }, // Unexpected demand
  ];

  for (let day = 0; day < days; day++) {
    const currentDate = new Date(startDate);
    currentDate.setDate(startDate.getDate() + day);

    const dayOfWeek = currentDate.getDay();
    const month = currentDate.getMonth() + 1;

    // Daily average base load
    // Summer (July/Aug) has higher AC load
    const summerBoost = month <= 8 ? 1.2 : 0.3;
    // Weekday vs weekend
    const weekdayBoost = dayOfWeek >= 1 && dayOfWeek <= 5 ? 1.0 : -0.5;

    const baseLoad =
      9.5 + summerBoost + weekdayBoost + (Math.random() - 0.5) * 0.8;
    const predicted = Math.round(baseLoad * 10) / 10;

    // Actual is usually close to predicted, with small variance
    let variance = (Math.random() - 0.5) * 0.6; // ±0.3 GW typical variance

    // Check for events
    const event = events.find((e) => e.day === day);
    if (event) {
      variance += event.magnitude;
    }

    // Add occasional random over/undershoots (5% chance of larger variance)
    if (Math.random() < 0.05) {
      variance += (Math.random() - 0.5) * 2.0;
    }

    const actual = Math.round((predicted + variance) * 10) / 10;

    // Format date
    const timeStr = currentDate.toISOString().slice(0, 10);

    data.push({
      time: timeStr,
      predicted,
      actual,
    });
  }

  return data;
}

export const powerUsageData = generatePowerData();

// Grid event types
export type EventType =
  | "Generation"
  | "Load"
  | "Transmission"
  | "System Protection"
  | "Market"
  | "Emergency";

export type EventSeverity = "low" | "medium" | "high" | "critical";

export interface GridEvent {
  id: string;
  timestamp: string;
  type: EventType;
  severity: EventSeverity;
  description: string;
  location?: string;
  impact: string;
}

// Sample grid events spanning July–September 2024
export const gridEvents: GridEvent[] = [
  {
    id: "evt-001",
    timestamp: "2024-07-05T14:23:00Z",
    type: "Generation",
    severity: "low",
    description: "Solar farm ramping down at sunset",
    location: "Brooklyn",
    impact: "−180 MW",
  },
  {
    id: "evt-002",
    timestamp: "2024-07-12T09:15:00Z",
    type: "Load",
    severity: "high",
    description: "Heat wave driving AC demand spike",
    location: "Manhattan",
    impact: "+2.8 GW",
  },
  {
    id: "evt-003",
    timestamp: "2024-07-15T16:47:00Z",
    type: "Generation",
    severity: "critical",
    description: "Gas plant forced outage due to equipment fault",
    location: "Queens",
    impact: "−2.5 GW",
  },
  {
    id: "evt-004",
    timestamp: "2024-07-22T11:30:00Z",
    type: "Transmission",
    severity: "medium",
    description: "Line trip caused by tree contact",
    location: "Bronx",
    impact: "−450 MW",
  },
  {
    id: "evt-005",
    timestamp: "2024-07-28T19:05:00Z",
    type: "Load",
    severity: "high",
    description: "Evening demand surge during solar transition",
    location: "Citywide",
    impact: "+3.2 GW",
  },
  {
    id: "evt-006",
    timestamp: "2024-08-03T13:22:00Z",
    type: "Market",
    severity: "medium",
    description: "Price spike due to generation scarcity",
    impact: "+$45/MWh",
  },
  {
    id: "evt-007",
    timestamp: "2024-08-10T07:18:00Z",
    type: "Generation",
    severity: "high",
    description: "Wind farm output drops due to calm conditions",
    location: "Staten Island",
    impact: "−1.8 GW",
  },
  {
    id: "evt-008",
    timestamp: "2024-08-14T10:45:00Z",
    type: "Transmission",
    severity: "low",
    description: "Planned switching operation for grid reconfiguration",
    location: "Brooklyn",
    impact: "−120 MW",
  },
  {
    id: "evt-009",
    timestamp: "2024-08-18T15:33:00Z",
    type: "Load",
    severity: "medium",
    description: "Industrial customer curtailment (demand response)",
    location: "Queens",
    impact: "−650 MW",
  },
  {
    id: "evt-010",
    timestamp: "2024-08-21T20:12:00Z",
    type: "System Protection",
    severity: "high",
    description: "Relay trip protecting overloaded transmission path",
    location: "Manhattan",
    impact: "−1.2 GW",
  },
  {
    id: "evt-011",
    timestamp: "2024-08-27T12:05:00Z",
    type: "Generation",
    severity: "medium",
    description: "Hydro plant ramping up for peak demand",
    location: "Upstate",
    impact: "+2.2 GW",
  },
  {
    id: "evt-012",
    timestamp: "2024-09-02T08:50:00Z",
    type: "Emergency",
    severity: "critical",
    description: "Substation equipment failure causing local outage",
    location: "Bronx",
    impact: "−1.8 GW",
  },
  {
    id: "evt-013",
    timestamp: "2024-09-09T16:20:00Z",
    type: "Market",
    severity: "low",
    description: "Battery storage dispatch for frequency regulation",
    impact: "+350 MW",
  },
  {
    id: "evt-014",
    timestamp: "2024-09-15T14:38:00Z",
    type: "Generation",
    severity: "high",
    description: "Nuclear plant unexpected shutdown",
    location: "Long Island",
    impact: "−2.0 GW",
  },
  {
    id: "evt-015",
    timestamp: "2024-09-20T11:15:00Z",
    type: "Transmission",
    severity: "medium",
    description: "Congestion event requiring generator redispatch",
    location: "Manhattan",
    impact: "−800 MW",
  },
  {
    id: "evt-016",
    timestamp: "2024-09-25T09:42:00Z",
    type: "Load",
    severity: "low",
    description: "Cool weather reducing AC load",
    location: "Citywide",
    impact: "−1.5 GW",
  },
  {
    id: "evt-017",
    timestamp: "2024-09-28T17:55:00Z",
    type: "System Protection",
    severity: "medium",
    description: "Frequency excursion corrected by reserve deployment",
    impact: "+950 MW",
  },
];
