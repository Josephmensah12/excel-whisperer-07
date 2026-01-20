
import { supabase } from "@/integrations/supabase/client";

export async function getParameter(name: string): Promise<string | null> {
  const { data, error } = await supabase
    .from('parameters')
    .select('value')
    .eq('name', name)
    .single();
  
  if (error) {
    console.error('Error fetching parameter:', error);
    return null;
  }

  return data?.value ?? null;
}

// Shipping calculation
interface ShippingParams {
  weight: number;
  dimensions: {
    length: number;
    width: number;
    height: number;
  };
  originCity: string;
  destinationCity: string;
}

export function calculateShippingCost(params: ShippingParams): number {
  const { weight, dimensions, originCity, destinationCity } = params;
  
  // Calculate volume in cubic centimeters
  const volume = dimensions.length * dimensions.width * dimensions.height;
  
  // Reference values (24.5 x 24.5 x 27 inches converted to cm)
  const referenceLength = 24.5 * 2.54; // inches to cm
  const referenceWidth = 24.5 * 2.54;
  const referenceHeight = 27 * 2.54;
  const referenceVolume = referenceLength * referenceWidth * referenceHeight;
  const referenceCost = 170; // $170 for reference package (updated from $55)
  
  // Calculate volumetric ratio compared to reference package
  const volumeRatio = volume / referenceVolume;
  
  // Base cost calculation using the volume ratio
  let baseCost = referenceCost * volumeRatio;
  
  // Weight factor (if weight is provided)
  const weightFactor = Math.max(1, weight / 10); // Weight adjustment (10kg as reference)
  
  // Distance calculation
  let distanceFactor = 1.0;
  if (originCity !== destinationCity) {
    distanceFactor = 1.2; // 20% increase for different cities
  }
  
  // Calculate final cost
  const cost = baseCost * weightFactor * distanceFactor;
  
  // Minimum shipping cost
  return Math.max(9.99, Math.round(cost * 100) / 100);
}
