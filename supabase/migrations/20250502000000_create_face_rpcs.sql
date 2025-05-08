
-- Create function to update face registration status in profiles
CREATE OR REPLACE FUNCTION public.update_face_registration(
  user_id_param UUID,
  is_registered BOOLEAN
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.profiles 
  SET 
    face_registered = is_registered,
    face_registered_at = CASE WHEN is_registered THEN NOW() ELSE NULL END,
    updated_at = NOW()
  WHERE id = user_id_param;
END;
$$;

-- Create function to log face search history
CREATE OR REPLACE FUNCTION public.log_face_search(
  user_id_param UUID,
  matched_param BOOLEAN,
  matched_person_id_param TEXT,
  image_url_param TEXT
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.face_search_history (
    user_id, 
    matched, 
    matched_person_id, 
    image_url, 
    search_timestamp
  ) VALUES (
    user_id_param,
    matched_param,
    matched_person_id_param,
    image_url_param,
    NOW()
  );
END;
$$;

-- Create function to register a face
CREATE OR REPLACE FUNCTION public.register_face(
  user_id_param UUID,
  face_id_param TEXT,
  confidence_param NUMERIC,
  status_param TEXT
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.face_registrations (
    user_id,
    face_id,
    confidence,
    status,
    created_at,
    updated_at
  ) VALUES (
    user_id_param,
    face_id_param,
    confidence_param,
    status_param,
    NOW(),
    NOW()
  );
END;
$$;

-- Create function to get matching profiles
CREATE OR REPLACE FUNCTION public.get_matching_profiles(
  limit_count INTEGER DEFAULT 10
)
RETURNS TABLE (
  id UUID,
  full_name TEXT,
  profession TEXT,
  avatar_url TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id,
    p.full_name,
    p.profession,
    p.avatar_url
  FROM 
    public.profiles p
  WHERE 
    p.avatar_url IS NOT NULL
  ORDER BY 
    RANDOM()
  LIMIT 
    limit_count;
END;
$$;
