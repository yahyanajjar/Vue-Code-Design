<template>
  <button
    class="flex items-center gap-0.5 px-2.5 py-1.5 text-sm rounded transition-colors"
    :class="active
      ? 'text-teal-600 font-medium border-b-2 border-teal-600 rounded-none'
      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'"
  >
    {{ label }}
    <ChevronDown v-if="hasDropdown" :size="12" class="opacity-60 mt-px" />
  </button>
</template>

<script setup lang="ts">
import { ChevronDown } from "lucide-vue-next";

withDefaults(defineProps<{
  label: string;
  active?: boolean;
  hasDropdown?: boolean;
}>(), {
  active: false,
  hasDropdown: false,
});
</script>
