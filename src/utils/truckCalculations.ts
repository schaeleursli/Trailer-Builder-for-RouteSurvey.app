import { TruckSpec } from '../types/trailer';
/**
 * Calculate the center of gravity for a truck
 * @param truck The truck configuration
 * @returns Distance from front bumper to center of gravity in meters
 */
export function calculateCenterOfGravity(truck: TruckSpec): number {
  // If no axle weights are defined, estimate based on wheelbase
  if (!truck.axle_weights || truck.axle_weights.length === 0) {
    return truck.wheelbase_m * 0.4 + 1.2; // Simple estimation
  }
  // Calculate axle positions
  const axlePositions: number[] = [];
  // Calculate axle positions based on wheelbase and spacings
  if (truck.axle_spacings && truck.axle_spacings.length > 0) {
    axlePositions.push(1.5); // Front axle position from front bumper
    let currentPos = 1.5;
    for (let i = 0; i < truck.axle_spacings.length; i++) {
      currentPos += truck.axle_spacings[i];
      axlePositions.push(currentPos);
    }
  } else {
    // Fallback if no axle spacings defined
    const numAxles = truck.num_axles || (truck.axle_config ? parseInt(truck.axle_config.split('x')[0]) / 2 : 3);
    const wheelbase = truck.wheelbase_m;
    const axleSpacing = numAxles > 2 ? wheelbase / (numAxles - 1) : wheelbase;
    for (let i = 0; i < numAxles; i++) {
      axlePositions.push(1.5 + i * axleSpacing);
    }
  }
  // Calculate weighted average of axle positions
  let totalMoment = 0;
  let totalWeight = 0;
  for (let i = 0; i < truck.axle_weights.length; i++) {
    totalMoment += axlePositions[i] * truck.axle_weights[i];
    totalWeight += truck.axle_weights[i];
  }
  // Add counterweight if present
  if (truck.has_counterweight && truck.counterweight_mass_t) {
    const counterweightPos = truck.overall_length_m - (truck.counterweight_position_m || 0.5);
    totalMoment += counterweightPos * truck.counterweight_mass_t;
    totalWeight += truck.counterweight_mass_t;
  }
  // Calculate CG position
  return totalWeight > 0 ? totalMoment / totalWeight : truck.wheelbase_m / 2 + 1.2;
}
/**
 * Validate truck configuration and return any warnings or errors
 */
export function validateTruckConfig(truck: TruckSpec): Array<{
  message: string;
  severity: 'warning' | 'error';
}> {
  const messages: Array<{
    message: string;
    severity: 'warning' | 'error';
  }> = [];
  // Check if axle weights match tare weight
  if (truck.axle_weights && truck.axle_weights.length > 0) {
    const totalAxleWeight = truck.axle_weights.reduce((sum, weight) => sum + weight, 0);
    const totalWeight = totalAxleWeight + (truck.has_counterweight ? truck.counterweight_mass_t || 0 : 0);
    if (Math.abs(totalWeight - truck.tare_t) > 0.5) {
      messages.push({
        message: `Total axle weights (${totalWeight.toFixed(1)}t) don't match tare weight (${truck.tare_t}t)`,
        severity: 'warning'
      });
    }
  }
  // Check kingpin height
  if (truck.has_kingpin && truck.kingpin_height_m) {
    if (truck.kingpin_height_m > 1.5) {
      messages.push({
        message: `Kingpin height (${truck.kingpin_height_m}m) exceeds 1.5m maximum`,
        severity: 'warning'
      });
    }
  }
  // Check axle loads against typical legal limits
  if (truck.axle_weights) {
    // Front axle typically limited to 7.5t in many jurisdictions
    if (truck.axle_weights[0] > 7.5) {
      messages.push({
        message: `Front axle load (${truck.axle_weights[0]}t) exceeds typical 7.5t limit`,
        severity: 'warning'
      });
    }
    // Rear axles typically limited to 11.5t per axle
    for (let i = 1; i < truck.axle_weights.length; i++) {
      if (truck.axle_weights[i] > 11.5) {
        messages.push({
          message: `Axle ${i + 1} load (${truck.axle_weights[i]}t) exceeds typical 11.5t limit`,
          severity: 'warning'
        });
      }
    }
  }
  // Check overall dimensions
  if (truck.overall_width_m > 2.55) {
    messages.push({
      message: `Overall width (${truck.overall_width_m}m) exceeds standard 2.55m limit`,
      severity: 'warning'
    });
  }
  const totalHeight = (truck.chassis_height_m || 1.0) + (truck.cab_height_m || 3.2);
  if (totalHeight > 4.0) {
    messages.push({
      message: `Total height (${totalHeight.toFixed(2)}m) exceeds 4.0m standard limit`,
      severity: 'warning'
    });
  }
  return messages;
}