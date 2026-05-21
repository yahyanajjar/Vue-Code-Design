export type ProductStatusKey =
  | "productStatusExpiringSoon"
  | "productStatusExpired"
  | "productStatusLowStock"
  | "productStatusOutOfStock"
  | "";

export type ProductCategoryKey =
  | "categoryGastrointestinal"
  | "categoryAntibiotic"
  | "categoryCardiovascular"
  | "categoryVitamins"
  | "categoryOtc"
  | "categoryDiabetes"
  | "categoryDermatology"
  | "categoryAnalgesic";

export type StatusColor = "red" | "yellow" | "orange" | "";
export type AumetReferenceStatus = "linked" | "notLinked";

export interface InventoryBatch {
  id: string;
  batchNumber: string;
  expiry: string;
  warehouseZone: string;
  stockQty: string;
  avgCost: string;
  sellPrice: string;
}

export interface InventoryProduct {
  id: string;
  code: string;
  imageUrl?: string;
  nameEn: string;
  nameAr: string;
  subtitleEn: string;
  subtitleAr: string;
  barcode: string;
  categoryKey: ProductCategoryKey;
  aumetReferenceStatus: AumetReferenceStatus;
  lastSaleAmount: string;
  tax: string;
  statusKey: ProductStatusKey;
  statusColor: StatusColor;
  batches: InventoryBatch[];
}
