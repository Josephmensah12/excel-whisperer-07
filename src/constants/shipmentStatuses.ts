export const SHIPMENT_STATUSES = [
  "Received",
  "Processing",
  "Shipped from USA",
  "In Transit",
  "Arrived Ghana",
  "Clearing from port",
  "Delivery scheduling",
  "Delivered",
  "Hold",
  "Cancelled",
] as const;

export type ShipmentStatus = typeof SHIPMENT_STATUSES[number];