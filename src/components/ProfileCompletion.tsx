import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

const DEPARTMENTS = [
  'Computer Science',
  'Information Technology',
  'Electronics',
  'Electrical',
  'Mechanical',
  'Civil',
  'Chemical',
  'Biotechnology',
  'Other'
];

const YEARS = ['1st', '2nd', '3rd', '4th'];
const SEMESTERS = ['1st', '2nd'];

export const ProfileCompletion = () => {
  const { user, userRole } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  // Common fields
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [department, setDepartment] = useState('');

  // Student-specific fields
  const [studentBranch, setStudentBranch] = useState('');
  const [studentId, setStudentId] = useState('');
  const [studentYear, setStudentYear] = useState('');
  const [studentSemester, setStudentSemester] = useState('');

  // Staff-specific fields
  const [staffMemberId, setStaffMemberId] = useState('');
  const [staffYear, setStaffYear] = useState('');

  // Club-specific fields
  const [clubName, setClubName] = useState('');
  const [clubRole, setClubRole] = useState('');
  const [clubMemberId, setClubMemberId] = useState('');
  const [clubYear, setClubYear] = useState('');

  // Admin-specific fields
  const [adminDepartmentId, setAdminDepartmentId] = useState('');

  // Lead-specific fields
  const [leadId, setLeadId] = useState('');

  useEffect(() => {
    fetchProfile();
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .maybeSingle();

    if (error) {
      console.error('Error fetching profile:', error);
      return;
    }

    if (data) {
      setName(data.name || '');
      setPhoneNumber(data.phone_number || '');
      setDepartment(data.department || '');
      
      if (userRole === 'student') {
        setStudentBranch(data.student_branch || '');
        setStudentId(data.student_id || '');
        setStudentYear(data.student_year || '');
        setStudentSemester(data.student_semester || '');
      } else if (userRole === 'staff') {
        setStaffMemberId(data.staff_member_id || '');
        setStaffYear(data.staff_year || '');
      } else if (userRole === 'club') {
        setClubName(data.club_name || '');
        setClubRole(data.club_role || '');
        setClubMemberId(data.club_member_id || '');
        setClubYear(data.club_year || '');
      } else if (userRole === 'admin') {
        setAdminDepartmentId(data.admin_department_id || '');
      } else if (userRole === 'lead') {
        setLeadId(data.lead_id || '');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let updateData: any = {
        name,
        phone_number: phoneNumber,
        department,
        profile_completed: true,
      };

      // Add role-specific fields
      if (userRole === 'student') {
        updateData.student_branch = studentBranch;
        updateData.student_id = studentId;
        updateData.student_year = studentYear;
        updateData.student_semester = studentSemester;
      } else if (userRole === 'staff') {
        updateData.staff_member_id = staffMemberId;
        updateData.staff_year = staffYear;
      } else if (userRole === 'club') {
        updateData.club_name = clubName;
        updateData.club_role = clubRole;
        updateData.club_member_id = clubMemberId;
        updateData.club_year = clubYear;
      } else if (userRole === 'admin') {
        updateData.admin_department_id = adminDepartmentId;
      } else if (userRole === 'lead') {
        updateData.lead_id = leadId;
      }

      const { error } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('id', user?.id);

      if (error) throw error;

      toast.success('Profile completed successfully!');
      navigate(0); // Refresh page to update profile state
    } catch (error: any) {
      toast.error(error.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const getRoleLabel = () => {
    switch (userRole) {
      case 'student': return 'Student';
      case 'staff': return 'Staff Member';
      case 'club': return 'Club Member';
      case 'admin': return 'Admin';
      case 'lead': return 'Lead (Super Admin)';
      default: return 'User';
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-accent/10 p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Complete Your Profile</CardTitle>
          <CardDescription>
            Role: {getRoleLabel()} - Please complete all required fields
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Common Fields */}
            <div className="space-y-2">
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                disabled={loading}
                placeholder="Enter your full name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number *</Label>
              <Input
                id="phone"
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                required
                disabled={loading}
                placeholder="10-digit number"
                pattern="[0-9]{10}"
                maxLength={10}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="department">Department *</Label>
              <Select value={department} onValueChange={setDepartment} disabled={loading} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  {DEPARTMENTS.map((dept) => (
                    <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Student-specific fields */}
            {userRole === 'student' && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="studentBranch">Branch *</Label>
                  <Select value={studentBranch} onValueChange={setStudentBranch} disabled={loading} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select branch" />
                    </SelectTrigger>
                    <SelectContent>
                      {DEPARTMENTS.map((dept) => (
                        <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="studentId">Student ID *</Label>
                  <Input
                    id="studentId"
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
                    required
                    disabled={loading}
                    placeholder="Enter unique student ID"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="studentYear">Year *</Label>
                    <Select value={studentYear} onValueChange={setStudentYear} disabled={loading} required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select year" />
                      </SelectTrigger>
                      <SelectContent>
                        {YEARS.map((year) => (
                          <SelectItem key={year} value={year}>{year}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="studentSemester">Semester *</Label>
                    <Select value={studentSemester} onValueChange={setStudentSemester} disabled={loading} required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select semester" />
                      </SelectTrigger>
                      <SelectContent>
                        {SEMESTERS.map((sem) => (
                          <SelectItem key={sem} value={sem}>{sem}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </>
            )}

            {/* Staff-specific fields */}
            {userRole === 'staff' && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="staffMemberId">Member ID *</Label>
                  <Input
                    id="staffMemberId"
                    value={staffMemberId}
                    onChange={(e) => setStaffMemberId(e.target.value)}
                    required
                    disabled={loading}
                    placeholder="Enter unique member ID"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="staffYear">Year *</Label>
                  <Select value={staffYear} onValueChange={setStaffYear} disabled={loading} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select year" />
                    </SelectTrigger>
                    <SelectContent>
                      {YEARS.map((year) => (
                        <SelectItem key={year} value={year}>{year}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}

            {/* Club-specific fields */}
            {userRole === 'club' && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="clubName">Club Name *</Label>
                  <Input
                    id="clubName"
                    value={clubName}
                    onChange={(e) => setClubName(e.target.value)}
                    required
                    disabled={loading}
                    placeholder="Enter club name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="clubRole">Role in Club *</Label>
                  <Select value={clubRole} onValueChange={setClubRole} disabled={loading} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Admin">Admin</SelectItem>
                      <SelectItem value="Member">Member</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="clubMemberId">Member ID *</Label>
                  <Input
                    id="clubMemberId"
                    value={clubMemberId}
                    onChange={(e) => setClubMemberId(e.target.value)}
                    required
                    disabled={loading}
                    placeholder="Enter unique member ID"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="clubYear">Year *</Label>
                  <Input
                    id="clubYear"
                    value={clubYear}
                    onChange={(e) => setClubYear(e.target.value)}
                    required
                    disabled={loading}
                    placeholder="Enter year"
                  />
                </div>
              </>
            )}

            {/* Admin-specific fields */}
            {userRole === 'admin' && (
              <div className="space-y-2">
                <Label htmlFor="adminDepartmentId">Department ID *</Label>
                <Input
                  id="adminDepartmentId"
                  value={adminDepartmentId}
                  onChange={(e) => setAdminDepartmentId(e.target.value)}
                  required
                  disabled={loading}
                  placeholder="Enter department ID"
                />
              </div>
            )}

            {/* Lead-specific fields */}
            {userRole === 'lead' && (
              <div className="space-y-2">
                <Label htmlFor="leadId">Lead ID *</Label>
                <Input
                  id="leadId"
                  value={leadId}
                  onChange={(e) => setLeadId(e.target.value)}
                  required
                  disabled={loading}
                  placeholder="Enter unique lead ID"
                />
              </div>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Saving...' : 'Complete Profile'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
