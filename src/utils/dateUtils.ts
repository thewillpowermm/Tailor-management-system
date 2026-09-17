export interface DaysLeftResult {
  text: string;
  diffDays: number;
  isToday: boolean;
  isPast: boolean;
  isUrgent: boolean; // Today, tomorrow, or overdue
}

export function getDaysLeft(dateStr?: string): DaysLeftResult | null {
  if (!dateStr) return null;

  try {
    const target = new Date(dateStr);
    if (isNaN(target.getTime())) return null;

    // Normalize to midnight
    const targetDate = new Date(target.getFullYear(), target.getMonth(), target.getDate());
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const diffTime = targetDate.getTime() - today.getTime();
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return { text: 'Today!', diffDays: 0, isToday: true, isPast: false, isUrgent: true };
    } else if (diffDays === 1) {
      return { text: 'Tomorrow (1 day)', diffDays: 1, isToday: false, isPast: false, isUrgent: true };
    } else if (diffDays > 1) {
      return { text: `In ${diffDays} days`, diffDays, isToday: false, isPast: false, isUrgent: diffDays <= 3 };
    } else if (diffDays === -1) {
      return { text: 'Yesterday (Overdue)', diffDays: -1, isToday: false, isPast: true, isUrgent: true };
    } else {
      return { text: `${Math.abs(diffDays)} days overdue`, diffDays, isToday: false, isPast: true, isUrgent: true };
    }
  } catch (e) {
    return null;
  }
}
