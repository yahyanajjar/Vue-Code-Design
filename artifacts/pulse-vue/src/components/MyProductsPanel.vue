<template>
  <div v-show="isVisible">
    <div class="border-b border-gray-100 bg-white px-6 py-4">
      <div class="flex flex-wrap items-center gap-3">
        <div class="relative flex-1 min-w-[200px]">
          <Loader2 v-if="isSearchLoading" class="absolute start-3 top-1/2 size-4 -translate-y-1/2 animate-spin text-sky-500" />
          <Search v-else class="absolute start-3 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
          <input
            v-model="query"
            :placeholder="t('searchMyProducts')"
            :dir="isRTL ? 'rtl' : 'ltr'"
            :class="[
              'h-10 w-full rounded-full border border-gray-300 ps-10 pe-4 text-sm focus:border-teal-500 focus:outline-none',
              isRTL ? 'text-right' : 'text-left',
            ]"
          />
        </div>
        <button
          type="button"
          @click="filtersOpen = !filtersOpen"
          :class="[
            'h-10 gap-2 rounded-full border px-4 text-sm whitespace-nowrap inline-flex items-center',
            filtersOpen
              ? 'border-teal-600 bg-teal-50 text-teal-600'
              : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50',
          ]"
        >
          <Filter class="size-4" :stroke-width="2" />
          {{ t("filters") }}
        </button>
      </div>

      <div v-if="filtersOpen" class="mt-2 border-t border-gray-200 pt-2.5">
        <div class="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
          <div>
            <label class="mb-1.5 block text-xs font-medium text-gray-600">
              {{ t("categoryFilter") }}
            </label>
            <div class="relative">
              <select
                v-model="categoryFilter"
                class="w-full appearance-none rounded-full border border-gray-300 bg-white px-4 py-2 pe-10 text-sm text-gray-600 cursor-pointer hover:border-gray-400 focus:border-teal-500 focus:outline-none"
              >
                <option v-for="option in categoryOptions" :key="option" :value="option">
                  {{ option === ALL_CATEGORIES ? t("all") : t(option) }}
                </option>
              </select>
              <ChevronDown class="pointer-events-none absolute end-3 top-1/2 size-4 -translate-y-1/2 text-gray-500" />
            </div>
          </div>

          <div>
            <label class="mb-1.5 block text-xs font-medium text-gray-600">
              {{ t("warehouse") }}
            </label>
            <div class="relative">
              <select
                v-model="warehouseFilter"
                class="w-full appearance-none rounded-full border border-gray-300 bg-white px-4 py-2 pe-10 text-sm text-gray-600 cursor-pointer hover:border-gray-400 focus:border-teal-500 focus:outline-none"
              >
                <option v-for="option in warehouseOptions" :key="option" :value="option">
                  {{ option === ALL_WAREHOUSES ? t("all") : option }}
                </option>
              </select>
              <ChevronDown class="pointer-events-none absolute end-3 top-1/2 size-4 -translate-y-1/2 text-gray-500" />
            </div>
          </div>

          <div>
            <label class="mb-1.5 block text-xs font-medium text-gray-600">
              {{ t("status") }}
            </label>
            <div class="relative">
              <select
                v-model="statusFilter"
                class="w-full appearance-none rounded-full border border-gray-300 bg-white px-4 py-2 pe-10 text-sm text-gray-600 cursor-pointer hover:border-gray-400 focus:border-teal-500 focus:outline-none"
              >
                <option v-for="option in statusOptions" :key="option" :value="option">
                  {{ option === ALL_STATUS ? t("all") : t(option) }}
                </option>
              </select>
              <ChevronDown class="pointer-events-none absolute end-3 top-1/2 size-4 -translate-y-1/2 text-gray-500" />
            </div>
          </div>
        </div>

        <div class="mt-3 flex justify-end gap-2">
          <button
            type="button"
            @click="resetFilters"
            class="h-8 rounded-full border border-gray-300 bg-white px-4 text-sm hover:bg-gray-50"
          >
            {{ t("reset") }}
          </button>
          <button
            type="button"
            @click="filtersOpen = false"
            class="h-8 rounded-full bg-teal-500 text-white px-4 text-sm hover:bg-teal-600"
          >
            {{ t("apply") }}
          </button>
        </div>
      </div>
    </div>

    <div class="max-h-[52vh] overflow-y-auto bg-gray-50 px-6 py-4 sm:max-h-[50vh]">
      <div class="overflow-hidden rounded-2xl border border-gray-200 bg-white">
        <div class="grid grid-cols-[minmax(0,2.2fr)_minmax(0,1fr)_minmax(0,0.9fr)_minmax(0,0.9fr)_minmax(0,1.2fr)_auto] gap-3 border-b border-gray-200 bg-gray-50 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-gray-500">
          <div>{{ t("product") }}</div>
          <div>{{ t("category") }}</div>
          <div>{{ t("currentStock") }}</div>
          <div>{{ t("sellingPrice") }}</div>
          <div>{{ t("warehouseLocation") }}</div>
          <div class="text-end">{{ t("status") }}</div>
        </div>

        <template v-if="isSearchLoading">
          <div
            v-for="i in 6"
            :key="`sk-${i}`"
            class="grid grid-cols-[minmax(0,2.2fr)_minmax(0,1fr)_minmax(0,0.9fr)_minmax(0,0.9fr)_minmax(0,1.2fr)_auto] gap-3 border-b border-gray-100 px-4 py-3 animate-pulse"
          >
            <div class="flex items-start justify-between gap-3">
              <div class="min-w-0 flex-1 space-y-2">
                <div class="h-3 w-20 rounded bg-gray-200" />
                <div class="h-4 w-3/4 rounded bg-gray-200" />
                <div class="h-3 w-1/2 rounded bg-gray-100" />
              </div>
            </div>
            <div class="h-4 w-20 self-center rounded bg-gray-100" />
            <div class="h-4 w-14 self-center rounded bg-gray-100" />
            <div class="h-4 w-14 self-center rounded bg-gray-100" />
            <div class="h-6 w-24 self-center rounded-full bg-gray-100" />
            <div class="h-6 w-16 self-center justify-self-end rounded-full bg-gray-100" />
          </div>
        </template>

        <template v-else>
          <div
            v-for="product in filteredProducts"
            :key="product.code"
            class="border-b border-gray-100 last:border-b-0"
          >
            <button
              type="button"
              @click="!isAlreadyAdded(product.code) && toggleSelection(product.code)"
              :class="[
                'relative grid w-full grid-cols-[minmax(0,2.2fr)_minmax(0,1fr)_minmax(0,0.9fr)_minmax(0,0.9fr)_minmax(0,1.2fr)_auto] gap-3 px-4 py-3 text-start transition-all',
                isAlreadyAdded(product.code)
                  ? 'bg-amber-50/70'
                  : isSelected(product.code)
                    ? 'bg-sky-50'
                    : 'bg-white hover:bg-gray-50',
              ]"
            >
              <div class="flex min-w-0 items-center gap-3">
                <div class="size-11 shrink-0 overflow-hidden rounded-lg border border-gray-200 bg-white flex items-center justify-center text-gray-400">
                  <Package class="size-4" />
                </div>
                <div class="min-w-0">
                  <div class="truncate text-sm font-semibold text-gray-900">
                    {{ language === "ar" ? product.nameAr : product.nameEn }}
                  </div>
                  <div class="mt-0.5 flex items-center gap-2 text-[11px] text-gray-500">
                    <span class="font-semibold text-sky-600">{{ product.code }}</span>
                    <span class="truncate">{{ product.barcode }}</span>
                  </div>
                </div>
              </div>
              <div class="self-center truncate text-xs text-gray-700">{{ t(product.categoryKey) }}</div>
              <div class="self-center text-xs font-medium text-gray-800">
                {{ Number(product.stockQty).toLocaleString("en-GB") }}
              </div>
              <div class="self-center text-xs font-medium text-gray-800">
                {{ t("jod") }} {{ product.sellPrice }}
              </div>
              <div class="flex min-w-0 flex-wrap items-center gap-1.5 self-center">
                <span class="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] text-gray-700">{{ product.warehouseZone }}</span>
                <span class="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] text-gray-700">{{ product.lotBatch }}</span>
              </div>
              <div class="flex items-center justify-end gap-2 self-center">
                <button
                  v-if="getProductWithBatches(product.code) && !isAlreadyAdded(product.code) && isSelected(product.code)"
                  type="button"
                  @click.stop="toggleExpanded(product.code)"
                  :class="[
                    'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-medium transition-colors',
                    isExpanded(product.code)
                      ? 'border-sky-200 bg-sky-100 text-sky-700'
                      : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50',
                  ]"
                  :aria-expanded="isExpanded(product.code)"
                >
                  {{ isExpanded(product.code) ? t("collapse") : t("viewBatches") }}
                  <ChevronUp v-if="isExpanded(product.code)" class="size-3.5" />
                  <ChevronDown v-else class="size-3.5" />
                </button>
                <div v-if="isAlreadyAdded(product.code)" class="inline-flex rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-medium text-amber-700">
                  {{ t("alreadyAdded") }}
                </div>
                <div v-else-if="isSelected(product.code)" class="inline-flex rounded-full border border-sky-200 bg-white px-2 py-0.5 text-[10px] font-medium text-sky-700">
                  {{ t("selectedItems") }}
                </div>
                <div
                  v-if="!isAlreadyAdded(product.code)"
                  :class="[
                    'flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full border px-1',
                    isSelected(product.code)
                      ? 'border-sky-500 bg-sky-500 text-white'
                      : 'border-gray-300 bg-white text-transparent',
                  ]"
                >
                  <Check class="size-3" />
                </div>
              </div>
            </button>

            <div
              v-if="isExpanded(product.code) && getProductWithBatches(product.code)"
              class="border-t border-sky-100 bg-sky-50/40 px-4 py-3"
              @click.stop
            >
              <div class="mb-3 flex items-center justify-between gap-3 rounded-xl border border-sky-100 bg-white/80 px-3 py-2 text-xs">
                <div>
                  <div class="font-semibold text-gray-900">{{ t("selectBatchesOptional") }}</div>
                  <div class="mt-0.5 text-gray-500">{{ t("leaveWithoutBatchesToCreateNew") }}</div>
                </div>
                <div class="rounded-full bg-sky-100 px-2 py-0.5 text-[10px] font-medium text-sky-700">
                  {{ getProductWithBatches(product.code)!.batches.length }} {{ t("batches") }}
                </div>
              </div>
              <div class="space-y-2">
                <button
                  v-for="batch in getProductWithBatches(product.code)!.batches"
                  :key="batch.id"
                  type="button"
                  @click.stop="toggleBatchSelection(product.code, batch.id)"
                  :class="[
                    'grid w-full grid-cols-[minmax(0,1.2fr)_minmax(0,0.9fr)_minmax(0,0.9fr)_minmax(0,0.9fr)_auto] gap-3 rounded-xl border px-3 py-2 text-start transition-all',
                    isBatchSelected(product.code, batch.id)
                      ? 'border-sky-400 bg-sky-50'
                      : 'border-gray-200 bg-white hover:border-sky-300',
                  ]"
                >
                  <div class="min-w-0">
                    <div class="text-xs font-semibold text-gray-900">{{ batch.batchNumber }}</div>
                    <div class="mt-0.5 truncate text-[11px] text-gray-500">
                      {{ t("expiry") }}: {{ batch.expiry }}
                    </div>
                  </div>
                  <div class="self-center text-[11px] text-gray-700">{{ batch.warehouseZone }}</div>
                  <div class="self-center text-[11px] text-gray-700">
                    {{ Number(batch.stockQty).toLocaleString("en-GB") }}
                  </div>
                  <div class="self-center text-[11px] text-gray-700">
                    {{ t("jod") }} {{ batch.sellPrice }}
                  </div>
                  <div
                    :class="[
                      'flex h-5 min-w-5 shrink-0 items-center justify-center justify-self-end rounded-full border px-1',
                      isBatchSelected(product.code, batch.id)
                        ? 'border-sky-500 bg-sky-500 text-white'
                        : 'border-gray-300 bg-white text-transparent',
                    ]"
                  >
                    <Check class="size-3" />
                  </div>
                </button>
              </div>
            </div>
          </div>
        </template>
      </div>

      <div
        v-if="!isSearchLoading && filteredProducts.length === 0"
        class="rounded-2xl border border-gray-200 bg-white p-10 text-center text-sm text-gray-500 mt-3"
      >
        {{ t("noMyProductsFound") }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from "vue";
import {
  Check,
  ChevronDown,
  ChevronUp,
  Filter,
  Loader2,
  Package,
  Search,
} from "lucide-vue-next";
import { useLanguage } from "../composables/useLanguage";
import {
  PHARMACY_INVENTORY_PRODUCTS,
  type ProductStatusKey,
  type ProductCategoryKey,
} from "../data/pharmacyInventorySample";
import { PHARMACY_INVENTORY_PRODUCTS_V2 } from "../data/pharmacyInventoryProducts";
import type { SelectedInventoryProductWithBatches } from "../types/manualStock";

const ALL_CATEGORIES = "all" as const;
const ALL_WAREHOUSES = "all" as const;
const ALL_STATUS = "all" as const;

type CategoryFilter = ProductCategoryKey | typeof ALL_CATEGORIES;
type StatusFilter = ProductStatusKey | typeof ALL_STATUS;

const props = withDefaults(
  defineProps<{
    selectedCodes: string[];
    selectedProducts?: SelectedInventoryProductWithBatches[];
    isVisible?: boolean;
  }>(),
  { isVisible: true },
);

const emit = defineEmits<{
  (e: "selectionChange", products: SelectedInventoryProductWithBatches[]): void;
  (e: "addProducts", products: SelectedInventoryProductWithBatches[]): void;
  (e: "cancel"): void;
}>();

const { t, language } = useLanguage();
const isRTL = computed(() => language.value === "ar");

const query = ref("");
const filtersOpen = ref(false);
const categoryFilter = ref<CategoryFilter>(ALL_CATEGORIES);
const warehouseFilter = ref<string>(ALL_WAREHOUSES);
const statusFilter = ref<StatusFilter>(ALL_STATUS);
const isSearchLoading = ref(false);
const selectedCodesState = ref<string[]>([]);
const expandedCodes = ref<string[]>([]);
const selectedBatchIdsByCode = ref<Record<string, string[]>>({});

const isControlledSelection = computed(
  () => Array.isArray(props.selectedProducts),
);

const categoryOptions = computed<CategoryFilter[]>(() => [
  ALL_CATEGORIES,
  ...Array.from(
    new Set(PHARMACY_INVENTORY_PRODUCTS.map((p) => p.categoryKey)),
  ),
]);

const warehouseOptions = computed<string[]>(() => [
  ALL_WAREHOUSES,
  ...Array.from(
    new Set(PHARMACY_INVENTORY_PRODUCTS.map((p) => p.warehouseZone)),
  ),
]);

const statusOptions = computed<StatusFilter[]>(() => [
  ALL_STATUS,
  ...(Array.from(
    new Set(
      PHARMACY_INVENTORY_PRODUCTS.map((p) => p.statusKey).filter(Boolean),
    ),
  ) as ProductStatusKey[]),
]);

let searchTimer: ReturnType<typeof setTimeout> | null = null;
watch(
  () => query.value,
  () => {
    isSearchLoading.value = true;
    if (searchTimer) clearTimeout(searchTimer);
    searchTimer = setTimeout(() => {
      isSearchLoading.value = false;
    }, 500);
  },
  { immediate: true },
);

watch(
  () => props.selectedProducts,
  (next) => {
    if (!isControlledSelection.value || !next) return;
    selectedCodesState.value = next.map(({ product }) => product.code);
    selectedBatchIdsByCode.value = next.reduce<Record<string, string[]>>(
      (acc, item) => {
        acc[item.product.code] = item.selectedBatchIds;
        return acc;
      },
      {},
    );
  },
  { immediate: true, deep: true },
);

onBeforeUnmount(() => {
  if (searchTimer) clearTimeout(searchTimer);
});

const filteredProducts = computed(() => {
  const q = query.value.trim().toLowerCase();
  return PHARMACY_INVENTORY_PRODUCTS.filter((product) => {
    const matchesCategory =
      categoryFilter.value === ALL_CATEGORIES ||
      product.categoryKey === categoryFilter.value;
    const matchesWarehouse =
      warehouseFilter.value === ALL_WAREHOUSES ||
      product.warehouseZone === warehouseFilter.value;
    const matchesStatus =
      statusFilter.value === ALL_STATUS ||
      product.statusKey === statusFilter.value;
    if (!matchesCategory || !matchesWarehouse || !matchesStatus) return false;
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

function isSelected(code: string) {
  return selectedCodesState.value.includes(code);
}
function isAlreadyAdded(code: string) {
  return props.selectedCodes.includes(code);
}
function isExpanded(code: string) {
  return expandedCodes.value.includes(code);
}
function isBatchSelected(code: string, batchId: string) {
  return (selectedBatchIdsByCode.value[code] ?? []).includes(batchId);
}
function getProductWithBatches(code: string) {
  return PHARMACY_INVENTORY_PRODUCTS_V2.find((p) => p.code === code);
}

function resetFilters() {
  categoryFilter.value = ALL_CATEGORIES;
  warehouseFilter.value = ALL_WAREHOUSES;
  statusFilter.value = ALL_STATUS;
}

function toggleSelection(productCode: string) {
  if (isControlledSelection.value && props.selectedProducts) {
    const product = getProductWithBatches(productCode);
    if (!product) return;
    if (selectedCodesState.value.includes(productCode)) {
      emit(
        "selectionChange",
        props.selectedProducts.filter(
          (item) => item.product.code !== productCode,
        ),
      );
      return;
    }
    emit("selectionChange", [
      ...props.selectedProducts,
      { product, selectedBatchIds: [] },
    ]);
    return;
  }
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
  if (isControlledSelection.value && props.selectedProducts) {
    emit(
      "selectionChange",
      props.selectedProducts.map((item) => {
        if (item.product.code !== productCode) return item;
        const next = item.selectedBatchIds.includes(batchId)
          ? item.selectedBatchIds.filter((id) => id !== batchId)
          : [...item.selectedBatchIds, batchId];
        return { ...item, selectedBatchIds: next };
      }),
    );
    return;
  }
  const existing = selectedBatchIdsByCode.value[productCode] ?? [];
  const next = existing.includes(batchId)
    ? existing.filter((id) => id !== batchId)
    : [...existing, batchId];
  selectedBatchIdsByCode.value = {
    ...selectedBatchIdsByCode.value,
    [productCode]: next,
  };
}

function handleAdd() {
  if (isControlledSelection.value) {
    emit("addProducts", props.selectedProducts ?? []);
    return;
  }
  const selected = PHARMACY_INVENTORY_PRODUCTS_V2.filter((product) =>
    selectedCodesState.value.includes(product.code),
  ).map((product) => ({
    product,
    selectedBatchIds: selectedBatchIdsByCode.value[product.code] ?? [],
  }));
  emit("addProducts", selected);
  selectedCodesState.value = [];
  expandedCodes.value = [];
  selectedBatchIdsByCode.value = {};
  query.value = "";
}

defineExpose({ handleAdd });
</script>
