<template>
  <div class="border border-gray-200 rounded-xl p-4 bg-white hover:border-teal-200 transition-colors">
    <div class="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center mb-3">
      <component :is="icon" :size="18" class="text-teal-600" />
    </div>
    <p class="text-sm font-semibold text-gray-800">{{ title }}</p>
    <p class="text-xs text-gray-500 mt-0.5">{{ subtitle }}</p>
  </div>
</template>

<script setup lang="ts">
import type { Component } from "vue";

defineProps<{
  icon: Component;
  title: string;
  subtitle: string;
}>();
</script>
