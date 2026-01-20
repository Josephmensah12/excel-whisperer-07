import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { CallRequestFormData } from "@/schemas/callRequestSchema";
import { CitySelect } from "./CitySelect";

interface CallRequestFormFieldsProps {
  form: UseFormReturn<CallRequestFormData>;
}

export function CallRequestFormFields({ form }: CallRequestFormFieldsProps) {
  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-sm font-medium text-gray-700">Name</FormLabel>
            <FormControl>
              <Input placeholder="Your name" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <CitySelect form={form} />

      <FormField
        control={form.control}
        name="shipToCity"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-sm font-medium text-gray-700">Ship To City</FormLabel>
            <FormControl>
              <Input placeholder="Destination city" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-sm font-medium text-gray-700">Email</FormLabel>
            <FormControl>
              <Input placeholder="Your email" type="email" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="phone"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-sm font-medium text-gray-700">Phone Number</FormLabel>
            <FormControl>
              <Input placeholder="Your phone number" type="tel" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}