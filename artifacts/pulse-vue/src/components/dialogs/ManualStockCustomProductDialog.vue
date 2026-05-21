<template>
  <div
    v-if="open"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
    @click.self="handleClose"
  >
    <div class="max-w-[760px] w-[92vw] bg-white rounded-3xl overflow-hidden max-h-[90vh] flex flex-col">
      <div class="px-6 py-5 border-b border-gray-200">
        <div class="flex items-center gap-3">
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
          <div class="size-10 bg-violet-100 rounded-xl flex items-center justify-center">
            <Package class="size-5 text-violet-600" :stroke-width="2" />
          </div>
          <div :class="isRTL ? 'text-right' : 'text-left'">
            <h2 class="text-xl font-bold text-gray-900">{{ t("newProduct") }}</h2>
            <p class="text-sm text-gray-500 mt-1">{{ t("newProductDescription") }}</p>
          </div>
        </div>
      </div>

      <div class="flex-1 overflow-y-auto">
        <ManualStockCustomProductPanel
          :existing-codes="existingCodes"
          @add-product="handleAddProduct"
          @cancel="handleClose"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { ArrowLeft, ArrowRight, Package } from "lucide-vue-next";
import { useLanguage } from "../../composables/useLanguage";
import ManualStockCustomProductPanel from "../ManualStockCustomProductPanel.vue";
import type { ManualCustomProductInput } from "../../types/manualStock";

const props = defineProps<{
  open: boolean;
  existingCodes: string[];
  onBackToSource?: () => void;
}>();

const emit = defineEmits<{
  (e: "update:open", value: boolean): void;
  (e: "addProduct", product: ManualCustomProductInput): void;
}>();

const { t, language } = useLanguage();
const isRTL = computed(() => language.value === "ar");

function handleClose() {
  emit("update:open", false);
}

function handleAddProduct(p: ManualCustomProductInput) {
  emit("addProduct", p);
  emit("update:open", false);
}

void props;
</script>
