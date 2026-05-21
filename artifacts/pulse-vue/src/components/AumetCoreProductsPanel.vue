<template>
  <div v-show="isVisible">
    <div class="px-6 py-4 border-b border-gray-100 bg-white">
      <div class="flex flex-wrap items-center gap-3">
        <div class="relative flex-1 min-w-[200px]">
          <Search class="absolute start-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
          <input
            v-model="query"
            :placeholder="t('searchAumetCoreProducts')"
            class="ps-10 pe-10 h-10 w-full rounded-full border border-gray-300 text-sm focus:border-teal-500 focus:outline-none"
          />
          <Loader2
            v-if="isSearchLoading"
            class="absolute end-3 top-1/2 -translate-y-1/2 size-4 text-teal-600 animate-spin"
          />
        </div>
        <button
          type="button"
          @click="filtersOpen = !filtersOpen"
          :class="[
            'h-10 gap-2 rounded-full border px-4 text-sm whitespace-nowrap inline-flex items-center',
            filtersOpen
              ? 'bg-teal-50 border-teal-600 text-teal-600'
              : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50',
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
              <ChevronDown class="absolute end-3 top-1/2 -translate-y-1/2 size-4 text-gray-500 pointer-events-none" />
            </div>
          </div>

          <div>
            <label class="mb-1.5 block text-xs font-medium text-gray-600">
              {{ t("manufacturer") }}
            </label>
            <div class="relative">
              <select
                v-model="manufacturerFilter"
                class="w-full appearance-none rounded-full border border-gray-300 bg-white px-4 py-2 pe-10 text-sm text-gray-600 cursor-pointer hover:border-gray-400 focus:border-teal-500 focus:outline-none"
              >
                <option v-for="option in manufacturerOptions" :key="option" :value="option">
                  {{ option === ALL_MANUFACTURERS ? t("all") : option }}
                </option>
              </select>
              <ChevronDown class="absolute end-3 top-1/2 -translate-y-1/2 size-4 text-gray-500 pointer-events-none" />
            </div>
          </div>

          <div>
            <label class="mb-1.5 block text-xs font-medium text-gray-600">
              {{ t("stockRange") }}
            </label>
            <div class="relative">
              <select
                v-model="stockStatusFilter"
                class="w-full appearance-none rounded-full border border-gray-300 bg-white px-4 py-2 pe-10 text-sm text-gray-600 cursor-pointer hover:border-gray-400 focus:border-teal-500 focus:outline-none"
              >
                <option :value="ALL_STOCK_STATUS">{{ t("all") }}</option>
                <option value="inStock">{{ language === "ar" ? "متوفر" : "In Stock" }}</option>
                <option value="outOfStock">{{ language === "ar" ? "غير متوفر" : "Out of Stock" }}</option>
              </select>
              <ChevronDown class="absolute end-3 top-1/2 -translate-y-1/2 size-4 text-gray-500 pointer-events-none" />
            </div>
          </div>
        </div>

        <div class="mt-3 flex justify-end gap-2">
          <button
            type="button"
            @click="resetFilters"
            class="h-8 px-4 text-sm rounded-full border border-gray-300 bg-white hover:bg-gray-50"
          >
            {{ t("reset") }}
          </button>
          <button
            type="button"
            @click="filtersOpen = false"
            class="bg-teal-500 hover:bg-teal-600 text-white h-8 px-4 text-sm rounded-full"
          >
            {{ t("apply") }}
          </button>
        </div>
      </div>
    </div>

    <div class="max-h-[52vh] overflow-y-auto bg-gray-50 px-6 py-4 sm:max-h-[50vh]">
      <div class="overflow-hidden rounded-2xl border border-gray-200 bg-white">
        <div class="grid grid-cols-[minmax(0,2.4fr)_minmax(0,1.1fr)_minmax(0,1fr)_minmax(0,0.9fr)_minmax(0,0.9fr)_auto] gap-3 border-b border-gray-200 bg-gray-50 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-gray-500">
          <div>{{ t("product") }}</div>
          <div>{{ t("category") }}</div>
          <div>{{ t("manufacturer") }}</div>
          <div>{{ t("avgCostPrice") }}</div>
          <div>{{ t("sellPrice") }}</div>
          <div class="text-end">{{ t("status") }}</div>
        </div>

        <template v-if="isSearchLoading">
          <div
            v-for="i in 6"
            :key="`skeleton-${i}`"
            class="grid grid-cols-[minmax(0,2.4fr)_minmax(0,1.1fr)_minmax(0,1fr)_minmax(0,0.9fr)_minmax(0,0.9fr)_auto] gap-3 border-b border-gray-100 px-4 py-3 animate-pulse"
          >
            <div class="flex items-center gap-3">
              <div class="size-12 rounded-xl bg-gray-200 shrink-0" />
              <div class="flex-1 space-y-2">
                <div class="h-3 w-20 rounded bg-gray-200" />
                <div class="h-4 w-3/4 rounded bg-gray-200" />
                <div class="h-3 w-1/2 rounded bg-gray-100" />
              </div>
            </div>
            <div class="h-4 w-20 self-center rounded bg-gray-100" />
            <div class="h-4 w-24 self-center rounded bg-gray-100" />
            <div class="h-4 w-14 self-center rounded bg-gray-100" />
            <div class="h-4 w-14 self-center rounded bg-gray-100" />
            <div class="h-6 w-16 self-center justify-self-end rounded-full bg-gray-100" />
          </div>
        </template>

        <template v-else>
          <button
            v-for="product in visibleProducts"
            :key="product.id"
            type="button"
            @click="!isAlreadyAdded(product.code) && toggleSelection(product.id)"
            :class="[
              'grid w-full grid-cols-[minmax(0,2.4fr)_minmax(0,1.1fr)_minmax(0,1fr)_minmax(0,0.9fr)_minmax(0,0.9fr)_auto] gap-3 border-b px-4 py-3 text-start transition-all relative',
              isAlreadyAdded(product.code)
                ? 'border-amber-100 bg-amber-50/70'
                : selectedIds.includes(product.id)
                  ? 'border-teal-100 bg-teal-50'
                  : 'border-gray-100 bg-white hover:bg-teal-50/40',
            ]"
          >
            <div class="flex min-w-0 items-center gap-3">
              <div class="size-11 shrink-0 overflow-hidden rounded-lg border border-gray-200 bg-white">
                <img
                  :src="product.imageUrl"
                  :alt="language === 'ar' ? product.nameAr : product.nameEn"
                  class="size-full object-cover"
                  loading="lazy"
                />
              </div>
              <div class="min-w-0">
                <div class="truncate text-sm font-semibold text-gray-900">
                  {{ language === "ar" ? product.nameAr : product.nameEn }}
                </div>
                <div class="mt-0.5 flex items-center gap-2 text-[11px] text-gray-500">
                  <span class="font-semibold text-teal-600">{{ product.code }}</span>
                  <span class="truncate">{{ product.barcode }}</span>
                </div>
              </div>
            </div>
            <div class="self-center truncate text-xs text-gray-700">{{ t(product.categoryKey) }}</div>
            <div class="self-center truncate text-xs text-gray-700">
              {{ language === "ar" ? product.manufacturerAr : product.manufacturerEn }}
            </div>
            <div class="self-center text-xs font-medium text-gray-800">{{ t("jod") }} {{ product.avgCost }}</div>
            <div class="self-center text-xs font-medium text-gray-800">{{ t("jod") }} {{ product.sellPrice }}</div>
            <div class="flex items-center justify-end gap-2 self-center">
              <div v-if="isAlreadyAdded(product.code)" class="inline-flex rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-medium text-amber-700">
                {{ t("alreadyAdded") }}
              </div>
              <div v-else-if="selectedIds.includes(product.id)" class="inline-flex rounded-full bg-teal-100 px-2 py-0.5 text-[10px] font-medium text-teal-700">
                {{ t("selectedItems") }}
              </div>
              <div
                v-if="!isAlreadyAdded(product.code)"
                :class="[
                  'flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full border px-1',
                  selectedIds.includes(product.id)
                    ? 'border-teal-500 bg-teal-500 text-white'
                    : 'border-gray-300 bg-white text-transparent',
                ]"
              >
                <Check class="size-3" />
              </div>
            </div>
          </button>
        </template>
      </div>

      <div
        v-if="!isSearchLoading && filteredProducts.length === 0"
        class="bg-white border border-gray-200 rounded-2xl p-10 text-center text-sm text-gray-500 mt-3"
      >
        {{ t("noAumetCoreProductsFound") }}
      </div>

      <template v-if="!isSearchLoading && filteredProducts.length > 0">
        <div ref="loadMoreRef" class="h-4" />
        <div
          v-if="isLoadingMore"
          class="flex items-center justify-center gap-2 py-4 text-sm text-gray-500"
        >
          <Loader2 class="size-4 animate-spin text-teal-600" />
          {{ t("loadingMoreProducts") }}
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from "vue";
import { Check, ChevronDown, Filter, Loader2, Search } from "lucide-vue-next";
import { useLanguage } from "../composables/useLanguage";
import {
  AUMET_CORE_PRODUCTS,
  type AumetCoreProduct,
} from "../data/aumetCoreProductsSample";
import type { ProductCategoryKey } from "../data/pharmacyInventorySample";

