import type { IorderItem } from '../db/iorder';

/** Human-readable labels for order status values. */
export const ORDER_STATUS_DISPLAY: Record<string, string> = {
  paid: 'Paid',
  cancelled: 'Cancelled',
  refunded: 'Refunded',
};

/**
 * Order item with embedded product data.
 * Used by OrderService.getOrderItems() for order detail views.
 */
export interface IorderItemWithProduct extends IorderItem {
  products: {
    id: number;
    name: string;
    image_url: string;
  } | null;
}
