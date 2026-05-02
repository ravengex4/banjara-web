import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function formatDate(dateStr) {
  if (!dateStr) return '';
  const [y, m, d] = dateStr.split('-');
  if (!y || !m || !d) return dateStr;
  return `${d}/${m}/${y}`;
}

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
