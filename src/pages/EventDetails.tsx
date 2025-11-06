import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Navbar } from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, ExternalLink, ArrowLeft } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) fetchEvent();
  }, [id]);

  const fetchEvent = async () => {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      setEvent(data);
    } catch (error) {
      console.error('Error fetching event:', error);
      toast.error('Failed to load event details');
    } finally {
      setLoading(false);
    }
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

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-20 text-center">
          <p className="text-muted-foreground text-lg">Event not found</p>
          <Button onClick={() => navigate('/')} className="mt-4">
            Go Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Event Image */}
          <div className="relative rounded-lg overflow-hidden" style={{ boxShadow: 'var(--shadow-card)' }}>
            {event.poster_url ? (
              <img 
                src={event.poster_url} 
                alt={event.title}
                className="w-full h-full object-cover min-h-[400px]"
              />
            ) : (
              <div className="w-full h-[400px] bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                <Calendar className="h-24 w-24 text-muted-foreground opacity-20" />
              </div>
            )}
          </div>

          {/* Event Details */}
          <div className="space-y-6">
            <div>
              <Badge className={`${getCategoryColor(event.category)} mb-4`}>
                {event.category}
              </Badge>
              <h1 className="text-4xl font-bold mb-4">{event.title}</h1>
              <p className="text-muted-foreground text-lg leading-relaxed">
                {event.description}
              </p>
            </div>

            <div className="space-y-4 py-6 border-y">
              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-primary mt-1" />
                <div>
                  <p className="font-medium">Date & Time</p>
                  <p className="text-muted-foreground">
                    {event.event_date && !isNaN(new Date(event.event_date).getTime())
                      ? format(new Date(event.event_date), 'PPP')
                      : 'Date TBA'}
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-primary mt-1" />
                <div>
                  <p className="font-medium">Venue</p>
                  <p className="text-muted-foreground">{event.venue}</p>
                </div>
              </div>
            </div>

            {event.registration_link && (
              <Button 
                className="w-full" 
                size="lg"
                onClick={() => window.open(event.registration_link, '_blank')}
              >
                Register Now
                <ExternalLink className="h-4 w-4 ml-2" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;
