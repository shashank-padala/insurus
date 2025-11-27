-- Seed data for reference tables
-- This script populates risk_categories, task_categories, task_templates, points_tiers, insurance_discounts, and points_redemption_options

-- Insert risk categories
INSERT INTO public.risk_categories (code, name, description, icon, color, examples) VALUES
  ('natural_risks', 'Natural Risks', 'Risks from natural disasters and environmental factors', '🌿', 'green', '["Floods and water damage", "Wildfires and heat damage", "Earthquakes and structural damage", "Hurricanes and wind damage", "Tornados and severe weather"]'::jsonb),
  ('geographic_risks', 'Geographic Risks', 'Location-specific hazards and regional factors', '🗺️', 'yellow', '["Location-specific hazards", "Coastal exposure", "Urban vs rural factors", "Climate zone considerations", "Local infrastructure"]'::jsonb),
  ('human_risks', 'Human Risks', 'Risks related to human behavior, maintenance, and safety practices', '👥', 'pink', '["Fire safety practices", "Security and theft prevention", "Maintenance behaviors", "Safety equipment usage", "Emergency preparedness"]'::jsonb)
ON CONFLICT (code) DO NOTHING;

-- Get risk category IDs for foreign keys
DO $$
DECLARE
  natural_risks_id UUID;
  geographic_risks_id UUID;
  human_risks_id UUID;
