
import { useState, useEffect } from "react";
import { fetchAvailableTimeSlots } from "./utils";

interface TimeSlotsState {
  slots: string[];
  viewingUsers: {[key: string]: number};
  realTimeViewers: number;
  isLoading: boolean;
}

interface UseTimeSlotsProps {
  selectedDate: Date | undefined;
  providerId?: string;
  availableTimeSlots: string[];
}

export const useTimeSlots = ({
  selectedDate,
  providerId,
  availableTimeSlots
}: UseTimeSlotsProps) => {
  const [state, setState] = useState<TimeSlotsState>({
    slots: availableTimeSlots,
    viewingUsers: {},
    realTimeViewers: 0,
    isLoading: false
  });

  // Fetch available time slots for selected date
  useEffect(() => {
    if (!selectedDate || !providerId) return;
    
    const getAvailableSlots = async () => {
      setState(prev => ({ ...prev, isLoading: true }));
      
      const slots = await fetchAvailableTimeSlots(
        providerId,
        selectedDate,
        availableTimeSlots
      );
      
      // Generate viewer counts for a few random slots
      const viewings: {[key: string]: number} = {};
      if (slots.length > 0) {
        const randomSlots = [...slots]
          .sort(() => 0.5 - Math.random())
          .slice(0, Math.min(3, slots.length));
        
        randomSlots.forEach(slot => {
          viewings[slot] = Math.floor(Math.random() * 3) + 1;
        });
      }
      
      setState({
        slots,
        viewingUsers: viewings,
        realTimeViewers: state.realTimeViewers,
        isLoading: false
      });
    };
    
    getAvailableSlots();
  }, [selectedDate, providerId, availableTimeSlots]);
  
  // Simulate real-time viewer counts
  useEffect(() => {
    if (selectedDate) {
      setState(prev => ({
        ...prev,
        realTimeViewers: Math.floor(Math.random() * 5) + 1
      }));
      
      // Update viewer counts periodically
      const interval = setInterval(() => {
        setState(prev => ({
          ...prev,
          realTimeViewers: Math.floor(Math.random() * 5) + 1
        }));
      }, Math.random() * 10000 + 10000);
      
      return () => clearInterval(interval);
    } else {
      setState(prev => ({ ...prev, realTimeViewers: 0 }));
    }
  }, [selectedDate]);

  return {
    ...state,
    hasViewers: Object.values(state.viewingUsers).some(count => count > 0),
    maxViewers: Object.values(state.viewingUsers).length > 0 
      ? Math.max(...Object.values(state.viewingUsers)) 
      : 0
  };
};
