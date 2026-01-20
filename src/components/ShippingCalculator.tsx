
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CitySelect } from "@/components/forms/CitySelect";
import { toast } from "@/hooks/use-toast";
import { calculateShippingCost } from "@/utils/parameters";
import { Package } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Define unit types and conversion factors
type UnitType = 'in' | 'cm' | 'mm' | 'ft';

const unitConversions: Record<UnitType, number> = {
  'in': 2.54, // 1 inch = 2.54 cm
  'cm': 1,    // 1 cm = 1 cm (base unit)
  'mm': 0.1,  // 1 mm = 0.1 cm
  'ft': 30.48 // 1 ft = 30.48 cm
};

const UnitLabels: Record<UnitType, string> = {
  'in': 'inches',
  'cm': 'centimeters',
  'mm': 'millimeters',
  'ft': 'feet'
};

const ShippingCalculator = () => {
  const [weight, setWeight] = useState<number>(0);
  const [length, setLength] = useState<number>(0);
  const [width, setWidth] = useState<number>(0);
  const [height, setHeight] = useState<number>(0);
  const [originCity, setOriginCity] = useState<string>("");
  const [destinationCity, setDestinationCity] = useState<string>("");
  const [shippingCost, setShippingCost] = useState<number | null>(null);
  const [isCalculating, setIsCalculating] = useState<boolean>(false);
  const [unit, setUnit] = useState<UnitType>('in');

  const handleCalculate = () => {
    // Validation for dimensions only
    if (!length || !width || !height) {
      toast("Missing Dimensions", {
        description: "Please enter length, width, and height.",
      });
      return;
    }

    setIsCalculating(true);

    // Default values for optional fields
    const calculationWeight = weight || 1; // Default weight of 1kg if not provided
    const calculationOriginCity = originCity || "Accra"; // Default origin city
    const calculationDestinationCity = destinationCity || "Accra"; // Default destination city

    // Convert dimensions to centimeters for internal calculation
    const conversionFactor = unitConversions[unit];
    const lengthInCm = length * conversionFactor;
    const widthInCm = width * conversionFactor;
    const heightInCm = height * conversionFactor;

    setTimeout(() => {
      try {
        const estimatedCost = calculateShippingCost({
          weight: calculationWeight,
          dimensions: { 
            length: lengthInCm, 
            width: widthInCm, 
            height: heightInCm 
          },
          originCity: calculationOriginCity,
          destinationCity: calculationDestinationCity,
        });

        setShippingCost(estimatedCost);
        
        toast("Done", {
          description: `Cost: $${estimatedCost.toFixed(2)}`,
        });
      } catch (error) {
        toast("Error", {
          description: "Unable to calculate shipping cost.",
        });
      } finally {
        setIsCalculating(false);
      }
    }, 1500);
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center flex items-center justify-center gap-2">
          <Package className="h-6 w-6" />
          Shipping Cost Calculator
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="weight">Weight (kg)</Label>
            <Input
              id="weight"
              type="number"
              min="0"
              step="0.1"
              value={weight || ''}
              onChange={(e) => setWeight(parseFloat(e.target.value))}
              placeholder="Optional"
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="unit-select">Units</Label>
            <Select value={unit} onValueChange={(value: UnitType) => setUnit(value)}>
              <SelectTrigger id="unit-select" className="mt-1">
                <SelectValue placeholder="Select unit" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="in">Inches (in)</SelectItem>
                <SelectItem value="cm">Centimeters (cm)</SelectItem>
                <SelectItem value="mm">Millimeters (mm)</SelectItem>
                <SelectItem value="ft">Feet (ft)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-3 gap-2 md:col-span-2">
            <div>
              <Label htmlFor="length">{`Length (${UnitLabels[unit]})*`}</Label>
              <Input
                id="length"
                type="number"
                min="0"
                step="0.1"
                value={length || ''}
                onChange={(e) => setLength(parseFloat(e.target.value))}
                placeholder="L"
                className="mt-1"
                required
              />
            </div>
            <div>
              <Label htmlFor="width">{`Width (${UnitLabels[unit]})*`}</Label>
              <Input
                id="width"
                type="number"
                min="0"
                step="0.1"
                value={width || ''}
                onChange={(e) => setWidth(parseFloat(e.target.value))}
                placeholder="W"
                className="mt-1"
                required
              />
            </div>
            <div>
              <Label htmlFor="height">{`Height (${UnitLabels[unit]})*`}</Label>
              <Input
                id="height"
                type="number"
                min="0"
                step="0.1"
                value={height || ''}
                onChange={(e) => setHeight(parseFloat(e.target.value))}
                placeholder="H"
                className="mt-1"
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="origin">Origin City</Label>
            <CitySelect
              value={originCity}
              onChange={setOriginCity}
              placeholder="Optional"
              className="mt-1"
              id="origin"
            />
          </div>

          <div>
            <Label htmlFor="destination">Destination City</Label>
            <CitySelect
              value={destinationCity}
              onChange={setDestinationCity}
              placeholder="Optional"
              className="mt-1"
              id="destination"
            />
          </div>
        </div>

        <div className="mt-8 flex justify-center">
          <Button onClick={handleCalculate} disabled={isCalculating} className="w-full md:w-auto min-w-[150px]">
            {isCalculating ? "Calculating..." : "Calculate Cost"}
          </Button>
        </div>

        {shippingCost !== null && (
          <div className="mt-8 p-6 bg-blue-50 rounded-lg text-center">
            <h3 className="text-xl font-medium mb-2">Estimated Cost</h3>
            <p className="text-3xl font-bold text-blue-600">${shippingCost.toFixed(2)}</p>
            <p className="mt-2 text-sm text-gray-500">
              Estimates may vary from actual costs
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ShippingCalculator;
