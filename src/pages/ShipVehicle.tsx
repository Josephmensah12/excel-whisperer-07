import React from "react";
import { toast } from "@/components/ui/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Car } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Footer from "@/components/Footer";
import NavMenu from "@/components/NavMenu";

const vehicleSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(100),
  phone: z
    .string()
    .trim()
    .min(7, "Enter a valid phone number")
    .max(20, "Phone number is too long"),
  vin: z
    .string()
    .trim()
    .length(17, "VIN must be exactly 17 characters")
    .regex(/^[A-HJ-NPR-Z0-9]+$/i, "VIN contains invalid characters"),
});

type VehicleFormValues = z.infer<typeof vehicleSchema>;

const ShipVehicle = () => {
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const form = useForm<VehicleFormValues>({
    resolver: zodResolver(vehicleSchema),
    defaultValues: { name: "", phone: "", vin: "" },
    mode: "onChange",
  });

  async function onSubmit(_values: VehicleFormValues) {
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1200));
    setIsSubmitting(false);
    toast("Vehicle shipping request submitted", {
      description: "Our team will contact you shortly with next steps.",
    });
    form.reset();
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <NavMenu />
      <main className="flex-1 pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <div className="h-14 w-14 rounded-xl bg-accent/10 flex items-center justify-center mx-auto mb-4">
              <Car className="h-7 w-7 text-accent" />
            </div>
            <h1 className="text-3xl font-bold text-foreground">Ship a Vehicle</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Tell us about your vehicle and we'll get back to you with a shipping plan.
            </p>
          </div>

          <div className="bg-card border border-border rounded-xl p-6 md:p-8 premium-shadow">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Your full name" maxLength={100} {...field} />
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
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input type="tel" placeholder="(832) 295-9347" maxLength={20} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="vin"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>VIN</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="17-character VIN"
                          maxLength={17}
                          className="uppercase"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? "Submitting..." : "Submit Request"}
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ShipVehicle;
