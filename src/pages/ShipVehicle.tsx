import React from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Car, Info, Phone, MessageCircle, RotateCcw } from "lucide-react";

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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import Footer from "@/components/Footer";
import NavMenu from "@/components/NavMenu";
import {
  requestVehicleEstimate,
  VehicleEstimateFieldError,
  WHATSAPP_NUMBER,
  type VehicleEstimateResult,
} from "@/lib/gcglApi";
import { H1, INTRO, DISCLAIMER, STEPS, PRICE_FACTORS, FAQ } from "@/content/shipVehicle";

const OFFICE_PHONE = "(832) 295-9347";
const OFFICE_PHONE_HREF = "tel:+18322959347";
const WHATSAPP_HREF = "https://wa.me/17138261087";

const CONDITIONS = [
  { value: "runs_and_drives", label: "Runs and drives" },
  { value: "starts_no_move", label: "Starts but doesn't drive" },
  { value: "non_running", label: "Doesn't run" },
] as const;

// Mirrors the server's checks (gcgl-admin services/vehicleEstimateRequest.js);
// the server stays the authority and its field errors are shown the same way.
const estimateSchema = z.object({
  name: z.string().trim().min(2, "Please enter your full name").max(200),
  phone: z
    .string()
    .trim()
    .refine((v) => {
      const digits = v.replace(/\D/g, "").length;
      return digits >= 10 && digits <= 15;
    }, "Please enter a valid phone number"),
  email: z.union([z.literal(""), z.string().trim().email("Please enter a valid email address")]),
  street: z.string().trim().min(1, "Please enter your street address").max(200),
  city: z.string().trim().min(1, "Please enter your city").max(100),
  state: z.string().trim().min(1, "Enter your state").max(50),
  zip: z.string().trim().regex(/^\d{5}(-\d{4})?$/, "Enter a 5-digit ZIP"),
  vin: z
    .string()
    .trim()
    .regex(/^[A-HJ-NPR-Z0-9]{17}$/i, "A VIN is 17 letters and numbers (it never contains I, O or Q)"),
  runningCondition: z.enum(["runs_and_drives", "starts_no_move", "non_running"]),
  company: z.string().optional(),
});

type EstimateFormValues = z.infer<typeof estimateSchema>;

const EMPTY: EstimateFormValues = {
  name: "",
  phone: "",
  email: "",
  street: "",
  city: "",
  state: "",
  zip: "",
  vin: "",
  runningCondition: "runs_and_drives",
  company: "",
};

