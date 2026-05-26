import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getColorByStatus(status: string) {
  if (status === "active") return "bg-gray-400";
  else return "bg-green-600";
}
