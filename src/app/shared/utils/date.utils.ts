export function formatDateToApi(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

export function parseApiDate(dateString: string): Date {
    const [year, month, day] = dateString.split('-').map(Number);
    return new Date(year, month - 1, day);
}

export function addOneYear(date: Date): Date {
    const result = new Date(date);
    result.setFullYear(result.getFullYear() + 1);
    return result;
}

export function isDateTodayOrFuture(date: Date): boolean {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const compareDate = new Date(date);
    compareDate.setHours(0, 0, 0, 0);
    return compareDate >= today;
}

export function calculateRevisionDate(releaseDate: string): string {
    const release = parseApiDate(releaseDate);
    const revision = addOneYear(release);
    return formatDateToApi(revision);
}