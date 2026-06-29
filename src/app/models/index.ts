// ─── DB Models (match Supabase schema) ──────────────────────────
export type { UserRole } from './db/user.model';
export { getUserRole } from './db/user.model';
export type { Iproduct } from './db/iproduct';
export type { Icategory } from './db/icategory';
export type { IcartItem } from './db/icart';
export type { Iorder, IorderItem } from './db/iorder';
export type { Icollection, IcollectionItem } from './db/icollection';
export type { Iprofile } from './db/iprofile';
export type { Ireview } from './db/ireview';

// ─── Frontend Models (composed/derived types) ───────────────────
export type { AuthState } from './frontend/auth';
export type { ProductWithCategory, ProductFilters, PaginatedResult } from './frontend/product';
export type {
  CartItemWithProduct,
  LocalStorageCartItem,
  CartMergeDecision,
  MergeData,
  MergeItem,
  MergeChoices,
} from './frontend/cart';
