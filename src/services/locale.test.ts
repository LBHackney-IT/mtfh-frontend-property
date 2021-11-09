import locale from './locale';

test('assetType returns for Dwelling', () => {
    expect(locale.assetType('Dwelling')).toBe('Dwelling');
    expect(locale.assetType('LettableNonDwelling')).toBe(
        'Lettable non-dwelling'
    );
    expect(locale.assetType('test')).toBe('test');
});
