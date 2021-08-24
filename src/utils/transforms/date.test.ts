import { formattedDate, isFutureDate } from './date';

test('formatted date parses correctly', () => {
    expect(formattedDate('1900-01-01')).toBe('');
    expect(formattedDate('2000-01-01')).toBe('01/01/2000');
    expect(formattedDate(null)).toBe('');
});

test('is future date', () => {
    expect(isFutureDate('1900-01-01')).toBe(true);
    expect(isFutureDate(null)).toBe(true);
    expect(isFutureDate('2100-01-02')).toBe(true);
});
