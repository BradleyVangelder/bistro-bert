export interface HolidayClosing {
  start: string; // ISO date string (YYYY-MM-DD)
  end: string; // ISO date string (YYYY-MM-DD)
  reopenDate: string; // ISO date string (YYYY-MM-DD)
  message: string; // Display message on banner
}

export const holidayClosings: HolidayClosing[] = [
  {
    start: '2025-12-23',
    end: '2025-12-26',
    reopenDate: '2025-12-27',
    message: 'Kerstvakantie'
  },
  {
    start: '2026-01-01',
    end: '2026-01-02',
    reopenDate: '2026-01-03',
    message: 'Nieuwjaarsvakantie'
  },
];

/**
 * Check if current date falls within any holiday closing period
 * @returns The holiday closing period if currently closed, otherwise null
 */
export function getCurrentHolidayClosing(): HolidayClosing | null {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (const closing of holidayClosings) {
    const startDate = new Date(closing.start);
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date(closing.end);
    endDate.setHours(23, 59, 59, 999);

    if (today >= startDate && today <= endDate) {
      return closing;
    }
  }

  return null;
}
