
import { AppointmentType } from "../types";

export const getAppointmentColor = (type: AppointmentType["type"], status?: AppointmentType["status"]) => {
  switch (type) {
    case "scheduled":
      if (status === "completed") return "bg-gray-100 border-gray-200";
      if (status === "pending") return "bg-amber-50 border-amber-200";
      return "bg-blue-50 border-blue-200";
    case "free": 
      return "bg-green-50 border-green-200";
    case "buffer":
      return "bg-purple-50 border-purple-200";
    case "blocked":
      return "bg-gray-50 border-gray-200";
    default:
      return "bg-gray-50 border-gray-200";
  }
};
