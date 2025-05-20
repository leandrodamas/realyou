
import { isSameDay } from "date-fns";

/**
 * Checks if a date is in the specified array of dates
 */
export const isDateInArray = (date: Date, dateArray: Date[]) => {
  return dateArray.some(availableDate => 
    isSameDay(availableDate, date)
  );
};

/**
 * Returns default dates for a fallback when API fails
 */
export const getDefaultDates = (startDate: Date) => {
  const dates: Date[] = [];
  for (let i = 1; i <= 14; i++) {
    if (i % 3 !== 0) { // Skip every third day
      dates.push(new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate() + i));
    }
  }
  return dates;
};
