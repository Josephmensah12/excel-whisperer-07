
import React from "react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { texasCities } from "@/constants/cities";
import { UseFormReturn } from "react-hook-form";
import { CallRequestFormData } from "@/schemas/callRequestSchema";

// The original form-based props
interface FormCitySelectProps {
  form: UseFormReturn<CallRequestFormData>;
}

// New simplified props for direct use
interface SimpleCitySelectProps {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

// Union type to support both use cases
export type CitySelectProps = FormCitySelectProps | SimpleCitySelectProps;

// Type guard to check which prop set we're using
function isFormProps(props: CitySelectProps): props is FormCitySelectProps {
  return 'form' in props;
}

export function CitySelect(props: CitySelectProps) {
  // Handle form case
  if (isFormProps(props)) {
    const { form } = props;
    const selectedCity = form.watch("shipFromCity");

    return (
      <div className="space-y-4">
        <FormField
          control={form.control}
          name="shipFromCity"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-gray-700">Ship From City</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a city" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {texasCities.map((city) => (
                    <SelectItem key={city} value={city}>
                      {city}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        {selectedCity === "Other" && (
          <FormField
            control={form.control}
            name="shipFromCityCustom"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-gray-700">Enter City Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter city name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
      </div>
    );
  }
  
  // Handle simplified direct usage case
  const { id, value, onChange, placeholder = "Select a city", className = "" } = props;
  
  return (
    <Select onValueChange={onChange} value={value}>
      <SelectTrigger id={id} className={className}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {texasCities.map((city) => (
          <SelectItem key={city} value={city}>
            {city}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
