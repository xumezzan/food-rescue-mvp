
export function formatCurrency(amount) {
    // Uzbek Sum formatting
    return new Intl.NumberFormat('uz-UZ', {
        style: 'currency',
        currency: 'UZS',
        maximumFractionDigits: 0
    }).format(amount);
}

export function calculateDiscount(price, original) {
    if (!original || original <= price) return 0;
    return Math.round(((original - price) / original) * 100);
}

export function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}
