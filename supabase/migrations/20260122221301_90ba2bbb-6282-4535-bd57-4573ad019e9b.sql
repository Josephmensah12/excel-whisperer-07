-- Add status column to shipments table
ALTER TABLE public.shipments 
ADD COLUMN status public.shipment_status DEFAULT 'Received'::public.shipment_status;

-- Update existing shipments with their latest status from events
UPDATE public.shipments s
SET status = (
  SELECT e.status 
  FROM public.shipment_events e 
  WHERE e.shipment_id = s.id 
  ORDER BY e.event_date DESC, e.created_at DESC 
  LIMIT 1
)
WHERE EXISTS (
  SELECT 1 FROM public.shipment_events e WHERE e.shipment_id = s.id
);