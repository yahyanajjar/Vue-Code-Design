<template>
  <nav class="sticky top-0 z-50 border-b bg-white px-6 py-2.5">
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-6">
        <div class="flex items-center gap-2">
          <Activity class="size-4 text-teal-500" :stroke-width="2.5" />
          <span class="text-sm font-semibold">Pulse</span>
        </div>

        <div class="flex items-center">
          <button class="h-9 px-3 text-xs text-gray-700 hover:text-gray-900 inline-flex items-center">
            {{ t("dashboard") }}
          </button>
          <button class="h-9 px-3 text-xs text-gray-700 hover:text-gray-900 inline-flex items-center gap-1">
            {{ t("pointOfSale") }} <ChevronDown class="size-3.5" />
          </button>

          <button
            type="button"
            @click="goToInventory"
            :class="[
              'h-9 px-3 text-xs font-medium transition-colors focus-visible:outline-none border-b-2 inline-flex items-center justify-center bg-transparent',
              isInventoryActive
                ? 'text-teal-600 hover:text-teal-700 border-teal-600'
                : 'text-gray-700 hover:text-gray-900 border-transparent',
            ]"
          >
            {{ t("inventory") }}
          </button>

          <button class="h-9 px-3 text-xs text-gray-700 hover:text-gray-900 inline-flex items-center gap-1">
            {{ t("marketplace") }} <ChevronDown class="size-3.5" />
          </button>
          <button class="h-9 px-3 text-xs text-gray-700 hover:text-gray-900 inline-flex items-center gap-1">
            {{ t("purchase") }} <ChevronDown class="size-3.5" />
          </button>
          <button class="h-9 px-3 text-xs text-gray-700 hover:text-gray-900 inline-flex items-center gap-1">
            {{ t("sellerPXP") }} <ChevronDown class="size-3.5" />
          </button>
          <button class="h-9 px-3 text-xs text-gray-700 hover:text-gray-900 inline-flex items-center gap-1">
            {{ t("customers") }} <ChevronDown class="size-3.5" />
          </button>
          <button class="h-9 px-3 text-xs text-gray-700 hover:text-gray-900 inline-flex items-center gap-1">
            {{ t("reports") }} <ChevronDown class="size-3.5" />
          </button>
          <button class="h-9 px-3 text-xs text-gray-700 hover:text-gray-900 inline-flex items-center gap-1">
            {{ t("settings") }} <ChevronDown class="size-3.5" />
          </button>
        </div>
      </div>

      <div class="flex items-center gap-2.5">
        <button
          @click="toggleLanguage"
          class="text-xs h-8 rounded-full border border-gray-300 px-3 hover:bg-gray-50"
        >
          {{ language === "en" ? "العربية" : "English" }}
        </button>

        <div class="bg-slate-900 text-white px-4 py-1.5 rounded-full text-xs font-medium">
          JOD 7.00
        </div>

        <div class="relative">
          <Bell class="size-5 text-gray-600 cursor-pointer" :stroke-width="2" />
          <span
            class="absolute -top-1 size-4 p-0 flex items-center justify-center bg-red-500 text-white text-[10px] rounded-full border-2 border-white"
            :class="isRTL ? '-start-1' : '-end-1'"
          >
            3
          </span>
        </div>

        <div class="size-8 cursor-pointer rounded-full bg-teal-100 text-teal-700 text-xs font-medium flex items-center justify-center">
          T
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { Bell, ChevronDown, Activity } from "lucide-vue-next";
import { useLanguage } from "../composables/useLanguage";

const { t, language, toggleLanguage, isRTL } = useLanguage();
const route = useRoute();
const router = useRouter();

const isInventoryActive = computed(() =>
  ["inventory", "update-stock", "manual-update-stock"].includes(
    (route.name as string) ?? "",
  ),
);

function goToInventory() {
  router.push({ name: "inventory" });
}
</script>
