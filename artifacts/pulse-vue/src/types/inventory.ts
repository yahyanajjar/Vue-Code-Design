export type AppPage =
  | "products"
  | "updateStock"
  | "manualUpdateStock"
  | "stockHistoryDetails"
  | "fullProductCreation"
  | "viewProduct";

export type ManualUpdateEntryPoint = "default" | "onboarding" | "createManyProducts";

export interface NavigateOptions {
  manualUpdateEntryPoint?: ManualUpdateEntryPoint;
}
