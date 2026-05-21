<template>
  <nav class="bg-white border-b border-gray-200 px-4 h-12 flex items-center justify-between sticky top-0 z-50">
    <!-- Left: Logo + Nav items -->
    <div class="flex items-center gap-6">
      <!-- Logo -->
      <div class="flex items-center gap-1.5 shrink-0">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" class="text-teal-600">
          <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" fill="currentColor" />
        </svg>
        <span class="font-semibold text-gray-900 text-sm">Pulse</span>
      </div>

      <!-- Nav Items -->
      <div class="flex items-center gap-0.5 text-sm">
        <NavItem label="Dashboard" />
        <NavItem label="Point of Sale" :has-dropdown="true" />
        <NavItem label="Inventory" :active="true" />
        <NavItem label="Marketplace" :has-dropdown="true" />
        <NavItem label="Purchase" :has-dropdown="true" />
        <NavItem label="Seller PXP" :has-dropdown="true" />
        <NavItem label="Customers" :has-dropdown="true" />
        <NavItem label="Reports" :has-dropdown="true" />
        <NavItem label="Settings" :has-dropdown="true" />
      </div>
    </div>

    <!-- Right: Language, Balance, Notifications, Avatar -->
    <div class="flex items-center gap-2">
      <button class="text-xs text-gray-600 hover:text-gray-900 px-2 py-1 rounded hover:bg-gray-100 transition-colors">
        العربية
      </button>

      <button class="flex items-center gap-1.5 bg-gray-900 text-white text-xs font-semibold px-3 py-1.5 rounded-md hover:bg-gray-800 transition-colors">
        <span>JOD 7.00</span>
      </button>

      <button class="relative p-1.5 rounded-md hover:bg-gray-100 transition-colors">
        <Bell :size="16" class="text-gray-600" />
        <span class="absolute top-0.5 right-0.5 w-3.5 h-3.5 bg-red-500 rounded-full text-white text-[9px] flex items-center justify-center font-bold leading-none">9</span>
      </button>

      <button class="w-7 h-7 rounded-full bg-teal-600 text-white text-xs font-semibold flex items-center justify-center hover:bg-teal-700 transition-colors">
        T
      </button>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { Bell } from "lucide-vue-next";
import NavItem from "./NavItem.vue";
</script>
