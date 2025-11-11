-- Add event_time and organizer fields to events table
ALTER TABLE public.events 
ADD COLUMN IF NOT EXISTS event_time text,
ADD COLUMN IF NOT EXISTS organizer text;

-- Add comment for clarity
COMMENT ON COLUMN public.events.event_time IS 'Time of the event (e.g., "10:00 AM")';
COMMENT ON COLUMN public.events.organizer IS 'Email of the event organizer';