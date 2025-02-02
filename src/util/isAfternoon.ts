export function isAfternoon(): boolean {
  const currentHour = new Date().getHours();
  return currentHour >= 12;
}