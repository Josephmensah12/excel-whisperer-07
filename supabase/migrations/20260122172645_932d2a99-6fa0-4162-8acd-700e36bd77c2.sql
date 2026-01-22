-- Create shipment status enum
CREATE TYPE public.shipment_status AS ENUM (
  'Received',
  'Processing', 
  'Shipped from USA',
  'In Transit',
  'Arrived Ghana',
  'Clearing from port',
  'Delivery scheduling',
  'Delivered',
  'Hold',
  'Cancelled'
);

-- Create app role enum for user roles
CREATE TYPE public.app_role AS ENUM ('admin', 'staff', 'driver');

-- Create user_roles table
CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create shipments table
CREATE TABLE public.shipments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_number text UNIQUE NOT NULL,
  phone_raw text NOT NULL,
  phone_normalized text NOT NULL,
  destination_zone_or_city text,
  eta_to_ghana date,
  eta_delivery date,
  delivery_address_flag boolean DEFAULT false,
  outstanding_balance_flag boolean DEFAULT false,
  whatsapp_opt_in boolean DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Create indexes on shipments
CREATE INDEX idx_shipments_invoice_number ON public.shipments(invoice_number);
CREATE INDEX idx_shipments_phone_normalized ON public.shipments(phone_normalized);

-- Enable RLS on shipments
ALTER TABLE public.shipments ENABLE ROW LEVEL SECURITY;

-- Create shipment_events table
CREATE TABLE public.shipment_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  shipment_id uuid REFERENCES public.shipments(id) ON DELETE CASCADE NOT NULL,
  status shipment_status NOT NULL,
  event_date date NOT NULL,
  notes text,
  created_by uuid REFERENCES auth.users(id),
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Create index on shipment_events
CREATE INDEX idx_shipment_events_shipment_id ON public.shipment_events(shipment_id);
CREATE UNIQUE INDEX idx_shipment_events_unique ON public.shipment_events(shipment_id, status, event_date);

-- Enable RLS on shipment_events
ALTER TABLE public.shipment_events ENABLE ROW LEVEL SECURITY;

-- Create shipment_photos table
CREATE TABLE public.shipment_photos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  shipment_id uuid REFERENCES public.shipments(id) ON DELETE CASCADE NOT NULL,
  photo_url text NOT NULL,
  is_final_delivery_proof boolean DEFAULT false,
  uploaded_by uuid REFERENCES auth.users(id),
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Create index on shipment_photos
CREATE INDEX idx_shipment_photos_shipment_id ON public.shipment_photos(shipment_id);

-- Enable RLS on shipment_photos
ALTER TABLE public.shipment_photos ENABLE ROW LEVEL SECURITY;

-- Create notification_queue table for WhatsApp notifications
CREATE TABLE public.notification_queue (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  shipment_id uuid REFERENCES public.shipments(id) ON DELETE CASCADE NOT NULL,
  phone_number text NOT NULL,
  message text NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed')),
  created_at timestamptz NOT NULL DEFAULT now(),
  sent_at timestamptz
);

-- Enable RLS on notification_queue
ALTER TABLE public.notification_queue ENABLE ROW LEVEL SECURITY;