const ALL_CATEGORIES = "all" as const;
const ALL_MANUFACTURERS = "all" as const;
const ALL_STOCK_STATUS = "all" as const;

type CategoryFilter = ProductCategoryKey | typeof ALL_CATEGORIES;
type StockStatusFilter = "inStock" | "outOfStock" | typeof ALL_STOCK_STATUS;

const props = withDefaults(
  defineProps<{
    selectedCodes: string[];
    selectedProducts?: AumetCoreProduct[];
    isVisible?: boolean;
  }>(),
  { isVisible: true },
);

const emit = defineEmits<{
  (e: "selectionChange", products: AumetCoreProduct[]): void;
  (e: "addProducts", products: AumetCoreProduct[]): void;
  (e: "cancel"): void;
}>();

const { t, language } = useLanguage();

const query = ref("");
const filtersOpen = ref(false);
const categoryFilter = ref<CategoryFilter>(ALL_CATEGORIES);
const manufacturerFilter = ref<string>(ALL_MANUFACTURERS);
const stockStatusFilter = ref<StockStatusFilter>(ALL_STOCK_STATUS);
const selectedIds = ref<string[]>([]);
const visibleCount = ref(12);
const isLoadingMore = ref(false);
const isSearchLoading = ref(false);
const loadMoreRef = ref<HTMLDivElement | null>(null);

