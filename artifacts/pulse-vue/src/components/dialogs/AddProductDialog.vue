<template>
  <div
    v-if="open"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
    @click.self="handleClose"
  >
    <div class="max-h-[calc(100vh-3rem)] max-w-[1100px] w-[92vw] bg-white rounded-3xl overflow-hidden flex flex-col sm:max-h-[calc(100vh-4rem)]">
      <div class="px-6 py-5 border-b border-gray-200 bg-gradient-to-b from-gray-50 to-white">
        <div :class="isRTL ? 'text-right' : 'text-left'">
          <h2 class="text-xl font-bold text-gray-900">{{ t("addProduct") }}</h2>
          <p class="text-sm text-gray-500 mt-1">
            {{ language === "ar"
              ? "اختر المصدر المناسب لإضافة المنتجات إلى الجدول"
              : "Choose the right source to add products to the table" }}
          </p>
        </div>

        <div :class="sourceGridClassName">
          <button
            v-for="option in visibleSourceOptions"
            :key="option.key"
            type="button"
            :disabled="isOpeningLoading"
            @click="$emit('update:activeSource', option.key)"
            :class="[
              'rounded-xl border text-start transition-all p-2.5',
              activeSource === option.key
                ? 'border-teal-500 bg-teal-50 shadow-sm'
                : 'border-gray-200 bg-white hover:border-teal-300 hover:bg-teal-50/40',
              isOpeningLoading ? 'cursor-wait opacity-70' : 'cursor-pointer',
            ]"
          >
            <div class="flex items-start gap-2.5">
              <div :class="['size-8 rounded-lg flex items-center justify-center shrink-0', option.iconClassName]">
                <component :is="option.icon" class="size-4" />
              </div>
              <div class="min-w-0 flex-1">
                <div class="text-sm font-semibold text-gray-900">{{ option.label }}</div>
                <div class="mt-0.5 text-[11px] leading-4 text-gray-500">{{ option.description }}</div>
              </div>
            </div>
          </button>
        </div>
      </div>

      <div v-if="showLoading" class="flex min-h-[420px] flex-col items-center justify-center gap-3 bg-white px-6 py-10 text-center">
        <div class="flex size-12 items-center justify-center rounded-full bg-teal-50 text-teal-600">
          <Loader2 class="size-5 animate-spin" />
        </div>
        <div class="space-y-1">
          <div class="text-sm font-semibold text-gray-900">
            {{ language === "ar" ? "جاري التحميل" : "Loading" }}
          </div>
          <div class="text-xs text-gray-500">
            {{ language === "ar" ? "يتم تجهيز قائمة المنتجات" : "Preparing the product list" }}
          </div>
        </div>
      </div>

      <div v-else class="flex-1 overflow-y-auto">
        <AumetCoreProductsPanel
          :selected-codes="selectedCodes"
          :selected-products="selectedCoreProducts"
          :is-visible="activeSource === 'core'"
          @selection-change="(p) => (selectedCoreProducts = p)"
          @add-products="handleAddSelected"
          @cancel="handleClose"
        />
        <MyProductsPanel
          :selected-codes="selectedCodes"
          :selected-products="selectedInventoryProducts"
          :is-visible="activeSource === 'inventory'"
          @selection-change="(p) => (selectedInventoryProducts = p)"
          @add-products="handleAddSelected"
          @cancel="handleClose"
        />
        <ManualStockCustomProductPanel
          v-if="activeSource === 'custom'"
          :existing-codes="selectedCodes"
          @add-product="handleAddCustom"
          @cancel="handleClose"
        />
      </div>

      <div
        v-if="activeSource !== 'custom' && !showLoading"
        class="border-t border-gray-200 bg-white px-6 py-3"
      >
        <div class="flex flex-wrap items-center justify-between gap-3">
          <div class="text-sm text-gray-500">
            {{ language === "ar"
              ? `تم تحديد ${totalSelectedCount} منتج`
              : `${totalSelectedCount} products selected` }}
          </div>
          <div class="flex flex-wrap items-center gap-3">
            <button
              type="button"
              @click="handleClose"
              class="h-10 rounded-full border border-gray-300 bg-white px-5 text-sm hover:bg-gray-50"
            >
              {{ t("cancel") }}
            </button>
            <button
              type="button"
              @click="handleAddSelected"
              :disabled="totalSelectedCount === 0"
              class="h-10 rounded-full bg-teal-500 text-white text-sm px-5 hover:bg-teal-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {{ t("addSelectedProducts") }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from "vue";
