import React from "react";
import { Link } from "react-router-dom";
import { useForm, useWatch, type Control } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

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
import {
  H1,
  INTRO,
  DISCLAIMER,
  STEPS,
  PRICE_FACTORS,
  FAQ,
  WAREHOUSE,
  DESTINATION,
  isHoustonAreaZip,
} from "@/content/shipVehicle";

const OFFICE_PHONE = "(832) 295-9347";
const OFFICE_PHONE_HREF = "tel:+18322959347";
const WHATSAPP_HREF = "https://wa.me/17138261087";

const CONDITIONS = [
  { value: "runs_and_drives", label: "Runs and drives" },
  { value: "starts_no_move", label: "Starts, doesn't drive" },
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

const usd = (n: number) => `$${n.toLocaleString("en-US", { maximumFractionDigits: 0 })}`;

function titleCase(s: string | null) {
  return s ? s.toLowerCase().replace(/\b[a-z]/g, (c) => c.toUpperCase()) : null;
}

function vehicleName(v: VehicleEstimateResult["vehicle"]) {
  if (!v) return null;
  return [v.year, titleCase(v.make), v.model].filter(Boolean).join(" ");
}

function placeFrom(city: string, state: string) {
  return [city.trim(), state.trim().toUpperCase()].filter(Boolean).join(", ");
}

const NO_ESTIMATE_MESSAGE: Record<string, string> = {
  decode_failed: "We couldn't look up your VIN just now, so there's no instant estimate. We'll call you with a price.",
  vin_not_found:
    "We couldn't find a vehicle for that VIN. Double-check it on the driver's side dashboard or your title; we'll also call you.",
  needs_review: "This vehicle needs a personal quote from our team. We'll call you with a price.",
};

/* ── The route: the page's signature. Three stops, two legs. ─────────── */

type Leg = { label: string; value: React.ReactNode; dashed?: boolean };

// A stop's `tail` continues the route line below its dot, in the style of the
// leg that follows, so the line is unbroken from stop to stop.
const Stop = ({ place, line, filled, tail }: { place: string; line?: string; filled?: boolean; tail?: "solid" | "dashed" }) => (
  <li className="relative pl-8">
    {tail && (
      <span
        aria-hidden="true"
        className={`absolute left-[5px] top-[1.1rem] bottom-0 w-0 border-l-2 ${
          tail === "dashed" ? "border-dashed border-[var(--sv-muted)]" : "border-solid border-[var(--sv-ink)]"
        }`}
      />
    )}
    <span
      aria-hidden="true"
      className={`absolute left-0 top-[0.35rem] h-3 w-3 rounded-full border-2 border-[var(--sv-ink)] ${
        filled ? "bg-[var(--sv-ink)]" : "bg-[var(--sv-panel)]"
      }`}
    />
    <p className="sv-place text-[0.95rem] leading-tight">{place}</p>
    {line && <p className="mt-0.5 text-sm text-[var(--sv-muted)]">{line}</p>}
  </li>
);

const LegRow = ({ leg }: { leg: Leg }) => (
  <li className="relative pl-8 py-4">
    <span
      aria-hidden="true"
      className={`absolute left-[5px] top-0 bottom-0 w-0 border-l-2 ${
        leg.dashed ? "border-dashed border-[var(--sv-muted)]" : "border-solid border-[var(--sv-ink)]"
      }`}
    />
    <p className="text-xs font-medium uppercase tracking-[0.08em] text-[var(--sv-muted)]">{leg.label}</p>
    <div className="mt-1 text-[0.95rem]">{leg.value}</div>
  </li>
);

const RouteSheet = ({ origin, originLine, inland, ocean }: { origin: string; originLine?: string; inland: Leg | null; ocean: Leg }) => (
  <ol aria-label="Your shipping route" className="list-none">
    <Stop place={origin} line={originLine} filled={!inland} tail={inland ? "dashed" : "solid"} />
    {inland && <LegRow leg={inland} />}
    {inland && <Stop place={WAREHOUSE.city} line={WAREHOUSE.line} filled tail="solid" />}
    <LegRow leg={ocean} />
    <Stop place={DESTINATION.city} line={DESTINATION.line} filled />
  </ol>
);

/** Route preview that follows the address as it's typed. */
const LiveRoute = ({ control }: { control: Control<EstimateFormValues> }) => {
  const [city, state, zip] = useWatch({ control, name: ["city", "state", "zip"] });
  const place = placeFrom(city ?? "", state ?? "");
  const houston = /^\d{5}/.test(zip ?? "") && isHoustonAreaZip(zip);

  if (houston) {
    return (
      <RouteSheet
        origin={WAREHOUSE.city}
        originLine={`Drop off at our warehouse, 5301 Polk Street`}
        inland={null}
        ocean={{ label: "Ocean freight", value: <span className="text-[var(--sv-muted)]">Your estimate appears here</span> }}
      />
    );
  }
  return (
    <RouteSheet
      origin={place || "Your city"}
      inland={{
        label: "Inland transport",
        dashed: true,
        value: <span className="text-[var(--sv-muted)]">To our warehouse, priced when we call</span>,
      }}
      ocean={{ label: "Ocean freight", value: <span className="text-[var(--sv-muted)]">Your estimate appears here</span> }}
    />
  );
};

/* ── Result ─────────────────────────────────────────────────────────── */

type Submitted = { result: VehicleEstimateResult; phone: string; place: string; houston: boolean };

const EstimateResult = ({ submitted, onReset }: { submitted: Submitted; onReset: () => void }) => {
  const { result, phone, place, houston } = submitted;
  const name = vehicleName(result.vehicle);
  const inlandNeeded = result.inland ? result.inland.required : !houston;
  const from = result.inland?.from || place;

  const ocean: Leg = result.estimate
    ? {
        label: "Ocean freight, Houston to Tema",
        value: (
          <p className="sv-wide sv-reveal text-[clamp(1.9rem,6vw,2.6rem)] font-bold leading-none">
            <span className="sv-mark">
              {result.estimate.isRange
                ? `${usd(result.estimate.low)} – ${usd(result.estimate.high)}`
                : `About ${usd(result.estimate.low)}`}
            </span>
          </p>
        ),
      }
    : {
        label: "Ocean freight, Houston to Tema",
        value: <p className="sv-reveal">{NO_ESTIMATE_MESSAGE[result.reason ?? "needs_review"] ?? NO_ESTIMATE_MESSAGE.needs_review}</p>,
      };

  return (
    <div aria-live="polite" className="space-y-8">
      <div>
        <p className="text-sm text-[var(--sv-muted)]">Your estimate</p>
        <h2 className="sv-wide mt-1 text-2xl font-semibold leading-tight">{name || "Your vehicle"}</h2>
      </div>

      {inlandNeeded ? (
        <RouteSheet
          origin={from || "Your city"}
          inland={{ label: "Inland transport", dashed: true, value: "To our warehouse, priced when we call" }}
          ocean={ocean}
        />
      ) : (
        <RouteSheet origin={WAREHOUSE.city} originLine="Drop off at our warehouse, 5301 Polk Street" inland={null} ocean={ocean} />
      )}

      {result.estimate && (
        <p className="border-t border-[var(--sv-line)] pt-5 text-sm leading-relaxed text-[var(--sv-muted)]">{DISCLAIMER}</p>
      )}

      <div className="rounded-sm bg-[var(--sv-paper)] p-5">
        <p className="font-semibold">What happens next</p>
        <p className="mt-1 text-[0.95rem] leading-relaxed">
          We'll call you at <span className="whitespace-nowrap font-medium">{phone}</span>
          {result.estimate ? " to confirm your price and the next sailing" : " with a price for your vehicle"}
          {inlandNeeded ? ", and to price the trip to Houston." : "."}
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Button asChild className="h-12 flex-1 rounded-sm bg-[var(--sv-ink)] text-base hover:bg-[var(--sv-ink)]/90">
          <a href={WHATSAPP_HREF} target="_blank" rel="noopener noreferrer">
            WhatsApp us now
          </a>
        </Button>
        <Button variant="outline" className="h-12 flex-1 rounded-sm border-[var(--sv-line)] bg-transparent text-base" onClick={onReset}>
          Estimate another vehicle
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
        setSendError(`We couldn't send your request. Please try again, or message us on WhatsApp at ${WHATSAPP_NUMBER}.`);
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
      <form onSubmit={form.handleSubmit(onSubmit)} noValidate className="space-y-10">
        <LiveRoute control={form.control} />

        <fieldset className="space-y-4">
          <legend className="sv-place mb-4 text-xs text-[var(--sv-muted)]">Where the car is, and who we call</legend>
          {text("name", "Full name", { autoComplete: "name", maxLength: 200 })}
          <div className="grid gap-4 sm:grid-cols-2">
            {text("phone", "Phone", { type: "tel", autoComplete: "tel", maxLength: 25 })}
            {text("email", "Email (optional)", { type: "email", autoComplete: "email", maxLength: 200 })}
          </div>
          {text("street", "Street address", { autoComplete: "street-address", maxLength: 200 })}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div className="col-span-2">{text("city", "City", { autoComplete: "address-level2", maxLength: 100 })}</div>
            <div className="col-span-1">{text("state", "State", { autoComplete: "address-level1", maxLength: 50 })}</div>
            <div className="col-span-1">{text("zip", "ZIP", { autoComplete: "postal-code", inputMode: "numeric", maxLength: 10 })}</div>
          </div>
        </fieldset>

        <fieldset className="space-y-4">
          <legend className="sv-place mb-4 text-xs text-[var(--sv-muted)]">The vehicle</legend>
          <div>
            {text("vin", "VIN", {
              maxLength: 17,
              className: "sv-wide uppercase tracking-[0.12em]",
              autoCapitalize: "characters",
              autoComplete: "off",
              spellCheck: false,
            })}
            <p className="mt-1.5 text-sm text-[var(--sv-muted)]">
              17 characters. It's on the driver's side of the dashboard and on your title.
            </p>
          </div>

          <FormField
            control={form.control}
            name="runningCondition"
            render={({ field }) => (
              <FormItem className="space-y-1.5">
                <FormLabel className="text-sm font-medium text-[var(--sv-ink)]">Condition</FormLabel>
                <FormControl>
                  <RadioGroup value={field.value} onValueChange={field.onChange} className="grid gap-2 sm:grid-cols-3">
                    {CONDITIONS.map((c) => (
                      <label
                        key={c.value}
                        className="flex min-h-12 cursor-pointer items-center gap-3 rounded-sm border border-[var(--sv-line)] bg-[var(--sv-panel)] px-3 text-sm transition-colors has-[:checked]:border-[var(--sv-ink)] has-[:checked]:bg-[var(--sv-paper)] has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-[var(--sv-ink)]"
                      >
                        <RadioGroupItem value={c.value} className="border-[var(--sv-ink)] text-[var(--sv-ink)]" />
                        {c.label}
                      </label>
                    ))}
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </fieldset>

        {/* Honeypot: hidden from people, filled by bots. */}
        <div className="absolute -left-[10000px]" aria-hidden="true">
          <label>
            Company
            <input tabIndex={-1} autoComplete="off" {...form.register("company")} />
          </label>
        </div>

        <div className="space-y-3">
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
            {isSubmitting ? "Working out your estimate…" : "See my estimate"}
          </Button>
          <p className="text-sm text-[var(--sv-muted)]">
            Free, and no commitment. Your estimate shows as soon as you submit, and we'll call you to confirm it.
          </p>
        </div>
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
    <div className="sv min-h-screen flex flex-col">
      <NavMenu />
      <main className="flex-1">
        {/* Hero: headline + estimator on the left, the photo on the right. */}
        <section className="mx-auto grid max-w-6xl gap-x-16 px-4 pb-16 pt-28 sm:px-6 md:pt-32 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.82fr)] lg:px-8">
          <div className="max-w-xl">
            <h1 className="sv-wide text-balance text-[clamp(2.2rem,5.2vw,3.6rem)] font-bold leading-[1.02] tracking-[-0.01em]">
              {H1}
            </h1>
            <p className="mt-6 max-w-[52ch] text-lg leading-relaxed text-[var(--sv-muted)]">{INTRO}</p>

            <div
              ref={panelRef}
              className="mt-10 scroll-mt-24 rounded-sm border border-[var(--sv-line)] bg-[var(--sv-panel)] p-6 shadow-[0_1px_2px_oklch(0.24_0.045_262/0.06),0_12px_32px_-16px_oklch(0.24_0.045_262/0.18)] sm:p-8"
            >
              {submitted ? <EstimateResult submitted={submitted} onReset={() => show(null)} /> : <EstimateForm onResult={show} />}
            </div>
          </div>

          <figure className="mt-12 lg:mt-2">
            <div className="lg:sticky lg:top-24">
              <img
                src="/images/cars-on-deck-1080.webp"
                srcSet="/images/cars-on-deck-640.webp 640w, /images/cars-on-deck-1080.webp 1080w"
                sizes="(min-width: 1024px) 42vw, 100vw"
                width={1080}
                height={1171}
                alt="Family cars, SUVs and a van parked on a ship's deck, the wake stretching out to open sea"
                className="aspect-[4/3] w-full rounded-sm object-cover object-[50%_70%] lg:aspect-[4/5] lg:object-[45%_50%]"
                decoding="async"
              />
              <figcaption className="mt-3 text-right text-xs text-[var(--sv-muted)]">Photo: Tobias Tullius, Unsplash</figcaption>
            </div>
          </figure>
        </section>

        {/* How it works, told along the same route. */}
        <section className="border-t border-[var(--sv-line)]">
          <div className="mx-auto grid max-w-6xl gap-10 px-4 py-20 sm:px-6 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:px-8">
            <h2 className="sv-wide text-balance text-3xl font-bold leading-tight md:text-4xl">From your driveway to Tema</h2>
            <ol className="list-none">
              {STEPS.map((s, i) => (
                <li key={s.title} className="grid grid-cols-[3.5rem_1fr] gap-4 border-t border-[var(--sv-line)] py-7 first:border-t-0 first:pt-0">
                  <span aria-hidden="true" className="sv-wide text-3xl font-medium leading-none text-[var(--sv-muted)]">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3 className="text-lg font-semibold">{s.title}</h3>
                    <p className="mt-1.5 max-w-[60ch] leading-relaxed text-[var(--sv-muted)]">{s.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* What moves the price. */}
        <section className="bg-[var(--sv-panel)]">
          <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
            <h2 className="sv-wide max-w-xl text-balance text-3xl font-bold leading-tight md:text-4xl">What moves the price</h2>
            <dl className="mt-10 grid max-w-4xl gap-x-12 gap-y-8 md:grid-cols-2">
              {PRICE_FACTORS.filter((f) => f.title !== "Not included").map((f) => (
                <div key={f.title} className="border-t-2 border-[var(--sv-ink)] pt-4">
                  <dt className="font-semibold">{f.title}</dt>
                  <dd className="mt-1.5 leading-relaxed text-[var(--sv-muted)]">{f.body}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-10 max-w-4xl border-t border-[var(--sv-line)] pt-5 leading-relaxed">
              <span className="font-semibold">Not in the estimate:</span>{" "}
              <span className="text-[var(--sv-muted)]">
                inland transport to Houston (priced on the call) and Ghana import duty and taxes.
              </span>
            </p>
          </div>
        </section>

        {/* Questions. */}
        <section>
          <div className="mx-auto grid max-w-6xl gap-10 px-4 py-20 sm:px-6 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:px-8">
            <div>
              <h2 className="sv-wide text-balance text-3xl font-bold leading-tight md:text-4xl">Questions we hear every week</h2>
              <p className="mt-4 max-w-[40ch] leading-relaxed text-[var(--sv-muted)]">
                Shipping household goods too? Try the{" "}
                <Link to="/shipping-calculator" className="font-medium text-[var(--sv-ink)] underline underline-offset-4">
                  shipping calculator
                </Link>
                .
              </p>
            </div>
            <dl>
              {FAQ.map((f) => (
                <div key={f.q} className="border-t border-[var(--sv-line)] py-6 first:border-t-0 first:pt-0">
                  <dt className="text-lg font-semibold">{f.q}</dt>
                  <dd className="mt-2 max-w-[65ch] leading-relaxed text-[var(--sv-muted)]">{f.a}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* Close: the one navy band on the page. */}
        <section className="bg-[var(--sv-ink)] text-[var(--sv-paper)]">
          <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-16 sm:px-6 md:flex-row md:items-end md:justify-between lg:px-8">
            <div>
              <h2 className="sv-wide text-3xl font-bold leading-tight md:text-4xl">Rather talk it through?</h2>
              <p className="mt-3 max-w-[48ch] leading-relaxed opacity-80">
                Call the office or message us on WhatsApp. Tell us where the car is and what it is, and we'll take it from there.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <a
                href={OFFICE_PHONE_HREF}
                className="sv-wide inline-flex h-12 items-center justify-center rounded-sm bg-[var(--sv-paper)] px-6 font-semibold text-[var(--sv-ink)] transition-opacity hover:opacity-90"
              >
                Call {OFFICE_PHONE}
              </a>
              <a
                href={WHATSAPP_HREF}
                target="_blank"
                rel="noopener noreferrer"
                className="sv-wide inline-flex h-12 items-center justify-center rounded-sm border border-[var(--sv-paper)]/40 px-6 font-semibold transition-colors hover:bg-[var(--sv-paper)]/10"
              >
                WhatsApp {WHATSAPP_NUMBER}
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
