-- Update profiles table to include all role-specific fields
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS student_branch TEXT,
ADD COLUMN IF NOT EXISTS student_id TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS student_year TEXT,
ADD COLUMN IF NOT EXISTS student_semester TEXT,
ADD COLUMN IF NOT EXISTS staff_member_id TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS staff_year TEXT,
ADD COLUMN IF NOT EXISTS club_name TEXT,
ADD COLUMN IF NOT EXISTS club_role TEXT,
ADD COLUMN IF NOT EXISTS club_member_id TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS club_year TEXT,
ADD COLUMN IF NOT EXISTS admin_department_id TEXT,
ADD COLUMN IF NOT EXISTS lead_id TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active',
ADD COLUMN IF NOT EXISTS last_login TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS profile_picture TEXT;

-- Create index for faster lookups on unique IDs
CREATE INDEX IF NOT EXISTS idx_profiles_student_id ON profiles(student_id);
CREATE INDEX IF NOT EXISTS idx_profiles_staff_member_id ON profiles(staff_member_id);
CREATE INDEX IF NOT EXISTS idx_profiles_club_member_id ON profiles(club_member_id);
CREATE INDEX IF NOT EXISTS idx_profiles_lead_id ON profiles(lead_id);

-- Add additional event fields
ALTER TABLE events
ADD COLUMN IF NOT EXISTS organizer_role TEXT,
ADD COLUMN IF NOT EXISTS rejection_reason TEXT,
ADD COLUMN IF NOT EXISTS approved_by UUID,
ADD COLUMN IF NOT EXISTS approval_date TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS views INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS is_pinned BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS max_capacity INTEGER,
ADD COLUMN IF NOT EXISTS registration_count INTEGER DEFAULT 0;

-- Update events policies to include club and lead roles
DROP POLICY IF EXISTS "Staff can insert events" ON events;
CREATE POLICY "Staff and Club can insert events"
ON events
FOR INSERT
TO authenticated
WITH CHECK (
  (has_role(auth.uid(), 'staff'::app_role) OR has_role(auth.uid(), 'club'::app_role)) 
  AND (auth.uid() = organizer_id)
);

DROP POLICY IF EXISTS "Staff can update own events" ON events;
CREATE POLICY "Staff and Club can update own events"
ON events
FOR UPDATE
TO authenticated
USING (
  (auth.uid() = organizer_id) 
  AND (has_role(auth.uid(), 'staff'::app_role) OR has_role(auth.uid(), 'club'::app_role))
);

DROP POLICY IF EXISTS "Staff can view own events" ON events;
CREATE POLICY "Staff and Club can view own events"
ON events
FOR SELECT
TO authenticated
USING (
  (auth.uid() = organizer_id) 
  AND (has_role(auth.uid(), 'staff'::app_role) OR has_role(auth.uid(), 'club'::app_role))
);

-- Lead can do everything with events
CREATE POLICY "Lead can view all events"
ON events
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'lead'::app_role));

CREATE POLICY "Lead can update all events"
ON events
FOR UPDATE
TO authenticated
USING (has_role(auth.uid(), 'lead'::app_role));

CREATE POLICY "Lead can delete all events"
ON events
FOR DELETE
TO authenticated
USING (has_role(auth.uid(), 'lead'::app_role));

CREATE POLICY "Lead can insert events"
ON events
FOR INSERT
TO authenticated
WITH CHECK (has_role(auth.uid(), 'lead'::app_role));

-- Lead can manage all user roles
CREATE POLICY "Lead can view all roles"
ON user_roles
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'lead'::app_role));

CREATE POLICY "Lead can update all roles"
ON user_roles
FOR UPDATE
TO authenticated
USING (has_role(auth.uid(), 'lead'::app_role));

CREATE POLICY "Lead can delete all roles"
ON user_roles
FOR DELETE
TO authenticated
USING (has_role(auth.uid(), 'lead'::app_role));

-- Lead can view all profiles
CREATE POLICY "Lead can view all profiles"
ON profiles
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'lead'::app_role));

CREATE POLICY "Lead can update all profiles"
ON profiles
FOR UPDATE
TO authenticated
USING (has_role(auth.uid(), 'lead'::app_role));

CREATE POLICY "Lead can delete profiles"
ON profiles
FOR DELETE
TO authenticated
USING (has_role(auth.uid(), 'lead'::app_role));