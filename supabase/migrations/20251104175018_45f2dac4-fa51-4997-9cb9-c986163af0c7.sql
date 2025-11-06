-- Allow all authenticated users to view all events
CREATE POLICY "Authenticated users can view all events"
ON events
FOR SELECT
TO authenticated
USING (true);