BEGIN
  SELECT id INTO natural_risks_id FROM public.risk_categories WHERE code = 'natural_risks';
  SELECT id INTO geographic_risks_id FROM public.risk_categories WHERE code = 'geographic_risks';
  SELECT id INTO human_risks_id FROM public.risk_categories WHERE code = 'human_risks';

  -- Insert task categories
  INSERT INTO public.task_categories (code, name, description, risk_category_id) VALUES
    ('fire_safety', 'Fire Safety', 'Tasks related to fire prevention and detection', natural_risks_id),
    ('water_damage_prevention', 'Water Damage Prevention', 'Tasks to prevent water intrusion and damage', natural_risks_id),
    ('wind_storm_protection', 'Wind & Storm Protection', 'Tasks to protect against wind and storm damage', natural_risks_id),
    ('earthquake_preparedness', 'Earthquake Preparedness', 'Tasks to prepare for earthquakes', natural_risks_id),
    ('wildfire_prevention', 'Wildfire Prevention', 'Tasks to prevent wildfire damage', natural_risks_id),
    ('location_hazards', 'Location Hazards', 'Tasks for location-specific hazards', geographic_risks_id),
    ('climate_adaptation', 'Climate Adaptation', 'Tasks for climate-specific adaptations', geographic_risks_id),
    ('infrastructure_reliability', 'Infrastructure Reliability', 'Tasks related to infrastructure', geographic_risks_id),
    ('security', 'Security', 'Tasks to prevent theft and break-ins', human_risks_id),
    ('maintenance', 'Maintenance', 'Regular maintenance tasks to prevent failures', human_risks_id),
    ('emergency_preparedness', 'Emergency Preparedness', 'Tasks to prepare for emergencies', human_risks_id),
    ('equipment_verification', 'Equipment Verification', 'Verification of safety equipment functionality', human_risks_id)
  ON CONFLICT (code) DO NOTHING;

  -- Get task category IDs
  DECLARE
    fire_safety_id UUID;
    water_damage_id UUID;
    wind_storm_id UUID;
    security_id UUID;
    maintenance_id UUID;
    emergency_id UUID;
    equipment_id UUID;
  BEGIN
    SELECT id INTO fire_safety_id FROM public.task_categories WHERE code = 'fire_safety';
    SELECT id INTO water_damage_id FROM public.task_categories WHERE code = 'water_damage_prevention';
    SELECT id INTO wind_storm_id FROM public.task_categories WHERE code = 'wind_storm_protection';
    SELECT id INTO security_id FROM public.task_categories WHERE code = 'security';
    SELECT id INTO maintenance_id FROM public.task_categories WHERE code = 'maintenance';
    SELECT id INTO emergency_id FROM public.task_categories WHERE code = 'emergency_preparedness';
    SELECT id INTO equipment_id FROM public.task_categories WHERE code = 'equipment_verification';

    -- Insert task templates
    INSERT INTO public.task_templates (template_id, name, description, task_category_id, risk_category_id, points_value, frequency, verification_type, insurance_relevance, example_evidence) VALUES
      ('fire_safety_001', 'Smoke Detector Test', 'Test all smoke detectors in your home to ensure they are functioning properly', fire_safety_id, natural_risks_id, 10, 'monthly', 'photo', 'Working smoke detectors can reduce fire damage claims and may qualify for insurance discounts', '["Photo of smoke detector with test button pressed and alarm sounding", "Video showing detector test with date/time visible"]'::jsonb),
      ('fire_safety_002', 'Fire Alarm System Inspection', 'Have your fire alarm system professionally inspected and provide proof of service', fire_safety_id, natural_risks_id, 8, 'annually', 'receipt', 'Professional inspections demonstrate proactive fire safety, potentially lowering premiums', '["Receipt from licensed fire safety inspector", "Inspection certificate with date and inspector signature"]'::jsonb),
      ('fire_safety_003', 'Fire Extinguisher Check', 'Verify fire extinguishers are accessible, not expired, and pressure gauge shows full', fire_safety_id, natural_risks_id, 7, 'monthly', 'photo', 'Properly maintained fire extinguishers can minimize fire damage', '["Photo of fire extinguisher showing expiration date and pressure gauge", "Photo of extinguisher in its designated location"]'::jsonb),
      ('fire_safety_004', 'Chimney and Fireplace Inspection', 'Inspect chimney for blockages, creosote buildup, and ensure damper functions properly', fire_safety_id, natural_risks_id, 6, 'annually', 'both', 'Chimney fires are a leading cause of house fires; regular inspection reduces risk', '["Photo of clean chimney interior", "Receipt from chimney sweep service"]'::jsonb),
      ('water_001', 'Water Heater Inspection', 'Check water heater for leaks, corrosion, and proper temperature settings', water_damage_id, natural_risks_id, 8, 'quarterly', 'photo', 'Water heater failures are a common source of water damage claims', '["Photo of water heater showing no leaks or corrosion", "Photo of temperature setting (recommended 120°F)"]'::jsonb),
      ('water_002', 'Sump Pump Test', 'Test sump pump operation by pouring water into sump pit and verifying pump activates', water_damage_id, natural_risks_id, 9, 'monthly', 'photo', 'Functional sump pumps prevent basement flooding, a major insurance claim category', '["Video of sump pump activating and removing water", "Photo of sump pump in operation"]'::jsonb),
      ('water_003', 'Gutter and Downspout Cleaning', 'Clear gutters and downspouts of debris to ensure proper water drainage', water_damage_id, natural_risks_id, 7, 'quarterly', 'photo', 'Clogged gutters can cause water intrusion and foundation damage', '["Photo of clean gutters after maintenance", "Photo showing clear downspout flow"]'::jsonb),
      ('water_004', 'Plumbing Leak Inspection', 'Check all visible plumbing for leaks, including under sinks, around toilets, and water supply lines', water_damage_id, natural_risks_id, 8, 'monthly', 'photo', 'Early leak detection prevents costly water damage claims', '["Photo of dry area under sinks", "Photo of water supply lines showing no leaks"]'::jsonb),
      ('wind_001', 'Roof Inspection', 'Inspect roof for missing, damaged, or loose shingles that could allow water intrusion', wind_storm_id, natural_risks_id, 9, 'quarterly', 'photo', 'Roof condition directly impacts wind and water damage claims', '["Photo of roof showing intact shingles", "Photo of roof from ground level showing no visible damage"]'::jsonb),
      ('wind_002', 'Tree Limb Trimming', 'Trim tree limbs that overhang or are close to your home to prevent storm damage', wind_storm_id, natural_risks_id, 6, 'annually', 'photo', 'Prevents tree-related property damage during storms', '["Before/after photos of trimmed tree limbs", "Photo showing safe clearance from home"]'::jsonb),
      ('wind_003', 'Window and Door Seal Check', 'Inspect window and door seals for cracks or gaps that could allow water intrusion', wind_storm_id, natural_risks_id, 5, 'quarterly', 'photo', 'Proper seals prevent water damage during storms', '["Photo of intact window seals", "Photo of door weatherstripping"]'::jsonb),
      ('security_001', 'Deadbolt Lock Verification', 'Verify all exterior doors have functioning deadbolt locks', security_id, human_risks_id, 7, 'monthly', 'photo', 'Deadbolt locks reduce theft risk and may qualify for security discounts', '["Photo of deadbolt in locked position", "Photo showing deadbolt extends fully into door frame"]'::jsonb),
      ('security_002', 'Security System Test', 'Test your security system (alarm, cameras, sensors) to ensure all components function', security_id, human_risks_id, 8, 'monthly', 'photo', 'Monitored security systems can reduce premiums by 5-20%', '["Photo of security panel showing system armed", "Photo of security camera feed"]'::jsonb),
      ('security_003', 'Exterior Lighting Check', 'Verify all exterior lights function properly to deter break-ins', security_id, human_risks_id, 4, 'monthly', 'photo', 'Adequate lighting reduces theft risk', '["Photo of exterior lights illuminated at night", "Photo showing light coverage around property"]'::jsonb),
      ('maintenance_001', 'HVAC System Service', 'Have HVAC system professionally serviced and provide service receipt', maintenance_id, human_risks_id, 7, 'annually', 'receipt', 'Proper HVAC maintenance prevents fire hazards and water damage', '["Receipt from licensed HVAC technician", "Service report showing system inspection"]'::jsonb),
      ('maintenance_002', 'Electrical Panel Inspection', 'Inspect electrical panel for signs of overheating, corrosion, or loose connections', maintenance_id, human_risks_id, 9, 'annually', 'both', 'Electrical issues are a leading cause of house fires', '["Photo of clean electrical panel", "Receipt from electrical inspection"]'::jsonb),
      ('maintenance_003', 'Foundation Inspection', 'Inspect foundation for cracks, settling, or water intrusion signs', maintenance_id, human_risks_id, 8, 'quarterly', 'photo', 'Foundation issues can lead to significant structural damage claims', '["Photo of foundation showing no cracks", "Photo of dry basement/crawlspace"]'::jsonb),
      ('emergency_001', 'Emergency Kit Verification', 'Verify emergency kit is stocked with essentials (water, food, first aid, flashlight)', emergency_id, human_risks_id, 5, 'quarterly', 'photo', 'Emergency preparedness reduces claim severity during disasters', '["Photo of stocked emergency kit", "Photo showing expiration dates on supplies"]'::jsonb),
      ('emergency_002', 'Emergency Contact List Update', 'Maintain updated list of emergency contacts including insurance agent', emergency_id, human_risks_id, 3, 'quarterly', 'document', 'Quick access to insurance information speeds claim processing', '["Photo of written emergency contact list", "Screenshot of contacts in phone"]'::jsonb),
      ('equipment_001', 'Carbon Monoxide Detector Test', 'Test all carbon monoxide detectors to ensure they function properly', equipment_id, human_risks_id, 9, 'monthly', 'photo', 'CO detectors prevent life-threatening incidents and potential liability', '["Photo of CO detector with test button pressed", "Photo showing detector is not expired"]'::jsonb),
      ('equipment_002', 'Generator Maintenance', 'If you have a generator, test it and provide maintenance proof', equipment_id, human_risks_id, 6, 'quarterly', 'both', 'Backup power prevents damage during outages (e.g., frozen pipes)', '["Photo of generator running", "Receipt from generator service"]'::jsonb)
    ON CONFLICT (template_id) DO NOTHING;
  END;