import { Boxes, Loader2, Package, Sparkles } from "lucide-vue-next";
import { useLanguage } from "../../composables/useLanguage";
import AumetCoreProductsPanel from "../AumetCoreProductsPanel.vue";
import MyProductsPanel from "../MyProductsPanel.vue";
import ManualStockCustomProductPanel from "../ManualStockCustomProductPanel.vue";
import type { AumetCoreProduct } from "../../data/aumetCoreProductsSample";
import type {
  AddProductSource,
  ManualCustomProductInput,
  SelectedInventoryProductWithBatches,
} from "../../types/manualStock";

const props = withDefaults(
  defineProps<{
    open: boolean;
    activeSource: AddProductSource;
    availableSources?: AddProductSource[];
    selectedCodes: string[];
  }>(),
  { availableSources: () => ["core", "inventory", "custom"] },
);

const emit = defineEmits<{
  (e: "update:open", value: boolean): void;
  (e: "update:activeSource", source: AddProductSource): void;
  (e: "addCoreProducts", products: AumetCoreProduct[]): void;
  (e: "addInventoryProducts", products: SelectedInventoryProductWithBatches[]): void;
  (e: "addCustomProduct", product: ManualCustomProductInput): void;
}>();

const { t, language } = useLanguage();
const isRTL = computed(() => language.value === "ar");

const isOpeningLoading = ref(false);
const selectedCoreProducts = ref<AumetCoreProduct[]>([]);
const selectedInventoryProducts = ref<SelectedInventoryProductWithBatches[]>([]);

const totalSelectedCount = computed(
  () => selectedCoreProducts.value.length + selectedInventoryProducts.value.length,
);

const sourceOptions = computed(() => [
  {
    key: "core" as AddProductSource,
    label: t("browseAumetCore"),
    description:
      language.value === "ar"
        ? "ابحث وأضف من كتالوج Aumet Core"
        : "Search and add from the Aumet Core catalog",
    icon: Sparkles,
    iconClassName: "bg-emerald-100 text-emerald-700",
  },
  {
    key: "inventory" as AddProductSource,
    label: language.value === "ar" ? "مخزوني" : "My Inventory",
    description:
      language.value === "ar"
        ? "اختر من منتجات مخزونك الحالية"
        : "Choose from your current inventory products",
    icon: Boxes,
    iconClassName: "bg-blue-100 text-blue-700",
  },
  {
    key: "custom" as AddProductSource,
    label: t("createProduct"),
    description:
      language.value === "ar"
        ? "أنشئ منتجًا جديدًا وأضفه مباشرة إلى الجدول"
        : "Create a new product and add it directly to the table",
    icon: Package,
    iconClassName: "bg-violet-100 text-violet-700",
  },
]);

const visibleSourceOptions = computed(() =>
  sourceOptions.value.filter((opt) => props.availableSources.includes(opt.key)),
);

const defaultSource = computed<AddProductSource>(
  () => visibleSourceOptions.value[0]?.key ?? "core",
);

const sourceGridClassName = computed(() =>
  visibleSourceOptions.value.length === 2
    ? "grid grid-cols-1 gap-2 mt-3 sm:grid-cols-2"
    : "grid grid-cols-1 gap-2 mt-3.5 md:grid-cols-3",
);

let openTimer: ReturnType<typeof setTimeout> | null = null;
watch(
  () => props.open,
  (isOpen) => {
    if (!isOpen) {
      isOpeningLoading.value = false;
      if (openTimer) {
        clearTimeout(openTimer);
        openTimer = null;
      }
      return;
    }
    isOpeningLoading.value = true;
    const current = props.activeSource;
    const isValid = visibleSourceOptions.value.some((o) => o.key === current);
    if (!isValid) {
      emit("update:activeSource", defaultSource.value);
    }
    openTimer = setTimeout(() => {
      isOpeningLoading.value = false;
    }, 1500);
  },
  { immediate: true },
);

onBeforeUnmount(() => {
  if (openTimer) clearTimeout(openTimer);
});

const showLoading = computed(() => isOpeningLoading.value);

function handleClose() {
  emit("update:open", false);
}

function handleAddSelected() {
  if (selectedCoreProducts.value.length > 0) {
    emit("addCoreProducts", selectedCoreProducts.value);
  }
  if (selectedInventoryProducts.value.length > 0) {
    emit("addInventoryProducts", selectedInventoryProducts.value);
  }
  if (
    selectedCoreProducts.value.length > 0 ||
    selectedInventoryProducts.value.length > 0
  ) {
    selectedCoreProducts.value = [];
    selectedInventoryProducts.value = [];
    emit("update:open", false);
  }
}

function handleAddCustom(product: ManualCustomProductInput) {
  emit("addCustomProduct", product);
  emit("update:open", false);
}
</script>
