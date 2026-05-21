<template>
  <div class="min-h-screen bg-[#f4f6f8] font-sans">
    <Navbar />
    <RouterView />
  </div>
</template>

<script setup lang="ts">
import Navbar from "./components/Navbar.vue";
import { RouterView } from "vue-router";
</script>
