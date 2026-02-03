import { countries } from '../constants/countries';

/**
 * Formats a phone number for display.
 * Input: +212767439353, countryCode: +212
 * Output: +212 767-439353
 */
export const formatPhone = (phone: string, countryCode: string = '+212'): string => {
    // Remove any non-digit characters except the +
    const clean = phone.replace(/[^\d+]/g, '');

    if (!clean.startsWith(countryCode)) {
        return clean;
    }

    const digits = clean.slice(countryCode.length);

    if (digits.length === 0) return countryCode;

    // Apply Morocco-specific formatting if it's Morocco
    if (countryCode === '+212') {
        if (digits.length <= 3) {
            return `${countryCode} ${digits}`;
        }
        return `${countryCode} ${digits.slice(0, 3)}-${digits.slice(3, 9)}`;
    }

    // Generic formatting for other countries (just a space after code)
    return `${countryCode} ${digits}`;
};

/**
 * Formats a phone number by automatically detecting the country code.
 */
export const formatAnyPhone = (phone: string): string => {
    const clean = phone.replace(/[^\d+]/g, '');
    const foundCountry = countries.find(c => clean.startsWith(c.code));

    return formatPhone(clean, foundCountry?.code || '+212');
};

/**
 * Legacy support/Shorthand for Moroccan phone formatting
 */
export const formatMoroccanPhone = (phone: string): string => {
    return formatPhone(phone, '+212');
};

/**
 * Cleans a phone number for storage.
 * Input: +212 767-439353
 * Output: +212767439353
 */
export const cleanPhoneForStorage = (phone: string): string => {
    return phone.replace(/[-\s]/g, '');
};
