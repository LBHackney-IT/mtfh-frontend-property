import { format, parseISO } from 'date-fns';

export const formatISO = (value: string): string => {
    if (value === '1900-01-01' || !value) {
        return '';
    }
    return format(parseISO(value), 'dd/MM/yyyy');
};
