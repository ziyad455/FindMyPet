export interface Country {
    name: string;
    code: string;
    flag: string;
    pattern?: string; // Optional regex for validation
    placeholder?: string;
}

export const countries: Country[] = [
    { name: 'Morocco', code: '+212', flag: '🇲🇦', placeholder: '767-439353' },
    { name: 'France', code: '+33', flag: '🇫🇷', placeholder: '6 12 34 56 78' },
    { name: 'United States', code: '+1', flag: '🇺🇸', placeholder: '(555) 000-0000' },
    { name: 'Spain', code: '+34', flag: '🇪🇸', placeholder: '600 000 000' },
    { name: 'United Kingdom', code: '+44', flag: '🇬🇧', placeholder: '7123 456789' },
    { name: 'United Arab Emirates', code: '+971', flag: '🇦🇪', placeholder: '50 123 4567' },
    { name: 'Saudi Arabia', code: '+966', flag: '🇸🇦', placeholder: '50 123 4567' },
    { name: 'Germany', code: '+49', flag: '🇩🇪', placeholder: '151 12345678' },
    { name: 'Italy', code: '+39', flag: '🇮🇹', placeholder: '312 345 6789' },
    { name: 'Canada', code: '+1', flag: '🇨🇦', placeholder: '(555) 000-0000' },
];
