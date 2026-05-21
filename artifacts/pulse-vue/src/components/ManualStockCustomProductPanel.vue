<template>
  <div
    class="flex h-[52vh] flex-col bg-white sm:h-[50vh]"
    :dir="isRTL ? 'rtl' : 'ltr'"
  >
    <div class="flex-1 overflow-y-auto bg-gray-50 p-6 space-y-5">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="space-y-2">
          <label class="text-sm font-medium text-gray-700 block">{{ t("code") }}</label>
          <input
            v-model="form.productCode"
            :placeholder="t('enterProductCode')"
            dir="ltr"
            class="h-11 w-full rounded-full border border-gray-300 px-4 text-sm focus:border-teal-500 focus:outline-none"
          />
          <p v-if="isDuplicateCode" class="text-xs text-red-600">
            {{ t("productCodeAlreadyExists") }}
          </p>
        </div>

        <div class="space-y-2">
          <label class="text-sm font-medium text-gray-700 block">{{ t("barcode") }}</label>
          <div class="relative">
            <Barcode class="absolute start-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
            <input
              v-model="form.barcode"
              :placeholder="t('enterBarcode')"
              dir="ltr"
              class="h-11 w-full rounded-full border border-gray-300 ps-10 pe-4 text-sm focus:border-teal-500 focus:outline-none"
            />
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="space-y-2">
          <label class="text-sm font-medium text-gray-700 block">{{ t("productNameEn") }}</label>
          <input
            v-model="form.productNameEn"
            :placeholder="t('enterProductNameEn')"
            dir="ltr"
            class="h-11 w-full rounded-full border border-gray-300 px-4 text-sm focus:border-teal-500 focus:outline-none"
          />
        </div>
        <div class="space-y-2">
          <label class="text-sm font-medium text-gray-700 block">{{ t("productNameAr") }}</label>
          <input
            v-model="form.productNameAr"
            :placeholder="t('enterProductNameAr')"
            dir="rtl"
            class="h-11 w-full rounded-full border border-gray-300 px-4 text-sm text-right focus:border-teal-500 focus:outline-none"
          />
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="space-y-2">
          <label class="text-sm font-medium text-gray-700 block">{{ t("category") }}</label>
          <select
            v-model="form.categoryKey"
            class="h-11 w-full rounded-full border border-gray-300 bg-white px-4 text-sm focus:border-teal-500 focus:outline-none"
          >
            <option v-for="key in CATEGORY_OPTIONS" :key="key" :value="key">
              {{ t(key) }}
            </option>
          </select>
        </div>
        <div class="space-y-2">
          <label class="text-sm font-medium text-gray-700 block">{{ t("currentStock") }}</label>
          <input
            v-model="form.currentStock"
            type="number"
            min="0"
            dir="ltr"
            class="h-11 w-full rounded-full border border-gray-300 px-4 text-sm focus:border-teal-500 focus:outline-none"
          />
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="space-y-2">
          <label class="text-sm font-medium text-gray-700 block">{{ t("cost") }}</label>
          <input
            v-model="form.avgCost"
            type="number"
            min="0"
            step="0.01"
            placeholder="0.00"
            dir="ltr"
            class="h-11 w-full rounded-full border border-gray-300 px-4 text-sm focus:border-teal-500 focus:outline-none"
          />
        </div>
        <div class="space-y-2">
          <label class="text-sm font-medium text-gray-700 block">{{ t("sellingPrice") }}</label>
          <input
            v-model="form.sellPrice"
            type="number"
            min="0"
            step="0.01"
            placeholder="0.00"
            dir="ltr"
            class="h-11 w-full rounded-full border border-gray-300 px-4 text-sm focus:border-teal-500 focus:outline-none"
          />
        </div>
      </div>
    </div>

    <div class="border-t border-gray-200 bg-white px-6 py-4 flex items-center justify-between gap-3">
      <div class="text-sm text-gray-500">{{ t("customProductWillBeAddedToTable") }}</div>
      <div class="flex items-center gap-3 flex-wrap">
        <button
          type="button"
          @click="$emit('cancel')"
          class="h-10 px-5 rounded-full border border-gray-300 bg-white text-sm hover:bg-gray-50"
        >
          {{ t("cancel") }}
        </button>
        <button
          type="button"
          @click="handleAdd"
          :disabled="!isValid"
          class="h-10 px-5 rounded-full bg-violet-600 text-white text-sm hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {{ t("addProduct") }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive } from "vue";
import { Barcode } from "lucide-vue-next";
import { useLanguage } from "../composables/useLanguage";
import type {
  ManualCustomProductInput,
  ProductCategoryKey,
} from "../types/manualStock";

const props = defineProps<{
  existingCodes: string[];
}>();

const emit = defineEmits<{
  (e: "addProduct", product: ManualCustomProductInput): void;
  (e: "cancel"): void;
}>();

const { t, language } = useLanguage();
const isRTL = computed(() => language.value === "ar");

const CATEGORY_OPTIONS: ProductCategoryKey[] = [
  "categoryGastrointestinal",
  "categoryAntibiotic",
  "categoryCardiovascular",
  "categoryVitamins",
  "categoryOtc",
  "categoryDiabetes",
  "categoryDermatology",
  "categoryAnalgesic",
];

const form = reactive<ManualCustomProductInput>({
  productCode: "",
  productNameEn: "",
  productNameAr: "",
  barcode: "",
  categoryKey: "categoryOtc",
  currentStock: "",
  avgCost: "",
  sellPrice: "",
});

const normalizedExisting = computed(
  () =>
    new Set(
      props.existingCodes
        .filter((c): c is string => typeof c === "string")
        .map((c) => c.trim().toLowerCase())
        .filter(Boolean),
    ),
);

const isDuplicateCode = computed(() =>
  normalizedExisting.value.has(form.productCode.trim().toLowerCase()),
);

const isValid = computed(
  () =>
    !!form.productCode.trim() &&
    !!form.productNameEn.trim() &&
    !!form.productNameAr.trim() &&
    !!form.barcode.trim() &&
    !!form.avgCost.trim() &&
    !!form.sellPrice.trim() &&
    !isDuplicateCode.value,
);

function resetForm() {
  form.productCode = "";
  form.productNameEn = "";
  form.productNameAr = "";
  form.barcode = "";
  form.categoryKey = "categoryOtc";
  form.currentStock = "";
  form.avgCost = "";
  form.sellPrice = "";
}

function handleAdd() {
  if (!isValid.value) return;
  emit("addProduct", {
    productCode: form.productCode.trim(),
    productNameEn: form.productNameEn.trim(),
    productNameAr: form.productNameAr.trim(),
    barcode: form.barcode.trim(),
    categoryKey: form.categoryKey,
    currentStock: form.currentStock,
    avgCost: form.avgCost.trim(),
    sellPrice: form.sellPrice.trim(),
  });
  resetForm();
}
</script>
