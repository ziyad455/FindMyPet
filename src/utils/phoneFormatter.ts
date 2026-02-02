/**
 * Formats a Moroccan phone number for display.
 * Input: +212767439353
 * Output: +212 767-439353
 */
export const formatMoroccanPhone = (phone: string): string => {
    // Remove any non-digit characters except the +
    const clean = phone.replace(/[^\d+]/g, '');

    if (!clean.startsWith('+212')) {
        return clean;
    }

    const prefix = '+212';
    const digits = clean.slice(prefix.length);

    if (digits.length === 0) return prefix;

    if (digits.length <= 3) {
        return `${prefix} ${digits}`;
    }

    return `${prefix} ${digits.slice(0, 3)}-${digits.slice(3, 9)}`;
};

/**
 * Cleans a phone number for storage.
 * Input: +212 767-439353
 * Output: +212767439353
 */
export const cleanPhoneForStorage = (phone: string): string => {
    return phone.replace(/[-\s]/g, '');
};
