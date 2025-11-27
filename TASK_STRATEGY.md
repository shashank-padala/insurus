# Insurus Task Strategy Document

## Overview
This document defines the task categorization strategy for the Insurus platform, based on USA home insurance industry standards and practices. The strategy ensures tasks are relevant, verifiable, and aligned with insurance risk assessment criteria.

## Risk Categories

### 1. Natural Risks
Risks from natural disasters and environmental factors that are typically covered by standard homeowners insurance policies.

**Examples:**
- Floods and water damage
- Wildfires and heat damage
- Earthquakes and structural damage
- Hurricanes and wind damage
- Tornados and severe weather

**Task Categories:**
- Fire Safety
- Water Damage Prevention
- Wind & Storm Protection
- Earthquake Preparedness
- Wildfire Prevention

### 2. Geographic Risks
Location-specific hazards and regional factors that affect insurance premiums and coverage requirements.

**Examples:**
- Location-specific hazards (coastal, flood zones, etc.)
- Coastal exposure
- Urban vs rural factors
- Climate zone considerations
- Local infrastructure reliability

**Task Categories:**
- Location Hazards
- Climate Adaptation
- Infrastructure Reliability

### 3. Human Risks
Risks related to human behavior, maintenance practices, and safety equipment usage that can be mitigated through proactive actions.

**Examples:**
- Fire safety practices
- Security and theft prevention
- Maintenance behaviors
- Safety equipment usage
- Emergency preparedness

**Task Categories:**
- Security
- Maintenance
- Emergency Preparedness
- Equipment Verification

## Task Categories

### Fire Safety
Tasks related to fire prevention, detection, and mitigation. These directly impact fire insurance claims and may qualify for insurance discounts.

**Key Tasks:**
- Smoke detector testing (monthly)
- Fire alarm system inspection (annually)
- Fire extinguisher verification (monthly)
- Chimney and fireplace inspection (annually)

**Verification Types:** Photo, Receipt, or Both

### Water Damage Prevention
Tasks to prevent water intrusion and damage, which is one of the most common insurance claims.

**Key Tasks:**
- Water heater inspection (quarterly)
- Sump pump testing (monthly)
- Gutter and downspout cleaning (quarterly)
- Plumbing leak inspection (monthly)

**Verification Types:** Primarily Photo

### Wind & Storm Protection
Tasks to protect against wind and storm damage, especially important in coastal and high-wind areas.

**Key Tasks:**
- Roof inspection (quarterly)
- Tree limb trimming (annually)
- Window and door seal check (quarterly)

**Verification Types:** Photo

### Security
Tasks to prevent theft and break-ins, which can reduce insurance premiums.

**Key Tasks:**
- Deadbolt lock verification (monthly)
- Security system test (monthly)
- Exterior lighting check (monthly)

**Verification Types:** Photo

### Maintenance
Regular maintenance tasks to prevent system failures that could lead to insurance claims.

**Key Tasks:**
- HVAC system service (annually)
- Electrical panel inspection (annually)
- Foundation inspection (quarterly)

**Verification Types:** Receipt or Both (Photo + Receipt)

### Emergency Preparedness
Tasks to prepare for emergencies, reducing claim severity during disasters.

**Key Tasks:**
- Emergency kit verification (quarterly)
- Emergency contact list update (quarterly)

**Verification Types:** Photo or Document

### Equipment Verification
Verification of safety equipment functionality to prevent incidents.

**Key Tasks:**
- Carbon monoxide detector test (monthly)
- Generator maintenance (quarterly)

**Verification Types:** Photo or Both

## Verification Types

### Photo Verification
- Used for visual confirmation of task completion
- Examples: Smoke detector test, fire extinguisher check, roof inspection
- AI analyzes photo to verify task was completed correctly

### Receipt Verification
- Used for professional services and maintenance
- Examples: Fire alarm inspection, HVAC service, electrical inspection
- Validates professional service was performed

### Document Verification
- Used for documentation that doesn't require photos
- Examples: Emergency contact lists, insurance policy updates

### Both (Photo + Receipt)
- Used when both visual proof and service documentation are valuable
- Examples: Chimney inspection (photo of clean chimney + receipt from sweep)

## Points System

Tasks are assigned point values (1-10) based on:
1. **Insurance Impact**: Tasks that directly prevent common claims (higher points)
2. **Frequency**: More frequent tasks may have slightly lower points per occurrence
3. **Difficulty**: More complex tasks earn more points
4. **Risk Reduction**: Tasks that prevent high-cost damage earn more points

**Point Distribution:**
- 9-10 points: Critical safety tasks (smoke detectors, CO detectors, electrical)
- 7-8 points: Important prevention tasks (water heater, security systems)
- 5-6 points: Regular maintenance tasks (tree trimming, emergency kits)
- 3-4 points: Routine checks (lighting, contact lists)

## Task Frequency

### Monthly
- Quick visual checks and tests
- Examples: Smoke detector test, security system test, sump pump test

### Quarterly
- Seasonal maintenance and inspections
- Examples: Gutter cleaning, foundation inspection, HVAC filter changes

### Annually
- Professional services and major inspections
- Examples: Fire alarm inspection, HVAC service, electrical panel inspection

### As Needed
- Tasks triggered by specific conditions
- Examples: Post-storm inspections, after-disaster assessments

## Insurance Industry Alignment

### Standard Homeowners Insurance Perils
Our tasks align with common insurance coverage areas:
- Fire and smoke damage
- Theft and vandalism
- Water damage (from plumbing, appliances)
- Wind and hail damage
- Liability prevention

### Premium Discount Opportunities
Tasks that may qualify for insurance discounts:
- Monitored security systems (5-20% discount)
- Fire safety devices (smoke detectors, fire extinguishers)
- Professional maintenance records
- Proactive risk mitigation

### Claim Prevention Focus
Tasks are designed to prevent the most common insurance claims:
1. Water damage (plumbing, appliances, weather)
2. Fire damage (electrical, heating, cooking)
3. Theft and vandalism
4. Wind and storm damage
5. Liability incidents

## AI Task Generation Strategy

When generating tasks for a property, the AI considers:

1. **Property Characteristics**
   - Property type (house, apartment, condo)
   - Age of property
   - Square footage
   - Number of stories

2. **Geographic Factors**
   - State and city location
   - Climate zone
   - Proximity to coast, flood zones, wildfire areas
   - Local building codes and requirements

3. **Existing Safety Devices**
   - Smoke detectors
   - Security systems
   - Sump pumps
   - Generators
   - Fire extinguishers

4. **Historical Data**
   - Previous task completions
   - Past issues or claims
   - Maintenance history

5. **Seasonal Considerations**
   - Time of year (hurricane season, winter prep, etc.)
   - Local weather patterns

## Implementation Notes

1. **Task Templates**: Base templates are stored in `src/constants/task-strategy.ts`
2. **AI Customization**: GPT-4o customizes tasks based on property analysis
3. **Verification**: GPT-4 Vision verifies photo submissions
4. **Blockchain**: Verified tasks are published to VeChain for immutability
5. **Scoring**: Safety score calculated from completed tasks and points earned

## Future Enhancements

- Integration with insurance provider APIs for premium discount verification
- Regional task variations based on state-specific requirements
- Partner with insurance companies for direct premium adjustments
- Advanced analytics showing risk reduction over time
- Integration with smart home devices for automated verification