END $$;

-- Insert points tiers
INSERT INTO public.points_tiers (tier_name, min_points, max_points, insurance_discount, description, display_order) VALUES
  ('Starter', 0, 99, 0, 'Begin your safety journey', 1),
  ('Bronze', 100, 249, 2, '2% discount on insurance premiums', 2),
  ('Silver', 250, 499, 5, '5% discount on insurance premiums', 3),
  ('Gold', 500, 999, 8, '8% discount on insurance premiums', 4),
  ('Platinum', 1000, 1999, 12, '12% discount on insurance premiums', 5),
  ('Diamond', 2000, NULL, 15, '15% discount on insurance premiums', 6)
ON CONFLICT (tier_name) DO NOTHING;

-- Insert insurance discounts
DO $$
DECLARE
  bronze_tier_id UUID;
  silver_tier_id UUID;
  gold_tier_id UUID;
  platinum_tier_id UUID;
  diamond_tier_id UUID;
BEGIN
  SELECT id INTO bronze_tier_id FROM public.points_tiers WHERE tier_name = 'Bronze';
  SELECT id INTO silver_tier_id FROM public.points_tiers WHERE tier_name = 'Silver';
  SELECT id INTO gold_tier_id FROM public.points_tiers WHERE tier_name = 'Gold';
  SELECT id INTO platinum_tier_id FROM public.points_tiers WHERE tier_name = 'Platinum';
  SELECT id INTO diamond_tier_id FROM public.points_tiers WHERE tier_name = 'Diamond';

  INSERT INTO public.insurance_discounts (tier_id, discount_percentage, points_required, benefits, partner_eligible) VALUES
    (bronze_tier_id, 2, 100, '["2% discount on annual premium", "Priority customer support", "Monthly safety report"]'::jsonb, true),
    (silver_tier_id, 5, 250, '["5% discount on annual premium", "Priority customer support", "Monthly safety report", "Free annual property inspection"]'::jsonb, true),
    (gold_tier_id, 8, 500, '["8% discount on annual premium", "Priority customer support", "Monthly safety report", "Free annual property inspection", "Dedicated account manager"]'::jsonb, true),
    (platinum_tier_id, 12, 1000, '["12% discount on annual premium", "Priority customer support", "Monthly safety report", "Free annual property inspection", "Dedicated account manager", "Exclusive insurance partner offers"]'::jsonb, true),
    (diamond_tier_id, 15, 2000, '["15% discount on annual premium", "Priority customer support", "Monthly safety report", "Free annual property inspection", "Dedicated account manager", "Exclusive insurance partner offers", "VIP rewards program access"]'::jsonb, true)
  ON CONFLICT DO NOTHING;
END $$;

-- Insert points redemption options
INSERT INTO public.points_redemption_options (redemption_id, name, description, points_cost, category) VALUES
  ('insurance_discount', 'Insurance Premium Discount', 'Automatic discount applied based on your tier', 0, 'insurance'),
  ('professional_inspection', 'Free Professional Inspection', 'Redeem for a free professional property inspection', 500, 'services'),
  ('safety_equipment', 'Safety Equipment Voucher', '$50 voucher for safety equipment (smoke detectors, fire extinguishers, etc.)', 300, 'products'),
  ('cashback_50', '$50 Cashback', 'Redeem points for $50 cashback', 1000, 'cashback'),
  ('cashback_100', '$100 Cashback', 'Redeem points for $100 cashback', 2000, 'cashback')
ON CONFLICT (redemption_id) DO NOTHING;