const isControlledSelection = computed(
  () => Array.isArray(props.selectedProducts),
);

const allProducts = computed(() =>
  Array.from({ length: 10 }, (_, index) =>
    AUMET_CORE_PRODUCTS.map((product) => ({
      ...product,
      id: `${product.id}-${index + 1}`,
      code: `${product.code}-${index + 1}`,
    })),
  ).flat(),
);

const categoryOptions = computed<CategoryFilter[]>(() => [
  ALL_CATEGORIES,
  ...Array.from(
    new Set(allProducts.value.map((product) => product.categoryKey)),
  ),
]);

const manufacturerOptions = computed<string[]>(() => [
  ALL_MANUFACTURERS,
  ...Array.from(
    new Set(
      allProducts.value.map((product) =>
        language.value === "ar" ? product.manufacturerAr : product.manufacturerEn,
      ),
    ),
  ),
]);

const filteredProducts = computed(() => {
  const normalizedQuery = query.value.trim().toLowerCase();
  return allProducts.value.filter((product) => {
    const manufacturerLabel =
      language.value === "ar" ? product.manufacturerAr : product.manufacturerEn;
    const matchesCategory =
      categoryFilter.value === ALL_CATEGORIES ||
      product.categoryKey === categoryFilter.value;
    const matchesManufacturer =
      manufacturerFilter.value === ALL_MANUFACTURERS ||
      manufacturerLabel === manufacturerFilter.value;
    const matchesStockStatus =
      stockStatusFilter.value === ALL_STOCK_STATUS ||
      (stockStatusFilter.value === "inStock"
        ? product.currentStock > 0
        : product.currentStock === 0);
    if (!matchesCategory || !matchesManufacturer || !matchesStockStatus) return false;
    if (!normalizedQuery) return true;
    return [
      product.code,
      product.barcode,
      product.nameEn,
      product.nameAr,
      product.subtitleEn,
      product.subtitleAr,
      product.manufacturerEn,
      product.manufacturerAr,
    ].some((value) => value.toLowerCase().includes(normalizedQuery));
  });
});

