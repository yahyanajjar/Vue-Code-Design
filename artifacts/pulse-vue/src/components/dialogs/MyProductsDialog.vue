<template>
  <div
    v-if="open"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
    @click.self="handleClose"
  >
    <div class="max-w-[1100px] w-[82vw] max-h-[92vh] bg-white rounded-3xl overflow-hidden flex flex-col">
      <div class="px-6 py-5 border-b border-gray-200">
        <div class="flex items-center gap-3 justify-between">
          <div class="flex items-center gap-3 min-w-0">
            <button
              v-if="onBackToSource"
              type="button"
              @click="onBackToSource"
              class="size-10 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 flex items-center justify-center shrink-0"
              :aria-label="t('backToChooseProductSource')"
            >
              <ArrowRight v-if="language === 'ar'" class="size-4 text-gray-700" />
              <ArrowLeft v-else class="size-4 text-gray-700" />
            </button>
            <div class="size-10 bg-sky-100 rounded-xl flex items-center justify-center">
              <Package2 class="size-5 text-sky-600" :stroke-width="2" />
            </div>
            <div :class="isRTL ? 'text-right' : 'text-left'">
              <h2 class="text-xl font-bold text-gray-900">{{ t("myProducts") }}</h2>
              <p class="text-sm text-gray-500 mt-1">{{ t("myProductsDescription") }}</p>
            </div>
          </div>
        </div>
      </div>

      <div class="px-6 py-4 border-b border-gray-100 bg-white">
        <div class="flex items-center gap-3">
          <div class="relative flex-1">
            <Search class="absolute start-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
            <input
              v-model="query"
              :placeholder="t('searchMyProducts')"
              :dir="isRTL ? 'rtl' : 'ltr'"
              :class="[
                'ps-10 pe-4 h-10 w-full rounded-full border border-gray-300 text-sm focus:border-teal-500 focus:outline-none',
                isRTL ? 'text-right' : 'text-left',
              ]"
            />
          </div>
          <div class="text-sm text-gray-500 whitespace-nowrap">
            {{ selectedCodesState.length }} {{ t("selectedItems") }}
          </div>
        </div>
      </div>

      <div class="flex-1 overflow-y-auto bg-gray-50 px-6 py-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            v-for="product in filteredProducts"
            :key="product.code"
            type="button"
            @click="!isAlreadyAdded(product.code) && toggleSelection(product.code)"
            :class="[
              'w-full text-start rounded-2xl border p-4 transition-all relative block',
              isAlreadyAdded(product.code)
                ? 'border-amber-200 bg-amber-50/70'
                : selectedCodesState.includes(product.code)
                  ? 'border-sky-500 bg-sky-50 shadow-sm'
                  : 'border-gray-200 bg-white hover:border-sky-300 hover:shadow-sm',
            ]"
          >
            <div class="flex items-start justify-between gap-3 mb-3">
              <div class="min-w-0">
                <div class="text-xs font-semibold text-sky-600 mb-1">{{ product.code }}</div>
                <div class="text-sm font-semibold text-gray-900 line-clamp-2">
                  {{ language === "ar" ? product.nameAr : product.nameEn }}
                </div>
                <div class="text-xs text-gray-500 mt-1 line-clamp-2">
                  {{ language === "ar" ? product.subtitleAr : product.subtitleEn }}
                </div>
              </div>
              <div
                v-if="!isAlreadyAdded(product.code)"
                :class="[
                  'min-w-6 h-6 rounded-full border flex items-center justify-center shrink-0 px-1',
                  selectedCodesState.includes(product.code)
                    ? 'border-sky-500 bg-sky-500 text-white'
                    : 'border-gray-300 bg-white text-transparent',
                ]"
              >
                <Check class="size-3.5" />
              </div>
            </div>
            <div class="grid grid-cols-2 gap-3 text-xs">
              <div>
                <div class="text-gray-500">{{ t("barcode") }}</div>
                <div class="font-medium text-gray-800">{{ product.barcode }}</div>
              </div>
              <div>
                <div class="text-gray-500">{{ t("category") }}</div>
                <div class="font-medium text-gray-800">{{ t(product.categoryKey) }}</div>
              </div>
              <div>
                <div class="text-gray-500">{{ t("currentStock") }}</div>
                <div class="font-medium text-gray-800">
                  {{ Number(product.stockQty).toLocaleString("en-GB") }}
                </div>
              </div>
              <div>
                <div class="text-gray-500">{{ t("sellingPrice") }}</div>
                <div class="font-medium text-gray-800">{{ t("jod") }} {{ product.sellPrice }}</div>
              </div>
            </div>

            <div class="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between gap-3 text-xs">
              <div class="flex items-center gap-2 flex-wrap">
                <span class="bg-gray-100 text-gray-700 rounded-full px-2 py-0.5">{{ product.warehouseZone }}</span>
                <span class="bg-gray-100 text-gray-700 rounded-full px-2 py-0.5">{{ product.lotBatch }}</span>
                <span
                  v-if="getProductWithBatches(product.code)"
                  class="bg-sky-100 text-sky-700 rounded-full px-2 py-0.5"
                >
                  {{ getProductWithBatches(product.code)!.batches.length }} {{ t("batches") }}
                </span>
              </div>
              <div class="flex items-center gap-2">
                <button
                  v-if="getProductWithBatches(product.code) && !isAlreadyAdded(product.code) && selectedCodesState.includes(product.code)"
                  type="button"
                  @click.stop="toggleExpanded(product.code)"
                  class="inline-flex items-center gap-1 rounded-full bg-white border border-gray-200 px-2.5 py-1 font-medium text-gray-700 hover:bg-gray-50"
                >
                  {{ t("batches") }}
                  <ChevronUp v-if="expandedCodes.includes(product.code)" class="size-3.5" />
                  <ChevronDown v-else class="size-3.5" />
                </button>
                <div v-if="isAlreadyAdded(product.code)" class="inline-flex rounded-full bg-amber-100 px-2.5 py-1 font-medium text-amber-700">
                  {{ t("alreadyAdded") }}
                </div>
                <div
                  v-else-if="selectedCodesState.includes(product.code)"
                  class="inline-flex rounded-full bg-sky-100 px-2.5 py-1 font-medium text-sky-700"
                >
                  {{
                    (selectedBatchIdsByCode[product.code]?.length ?? 0) > 0
                      ? `${selectedBatchIdsByCode[product.code]!.length} ${t("batches")}`
                      : t("selectedItems")
                  }}
                </div>
              </div>
            </div>

            <div
              v-if="expandedCodes.includes(product.code) && getProductWithBatches(product.code)"
              class="mt-3 rounded-xl border border-sky-100 bg-white p-3 space-y-2"
              @click.stop
            >
              <div class="flex items-center justify-between gap-3 text-xs">
                <div class="font-semibold text-gray-900">{{ t("selectBatchesOptional") }}</div>
                <div class="text-gray-500">{{ t("leaveWithoutBatchesToCreateNew") }}</div>
              </div>

              <button
                v-for="batch in getProductWithBatches(product.code)!.batches"
                :key="batch.id"
                type="button"
                @click.stop="toggleBatchSelection(product.code, batch.id)"
                :class="[
                  'w-full rounded-xl border px-3 py-2 text-start transition-all',
                  isBatchSelected(product.code, batch.id)
                    ? 'border-sky-400 bg-sky-50'
                    : 'border-gray-200 bg-white hover:border-sky-300',
                ]"
              >
                <div class="flex items-center justify-between gap-3">
                  <div class="min-w-0">
                    <div class="text-xs font-semibold text-gray-900">{{ batch.batchNumber }}</div>
                    <div class="text-[11px] text-gray-500 mt-0.5 flex items-center gap-2 flex-wrap">
                      <span>{{ t("expiry") }}: {{ batch.expiry }}</span>
                      <span>{{ t("warehouseLocation") }}: {{ batch.warehouseZone }}</span>
                    </div>
                  </div>
                  <div
                    :class="[
                      'min-w-5 h-5 rounded-full border flex items-center justify-center shrink-0 px-1',
                      isBatchSelected(product.code, batch.id)
                        ? 'border-sky-500 bg-sky-500 text-white'
                        : 'border-gray-300 bg-white text-transparent',
                    ]"
                  >
                    <Check class="size-3" />
                  </div>
                </div>
                <div class="grid grid-cols-3 gap-2 text-[11px] mt-2 text-gray-700">
                  <div>
                    <span class="text-gray-500">{{ t("stockQty") }}: </span>
                    {{ Number(batch.stockQty).toLocaleString("en-GB") }}
                  </div>
                  <div>
                    <span class="text-gray-500">{{ t("cost") }}: </span>{{ batch.avgCost }}
                  </div>
                  <div>
                    <span class="text-gray-500">{{ t("sellingPrice") }}: </span>{{ batch.sellPrice }}
                  </div>
                </div>
              </button>
            </div>
          </button>
        </div>

        <div
          v-if="filteredProducts.length === 0"
          class="bg-white border border-gray-200 rounded-2xl p-10 text-center text-sm text-gray-500 mt-3"
        >
          {{ t("noMyProductsFound") }}
        </div>
      </div>

      <div class="px-6 py-4 border-t border-gray-200 bg-white flex items-center justify-between gap-3">
        <div class="text-sm text-gray-500">{{ t("selectProductsFromInventory") }}</div>
        <div class="flex items-center gap-3 flex-wrap">
          <button
            type="button"
            @click="handleClose"
            class="h-10 px-5 rounded-full border border-gray-300 bg-white text-sm hover:bg-gray-50"
          >
            {{ t("cancel") }}
          </button>
          <button
            type="button"
            @click="handleAdd"
            :disabled="selectedCodesState.length === 0"
            class="h-10 px-5 rounded-full bg-sky-500 text-white text-sm hover:bg-sky-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ t("addSelectedProducts") }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronDown,
  ChevronUp,
  Package2,
  Search,
} from "lucide-vue-next";
import { useLanguage } from "../../composables/useLanguage";
import { PHARMACY_INVENTORY_PRODUCTS } from "../../data/pharmacyInventorySample";
import { PHARMACY_INVENTORY_PRODUCTS_V2 } from "../../data/pharmacyInventoryProducts";
import type { SelectedInventoryProductWithBatches } from "../../types/manualStock";

