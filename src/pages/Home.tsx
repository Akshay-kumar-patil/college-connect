import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Navbar } from '@/components/Navbar';
import { EventCard } from '@/components/EventCard';
import { Button } from '@/components/ui/button';
import { Filter } from 'lucide-react';
import heroImage from '@/assets/campus-hero.jpg';

type EventCategory = 'all' | 'hackathon' | 'technical' | 'cultural' | 'sports';

const Home = () => {
  const [events, setEvents] = useState<any[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<EventCategory>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    if (selectedCategory === 'all') {
      setFilteredEvents(events);
    } else {
      setFilteredEvents(events.filter(e => e.category === selectedCategory));
    }
  }, [selectedCategory, events]);

  const fetchEvents = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      let query = supabase
        .from('events')
        .select('*');
      
      // Show only approved events to non-authenticated users
      if (!user) {
        query = query.eq('status', 'approved');
      }
      
      const { data, error } = await query.order('event_date', { ascending: true });

      if (error) throw error;
      setEvents(data || []);
      setFilteredEvents(data || []);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const categories: { value: EventCategory; label: string; color: string }[] = [
    { value: 'all', label: 'All Events', color: 'bg-primary' },
    { value: 'hackathon', label: 'Hackathons', color: 'bg-primary' },
    { value: 'technical', label: 'Technical', color: 'bg-accent' },
    { value: 'cultural', label: 'Cultural', color: 'bg-secondary' },
    { value: 'sports', label: 'Sports', color: 'bg-destructive' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center justify-center text-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-background z-10" />
        <img 
          src={heroImage} 
          alt="Campus Buildings" 
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        <div className="relative z-20 container mx-auto px-4 text-white">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in drop-shadow-2xl">
            Discover Campus Events
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto animate-fade-in drop-shadow-lg">
            Join hackathons, workshops, cultural fests, and sports competitions at your college
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="bg-card border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-2 flex-wrap">
            <Filter className="h-5 w-5 text-muted-foreground" />
            <span className="text-sm font-medium mr-2">Filter by:</span>
            {categories.map((cat) => (
              <Button
                key={cat.value}
                variant={selectedCategory === cat.value ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(cat.value)}
                className="transition-all"
              >
                {cat.label}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Events Grid */}
      <section className="container mx-auto px-4 py-12">
        {loading ? (
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-muted-foreground text-lg">
              No events found in this category.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event) => (
              <EventCard
                key={event.id}
                id={event.id}
                title={event.title}
                description={event.description}
                category={event.category}
                eventDate={event.event_date}
                venue={event.venue}
                posterUrl={event.poster_url}
                registrationLink={event.registration_link}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;
