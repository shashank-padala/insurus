/**
 * Task Strategy for Insurus Platform
 * Based on USA Home Insurance Industry Standards and Practices
 */

export enum RiskCategory {
  NATURAL_RISKS = "natural_risks",
  GEOGRAPHIC_RISKS = "geographic_risks",
  HUMAN_RISKS = "human_risks",
}

export enum TaskCategory {
  // Natural Risks
  FIRE_SAFETY = "fire_safety",
  WATER_DAMAGE_PREVENTION = "water_damage_prevention",
  WIND_STORM_PROTECTION = "wind_storm_protection",
  EARTHQUAKE_PREPAREDNESS = "earthquake_preparedness",
  WILDFIRE_PREVENTION = "wildfire_prevention",
  
  // Geographic Risks
  LOCATION_HAZARDS = "location_hazards",
  CLIMATE_ADAPTATION = "climate_adaptation",
  INFRASTRUCTURE_RELIABILITY = "infrastructure_reliability",
  
  // Human Risks
  SECURITY = "security",
  MAINTENANCE = "maintenance",
  EMERGENCY_PREPAREDNESS = "emergency_preparedness",
  EQUIPMENT_VERIFICATION = "equipment_verification",
}

export interface TaskTemplate {
  id: string;
  name: string;
  description: string;
  category: TaskCategory;
  riskCategory: RiskCategory;
  pointsValue: number; // 1-10 based on importance
  frequency: "monthly" | "quarterly" | "annually" | "as_needed";
  verificationType: "photo" | "receipt" | "document" | "both";
  insuranceRelevance: string; // How this affects insurance
  examples: string[]; // Example evidence submissions
}

