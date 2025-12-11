-- Allow admins to insert events
CREATE POLICY "Admins can insert events" 
ON public.events 
FOR INSERT 
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));