function usd(n: number) {
  return `$${n.toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
}

function vehicleName(v: VehicleEstimateResult["vehicle"]) {
  if (!v) return null;
  const titleCase = (s: string | null) =>
    s ? s.toLowerCase().replace(/\b[a-z]/g, (c) => c.toUpperCase()) : null;
  return [v.year, titleCase(v.make), v.model].filter(Boolean).join(" ");
}

const NO_ESTIMATE_MESSAGE: Record<string, string> = {
  decode_failed:
    "We couldn't look up your VIN just now, so we can't show an instant estimate.",
  vin_not_found:
    "We couldn't find a vehicle for that VIN. Please double-check it; it's on the driver's side dashboard and on your title.",
  needs_review:
    "This vehicle needs a personal quote from our team rather than an instant estimate.",
};

type Submitted = { result: VehicleEstimateResult; phone: string };

const EstimateResult = ({ submitted, onReset }: { submitted: Submitted; onReset: () => void }) => {
  const { result, phone } = submitted;
  const name = vehicleName(result.vehicle);

  return (
    <div className="space-y-5" aria-live="polite">
      {result.estimate ? (
        <>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Your estimated shipping cost</p>
            {name && <p className="mt-1 font-semibold text-foreground">{name}, Houston to Tema</p>}
            <p className="mt-2 text-4xl font-bold text-foreground tabular-nums">
              {result.estimate.isRange
                ? `${usd(result.estimate.low)} – ${usd(result.estimate.high)}`
                : `About ${usd(result.estimate.low)}`}
            </p>
          </div>
          <div className="flex gap-3 rounded-lg border border-accent/40 bg-accent/10 p-4 text-sm text-foreground">
            <Info className="h-5 w-5 shrink-0 text-accent" aria-hidden="true" />
            <p>{DISCLAIMER}</p>
          </div>
        </>
      ) : (
        <div>
          <p className="text-xl font-semibold text-foreground">We've received your request</p>
          {name && <p className="mt-1 text-sm text-muted-foreground">{name}</p>}
          <p className="mt-3 text-sm text-foreground">
            {NO_ESTIMATE_MESSAGE[result.reason ?? "needs_review"] ?? NO_ESTIMATE_MESSAGE.needs_review}
          </p>
        </div>
      )}

      <div className="rounded-lg bg-muted p-4 text-sm text-foreground">
        <p className="font-semibold">What happens next</p>
        <p className="mt-1">
          A Gold Coast representative will call you at <span className="font-medium">{phone}</span>{" "}
          {result.estimate
            ? "to confirm your price and the next sailing."
            : "with a price for your vehicle."}
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Button asChild className="flex-1">
          <a href={WHATSAPP_HREF} target="_blank" rel="noopener noreferrer">
            <MessageCircle className="mr-2 h-4 w-4" /> WhatsApp us
          </a>
        </Button>
        <Button variant="outline" className="flex-1" onClick={onReset}>
          <RotateCcw className="mr-2 h-4 w-4" /> Estimate another vehicle
        </Button>
      </div>
    </div>
  );
};

const EstimateForm = ({ onResult }: { onResult: (s: Submitted) => void }) => {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [sendError, setSendError] = React.useState<string | null>(null);

  const form = useForm<EstimateFormValues>({
    resolver: zodResolver(estimateSchema),
    defaultValues: EMPTY,
  });

  async function onSubmit(values: EstimateFormValues) {
    setIsSubmitting(true);
    setSendError(null);
    try {
      const result = await requestVehicleEstimate({
        name: values.name,
        phone: values.phone,
        email: values.email || undefined,
        street: values.street,
        city: values.city,
        state: values.state,
        zip: values.zip,
        vin: values.vin.trim().toUpperCase(),
        runningCondition: values.runningCondition,
        company: values.company,
      });
      onResult({ result, phone: values.phone.trim() });
    } catch (err) {
      if (err instanceof VehicleEstimateFieldError) {
        for (const [field, message] of Object.entries(err.fields)) {
          if (field in EMPTY) form.setError(field as keyof EstimateFormValues, { message });
        }
      } else {
        console.error("Vehicle estimate request failed:", err);
        setSendError(
          `We couldn't send your request. Please try again, or reach us on WhatsApp at ${WHATSAPP_NUMBER}.`
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  const text = (
    name: keyof EstimateFormValues,
    label: string,
    props: React.ComponentProps<typeof Input> = {}
  ) => (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input {...props} {...field} value={field.value ?? ""} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" noValidate>
        {text("name", "Full name", { autoComplete: "name", maxLength: 200 })}
        <div className="grid gap-4 sm:grid-cols-2">
          {text("phone", "Phone number", { type: "tel", autoComplete: "tel", maxLength: 25 })}
          {text("email", "Email (optional)", { type: "email", autoComplete: "email", maxLength: 200 })}
        </div>
        {text("street", "Street address", { autoComplete: "street-address", maxLength: 200 })}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="col-span-2">
            {text("city", "City", { autoComplete: "address-level2", maxLength: 100 })}
          </div>
          <div className="col-span-1">
            {text("state", "State", { autoComplete: "address-level1", maxLength: 50 })}
          </div>
          <div className="col-span-1">
            {text("zip", "ZIP", { autoComplete: "postal-code", inputMode: "numeric", maxLength: 10 })}
          </div>
        </div>

        {text("vin", "Vehicle VIN", {
          maxLength: 17,
          className: "uppercase tracking-wider",
          autoCapitalize: "characters",
          autoComplete: "off",
          spellCheck: false,
        })}
        <p className="-mt-2 text-xs text-muted-foreground">
          17 characters, on the driver's side of the dashboard and on your title.
        </p>

        <FormField
          control={form.control}
          name="runningCondition"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Vehicle condition</FormLabel>
              <FormControl>
                <RadioGroup value={field.value} onValueChange={field.onChange} className="gap-2 sm:grid-cols-3">
                  {CONDITIONS.map((c) => (
                    <label
                      key={c.value}
                      className="flex cursor-pointer items-center gap-2 rounded-md border border-input px-3 py-2 text-sm has-[:checked]:border-accent has-[:checked]:bg-accent/10"
                    >
                      <RadioGroupItem value={c.value} />
                      {c.label}
                    </label>
                  ))}
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Honeypot: hidden from people, filled by bots. */}
        <div className="absolute -left-[10000px]" aria-hidden="true">
          <label>
            Company
            <input tabIndex={-1} autoComplete="off" {...form.register("company")} />
          </label>
        </div>

        {sendError && (
          <p role="alert" className="text-sm font-medium text-destructive">
            {sendError}
          </p>
        )}

        <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Getting your estimate..." : "Get my estimate"}
        </Button>
        <p className="text-xs text-muted-foreground">
          Your estimate appears as soon as you submit. A Gold Coast representative will contact you
          about your shipment.
        </p>
      </form>
    </Form>
  );
};

