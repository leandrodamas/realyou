
-- Create storage buckets for our application
INSERT INTO storage.buckets (id, name, public, avif_autodetection)
VALUES ('profiles', 'profiles', true, false)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public, avif_autodetection)
VALUES ('work-gallery', 'work-gallery', true, false)
ON CONFLICT (id) DO NOTHING;

-- Set up security policies for the bucket
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING (bucket_id = 'profiles' OR bucket_id = 'work-gallery');

-- Allow authenticated users to upload their own profile content
CREATE POLICY "Users can upload their own profile content"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'profiles' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow authenticated users to update their own profile content
CREATE POLICY "Users can update their own profile content"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'profiles' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow authenticated users to delete their own profile content
CREATE POLICY "Users can delete their own profile content"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'profiles' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow authenticated users to upload their own work content
CREATE POLICY "Users can upload their own work content"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'work-gallery' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow authenticated users to update their own work content
CREATE POLICY "Users can update their own work content"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'work-gallery' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow authenticated users to delete their own work content
CREATE POLICY "Users can delete their own work content"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'work-gallery' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);