const visibleProducts = computed(() =>
  filteredProducts.value.slice(0, visibleCount.value),
);

function isAlreadyAdded(code: string) {
  return props.selectedCodes.includes(code);
}

let searchTimer: ReturnType<typeof setTimeout> | null = null;
watch(
  () => [query.value, categoryFilter.value, manufacturerFilter.value, stockStatusFilter.value],
  () => {
    isSearchLoading.value = true;
    visibleCount.value = 12;
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
    selectedIds.value = next.map((p) => p.id);
  },
  { immediate: true, deep: true },
);

let observer: IntersectionObserver | null = null;
watch(
  [loadMoreRef, isSearchLoading, () => filteredProducts.value.length],
  () => {
    if (observer) {
      observer.disconnect();
      observer = null;
    }
    if (isSearchLoading.value) return;
    const node = loadMoreRef.value;
    if (!node) return;
    observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (
          first?.isIntersecting &&
          !isLoadingMore.value &&
          visibleCount.value < filteredProducts.value.length
        ) {
          isLoadingMore.value = true;
          setTimeout(() => {
            visibleCount.value = Math.min(
              visibleCount.value + 12,
              filteredProducts.value.length,
            );
            isLoadingMore.value = false;
          }, 700);
        }
      },
      { threshold: 0.2 },
    );
    observer.observe(node);
  },
);

onBeforeUnmount(() => {
  if (searchTimer) clearTimeout(searchTimer);
  if (observer) observer.disconnect();
});

function toggleSelection(productId: string) {
  if (isControlledSelection.value && props.selectedProducts) {
    const product = allProducts.value.find((item) => item.id === productId);
    if (!product) return;
    if (selectedIds.value.includes(productId)) {
      emit(
        "selectionChange",
        props.selectedProducts.filter((item) => item.id !== productId),
      );
      return;
    }
    emit("selectionChange", [...props.selectedProducts, product]);
    return;
  }
  if (selectedIds.value.includes(productId)) {
    selectedIds.value = selectedIds.value.filter((id) => id !== productId);
  } else {
    selectedIds.value = [...selectedIds.value, productId];
  }
}

function resetFilters() {
  categoryFilter.value = ALL_CATEGORIES;
  manufacturerFilter.value = ALL_MANUFACTURERS;
  stockStatusFilter.value = ALL_STOCK_STATUS;
}

function handleAdd() {
  if (isControlledSelection.value) {
    emit("addProducts", props.selectedProducts ?? []);
    return;
  }
  const sel = allProducts.value.filter((p) => selectedIds.value.includes(p.id));
  emit("addProducts", sel);
  selectedIds.value = [];
  query.value = "";
}

defineExpose({ handleAdd, selectedIds });
</script>
