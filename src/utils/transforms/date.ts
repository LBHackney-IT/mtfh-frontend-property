import { format, parseISO, isValid, isSameDay, isFuture } from 'date-fns';

const voidDate = new Date('1900-01-01T00:00:00');

export const parseDate = (date: string | null): Date | null => {
    if (!date) return null;
    const parsedDate = parseISO(date);
    return isValid(parsedDate) && !isSameDay(parsedDate, voidDate)
        ? parsedDate
        : null;
};

export const formattedDate = (date: string | null): string => {
    const parsedDate = parseDate(date);
    if (!parsedDate) {
        return '';
    }
    return format(parsedDate, 'dd/MM/yyyy');
};

export const isFutureDate = (date: string | null): boolean => {
    const parsedDate = parseDate(date);

    if (!parsedDate) {
        return true;
    }

    return isFuture(parsedDate);
};
