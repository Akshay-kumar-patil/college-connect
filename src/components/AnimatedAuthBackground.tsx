import { useState } from 'react';

const motivationalMessages = [
  "Keep learning! 💡",
  "You've got this! 🚀",
  "Dream big! ✨",
  "Stay curious! 🎯",
  "Never stop growing! 🌱",
  "Believe in yourself! 💪",
  "Innovation starts here! 🔥",
  "Your future is bright! 🌟",
];

interface Student {
  id: number;
  x: number;
  y: number;
  duration: number;
  delay: number;
  message: string;
}

const students: Student[] = [
  { id: 1, x: 10, y: 20, duration: 20, delay: 0, message: motivationalMessages[0] },
  { id: 2, x: 75, y: 15, duration: 25, delay: 2, message: motivationalMessages[1] },
  { id: 3, x: 20, y: 70, duration: 22, delay: 4, message: motivationalMessages[2] },
  { id: 4, x: 85, y: 65, duration: 24, delay: 1, message: motivationalMessages[3] },
  { id: 5, x: 45, y: 40, duration: 26, delay: 3, message: motivationalMessages[4] },
  { id: 6, x: 60, y: 80, duration: 23, delay: 5, message: motivationalMessages[5] },
  { id: 7, x: 30, y: 45, duration: 21, delay: 2.5, message: motivationalMessages[6] },
  { id: 8, x: 70, y: 35, duration: 27, delay: 4.5, message: motivationalMessages[7] },
];

export const AnimatedAuthBackground = () => {
  const [hoveredStudent, setHoveredStudent] = useState<number | null>(null);

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-accent/20 to-secondary/20 animate-gradient" />
      
      {/* Floating orbs for extra effect */}
      <div className="absolute top-10 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-float" 
           style={{ animationDelay: '0s' }} />
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-float" 
           style={{ animationDelay: '2s' }} />
      <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-secondary/10 rounded-full blur-3xl animate-float" 
           style={{ animationDelay: '4s' }} />
      
      {/* Animated students */}
      {students.map((student) => (
        <div
          key={student.id}
          className="absolute cursor-pointer group"
          style={{
            left: `${student.x}%`,
            top: `${student.y}%`,
            animation: `float ${student.duration}s ease-in-out infinite`,
            animationDelay: `${student.delay}s`,
          }}
          onMouseEnter={() => setHoveredStudent(student.id)}
          onMouseLeave={() => setHoveredStudent(null)}
        >
          {/* Student avatar */}
          <div className="relative">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent shadow-lg 
                          flex items-center justify-center text-2xl transition-all duration-300
                          group-hover:scale-110 group-hover:shadow-2xl group-hover:from-accent group-hover:to-secondary">
              💻
            </div>
            
            {/* Motivational message tooltip */}
            {hoveredStudent === student.id && (
              <div className="absolute -top-12 left-1/2 -translate-x-1/2 whitespace-nowrap 
                            bg-card/95 backdrop-blur-sm text-foreground px-4 py-2 rounded-lg 
                            shadow-xl border border-primary/20 animate-scale-in">
                <div className="text-sm font-medium">{student.message}</div>
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 
                              bg-card/95 rotate-45 border-r border-b border-primary/20" />
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