export const TASK_TEMPLATES: TaskTemplate[] = [
  // FIRE SAFETY
  {
    id: "fire_safety_001",
    name: "Smoke Detector Test",
    description: "Test all smoke detectors in your home to ensure they are functioning properly",
    category: TaskCategory.FIRE_SAFETY,
    riskCategory: RiskCategory.NATURAL_RISKS,
    pointsValue: 10,
    frequency: "monthly",
    verificationType: "photo",
    insuranceRelevance: "Working smoke detectors can reduce fire damage claims and may qualify for insurance discounts",
    examples: [
      "Photo of smoke detector with test button pressed and alarm sounding",
      "Video showing detector test with date/time visible"
    ]
  },
  {
    id: "fire_safety_002",
    name: "Fire Alarm System Inspection",
    description: "Have your fire alarm system professionally inspected and provide proof of service",
    category: TaskCategory.FIRE_SAFETY,
    riskCategory: RiskCategory.NATURAL_RISKS,
    pointsValue: 8,
    frequency: "annually",
    verificationType: "receipt",
    insuranceRelevance: "Professional inspections demonstrate proactive fire safety, potentially lowering premiums",
    examples: [
      "Receipt from licensed fire safety inspector",
      "Inspection certificate with date and inspector signature"
    ]
  },
  {
    id: "fire_safety_003",
    name: "Fire Extinguisher Check",
    description: "Verify fire extinguishers are accessible, not expired, and pressure gauge shows full",
    category: TaskCategory.FIRE_SAFETY,
    riskCategory: RiskCategory.NATURAL_RISKS,
    pointsValue: 7,
    frequency: "monthly",
    verificationType: "photo",
    insuranceRelevance: "Properly maintained fire extinguishers can minimize fire damage",
    examples: [
      "Photo of fire extinguisher showing expiration date and pressure gauge",
      "Photo of extinguisher in its designated location"
    ]
  },
  {
    id: "fire_safety_004",
    name: "Chimney and Fireplace Inspection",
    description: "Inspect chimney for blockages, creosote buildup, and ensure damper functions properly",
    category: TaskCategory.FIRE_SAFETY,
    riskCategory: RiskCategory.NATURAL_RISKS,
    pointsValue: 6,
    frequency: "annually",
    verificationType: "both",
    insuranceRelevance: "Chimney fires are a leading cause of house fires; regular inspection reduces risk",
    examples: [
      "Photo of clean chimney interior",
      "Receipt from chimney sweep service"
    ]
  },
  
  // WATER DAMAGE PREVENTION
  {
    id: "water_001",
    name: "Water Heater Inspection",
    description: "Check water heater for leaks, corrosion, and proper temperature settings",
    category: TaskCategory.WATER_DAMAGE_PREVENTION,
    riskCategory: RiskCategory.NATURAL_RISKS,
    pointsValue: 8,
    frequency: "quarterly",
    verificationType: "photo",
    insuranceRelevance: "Water heater failures are a common source of water damage claims",
    examples: [
      "Photo of water heater showing no leaks or corrosion",
      "Photo of temperature setting (recommended 120°F)"
    ]
  },
  {
    id: "water_002",
    name: "Sump Pump Test",
    description: "Test sump pump operation by pouring water into sump pit and verifying pump activates",
    category: TaskCategory.WATER_DAMAGE_PREVENTION,
    riskCategory: RiskCategory.NATURAL_RISKS,
    pointsValue: 9,
    frequency: "monthly",
    verificationType: "photo",
    insuranceRelevance: "Functional sump pumps prevent basement flooding, a major insurance claim category",
    examples: [
      "Video of sump pump activating and removing water",
      "Photo of sump pump in operation"
    ]
  },
  {
    id: "water_003",
    name: "Gutter and Downspout Cleaning",
    description: "Clear gutters and downspouts of debris to ensure proper water drainage",
    category: TaskCategory.WATER_DAMAGE_PREVENTION,
    riskCategory: RiskCategory.NATURAL_RISKS,
    pointsValue: 7,
    frequency: "quarterly",
    verificationType: "photo",
    insuranceRelevance: "Clogged gutters can cause water intrusion and foundation damage",
    examples: [
      "Photo of clean gutters after maintenance",
      "Photo showing clear downspout flow"
    ]
  },
  {
    id: "water_004",
    name: "Plumbing Leak Inspection",
    description: "Check all visible plumbing for leaks, including under sinks, around toilets, and water supply lines",
    category: TaskCategory.WATER_DAMAGE_PREVENTION,
    riskCategory: RiskCategory.NATURAL_RISKS,
    pointsValue: 8,
    frequency: "monthly",
    verificationType: "photo",
    insuranceRelevance: "Early leak detection prevents costly water damage claims",
    examples: [
      "Photo of dry area under sinks",
      "Photo of water supply lines showing no leaks"
    ]
  },
  
  // WIND STORM PROTECTION
  {
    id: "wind_001",
    name: "Roof Inspection",
    description: "Inspect roof for missing, damaged, or loose shingles that could allow water intrusion",
    category: TaskCategory.WIND_STORM_PROTECTION,
    riskCategory: RiskCategory.NATURAL_RISKS,
    pointsValue: 9,
    frequency: "quarterly",
    verificationType: "photo",
    insuranceRelevance: "Roof condition directly impacts wind and water damage claims",
    examples: [
      "Photo of roof showing intact shingles",
      "Photo of roof from ground level showing no visible damage"
    ]
  },
  {
    id: "wind_002",
    name: "Tree Limb Trimming",
    description: "Trim tree limbs that overhang or are close to your home to prevent storm damage",
    category: TaskCategory.WIND_STORM_PROTECTION,
    riskCategory: RiskCategory.NATURAL_RISKS,
    pointsValue: 6,
    frequency: "annually",
    verificationType: "photo",
    insuranceRelevance: "Prevents tree-related property damage during storms",
    examples: [
      "Before/after photos of trimmed tree limbs",
      "Photo showing safe clearance from home"
    ]
  },
  {
    id: "wind_003",
    name: "Window and Door Seal Check",
    description: "Inspect window and door seals for cracks or gaps that could allow water intrusion",
    category: TaskCategory.WIND_STORM_PROTECTION,
    riskCategory: RiskCategory.NATURAL_RISKS,
    pointsValue: 5,
    frequency: "quarterly",
    verificationType: "photo",
    insuranceRelevance: "Proper seals prevent water damage during storms",
    examples: [
      "Photo of intact window seals",
      "Photo of door weatherstripping"
    ]
  },
  
  // SECURITY
  {
    id: "security_001",
    name: "Deadbolt Lock Verification",
    description: "Verify all exterior doors have functioning deadbolt locks",
    category: TaskCategory.SECURITY,
    riskCategory: RiskCategory.HUMAN_RISKS,
    pointsValue: 7,
    frequency: "monthly",
    verificationType: "photo",
    insuranceRelevance: "Deadbolt locks reduce theft risk and may qualify for security discounts",
    examples: [
      "Photo of deadbolt in locked position",
      "Photo showing deadbolt extends fully into door frame"
    ]
  },
  {
    id: "security_002",
    name: "Security System Test",
    description: "Test your security system (alarm, cameras, sensors) to ensure all components function",
    category: TaskCategory.SECURITY,
    riskCategory: RiskCategory.HUMAN_RISKS,
    pointsValue: 8,
    frequency: "monthly",
    verificationType: "photo",
    insuranceRelevance: "Monitored security systems can reduce premiums by 5-20%",
    examples: [
      "Photo of security panel showing system armed",
      "Photo of security camera feed"
    ]
  },
  {
    id: "security_003",
    name: "Exterior Lighting Check",
    description: "Verify all exterior lights function properly to deter break-ins",
    category: TaskCategory.SECURITY,
    riskCategory: RiskCategory.HUMAN_RISKS,
    pointsValue: 4,
    frequency: "monthly",
    verificationType: "photo",
    insuranceRelevance: "Adequate lighting reduces theft risk",
    examples: [
      "Photo of exterior lights illuminated at night",
      "Photo showing light coverage around property"
    ]
  },
  
  // MAINTENANCE
  {
    id: "maintenance_001",
    name: "HVAC System Service",
    description: "Have HVAC system professionally serviced and provide service receipt",
    category: TaskCategory.MAINTENANCE,
    riskCategory: RiskCategory.HUMAN_RISKS,
    pointsValue: 7,
    frequency: "annually",
    verificationType: "receipt",
    insuranceRelevance: "Proper HVAC maintenance prevents fire hazards and water damage",
    examples: [
      "Receipt from licensed HVAC technician",
      "Service report showing system inspection"
    ]
  },
  {
    id: "maintenance_002",
    name: "Electrical Panel Inspection",
    description: "Inspect electrical panel for signs of overheating, corrosion, or loose connections",
    category: TaskCategory.MAINTENANCE,
    riskCategory: RiskCategory.HUMAN_RISKS,
    pointsValue: 9,
    frequency: "annually",
    verificationType: "both",
    insuranceRelevance: "Electrical issues are a leading cause of house fires",
    examples: [
      "Photo of clean electrical panel",
      "Receipt from electrical inspection"
    ]
  },
  {
    id: "maintenance_003",
    name: "Foundation Inspection",
    description: "Inspect foundation for cracks, settling, or water intrusion signs",
    category: TaskCategory.MAINTENANCE,
    riskCategory: RiskCategory.HUMAN_RISKS,
    pointsValue: 8,
    frequency: "quarterly",
    verificationType: "photo",
    insuranceRelevance: "Foundation issues can lead to significant structural damage claims",
    examples: [
      "Photo of foundation showing no cracks",
      "Photo of dry basement/crawlspace"
    ]
  },
  
  // EMERGENCY PREPAREDNESS
  {
    id: "emergency_001",
    name: "Emergency Kit Verification",
    description: "Verify emergency kit is stocked with essentials (water, food, first aid, flashlight)",
    category: TaskCategory.EMERGENCY_PREPAREDNESS,
    riskCategory: RiskCategory.HUMAN_RISKS,
    pointsValue: 5,
    frequency: "quarterly",
    verificationType: "photo",
    insuranceRelevance: "Emergency preparedness reduces claim severity during disasters",
    examples: [
      "Photo of stocked emergency kit",
      "Photo showing expiration dates on supplies"
    ]
  },
  {
    id: "emergency_002",
    name: "Emergency Contact List Update",
    description: "Maintain updated list of emergency contacts including insurance agent",
    category: TaskCategory.EMERGENCY_PREPAREDNESS,
    riskCategory: RiskCategory.HUMAN_RISKS,
    pointsValue: 3,
    frequency: "quarterly",
    verificationType: "document",
    insuranceRelevance: "Quick access to insurance information speeds claim processing",
    examples: [
      "Photo of written emergency contact list",
      "Screenshot of contacts in phone"
    ]
  },
  
  // EQUIPMENT VERIFICATION
  {
    id: "equipment_001",
    name: "Carbon Monoxide Detector Test",
    description: "Test all carbon monoxide detectors to ensure they function properly",
    category: TaskCategory.EQUIPMENT_VERIFICATION,
    riskCategory: RiskCategory.HUMAN_RISKS,
    pointsValue: 9,
    frequency: "monthly",
    verificationType: "photo",
    insuranceRelevance: "CO detectors prevent life-threatening incidents and potential liability",
    examples: [
      "Photo of CO detector with test button pressed",
      "Photo showing detector is not expired"
    ]
  },
  {
    id: "equipment_002",
    name: "Generator Maintenance",
    description: "If you have a generator, test it and provide maintenance proof",
    category: TaskCategory.EQUIPMENT_VERIFICATION,
    riskCategory: RiskCategory.HUMAN_RISKS,
    pointsValue: 6,
    frequency: "quarterly",
    verificationType: "both",
    insuranceRelevance: "Backup power prevents damage during outages (e.g., frozen pipes)",
    examples: [
      "Photo of generator running",
      "Receipt from generator service"
    ]
  },
];

