/** Base URL of the GCGL admin backend that serves the public tracking, payment
 *  and lead-capture endpoints. */
export const GCGL_API = "https://gcgl-admin-backend-production.up.railway.app";

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
