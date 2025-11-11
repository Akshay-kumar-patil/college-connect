import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';

interface EventCardProps {
  id: string;
  title: string;
  description: string;
  category: string;
  eventDate: string;
  eventTime?: string;
  venue: string;
  posterUrl?: string;
  status?: string;
  registrationLink?: string;
}

export const EventCard = ({ 
  id, 
  title, 
  description, 
  category, 
  eventDate,
  eventTime,
  venue, 
  posterUrl,
  status,
  registrationLink 
}: EventCardProps) => {
  const navigate = useNavigate();

  const handleBannerClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (registrationLink) {
      window.open(registrationLink, '_blank');
    }
  };

  const getCategoryColor = (cat: string) => {
    const colors = {
      hackathon: 'bg-primary text-primary-foreground',
      technical: 'bg-accent text-accent-foreground',
      cultural: 'bg-secondary text-secondary-foreground',
      sports: 'bg-destructive text-destructive-foreground'
    };
    return colors[cat as keyof typeof colors] || 'bg-muted text-muted-foreground';
  };

  return (
    <Card className="overflow-hidden transition-all duration-300 group cursor-pointer border-border hover:border-primary/50" 
          style={{ boxShadow: 'var(--shadow-card)' }}
          onMouseEnter={(e) => e.currentTarget.style.boxShadow = 'var(--shadow-hover)'}
          onMouseLeave={(e) => e.currentTarget.style.boxShadow = 'var(--shadow-card)'}
          onClick={() => navigate(`/event/${id}`)}>
      <div 
        className="relative h-48 overflow-hidden bg-gradient-to-br from-primary/20 to-accent/20 cursor-pointer"
        onClick={handleBannerClick}
        title={registrationLink ? "Click to register" : "View details"}
      >
        {posterUrl ? (
          <>
            <img 
              src={posterUrl} 
              alt={title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
            <Calendar className="h-16 w-16 opacity-20 group-hover:scale-110 group-hover:opacity-40 transition-all duration-300" />
          </div>
        )}
        <Badge className={`absolute top-3 right-3 ${getCategoryColor(category)} transition-transform duration-300 group-hover:scale-105`}>
          {category}
        </Badge>
        {status && status !== 'approved' && (
          <Badge className="absolute top-3 left-3 bg-yellow-500 text-white transition-transform duration-300 group-hover:scale-105">
            {status}
          </Badge>
        )}
      </div>
      
      <div className="p-6">
        <h3 className="font-bold text-xl mb-2 line-clamp-1 group-hover:text-primary transition-colors">
          {title}
        </h3>
        <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
          {description}
        </p>
        
        <div className="flex flex-col gap-2 text-sm text-muted-foreground mb-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>
              {eventDate && !isNaN(new Date(eventDate).getTime()) 
                ? format(new Date(eventDate), 'PPP')
                : 'Date TBA'}
              {eventTime && ` • ${eventTime}`}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            <span>{venue}</span>
          </div>
        </div>

        {registrationLink ? (
          <Button 
            className="w-full" 
            variant="default"
            onClick={(e) => {
              e.stopPropagation();
              window.open(registrationLink, '_blank');
            }}
          >
            Register Now
          </Button>
        ) : (
          <Button className="w-full" variant="default">
            View Details
          </Button>
        )}
      </div>
    </Card>
  );
};
