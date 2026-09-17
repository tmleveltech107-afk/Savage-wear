import { Product } from '../types';

/**
 * Returns the price in PKR for a product.
 * If product has pkrPrice defined, returns that.
 * Otherwise converts standard USD price to a realistic PKR tier (e.g. 3,490, 4,990).
 */
export function getProductPKRPrice(product: Product): number {
  if (product.pkrPrice) {
    return product.pkrPrice;
  }
  // Mapped luxury high-street PKR tiers matching Pakistani flagship stores (Lama, Outfitters, etc.)
  const baseTiers: Record<string, number> = {
    'sw-jeans-brown': 3490,
    'sw-01': 3990,
    'sw-02': 4990,
    'sw-03': 3690,
    'sw-04': 2990,
    'sw-05': 2990,
    'sw-06': 5490,
    'sw-07': 5990,
    'sw-08': 3490,
  };

  if (baseTiers[product.id]) {
    return baseTiers[product.id];
  }

  // Fallback realistic tier ending in 90 or 50
  const estimated = Math.round((product.price * 28) / 100) * 100 - 10;
  return Math.max(2490, estimated);
}

/**
 * Formats a number to "PKR 3,490"
 */
export function formatPKR(amount: number): string {
  return `PKR ${amount.toLocaleString('en-US')}`;
}

/**
 * Formats installment amount to "Rs. 1,163"
 */
export function formatInstallmentRs(totalPKR: number, installments: number = 3): string {
  const perInstallment = Math.round(totalPKR / installments);
  return `Rs. ${perInstallment.toLocaleString('en-US')}`;
}
