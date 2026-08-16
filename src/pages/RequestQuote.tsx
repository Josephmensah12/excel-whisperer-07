
import React from "react";
import { toast } from "@/components/ui/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ClipboardList } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import Footer from "@/components/Footer";
import NavMenu from "@/components/NavMenu";
import { submitLead, WHATSAPP_NUMBER } from "@/lib/gcglApi";

// Define the schema for the form
const quoteFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  origin: z.string().min(2, "Origin must be at least 2 characters"),
  destination: z.string().min(2, "Destination must be at least 2 characters"),
  goodsType: z.string().min(2, "Type of goods must be at least 2 characters"),
  additionalInfo: z.string().optional(),
});

type QuoteFormValues = z.infer<typeof quoteFormSchema>;

const RequestQuote = () => {
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const form = useForm<QuoteFormValues>({
    resolver: zodResolver(quoteFormSchema),
    defaultValues: {
      name: "",
      email: "",
      origin: "",
      destination: "",
      goodsType: "",
      additionalInfo: "",
    },
    mode: "onChange",
  });

  async function onSubmit(values: QuoteFormValues) {
    setIsSubmitting(true);
    try {
      await submitLead({
        type: "quote",
        name: values.name,
        email: values.email,
        origin: values.origin,
        destination: values.destination,
        goodsType: values.goodsType,
        additionalInfo: values.additionalInfo,
      });
      toast("Quote request submitted", {
        description: "We will get back to you shortly with a quote.",
      });
      form.reset();
    } catch (err) {
      console.error("Quote request failed:", err);
      toast("We couldn't send your request", {
        description: `Please try again, or reach us on WhatsApp at ${WHATSAPP_NUMBER}.`,
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-100 flex flex-col">
      <NavMenu />
      
      <div className="relative">
        <div className="absolute inset-0 z-0">
          <img 
            src="/lovable-uploads/fec56b94-d58e-44f1-9568-71d7cfcb6770.png" 
            alt="Shipping logistics illustration" 
            className="w-full h-48 md:h-64 object-cover"
          />
          <div className="absolute inset-0 bg-black/50"></div>
        </div>
        <div className="relative z-10 h-48 md:h-64 flex items-center justify-center">
          <div className="text-center text-white">
            <ClipboardList className="h-16 w-16 mx-auto mb-2" />
            <h1 className="text-3xl md:text-4xl font-bold">Request a Quote</h1>
            <p className="text-lg mt-2">Get personalized shipping rates</p>
          </div>
        </div>
      </div>
      
      <div className="flex-1 flex flex-col md:flex-row py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="md:w-1/2 mb-8 md:mb-0 md:pr-8">
          <p className="text-lg text-gray-700 mb-6">
            Fill out the form with your shipping details and we'll provide you with a competitive quote tailored to your needs.
          </p>
        </div>
        <div className="md:w-1/2">
          <div className="bg-white shadow rounded-lg p-6 md:p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Shipping Quote Form</h2>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Your full name" {...field} />
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
                        <Input placeholder="your.email@example.com" type="email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="origin"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-gray-700">Origin</FormLabel>
                        <FormControl>
                          <Input placeholder="City, Country" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="destination"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-gray-700">Destination</FormLabel>
                        <FormControl>
                          <Input placeholder="City, Country" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="goodsType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">Type of Goods</FormLabel>
                      <FormControl>
                        <Input placeholder="Electronics, Furniture, etc." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="additionalInfo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">Additional Information</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Any additional details about your shipment (dimensions, weight, timeline, etc.)" 
                          className="min-h-[100px]" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Submitting..." : "Request Quote"}
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default RequestQuote;
