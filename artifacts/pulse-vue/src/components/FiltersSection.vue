<template>
  <div v-if="isOpen && type === 'products'" class="border-t border-gray-200 bg-white px-4 py-3">
    <div class="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
      <div v-for="f in productFilters" :key="f.label">
        <label class="mb-1.5 block text-xs font-medium text-gray-600">{{ f.label }}</label>
        <div class="relative">
          <select class="w-full appearance-none rounded-full border border-gray-300 bg-white px-4 py-2 pe-10 text-sm text-gray-600 cursor-pointer hover:border-gray-400 focus:border-teal-500 focus:outline-none">
            <option>{{ f.placeholder }}</option>
          </select>
          <ChevronDown class="absolute end-3 top-1/2 -translate-y-1/2 size-4 text-gray-500 pointer-events-none" />
        </div>
      </div>
    </div>
    <div class="mt-3 flex justify-end gap-2">
      <button class="h-8 px-4 text-sm rounded-full border border-gray-300 hover:bg-gray-50">{{ t("reset") }}</button>
      <button class="bg-teal-500 hover:bg-teal-600 text-white h-8 px-4 text-sm rounded-full">{{ t("apply") }}</button>
    </div>
  </div>
  <div v-else-if="isOpen" class="p-4 border-t border-gray-200 bg-white">
    <div class="grid grid-cols-3 gap-4 mb-4">
      <div v-for="f in historyFilters" :key="f.label">
        <label class="text-xs font-medium text-gray-600 mb-2 block">{{ f.label }}</label>
        <div class="relative">
          <select class="w-full border border-gray-300 rounded-full px-4 py-2.5 pe-10 text-sm text-gray-600 bg-white appearance-none cursor-pointer hover:border-gray-400 focus:border-teal-500 focus:outline-none">
            <option>{{ f.placeholder }}</option>
          </select>
          <ChevronDown class="absolute end-3 top-1/2 -translate-y-1/2 size-4 text-gray-500 pointer-events-none" />
        </div>
      </div>
    </div>
    <div class="flex justify-end gap-2">
      <button class="h-9 px-5 text-sm rounded-full border border-gray-300 hover:bg-gray-50">{{ t("reset") }}</button>
      <button class="bg-teal-500 hover:bg-teal-600 text-white h-9 px-5 text-sm rounded-full">{{ t("apply") }}</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { ChevronDown } from "lucide-vue-next";
import { useLanguage } from "../composables/useLanguage";

const props = defineProps<{ isOpen: boolean; type: "products" | "stockHistory" }>();
const { t } = useLanguage();

const productFilters = computed(() => [
  { label: t("categoryFilter"), placeholder: t("selectCategory") },
  { label: t("stockRange"), placeholder: t("selectStockRange") },
  { label: t("expiryStatus"), placeholder: t("selectExpiryStatus") },
  { label: t("warehouse"), placeholder: t("selectStatus") },
  { label: t("agingLastSale"), placeholder: t("selectAgingLastSale") },
  { label: t("status"), placeholder: t("selectStatus") },
]);

const historyFilters = computed(() => [
  { label: t("createdDateRange"), placeholder: t("selectDateRange") },
  { label: t("createdUserFilter"), placeholder: t("allUsers") },
  { label: t("status"), placeholder: t("allStatus") },
]);

void props;
</script>
