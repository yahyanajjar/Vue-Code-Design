<template>
  <div class="flex items-center gap-2">
    <div
      class="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-colors"
      :class="done
        ? 'bg-teal-600 text-white'
        : active
          ? 'bg-teal-600 text-white ring-2 ring-teal-200'
          : 'bg-gray-100 text-gray-400'"
    >
      <Check v-if="done" :size="12" stroke-width="3" />
      <span v-else>{{ number }}</span>
    </div>
    <span
      class="text-sm font-medium transition-colors"
      :class="active ? 'text-teal-700' : done ? 'text-gray-600' : 'text-gray-400'"
    >{{ label }}</span>
    <div v-if="number < 3" class="w-8 h-px bg-gray-200 ml-1" />
  </div>
</template>

<script setup lang="ts">
import { Check } from "lucide-vue-next";

defineProps<{
  number: number;
  label: string;
  active: boolean;
  done: boolean;
}>();
</script>
