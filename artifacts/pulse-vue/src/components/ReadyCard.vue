<template>
  <div class="flex items-start gap-3 border border-gray-200 rounded-xl p-3.5">
    <div class="w-8 h-8 rounded-lg bg-teal-100 flex items-center justify-center shrink-0">
      <ShoppingCart v-if="icon === 'point-of-sale'" :size="15" class="text-teal-600" />
      <ArrowLeftRight v-else-if="icon === 'p2p'" :size="15" class="text-teal-600" />
      <Activity v-else-if="icon === 'monitoring'" :size="15" class="text-teal-600" />
      <ShoppingBag v-else :size="15" class="text-teal-600" />
    </div>
    <div>
      <p class="text-sm font-semibold text-gray-800">{{ label }}</p>
      <p class="text-xs text-gray-500 mt-0.5">{{ desc }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ShoppingCart, ArrowLeftRight, Activity, ShoppingBag } from "lucide-vue-next";

defineProps<{
  icon: string;
  label: string;
  desc: string;
}>();
</script>
