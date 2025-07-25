export function calculateTotal(amounts: string): number {
    return amounts.split(/[,\n]+/).reduce((acc, curr) => {
        const value = parseFloat(curr.trim());
        return acc + (isNaN(value) || curr.trim() === '' ? 0 : value);
    }, 0);
}