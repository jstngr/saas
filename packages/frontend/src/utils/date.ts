import { format } from "date-fns";

export const formatDate = (date: string | Date): string => {
  return format(new Date(date), "MMM d, yyyy");
};

export const formatDateTime = (date: string | Date): string => {
  return format(new Date(date), "MMM d, yyyy HH:mm");
};

export const formatDateForInput = (date: string | Date): string => {
  return format(new Date(date), "yyyy-MM-dd");
};
