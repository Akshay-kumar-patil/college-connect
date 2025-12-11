import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Navbar } from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Check, X, Trash2, Calendar, MapPin } from 'lucide-react';
import { format } from 'date-fns';
import { useAuth } from '@/contexts/AuthContext';
import { EventUploadForm } from '@/components/EventUploadForm';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [pendingEvents, setPendingEvents] = useState<any[]>([]);
  const [allEvents, setAllEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [profileCompleted, setProfileCompleted] = useState(false);
  const [checkingProfile, setCheckingProfile] = useState(true);

  useEffect(() => {
    if (user) {
      checkProfileCompletion();
    }
    fetchEvents();
  }, [user]);

  const checkProfileCompletion = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('profile_completed')
        .eq('id', user?.id)
        .maybeSingle();

      if (error) throw error;
      setProfileCompleted(data?.profile_completed || false);
    } catch (error) {
      console.error('Error checking profile:', error);
    } finally {
      setCheckingProfile(false);
    }
  };

  const fetchEvents = async () => {
    try {
      // Fetch pending events
      const { data: pending } = await supabase
        .from('events')
        .select('*, profiles:organizer_id(name)')
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      setPendingEvents(pending || []);

      // Fetch all events
      const { data: all } = await supabase
        .from('events')
        .select('*, profiles:organizer_id(name)')
        .order('created_at', { ascending: false });

      setAllEvents(all || []);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (eventId: string) => {
    try {
      const { error } = await supabase
        .from('events')
        .update({ status: 'approved' })
        .eq('id', eventId);

      if (error) throw error;
      toast.success('Event approved!');
      fetchEvents();
    } catch (error) {
      toast.error('Failed to approve event');
    }
  };

  const handleReject = async (eventId: string) => {
    try {
      const { error } = await supabase
        .from('events')
        .update({ status: 'rejected' })
        .eq('id', eventId);

      if (error) throw error;
      toast.success('Event rejected');
      fetchEvents();
    } catch (error) {
      toast.error('Failed to reject event');
    }
  };

  const handleDelete = async (eventId: string) => {
    if (!confirm('Are you sure you want to delete this event?')) return;

    try {
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', eventId);

      if (error) throw error;
      toast.success('Event deleted');
      fetchEvents();
    } catch (error) {
      toast.error('Failed to delete event');
    }
  };

  const getStatusColor = (status: string) => {
    const colors = {
      pending: 'bg-yellow-500',
      approved: 'bg-green-500',
      rejected: 'bg-red-500'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-500';
  };

  const getCategoryColor = (cat: string) => {
    const colors = {
      hackathon: 'bg-primary text-primary-foreground',
      technical: 'bg-accent text-accent-foreground',
      cultural: 'bg-secondary text-secondary-foreground',
      sports: 'bg-destructive text-destructive-foreground'
    };
    return colors[cat as keyof typeof colors] || 'bg-muted';
  };

  if (checkingProfile) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!profileCompleted) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-accent/10 p-4">
          <div className="text-center max-w-md">
            <h2 className="text-2xl font-bold mb-4">Complete Your Profile</h2>
            <p className="text-muted-foreground mb-6">
              You need to complete your profile before accessing the admin dashboard.
            </p>
            <Button onClick={() => window.location.href = '/profile-complete'}>
              Complete Profile
            </Button>
          </div>
        </div>
      </>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage and approve events</p>
          </div>
          <EventUploadForm onEventCreated={fetchEvents} />
        </div>

        {/* Pending Events Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
            Pending Approvals
            {pendingEvents.length > 0 && (
              <Badge variant="destructive">{pendingEvents.length}</Badge>
            )}
          </h2>

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : pendingEvents.length === 0 ? (
            <div className="text-center py-10 border-2 border-dashed rounded-lg">
              <p className="text-muted-foreground">No pending events</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {pendingEvents.map((event) => (
                <Card key={event.id}>
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row gap-6">
                      {/* Event Image */}
                      <div className="w-full md:w-48 h-48 rounded-lg overflow-hidden bg-gradient-to-br from-primary/20 to-accent/20 flex-shrink-0">
                        {event.poster_url ? (
                          <img 
                            src={event.poster_url} 
                            alt={event.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Calendar className="h-12 w-12 text-muted-foreground opacity-20" />
                          </div>
                        )}
                      </div>

                      {/* Event Details */}
                      <div className="flex-1 space-y-4">
                        <div>
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="text-2xl font-bold">{event.title}</h3>
                            <Badge className={getCategoryColor(event.category)}>
                              {event.category}
                            </Badge>
                          </div>
                          <p className="text-muted-foreground">{event.description}</p>
                        </div>

                        <div className="flex flex-col gap-2 text-sm">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-primary" />
                            <span>{format(new Date(event.event_date), 'PPP')}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-primary" />
                            <span>{event.venue}</span>
                          </div>
                          <p className="text-muted-foreground">
                            Organized by: {event.profiles?.name || 'Unknown'}
                          </p>
                        </div>

                        <div className="flex gap-2">
                          <Button onClick={() => handleApprove(event.id)} className="flex-1">
                            <Check className="h-4 w-4 mr-2" />
                            Approve
                          </Button>
                          <Button 
                            onClick={() => handleReject(event.id)} 
                            variant="destructive"
                            className="flex-1"
                          >
                            <X className="h-4 w-4 mr-2" />
                            Reject
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* All Events Section */}
        <div>
          <h2 className="text-2xl font-semibold mb-6">All Events</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-4">Title</th>
                  <th className="text-left p-4">Category</th>
                  <th className="text-left p-4">Date</th>
                  <th className="text-left p-4">Status</th>
                  <th className="text-left p-4">Organizer</th>
                  <th className="text-left p-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {allEvents.map((event) => (
                  <tr key={event.id} className="border-b hover:bg-muted/50">
                    <td className="p-4 font-medium">{event.title}</td>
                    <td className="p-4">
                      <Badge className={getCategoryColor(event.category)}>
                        {event.category}
                      </Badge>
                    </td>
                    <td className="p-4">{format(new Date(event.event_date), 'PP')}</td>
                    <td className="p-4">
                      <Badge className={`${getStatusColor(event.status)} text-white`}>
                        {event.status}
                      </Badge>
                    </td>
                    <td className="p-4">{event.profiles?.name || 'Unknown'}</td>
                    <td className="p-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(event.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
