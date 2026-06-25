// Auth
export type { UserRole, AuthState } from './user.model';
export { getUserRole } from './user.model';

// Core
export type { Iproduct } from './iproduct';
export type { Icategory } from './icategory';

// User
export type { Ireview } from './ireview';
export type { Iprofile } from './iprofile';

// Orders
export type { Iorder, IorderItem } from './iorder';

// Cart
export type { Icart, IcartItem } from './icart';

// Collections
export type { Icollection, IcollectionItem } from './icollection';

// Aggregated types
import type { Iproduct } from './iproduct';
import type { Icategory } from './icategory';

export type ProductWithCategory = Iproduct & {
  categories: Icategory | null;
};
