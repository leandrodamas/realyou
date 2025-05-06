
import { addDays, isSameDay } from "date-fns";
import { TimelineDay, TimelineDayAppointment } from "./types";

export const generateMockAppointmentsData = (weekDates: Date[]): TimelineDay[] => {
  // Mock appointments data - in a real app, this would come from an API
  const mockAppointmentsData: TimelineDay[] = weekDates.map(date => {
    // Generate different appointments for each day
    const dayAppointments: TimelineDayAppointment[] = [];
    
    // Working hours from 8 AM to 6 PM
    const workHours = [...Array(10)].map((_, i) => `${8 + i}:00`);
    
    // For demonstration, create different appointment types
    workHours.forEach(time => {
      // Randomly determine if this slot has an appointment
      const rand = Math.random();
      
      if (rand < 0.3) {
        // 30% chance of scheduled appointment
        dayAppointments.push({
          id: `appt-${date.toISOString()}-${time}`,
          title: "Consultoria de Software",
          time,
          duration: 60,
          clientName: rand < 0.15 ? "Maria Silva" : "João Santos",
          clientImage: rand < 0.15 
            ? "https://randomuser.me/api/portraits/women/33.jpg" 
            : "https://randomuser.me/api/portraits/men/54.jpg",
          type: "scheduled",
          status: rand < 0.1 ? "completed" : (rand < 0.2 ? "confirmed" : "pending"),
          location: rand < 0.15 ? "in-person" : "online",
          price: Math.floor(rand * 50) + 150
        });
      } else if (rand < 0.4) {
        // 10% chance of blocked time
        dayAppointments.push({
          id: `blocked-${date.toISOString()}-${time}`,
          title: "Indisponível",
          time,
          duration: 60,
          type: "blocked"
        });
      } else if (rand < 0.5) {
        // 10% chance of buffer time
        dayAppointments.push({
          id: `buffer-${date.toISOString()}-${time}`,
          title: "Intervalo",
          time,
          duration: 60,
          type: "buffer"
        });
      } else {
        // 50% chance of free time slot
        dayAppointments.push({
          id: `free-${date.toISOString()}-${time}`,
          title: "Disponível",
          time,
          duration: 60,
          type: "free"
        });
      }
    });
    
    return {
      date,
      appointments: dayAppointments
    };
  });
  
  return mockAppointmentsData;
};

export const getDayAppointments = (date: Date, mockAppointmentsData: TimelineDay[]) => {
  return mockAppointmentsData.find(day => isSameDay(day.date, date))?.appointments || [];
};
