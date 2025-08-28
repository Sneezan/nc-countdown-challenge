export interface CountdownResult {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isExpired: boolean;
  isInThePast: boolean;
}

export function calculateCountdown(targetDate: string): CountdownResult {
  const eventDate = new Date(targetDate);
  const now = new Date();

  const eventStartOfDay = new Date(
    eventDate.getFullYear(),
    eventDate.getMonth(),
    eventDate.getDate(),
  );
  const nowStartOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const distance = eventDate.getTime() - now.getTime();
  const daysDifference = Math.floor(
    (eventStartOfDay.getTime() - nowStartOfDay.getTime()) / (1000 * 60 * 60 * 24),
  );

  // Check if it's today (expired) or in the past
  if (distance <= 0) {
    if (daysDifference === 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true, isInThePast: false };
    } else {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: false, isInThePast: true };
    }
  }

  const days = Math.floor(distance / (1000 * 60 * 60 * 24));
  const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((distance % (1000 * 60)) / 1000);

  return { days, hours, minutes, seconds, isExpired: false, isInThePast: false };
}
