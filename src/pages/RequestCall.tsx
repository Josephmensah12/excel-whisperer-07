import React from "react";
import { toast } from "@/components/ui/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { CallRequestFormFields } from "@/components/forms/CallRequestFormFields";
import { CallRequestFormData, callRequestSchema } from "@/schemas/callRequestSchema";
import Footer from "@/components/Footer";
import NavMenu from "@/components/NavMenu";
import { submitLead, WHATSAPP_NUMBER } from "@/lib/gcglApi";

const RequestCall = () => {
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const form = useForm<CallRequestFormData>({
    resolver: zodResolver(callRequestSchema),
    defaultValues: {
      name: "",
      shipFromCity: "",
      shipFromCityCustom: "",
      shipToCity: "",
      email: "",
      phone: "",
    },
    mode: "onChange",
  });

  async function onSubmit(values: CallRequestFormData) {
    setIsSubmitting(true);
    try {
      // "Other" puts the real city name in the free-text companion field.
      const origin =
        values.shipFromCity === "Other" && values.shipFromCityCustom
          ? values.shipFromCityCustom
          : values.shipFromCity;

      await submitLead({
        type: "call",
        name: values.name,
        email: values.email,
        phone: values.phone,
        origin,
        destination: values.shipToCity,
      });
      toast("Request submitted", {
        description: "We will contact you shortly.",
      });
      form.reset();
    } catch (err) {
      console.error("Call request failed:", err);
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
      <div className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Request a Call</h2>
            <p className="mt-2 text-sm text-gray-600">Fill out the form and we'll contact you shortly</p>
          </div>
        </div>
        <div className="bg-white shadow rounded-lg p-6 md:p-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <CallRequestFormFields form={form} />
              <Button 
                type="submit" 
                className="w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Submit Request"}
              </Button>
            </form>
          </Form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default RequestCall;
