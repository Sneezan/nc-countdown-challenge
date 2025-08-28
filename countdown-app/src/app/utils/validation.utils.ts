export function isValidTitle(title: string): boolean {
  return Boolean(title && title.trim().length > 0);
}

export function isValidDate(date: string): boolean {
  if (!date) return false;

  const dateObj = new Date(date);
  return !isNaN(dateObj.getTime()) && dateObj > new Date();
}

export function isFormValid(title: string, date: string): boolean {
  return isValidTitle(title) && isValidDate(date);
}
