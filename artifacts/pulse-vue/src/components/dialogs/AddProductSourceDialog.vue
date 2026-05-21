<template>
  <div v-if="open" class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" @click.self="emit('update:open', false)">
    <div class="max-w-[760px] w-[92vw] bg-white rounded-3xl overflow-hidden shadow-xl">
      <div class="px-6 py-5 border-b border-gray-200">
        <div :class="isRTL ? 'text-right' : 'text-left'">
          <h2 class="text-xl font-bold text-gray-900">{{ t("addProduct") }}</h2>
          <p class="text-sm text-gray-500 mt-1">{{ t("chooseProductSourceDescription") }}</p>
        </div>
      </div>
      <div class="bg-gray-50 p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <button
          v-for="option in options"
          :key="option.source"
          type="button"
          @click="selectSource(option.source)"
          :class="[
            'rounded-2xl border p-5 text-start transition-all hover:shadow-sm hover:-translate-y-0.5',
            selectedSource === option.source ? 'border-teal-400 bg-teal-50/70' : 'border-gray-200 bg-white',
            isRTL ? 'text-right' : 'text-left',
          ]"
        >
          <div :class="['size-11 rounded-2xl flex items-center justify-center mb-4', option.accentClassName]">
            <component :is="option.icon" class="size-5" :stroke-width="2" />
          </div>
          <div class="text-base font-semibold text-gray-900 mb-1.5">{{ t(option.titleKey) }}</div>
          <div class="text-sm text-gray-500 leading-6">{{ t(option.descriptionKey) }}</div>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { Boxes, CirclePlus, PackageSearch } from "lucide-vue-next";
import { useLanguage } from "../../composables/useLanguage";

export type ProductSourceOption = "core" | "inventory" | "custom";

const props = defineProps<{
  open: boolean;
  selectedSource?: ProductSourceOption | null;
}>();
const emit = defineEmits<{
  "update:open": [v: boolean];
  selectSource: [v: ProductSourceOption];
}>();

const { t, language } = useLanguage();
const isRTL = computed(() => language.value === "ar");

const options = [
  { source: "core" as const, icon: PackageSearch, titleKey: "sourceAumetCore", descriptionKey: "sourceAumetCoreDescription", accentClassName: "bg-teal-100 text-teal-600" },
  { source: "inventory" as const, icon: Boxes, titleKey: "sourceMyProducts", descriptionKey: "sourceMyProductsDescription", accentClassName: "bg-sky-100 text-sky-600" },
  { source: "custom" as const, icon: CirclePlus, titleKey: "sourceNewProduct", descriptionKey: "sourceNewProductDescription", accentClassName: "bg-violet-100 text-violet-600" },
];

function selectSource(s: ProductSourceOption) {
  emit("selectSource", s);
  emit("update:open", false);
}
void props;
</script>