-- Create column mapping settings table
CREATE TABLE public.excel_column_mappings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  mapping_name text NOT NULL DEFAULT 'default',
  column_config jsonb NOT NULL DEFAULT '{}',
  created_by uuid REFERENCES auth.users(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS on excel_column_mappings
ALTER TABLE public.excel_column_mappings ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check user roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Create function to check if user has any admin/staff/driver role
CREATE OR REPLACE FUNCTION public.has_any_role(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
  )
$$;

-- RLS Policies for user_roles
CREATE POLICY "Admins can manage all roles"
ON public.user_roles
FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can view their own roles"
ON public.user_roles
FOR SELECT
USING (auth.uid() = user_id);

-- RLS Policies for shipments
-- Staff/Admin can read/write all shipments
CREATE POLICY "Staff and Admin can manage shipments"
ON public.shipments
FOR ALL
USING (public.has_any_role(auth.uid()));

-- RLS Policies for shipment_events
CREATE POLICY "Staff and Admin can manage shipment events"
ON public.shipment_events
FOR ALL
USING (public.has_any_role(auth.uid()));

-- RLS Policies for shipment_photos
CREATE POLICY "Staff and Admin can manage photos"
ON public.shipment_photos
FOR ALL
USING (public.has_any_role(auth.uid()));

-- RLS Policies for notification_queue
CREATE POLICY "Staff and Admin can manage notifications"
ON public.notification_queue
FOR ALL
USING (public.has_any_role(auth.uid()));

-- RLS Policies for excel_column_mappings
CREATE POLICY "Staff and Admin can manage column mappings"
ON public.excel_column_mappings
FOR ALL
USING (public.has_any_role(auth.uid()));

-- Create function to normalize phone numbers
CREATE OR REPLACE FUNCTION public.normalize_phone(phone text)
RETURNS text
LANGUAGE plpgsql
IMMUTABLE
AS $$
BEGIN
  -- Remove all non-digit characters
  RETURN regexp_replace(phone, '[^0-9]', '', 'g');
END;
$$;

-- Create trigger to auto-update updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_shipments_updated_at
  BEFORE UPDATE ON public.shipments
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_excel_column_mappings_updated_at
  BEFORE UPDATE ON public.excel_column_mappings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create RPC function for public tracking lookup (no auth required)
CREATE OR REPLACE FUNCTION public.lookup_shipment(p_invoice_number text, p_phone_number text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_shipment record;
  v_events jsonb;
  v_photos jsonb;
  v_normalized_phone text;
BEGIN
  -- Normalize the input phone number
  v_normalized_phone := normalize_phone(p_phone_number);
  
  -- Look up shipment by invoice number and normalized phone
  SELECT * INTO v_shipment
  FROM public.shipments
  WHERE LOWER(TRIM(invoice_number)) = LOWER(TRIM(p_invoice_number))
    AND phone_normalized = v_normalized_phone;
  
  IF v_shipment IS NULL THEN
    RETURN NULL;
  END IF;
  
  -- Get timeline events
  SELECT COALESCE(jsonb_agg(
    jsonb_build_object(
      'id', e.id,
      'status', e.status,
      'event_date', e.event_date,
      'notes', e.notes
    ) ORDER BY e.event_date DESC, e.created_at DESC
  ), '[]'::jsonb) INTO v_events
  FROM public.shipment_events e
  WHERE e.shipment_id = v_shipment.id;
  
  -- Get final delivery photos only
  SELECT COALESCE(jsonb_agg(
    jsonb_build_object(
      'id', p.id,
      'photo_url', p.photo_url
    )
  ), '[]'::jsonb) INTO v_photos
  FROM public.shipment_photos p
  WHERE p.shipment_id = v_shipment.id
    AND p.is_final_delivery_proof = true;
  
  RETURN jsonb_build_object(
    'id', v_shipment.id,
    'invoice_number', v_shipment.invoice_number,
    'destination_zone_or_city', v_shipment.destination_zone_or_city,
    'eta_to_ghana', v_shipment.eta_to_ghana,
    'eta_delivery', v_shipment.eta_delivery,
    'delivery_address_flag', v_shipment.delivery_address_flag,
    'outstanding_balance_flag', v_shipment.outstanding_balance_flag,
    'events', v_events,
    'photos', v_photos
  );
END;
$$;

-- Create storage bucket for shipment photos
INSERT INTO storage.buckets (id, name, public)
VALUES ('shipment-photos', 'shipment-photos', true);

-- Storage policies for shipment-photos bucket
CREATE POLICY "Public can view delivery proof photos"
ON storage.objects FOR SELECT
USING (bucket_id = 'shipment-photos');

CREATE POLICY "Authenticated staff can upload photos"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'shipment-photos' 
  AND auth.role() = 'authenticated'
  AND public.has_any_role(auth.uid())
);

CREATE POLICY "Authenticated staff can update photos"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'shipment-photos' 
  AND auth.role() = 'authenticated'
  AND public.has_any_role(auth.uid())
);

CREATE POLICY "Authenticated staff can delete photos"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'shipment-photos' 
  AND auth.role() = 'authenticated'
  AND public.has_any_role(auth.uid())
);