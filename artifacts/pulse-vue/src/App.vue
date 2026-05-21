<template>
  <div
    class="h-screen flex flex-col bg-gray-50 overflow-hidden"
    :dir="isRTL ? 'rtl' : 'ltr'"
  >
    <Navbar />
    <div class="flex-1 overflow-y-auto">
      <RouterView />
    </div>
  </div>
</template>

<script setup lang="ts">
import { RouterView } from "vue-router";
import Navbar from "./components/Navbar.vue";
import { useLanguage } from "./composables/useLanguage";

const { isRTL } = useLanguage();
</script>