const props = defineProps<{
  open: boolean;
  selectedCodes: string[];
  onBackToSource?: () => void;
}>();

const emit = defineEmits<{
  (e: "update:open", value: boolean): void;
  (e: "addProducts", products: SelectedInventoryProductWithBatches[]): void;
}>();

const { t, language } = useLanguage();
const isRTL = computed(() => language.value === "ar");

const query = ref("");
const selectedCodesState = ref<string[]>([]);
const expandedCodes = ref<string[]>([]);
const selectedBatchIdsByCode = ref<Record<string, string[]>>({});

const filteredProducts = computed(() => {
  const q = query.value.trim().toLowerCase();
  return PHARMACY_INVENTORY_PRODUCTS.filter((product) => {
    if (!q) return true;
    return [
      product.code,
      product.barcode,
      product.nameEn,
      product.nameAr,
      product.subtitleEn,
      product.subtitleAr,
      product.lotBatch,
      product.warehouseZone,
    ].some((value) => value.toLowerCase().includes(q));
  });
});

function isAlreadyAdded(code: string) {
  return props.selectedCodes.includes(code);
}
function isBatchSelected(code: string, batchId: string) {
  return (selectedBatchIdsByCode.value[code] ?? []).includes(batchId);
}
function getProductWithBatches(code: string) {
  return PHARMACY_INVENTORY_PRODUCTS_V2.find((p) => p.code === code);
}

