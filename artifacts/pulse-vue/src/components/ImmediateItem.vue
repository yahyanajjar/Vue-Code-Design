<template>
  <div class="flex items-center gap-2.5">
    <div class="w-5 h-5 rounded-full border-2 border-teal-500 flex items-center justify-center shrink-0">
      <Check :size="10" class="text-teal-500" stroke-width="3" />
    </div>
    <span class="text-sm text-gray-700">{{ label }}</span>
  </div>
</template>

<script setup lang="ts">
import { Check } from "lucide-vue-next";

defineProps<{
  label: string;
}>();
</script>
