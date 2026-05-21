<template>
  <div
    class="w-11 h-11 rounded-lg flex items-center justify-center shrink-0 border"
    :class="bg"
  >
    <!-- Pill -->
    <svg v-if="variant === 'pill'" width="26" height="14" viewBox="0 0 32 16" fill="none">
      <rect x="0.5" y="0.5" width="31" height="15" rx="7.5" fill="#fff" stroke="#cbd5e1" />
      <rect x="0.5" y="0.5" width="15.5" height="15" rx="7.5" fill="#fde68a" stroke="#cbd5e1" />
    </svg>
    <!-- Capsule -->
    <svg v-else-if="variant === 'capsule'" width="26" height="14" viewBox="0 0 32 16" fill="none">
      <rect x="0.5" y="0.5" width="31" height="15" rx="7.5" fill="#a7f3d0" stroke="#10b981" />
      <rect x="0.5" y="0.5" width="15.5" height="15" rx="7.5" fill="#ddd6fe" stroke="#10b981" />
    </svg>
    <!-- Tablet -->
    <svg v-else-if="variant === 'tablet'" width="22" height="22" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" fill="#fff" stroke="#94a3b8" stroke-width="1.5" />
      <path d="M12 4 L12 20" stroke="#94a3b8" stroke-width="1.2" />
    </svg>
    <!-- Bottle -->
    <svg v-else-if="variant === 'bottle'" width="18" height="24" viewBox="0 0 20 26" fill="none">
      <rect x="6" y="0.5" width="8" height="4" rx="1" fill="#64748b" />
      <path d="M3 6 H17 V23 a2 2 0 0 1 -2 2 H5 a2 2 0 0 1 -2 -2 Z" fill="#fef3c7" stroke="#94a3b8" />
      <rect x="5" y="11" width="10" height="6" fill="#fff" />
    </svg>
    <!-- Drops -->
    <svg v-else-if="variant === 'drops'" width="20" height="24" viewBox="0 0 20 24" fill="none">
      <path d="M10 1 C 5 9 3 13 3 17 a 7 7 0 0 0 14 0 c 0 -4 -2 -8 -7 -16 z" fill="#bae6fd" stroke="#0284c7" stroke-width="1" />
    </svg>
    <!-- Cream -->
    <svg v-else-if="variant === 'cream'" width="26" height="14" viewBox="0 0 28 16" fill="none">
      <path d="M3 8 L8 3 H25 a2 2 0 0 1 2 2 v6 a2 2 0 0 1 -2 2 H8 Z" fill="#fce7f3" stroke="#db2777" />
      <rect x="1" y="6" width="3" height="4" rx="1" fill="#db2777" />
    </svg>
    <!-- Heart -->
    <svg v-else-if="variant === 'heart'" width="22" height="20" viewBox="0 0 24 22" fill="none">
      <path d="M12 21 C 4 14 1 10 1 6 a 5 5 0 0 1 11 -3 a 5 5 0 0 1 11 3 c 0 4 -3 8 -11 15 z" fill="#fecaca" stroke="#dc2626" stroke-width="1.5" />
    </svg>
    <!-- Vitamin / Star -->
    <svg v-else-if="variant === 'vitamin'" width="22" height="22" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" fill="#fef3c7" stroke="#f59e0b" stroke-width="1.5" />
      <path d="M12 6 L13.5 10 L18 10.5 L14.5 13.5 L15.5 18 L12 15.5 L8.5 18 L9.5 13.5 L6 10.5 L10.5 10 Z" fill="#f59e0b" />
    </svg>
    <!-- Syringe -->
    <svg v-else-if="variant === 'syringe'" width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M3 21 L8 16" stroke="#0284c7" stroke-width="1.5" stroke-linecap="round" />
      <rect x="8" y="9" width="10" height="6" rx="1" fill="#e0f2fe" stroke="#0284c7" transform="rotate(-45 13 12)" />
      <path d="M16 5 L20 9" stroke="#475569" stroke-width="2" stroke-linecap="round" />
    </svg>
    <!-- Default -->
    <Pill v-else :size="18" class="text-gray-400" />
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { Pill } from "lucide-vue-next";

const props = defineProps<{
  variant: string;
}>();

const palette: Record<string, string> = {
  pill: "bg-amber-50 border-amber-100",
  capsule: "bg-emerald-50 border-emerald-100",
  tablet: "bg-slate-50 border-slate-200",
  bottle: "bg-yellow-50 border-yellow-100",
  drops: "bg-sky-50 border-sky-100",
  cream: "bg-pink-50 border-pink-100",
  heart: "bg-red-50 border-red-100",
  vitamin: "bg-orange-50 border-orange-100",
  syringe: "bg-blue-50 border-blue-100",
};

const bg = computed(() => palette[props.variant] || "bg-gray-50 border-gray-100");
</script>
