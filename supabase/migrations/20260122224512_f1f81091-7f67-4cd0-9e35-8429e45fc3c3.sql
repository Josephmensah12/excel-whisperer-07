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
    'status', v_shipment.status,
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