const ShipVehicle = () => {
  const [submitted, setSubmitted] = React.useState<Submitted | null>(null);
  const cardRef = React.useRef<HTMLDivElement>(null);

  const show = (s: Submitted | null) => {
    setSubmitted(s);
    cardRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <NavMenu />
      <main className="flex-1 pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto grid gap-10 lg:grid-cols-[1fr_minmax(0,520px)] lg:items-start">
          <section>
            <div className="h-14 w-14 rounded-xl bg-accent/10 flex items-center justify-center mb-4">
              <Car className="h-7 w-7 text-accent" aria-hidden="true" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">{H1}</h1>
            <p className="mt-4 text-lg text-muted-foreground">{INTRO}</p>
            <ul className="mt-6 space-y-2 text-foreground">
              <li>Cars, SUVs, pickup trucks and vans</li>
              <li>Running or non-running vehicles</li>
              <li>Container or RoRo shipping to Tema port</li>
            </ul>
            <p className="mt-6 text-sm text-muted-foreground">
              Prefer to talk?{" "}
              <a href={OFFICE_PHONE_HREF} className="font-medium text-foreground underline underline-offset-4">
                <Phone className="inline h-4 w-4 mr-1" aria-hidden="true" />
                {OFFICE_PHONE}
              </a>{" "}
              or{" "}
              <a href={WHATSAPP_HREF} target="_blank" rel="noopener noreferrer" className="font-medium text-foreground underline underline-offset-4">
                WhatsApp {WHATSAPP_NUMBER}
              </a>
            </p>
          </section>

          <div ref={cardRef} className="scroll-mt-24 bg-card border border-border rounded-xl p-6 md:p-8 premium-shadow">
            <h2 className="text-xl font-semibold text-foreground mb-5">
              {submitted ? "Your vehicle shipping estimate" : "Get a free instant estimate"}
            </h2>
            {submitted ? (
              <EstimateResult submitted={submitted} onReset={() => show(null)} />
            ) : (
              <EstimateForm onResult={show} />
            )}
          </div>
        </div>

        <div className="max-w-6xl mx-auto mt-16 space-y-16">
          <section>
            <h2 className="text-2xl font-bold text-foreground">How shipping a car to Ghana works</h2>
            <ol className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {STEPS.map((s, i) => (
                <li key={s.title}>
                  <p className="text-sm font-semibold text-accent tabular-nums">Step {i + 1}</p>
                  <h3 className="mt-1 font-semibold text-foreground">{s.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{s.body}</p>
                </li>
              ))}
            </ol>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground">What affects the price</h2>
            <dl className="mt-6 grid gap-6 md:grid-cols-2">
              {PRICE_FACTORS.map((f) => (
                <div key={f.title}>
                  <dt className="font-semibold text-foreground">{f.title}</dt>
                  <dd className="mt-1 text-sm text-muted-foreground">{f.body}</dd>
                </div>
              ))}
            </dl>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground">Car shipping questions</h2>
            <dl className="mt-6 divide-y divide-border border-y border-border">
              {FAQ.map((f) => (
                <div key={f.q} className="py-5">
                  <dt className="font-semibold text-foreground">{f.q}</dt>
                  <dd className="mt-2 text-muted-foreground">{f.a}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-6 text-sm text-muted-foreground">
              Shipping household goods too? See our{" "}
              <Link to="/shipping-calculator" className="font-medium text-foreground underline underline-offset-4">
                shipping calculator
              </Link>{" "}
              or{" "}
              <Link to="/request-quote" className="font-medium text-foreground underline underline-offset-4">
                request a quote
              </Link>
              .
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ShipVehicle;
