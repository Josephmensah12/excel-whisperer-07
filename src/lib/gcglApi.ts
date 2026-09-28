/** Base URL of the GCGL admin backend that serves the public tracking, payment
 *  and lead-capture endpoints. */
export const GCGL_API =
  import.meta.env.VITE_GCGL_API || "https://gcgl-admin-backend-production.up.railway.app";

/** Phone number shown to customers when a submission cannot get through. */
export const WHATSAPP_NUMBER = "+1 713-826-1087";

export type LeadPayload = {
  type: "quote" | "call";
  name: string;
  email?: string;
  phone?: string;
  origin?: string;
  destination?: string;
  goodsType?: string;
  additionalInfo?: string;
};

/**
 * Send a website lead to the backend.
 *
 * Throws when the request does not reach the server or the server rejects it,
 * so callers can tell the customer the truth instead of showing a success
 * message for a submission that went nowhere.
 */
export async function submitLead(payload: LeadPayload): Promise<void> {
  const res = await fetch(`${GCGL_API}/api/public/lead`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const json = await res.json().catch(() => null);

  if (!res.ok || !json?.success) {
    throw new Error(json?.error || `Request failed (${res.status})`);
  }
}

export type RunningCondition = "runs_and_drives" | "starts_no_move" | "non_running";

export type VehicleEstimateRequest = {
  name: string;
  phone: string;
  email?: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  vin: string;
  runningCondition: RunningCondition;
  /** Honeypot; always empty for real visitors. */
  company?: string;
};

export type VehicleEstimateResult = {
  vehicle: { year: number | null; make: string | null; model: string | null; trim: string | null; bodyType: string | null } | null;
  estimate: { low: number; high: number; isRange: boolean } | null;
  /** Why no estimate was given, when it wasn't. */
  reason: null | "decode_failed" | "vin_not_found" | "needs_review";
};

/** Server-side validation failure, with a message per form field. */
export class VehicleEstimateFieldError extends Error {
  constructor(public fields: Record<string, string>) {
    super("Please check the highlighted fields");
  }
}

/**
 * Ask the backend for a vehicle shipping estimate. The request is saved as a
 * lead whether or not an estimate comes back. Throws VehicleEstimateFieldError
 * for invalid fields and Error when the request could not be delivered.
 */
export async function requestVehicleEstimate(payload: VehicleEstimateRequest): Promise<VehicleEstimateResult> {
  const res = await fetch(`${GCGL_API}/api/public/vehicle-estimate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const json = await res.json().catch(() => null);

  if (res.status === 400 && json?.fields) throw new VehicleEstimateFieldError(json.fields);
  if (!res.ok || !json?.success) throw new Error(json?.error || `Request failed (${res.status})`);

  return { vehicle: json.vehicle ?? null, estimate: json.estimate ?? null, reason: json.reason ?? null };
}
