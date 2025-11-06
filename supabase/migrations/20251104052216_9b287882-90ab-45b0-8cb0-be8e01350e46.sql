-- Drop existing policy
DROP POLICY IF EXISTS "Users can insert own registrations" ON event_registrations;

-- Create new policy allowing all authenticated users to insert event registrations
CREATE POLICY "Allow all authenticated users to insert events"
ON event_registrations
FOR INSERT
TO authenticated
WITH CHECK (true);