export const RISK_CATEGORY_INFO = {
  [RiskCategory.NATURAL_RISKS]: {
    name: "Natural Risks",
    description: "Risks from natural disasters and environmental factors",
    color: "green",
    icon: "🌿",
    examples: [
      "Floods and water damage",
      "Wildfires and heat damage",
      "Earthquakes and structural damage",
      "Hurricanes and wind damage",
      "Tornados and severe weather"
    ]
  },
  [RiskCategory.GEOGRAPHIC_RISKS]: {
    name: "Geographic Risks",
    description: "Location-specific hazards and regional factors",
    color: "yellow",
    icon: "🗺️",
    examples: [
      "Location-specific hazards",
      "Coastal exposure",
      "Urban vs rural factors",
      "Climate zone considerations",
      "Local infrastructure"
    ]
  },
  [RiskCategory.HUMAN_RISKS]: {
    name: "Human Risks",
    description: "Risks related to human behavior, maintenance, and safety practices",
    color: "pink",
    icon: "👥",
    examples: [
      "Fire safety practices",
      "Security and theft prevention",
      "Maintenance behaviors",
      "Safety equipment usage",
      "Emergency preparedness"
    ]
  }
};

export const TASK_CATEGORY_INFO = {
  [TaskCategory.FIRE_SAFETY]: {
    name: "Fire Safety",
    riskCategory: RiskCategory.NATURAL_RISKS,
    description: "Tasks related to fire prevention and detection"
  },
  [TaskCategory.WATER_DAMAGE_PREVENTION]: {
    name: "Water Damage Prevention",
    riskCategory: RiskCategory.NATURAL_RISKS,
    description: "Tasks to prevent water intrusion and damage"
  },
  [TaskCategory.WIND_STORM_PROTECTION]: {
    name: "Wind & Storm Protection",
    riskCategory: RiskCategory.NATURAL_RISKS,
    description: "Tasks to protect against wind and storm damage"
  },
  [TaskCategory.SECURITY]: {
    name: "Security",
    riskCategory: RiskCategory.HUMAN_RISKS,
    description: "Tasks to prevent theft and break-ins"
  },
  [TaskCategory.MAINTENANCE]: {
    name: "Maintenance",
    riskCategory: RiskCategory.HUMAN_RISKS,
    description: "Regular maintenance tasks to prevent failures"
  },
  [TaskCategory.EMERGENCY_PREPAREDNESS]: {
    name: "Emergency Preparedness",
    riskCategory: RiskCategory.HUMAN_RISKS,
    description: "Tasks to prepare for emergencies"
  },
  [TaskCategory.EQUIPMENT_VERIFICATION]: {
    name: "Equipment Verification",
    riskCategory: RiskCategory.HUMAN_RISKS,
    description: "Verification of safety equipment functionality"
  }
};

