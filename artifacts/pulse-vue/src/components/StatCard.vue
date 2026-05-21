<template>
  <div class="rounded-xl border border-gray-200 px-5 py-4" :class="bgColor">
    <p class="text-2xl font-bold text-gray-900 mb-0.5">{{ value }}</p>
    <p class="text-xs text-gray-500 font-medium">{{ label }}</p>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  label: string;
  value: string;
  iconColor: string;
  bgColor: string;
}>();
</script>
