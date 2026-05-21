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
            <div class="size-10 bg-teal-100 rounded-xl flex items-center justify-center shrink-0">
              <Package2 class="size-5 text-teal-600" :stroke-width="2" />
            </div>
            <div>
              <h2 class="text-xl font-bold text-gray-900">{{ t("aumetCoreProducts") }}</h2>
              <p class="text-sm text-gray-500 mt-1">{{ t("aumetCoreProductsDescription") }}</p>
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
              :placeholder="t('searchAumetCoreProducts')"
              class="ps-10 pe-10 h-10 w-full rounded-full border border-gray-300 text-sm focus:border-teal-500 focus:outline-none"
            />
            <Loader2 v-if="isSearchLoading" class="absolute end-3 top-1/2 -translate-y-1/2 size-4 text-teal-600 animate-spin" />
          </div>
          <div class="text-sm text-gray-500 whitespace-nowrap">
            {{ selectedIds.length }} {{ t("selectedItems") }}
          </div>
        </div>
      </div>

      <div class="flex-1 overflow-y-auto bg-gray-50 px-6 py-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <template v-if="isSearchLoading">
            <div
              v-for="i in 6"
              :key="`sk-${i}`"
              class="rounded-2xl border border-gray-200 bg-white p-4 animate-pulse"
            >
              <div class="flex items-start gap-3 mb-3">
                <div class="size-16 rounded-2xl bg-gray-200 shrink-0" />
                <div class="flex-1 space-y-2">
                  <div class="h-3 w-20 rounded bg-gray-200" />
                  <div class="h-4 w-3/4 rounded bg-gray-200" />
                  <div class="h-3 w-full rounded bg-gray-100" />
                </div>
              </div>
            </div>
          </template>

          <template v-else>
            <button
              v-for="product in visibleProducts"
              :key="product.id"
              type="button"
              @click="!isAlreadyAdded(product.code) && toggleSelection(product.id)"
              :class="[
                'w-full text-start rounded-2xl border p-4 transition-all relative',
                isAlreadyAdded(product.code)
                  ? 'border-amber-200 bg-amber-50/70'
                  : selectedIds.includes(product.id)
                    ? 'border-teal-500 bg-teal-50 shadow-sm'
                    : 'border-gray-200 bg-white hover:border-teal-300 hover:shadow-sm',
              ]"
            >
              <div class="flex items-start justify-between gap-3 mb-3">
                <div class="flex items-start gap-3 min-w-0">
                  <div class="size-16 rounded-2xl border border-gray-200 bg-white overflow-hidden shrink-0">
                    <img
                      :src="product.imageUrl"
                      :alt="language === 'ar' ? product.nameAr : product.nameEn"
                      class="size-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <div class="min-w-0">
                    <div class="text-xs font-semibold text-teal-600 mb-1">{{ product.code }}</div>
                    <div class="text-sm font-semibold text-gray-900 line-clamp-2">
                      {{ language === "ar" ? product.nameAr : product.nameEn }}
                    </div>
                    <div class="text-xs text-gray-500 mt-1 line-clamp-2">
                      {{ language === "ar" ? product.subtitleAr : product.subtitleEn }}
                    </div>
                  </div>
                </div>
                <div
                  v-if="!isAlreadyAdded(product.code)"
                  :class="[
                    'min-w-6 h-6 rounded-full border flex items-center justify-center shrink-0 px-1',
                    selectedIds.includes(product.id)
                      ? 'border-teal-500 bg-teal-500 text-white'
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
                  <div class="text-gray-500">{{ t("avgCostPrice") }}</div>
                  <div class="font-medium text-gray-800">{{ t("jod") }} {{ product.avgCost }}</div>
                </div>
                <div>
                  <div class="text-gray-500">{{ t("sellPrice") }}</div>
                  <div class="font-medium text-gray-800">{{ t("jod") }} {{ product.sellPrice }}</div>
                </div>
              </div>
              <div class="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between gap-3 text-xs">
                <div class="text-gray-500">
                  {{ t("manufacturer") }}: {{ language === "ar" ? product.manufacturerAr : product.manufacturerEn }}
                </div>
                <div v-if="isAlreadyAdded(product.code)" class="inline-flex rounded-full bg-amber-100 px-2.5 py-1 font-medium text-amber-700">
                  {{ t("alreadyAdded") }}
                </div>
                <div v-else-if="selectedIds.includes(product.id)" class="inline-flex rounded-full bg-teal-100 px-2.5 py-1 font-medium text-teal-700">
                  {{ t("selectedItems") }}
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
          <div v-if="isLoadingMore" class="flex items-center justify-center gap-2 py-4 text-sm text-gray-500">
            <Loader2 class="size-4 animate-spin text-teal-600" />
            {{ t("loadingMoreProducts") }}
          </div>
        </template>
      </div>

      <div class="px-6 py-4 border-t border-gray-200 bg-white flex items-center justify-between gap-3">
        <div class="text-sm text-gray-500">{{ t("selectProductsToAddToManualStock") }}</div>
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
            :disabled="selectedIds.length === 0"
            class="h-10 px-5 rounded-full bg-teal-500 text-white text-sm hover:bg-teal-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ t("addSelectedProducts") }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from "vue";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Loader2,
  Package2,
  Search,
} from "lucide-vue-next";
import { useLanguage } from "../../composables/useLanguage";
import {
  AUMET_CORE_PRODUCTS,
  type AumetCoreProduct,
} from "../../data/aumetCoreProductsSample";

const props = defineProps<{
  open: boolean;
  selectedCodes: string[];
  onBackToSource?: () => void;
}>();

const emit = defineEmits<{
  (e: "update:open", value: boolean): void;
  (e: "addProducts", products: AumetCoreProduct[]): void;
}>();

const { t, language } = useLanguage();

const query = ref("");
const selectedIds = ref<string[]>([]);
const visibleCount = ref(12);
const isLoadingMore = ref(false);
const isSearchLoading = ref(false);
const loadMoreRef = ref<HTMLDivElement | null>(null);

const allProducts = computed(() =>
  Array.from({ length: 10 }, (_, index) =>
    AUMET_CORE_PRODUCTS.map((product) => ({
      ...product,
      id: `${product.id}-${index + 1}`,
      code: `${product.code}-${index + 1}`,
    })),
  ).flat(),
);

const filteredProducts = computed(() => {
  const q = query.value.trim().toLowerCase();
  return allProducts.value.filter((product) => {
    if (!q) return true;
    return [
      product.code,
      product.barcode,
      product.nameEn,
      product.nameAr,
      product.subtitleEn,
      product.subtitleAr,
      product.manufacturerEn,
      product.manufacturerAr,
    ].some((value) => value.toLowerCase().includes(q));
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
  () => query.value,
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
  if (selectedIds.value.includes(productId)) {
    selectedIds.value = selectedIds.value.filter((id) => id !== productId);
  } else {
    selectedIds.value = [...selectedIds.value, productId];
  }
}

function resetDialogState() {
  selectedIds.value = [];
  query.value = "";
  visibleCount.value = 12;
  isLoadingMore.value = false;
  isSearchLoading.value = false;
}

function handleClose() {
  resetDialogState();
  emit("update:open", false);
}

function handleAdd() {
  const sel = allProducts.value.filter((p) => selectedIds.value.includes(p.id));
  emit("addProducts", sel);
  resetDialogState();
  emit("update:open", false);
}
</script>
