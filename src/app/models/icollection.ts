export interface Icollection {
  id: number;
  user_id: string;
  name: string;
  created_at: string;
}

export interface IcollectionItem {
  id: number;
  collection_id: number;
  product_id: number;
  added_at: string;
}
