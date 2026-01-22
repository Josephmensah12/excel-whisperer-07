-- Fix function search path for normalize_phone
CREATE OR REPLACE FUNCTION public.normalize_phone(phone text)
RETURNS text
LANGUAGE plpgsql
IMMUTABLE
SET search_path = public
AS $$
BEGIN
  -- Remove all non-digit characters
  RETURN regexp_replace(phone, '[^0-9]', '', 'g');
END;
$$;

-- Fix function search path for update_updated_at_column
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER 
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;