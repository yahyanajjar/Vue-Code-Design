import type {
  InventoryProduct,
  ProductCategoryKey,
} from "../data/inventoryModels";
import type { AumetCoreProduct } from "../data/aumetCoreProductsSample";

export interface ManualCustomProductInput {
  productCode: string;
  productNameEn: string;
  productNameAr: string;
  barcode: string;
  categoryKey: ProductCategoryKey;
  currentStock: string;
  avgCost: string;
  sellPrice: string;
}

export interface SelectedInventoryProductWithBatches {
  product: InventoryProduct;
  selectedBatchIds: string[];
}

export type AddProductSource = "core" | "inventory" | "custom";

export type { AumetCoreProduct, InventoryProduct, ProductCategoryKey };
