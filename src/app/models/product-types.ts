export type ProductCardLayout = 'grid' | 'list' | 'featured';

export type ProductAvailabilityStatus = 'in-stock' | 'low-stock' | 'out-of-stock';

export interface ProductAvailability {
  status: ProductAvailabilityStatus;
  count: number;
  label: string;
}

export function resolveAvailability(count: number): ProductAvailability {
  if (count <= 0) {
    return { status: 'out-of-stock', count: 0, label: 'Out of Stock' };
  }
  if (count <= 3) {
    return { status: 'low-stock', count, label: `Only ${count} left` };
  }
  return { status: 'in-stock', count, label: 'In Stock' };
}
