export function formatMonthYear(dateStr) {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

export function formatPeriod(startDate, endDate, currentlyWorking) {
    const start = formatMonthYear(startDate);
    const end = currentlyWorking ? "Present" : formatMonthYear(endDate);
    return `${start} — ${end}`;
}
