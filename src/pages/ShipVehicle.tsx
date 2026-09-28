import React from "react";
import { useForm, useWatch, type Control } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ChevronDown } from "lucide-react";

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
import { H1, INTRO, DISCLAIMER, STEPS, FAQ, WAREHOUSE, DESTINATION, isHoustonAreaZip } from "@/content/shipVehicle";

const OFFICE_PHONE = "(832) 295-9347";
const OFFICE_PHONE_HREF = "tel:+18322959347";
const WHATSAPP_HREF = "https://wa.me/17138261087";

const CONDITIONS = [
  { value: "runs_and_drives", label: "Runs" },
  { value: "starts_no_move", label: "Starts only" },
  { value: "non_running", label: "Doesn't run" },
] as const;

// Mirrors the server's checks (gcgl-admin services/vehicleEstimateRequest.js);
// the server stays the authority and its field errors are shown the same way.
const estimateSchema = z.object({
  name: z.string().trim().min(2, "Enter your full name").max(200),
  phone: z
    .string()
    .trim()
    .refine((v) => {
      const digits = v.replace(/\D/g, "").length;
      return digits >= 10 && digits <= 15;
    }, "Enter a valid phone number"),
  email: z.union([z.literal(""), z.string().trim().email("Enter a valid email")]),
  street: z.string().trim().min(1, "Enter your street address").max(200),
  city: z.string().trim().min(1, "Enter your city").max(100),
  state: z.string().trim().min(1, "Enter state").max(50),
  zip: z.string().trim().regex(/^\d{5}(-\d{4})?$/, "5-digit ZIP"),
  vin: z
    .string()
    .trim()
    .regex(/^[A-HJ-NPR-Z0-9]{17}$/i, "A VIN is 17 letters and numbers (no I, O or Q)"),
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

const usd = (n: number) => `$${n.toLocaleString("en-US", { maximumFractionDigits: 0 })}`;

function vehicleName(v: VehicleEstimateResult["vehicle"]) {
  if (!v) return null;
  const make = v.make ? v.make.toLowerCase().replace(/\b[a-z]/g, (c) => c.toUpperCase()) : null;
  return [v.year, make, v.model].filter(Boolean).join(" ");
}

function placeFrom(city: string, state: string) {
  return [city.trim(), state.trim().toUpperCase()].filter(Boolean).join(", ");
}

const NO_ESTIMATE_MESSAGE: Record<string, string> = {
  decode_failed: "We couldn't look up your VIN just now. We'll call you with a price.",
  vin_not_found: "We couldn't find that VIN. Check it on your dashboard or title; we'll also call you.",
  needs_review: "This vehicle needs a personal quote. We'll call you with a price.",
};

/* ── Route ─────────────────────────────────────────────────────────────
 * The page's signature: the customer's own route. A one-line strip while
 * they fill the form, the full sheet with the price once they submit. */

const Line = ({ dashed }: { dashed?: boolean }) => (
  <span
    aria-hidden="true"
    className={`h-0 min-w-4 flex-1 border-t-2 ${dashed ? "border-dashed border-[var(--sv-muted)]" : "border-[var(--sv-ink)]"}`}
  />
);

const RouteStrip = ({ control }: { control: Control<EstimateFormValues> }) => {
  const [city, state, zip] = useWatch({ control, name: ["city", "state", "zip"] });
  const houston = /^\d{5}/.test(zip ?? "") && isHoustonAreaZip(zip);
  const origin = placeFrom(city ?? "", state ?? "") || "Your city";
  return (
    <p aria-label={`Route: ${houston ? "" : origin + ", "}Houston, Tema`} className="sv-place flex items-center gap-2 text-[0.7rem] text-[var(--sv-ink)]">
      {!houston && (
        <>
          <span className="max-w-[40%] truncate">{origin}</span>
          <Line dashed />
        </>
      )}
      <span className="shrink-0">Houston</span>
      <Line />
      <span className="shrink-0">Tema</span>
    </p>
  );
};

type Leg = { label: string; value: React.ReactNode; dashed?: boolean };

const Stop = ({ place, line, tail }: { place: string; line?: string; tail?: "solid" | "dashed" }) => (
  <li className="relative pl-7">
    {tail && (
      <span
        aria-hidden="true"
        className={`absolute bottom-0 left-[5px] top-[1.1rem] border-l-2 ${
          tail === "dashed" ? "border-dashed border-[var(--sv-muted)]" : "border-[var(--sv-ink)]"
        }`}
      />
    )}
    <span aria-hidden="true" className="absolute left-0 top-[0.3rem] h-3 w-3 rounded-full border-2 border-[var(--sv-ink)] bg-[var(--sv-ink)]" />
    <p className="sv-place text-sm leading-tight">{place}</p>
    {line && <p className="text-sm text-[var(--sv-muted)]">{line}</p>}
  </li>
);

const LegRow = ({ leg }: { leg: Leg }) => (
  <li className="relative py-3 pl-7">
    <span
      aria-hidden="true"
      className={`absolute bottom-0 left-[5px] top-0 border-l-2 ${leg.dashed ? "border-dashed border-[var(--sv-muted)]" : "border-[var(--sv-ink)]"}`}
    />
    <p className="text-xs font-medium uppercase tracking-[0.08em] text-[var(--sv-muted)]">{leg.label}</p>
    <div className="mt-1">{leg.value}</div>
  </li>
);

/* ── Result ─────────────────────────────────────────────────────────── */

type Submitted = { result: VehicleEstimateResult; phone: string; place: string; houston: boolean };

const EstimateResult = ({ submitted, onReset }: { submitted: Submitted; onReset: () => void }) => {
  const { result, phone, place, houston } = submitted;
  const inlandNeeded = result.inland ? result.inland.required : !houston;
  const from = result.inland?.from || place || "Your city";

  const price = result.estimate ? (
    <p className="sv-wide sv-reveal text-[2rem] font-bold leading-none sm:text-[2.5rem]">
      <span className="sv-mark">
        {result.estimate.isRange ? `${usd(result.estimate.low)} – ${usd(result.estimate.high)}` : `About ${usd(result.estimate.low)}`}
      </span>
    </p>
  ) : (
    <p className="sv-reveal">{NO_ESTIMATE_MESSAGE[result.reason ?? "needs_review"] ?? NO_ESTIMATE_MESSAGE.needs_review}</p>
  );

  return (
    <div aria-live="polite" className="space-y-6">
      <h2 className="sv-wide text-xl font-semibold leading-tight">{vehicleName(result.vehicle) || "Your vehicle"}</h2>

      <ol aria-label="Your shipping route" className="list-none">
        {inlandNeeded ? (
          <>
            <Stop place={from} tail="dashed" />
            <LegRow leg={{ label: "Inland transport", dashed: true, value: "Priced when we call" }} />
            <Stop place={WAREHOUSE.city} line={WAREHOUSE.line} tail="solid" />
          </>
        ) : (
          <Stop place={WAREHOUSE.city} line={WAREHOUSE.line} tail="solid" />
        )}
        <LegRow leg={{ label: "Container shipping", value: price }} />
        <Stop place={DESTINATION.city} />
      </ol>

      {result.estimate && <p className="text-sm text-[var(--sv-muted)]">{DISCLAIMER}</p>}

      <p className="rounded-sm bg-[var(--sv-paper)] p-4 text-[0.95rem]">
        We'll call <span className="whitespace-nowrap font-semibold">{phone}</span> to confirm
        {result.estimate ? " your price" : " a price"}
        {inlandNeeded ? " and the trip to Houston." : "."}
      </p>

      <div className="grid gap-3 sm:grid-cols-2">
        <Button asChild className="h-12 rounded-sm bg-[var(--sv-ink)] text-base hover:bg-[var(--sv-ink)]/90">
          <a href={WHATSAPP_HREF} target="_blank" rel="noopener noreferrer">
            WhatsApp us
          </a>
        </Button>
        <Button variant="outline" className="h-12 rounded-sm border-[var(--sv-line)] bg-transparent text-base" onClick={onReset}>
          Another vehicle
        </Button>
      </div>
    </div>
  );
};

/* ── Form ───────────────────────────────────────────────────────────── */

const inputClass =
  "h-12 rounded-sm border-[var(--sv-line)] bg-[var(--sv-panel)] text-base md:text-base focus-visible:ring-[var(--sv-ink)] focus-visible:ring-offset-0";

const EstimateForm = ({ onResult }: { onResult: (s: Submitted) => void }) => {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [sendError, setSendError] = React.useState<string | null>(null);

  const form = useForm<EstimateFormValues>({ resolver: zodResolver(estimateSchema), defaultValues: EMPTY });

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
      onResult({
        result,
        phone: values.phone.trim(),
        place: placeFrom(values.city, values.state),
        houston: isHoustonAreaZip(values.zip),
      });
    } catch (err) {
      if (err instanceof VehicleEstimateFieldError) {
        for (const [field, message] of Object.entries(err.fields)) {
          if (field in EMPTY) form.setError(field as keyof EstimateFormValues, { message });
        }
      } else {
        console.error("Vehicle estimate request failed:", err);
        setSendError(`Couldn't send. Try again, or WhatsApp us at ${WHATSAPP_NUMBER}.`);
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  const text = (name: keyof EstimateFormValues, label: string, props: React.ComponentProps<typeof Input> = {}) => (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className="space-y-1.5">
          <FormLabel className="text-sm font-medium text-[var(--sv-ink)]">{label}</FormLabel>
          <FormControl>
            <Input {...props} {...field} value={field.value ?? ""} className={`${inputClass} ${props.className ?? ""}`} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} noValidate className="space-y-4">
        <RouteStrip control={form.control} />

        {text("vin", "Vehicle VIN", {
          maxLength: 17,
          className: "sv-wide uppercase tracking-[0.1em] placeholder:font-sans placeholder:normal-case placeholder:tracking-normal",
          autoCapitalize: "characters",
          autoComplete: "off",
          spellCheck: false,
          placeholder: "17 characters",
        })}

        <FormField
          control={form.control}
          name="runningCondition"
          render={({ field }) => (
            <FormItem className="space-y-1.5">
              <FormLabel className="text-sm font-medium text-[var(--sv-ink)]">Does it run?</FormLabel>
              <FormControl>
                <RadioGroup value={field.value} onValueChange={field.onChange} className="grid grid-cols-3 gap-2">
                  {CONDITIONS.map((c) => (
                    <label
                      key={c.value}
                      className="flex h-12 cursor-pointer items-center justify-center rounded-sm border border-[var(--sv-line)] bg-[var(--sv-panel)] px-2 text-center text-sm transition-colors has-[:checked]:border-[var(--sv-ink)] has-[:checked]:bg-[var(--sv-ink)] has-[:checked]:text-[var(--sv-paper)] has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-[var(--sv-ink)] has-[:focus-visible]:ring-offset-2"
                    >
                      <RadioGroupItem value={c.value} className="sr-only" />
                      {c.label}
                    </label>
                  ))}
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {text("name", "Full name", { autoComplete: "name", maxLength: 200 })}
        <div className="grid gap-4 sm:grid-cols-2 sm:gap-3">
          {text("phone", "Phone", { type: "tel", autoComplete: "tel", maxLength: 25 })}
          {text("email", "Email (optional)", { type: "email", autoComplete: "email", maxLength: 200 })}
        </div>
        {text("street", "Street address", { autoComplete: "street-address", maxLength: 200 })}
        <div className="grid grid-cols-2 gap-x-3 gap-y-4 sm:grid-cols-[1fr_5rem_6.5rem]">
          <div className="col-span-2 sm:col-span-1">{text("city", "City", { autoComplete: "address-level2", maxLength: 100 })}</div>
          {text("state", "State", { autoComplete: "address-level1", maxLength: 50 })}
          {text("zip", "ZIP", { autoComplete: "postal-code", inputMode: "numeric", maxLength: 10 })}
        </div>

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
        <Button
          type="submit"
          disabled={isSubmitting}
          className="sv-wide h-14 w-full rounded-sm bg-[var(--sv-ink)] text-base font-semibold tracking-wide text-[var(--sv-paper)] hover:bg-[var(--sv-ink)]/90"
        >
          {isSubmitting ? "Checking your VIN…" : "See my estimate"}
        </Button>
        <p className="text-center text-sm text-[var(--sv-muted)]">Free. No commitment.</p>
      </form>
    </Form>
  );
};

/* ── Page ───────────────────────────────────────────────────────────── */

const ShipVehicle = () => {
  const [submitted, setSubmitted] = React.useState<Submitted | null>(null);
  const panelRef = React.useRef<HTMLDivElement>(null);

  const show = (s: Submitted | null) => {
    setSubmitted(s);
    panelRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="sv flex min-h-screen flex-col">
      <NavMenu />
      <main className="flex-1 pt-16">
        <img
          src="/images/car-containers-1600.webp"
          srcSet="/images/car-containers-800.webp 800w, /images/car-containers-1600.webp 1600w"
          sizes="100vw"
          width={1600}
          height={900}
          alt="An SUV parked in front of a wall of stacked shipping containers at a port"
          className="h-[34vh] max-h-[460px] min-h-[190px] w-full object-cover object-[78%_100%]"
          // React 18 doesn't know fetchPriority; pass the HTML attribute directly.
          {...{ fetchpriority: "high" }}
        />

        <section className="mx-auto grid max-w-5xl gap-10 px-4 pb-16 pt-8 sm:px-6 md:grid-cols-[1fr_minmax(0,440px)] md:gap-14 md:pt-12 lg:px-8">
          <div>
            <h1 className="sv-wide text-[clamp(2.1rem,7vw,3.4rem)] font-bold leading-[1.02]">{H1}</h1>
            <p className="mt-3 max-w-[34ch] text-lg text-[var(--sv-muted)]">{INTRO}</p>

            <ol className="mt-8 hidden list-none space-y-5 md:block">
              {STEPS.map((s, i) => (
                <li key={s.title} className="grid grid-cols-[2.25rem_1fr]">
                  <span aria-hidden="true" className="sv-wide text-lg font-semibold text-[var(--sv-muted)]">
                    {i + 1}
                  </span>
                  <p>
                    <span className="font-semibold">{s.title}.</span> <span className="text-[var(--sv-muted)]">{s.body}</span>
                  </p>
                </li>
              ))}
            </ol>
          </div>

          <div
            ref={panelRef}
            className="-mx-4 scroll-mt-20 border-y border-[var(--sv-line)] bg-[var(--sv-panel)] px-4 py-6 sm:mx-0 sm:rounded-sm sm:border sm:p-7 sm:shadow-[0_12px_32px_-16px_oklch(0.24_0.045_262/0.18)]"
          >
            {submitted ? <EstimateResult submitted={submitted} onReset={() => show(null)} /> : <EstimateForm onResult={show} />}
          </div>
        </section>

        {/* Steps again on phones, under the form (desktop shows them beside it). */}
        <section className="mx-auto max-w-5xl px-4 pb-12 sm:px-6 md:hidden">
          <h2 className="sv-wide text-2xl font-bold">How it works</h2>
          <ol className="mt-5 list-none space-y-4">
            {STEPS.map((s, i) => (
              <li key={s.title} className="grid grid-cols-[2rem_1fr]">
                <span aria-hidden="true" className="sv-wide font-semibold text-[var(--sv-muted)]">
                  {i + 1}
                </span>
                <p>
                  <span className="font-semibold">{s.title}.</span> <span className="text-[var(--sv-muted)]">{s.body}</span>
                </p>
              </li>
            ))}
          </ol>
        </section>

        <section className="border-t border-[var(--sv-line)]">
          <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 md:py-16 lg:px-8">
            <h2 className="sv-wide text-2xl font-bold md:text-3xl">Questions</h2>
            <div className="mt-4 divide-y divide-[var(--sv-line)] border-y border-[var(--sv-line)]">
              {FAQ.map((f) => (
                <details key={f.q} className="group">
                  <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 py-3 font-semibold [&::-webkit-details-marker]:hidden">
                    {f.q}
                    <ChevronDown aria-hidden="true" className="h-5 w-5 shrink-0 text-[var(--sv-muted)] transition-transform group-open:rotate-180" />
                  </summary>
                  <p className="pb-4 pr-9 text-[var(--sv-muted)]">{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[var(--sv-ink)] text-[var(--sv-paper)]">
          <div className="mx-auto flex max-w-5xl flex-col gap-5 px-4 py-12 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
            <h2 className="sv-wide text-2xl font-bold md:text-3xl">Rather talk?</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              <a
                href={OFFICE_PHONE_HREF}
                className="inline-flex h-12 items-center justify-center rounded-sm bg-[var(--sv-paper)] px-6 font-semibold text-[var(--sv-ink)]"
              >
                Call {OFFICE_PHONE}
              </a>
              <a
                href={WHATSAPP_HREF}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-12 items-center justify-center rounded-sm border border-[var(--sv-paper)]/40 px-6 font-semibold"
              >
                WhatsApp
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default ShipVehicle;
