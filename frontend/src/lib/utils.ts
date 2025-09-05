import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export const capitalize = (name: string) =>
  name
    .toLowerCase()
    .split(" ")
    .map((n) => n.charAt(0).toUpperCase() + n.slice(1))
    .join(" ");
