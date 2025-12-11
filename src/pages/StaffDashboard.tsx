import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Navbar } from '@/components/Navbar';
import { EventCard } from '@/components/EventCard';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { EventUploadForm } from '@/components/EventUploadForm';

const StaffDashboard = () => {
  const { user } = useAuth();
  const [myEvents, setMyEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [profileCompleted, setProfileCompleted] = useState(false);
  const [checkingProfile, setCheckingProfile] = useState(true);

  useEffect(() => {
    if (user) {
      checkProfileCompletion();
      fetchMyEvents();
    }
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

  const fetchMyEvents = async () => {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('organizer_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMyEvents(data || []);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
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
              You need to complete your profile before you can add events.
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
            <h1 className="text-4xl font-bold mb-2">Staff Dashboard</h1>
            <p className="text-muted-foreground">Manage your events</p>
          </div>
          <EventUploadForm onEventCreated={fetchMyEvents} />
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-6">My Events</h2>
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : myEvents.length === 0 ? (
            <div className="text-center py-20 border-2 border-dashed rounded-lg">
              <p className="text-muted-foreground">No events yet. Click "Add Event" to get started!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {myEvents.map((event) => (
                <EventCard
                  key={event.id}
                  id={event.id}
                  title={event.title}
                  description={event.description}
                  category={event.category}
                  eventDate={event.event_date}
                  eventTime={event.event_time}
                  venue={event.venue}
                  posterUrl={event.poster_url}
                  status={event.status}
                  registrationLink={event.registration_link}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StaffDashboard;
