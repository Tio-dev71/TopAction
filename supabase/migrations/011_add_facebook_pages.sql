-- Add facebook_pages JSONB column to support multiple Facebook pages
ALTER TABLE public.tournaments 
ADD COLUMN facebook_pages JSONB DEFAULT '[]'::jsonb;

-- Optional: Migrate existing data
UPDATE public.tournaments
SET facebook_pages = jsonb_build_array(
  jsonb_build_object(
    'name', COALESCE(facebook_page_name, 'TOPPLAY'),
    'url', facebook_page_url
  )
)
WHERE facebook_page_url IS NOT NULL AND facebook_page_url != '';