function toggleSelection(productCode: string) {
  if (selectedCodesState.value.includes(productCode)) {
    selectedCodesState.value = selectedCodesState.value.filter(
      (c) => c !== productCode,
    );
    const next = { ...selectedBatchIdsByCode.value };
    delete next[productCode];
    selectedBatchIdsByCode.value = next;
  } else {
    selectedCodesState.value = [...selectedCodesState.value, productCode];
  }
}

function toggleExpanded(productCode: string) {
  if (expandedCodes.value.includes(productCode)) {
    expandedCodes.value = expandedCodes.value.filter((c) => c !== productCode);
  } else {
    expandedCodes.value = [...expandedCodes.value, productCode];
  }
}

function toggleBatchSelection(productCode: string, batchId: string) {
  const existing = selectedBatchIdsByCode.value[productCode] ?? [];
  const next = existing.includes(batchId)
    ? existing.filter((id) => id !== batchId)
    : [...existing, batchId];
  selectedBatchIdsByCode.value = {
    ...selectedBatchIdsByCode.value,
    [productCode]: next,
  };
}

function resetDialogState() {
  selectedCodesState.value = [];
  expandedCodes.value = [];
  selectedBatchIdsByCode.value = {};
  query.value = "";
}

function handleClose() {
  resetDialogState();
  emit("update:open", false);
}

function handleAdd() {
  const selected = PHARMACY_INVENTORY_PRODUCTS_V2.filter((p) =>
    selectedCodesState.value.includes(p.code),
  ).map((product) => ({
    product,
    selectedBatchIds: selectedBatchIdsByCode.value[product.code] ?? [],
  }));
  emit("addProducts", selected);
  resetDialogState();
  emit("update:open", false);
}
</script>
