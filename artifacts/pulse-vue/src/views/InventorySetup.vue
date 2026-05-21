<template>
  <main class="p-6 max-w-[1200px] mx-auto">
    <div class="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      <div class="flex gap-0">
        <!-- Left Panel -->
        <div class="flex-1 p-8 border-r border-gray-200">
          <!-- Chip -->
          <div class="inline-flex items-center gap-1.5 border border-gray-200 rounded-full px-3 py-1 text-xs text-gray-600 font-medium mb-5">
            <Settings2 :size="12" class="text-gray-500" />
            Inventory Setup
          </div>

          <!-- Heading -->
          <h1 class="text-2xl font-bold text-gray-900 mb-3 leading-snug">
            Moving to Pulse is now effortless
          </h1>
          <p class="text-sm text-gray-500 leading-relaxed mb-6 max-w-lg">
            You only need one thing: your inventory Excel file. Upload it once, and Pulse
            automatically transfers your products, quantities, and batches into Aumet.
          </p>

          <!-- Action Buttons -->
          <div class="flex gap-3 mb-5">
            <RouterLink
              to="/go-live"
              class="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors shadow-sm"
            >
              <Upload :size="15" />
              Go Live with My Inventory
            </RouterLink>
            <RouterLink
              to="/add-product"
              class="flex items-center gap-2 border border-gray-300 hover:bg-gray-50 text-gray-700 text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors"
            >
              <PlusCircle :size="15" />
              Add Products Manually
            </RouterLink>
          </div>

          <!-- Reward Banner -->
          <div class="flex items-start gap-3 border border-gray-200 rounded-xl p-4 mb-6 bg-gray-50">
            <div class="w-9 h-9 rounded-xl bg-orange-100 flex items-center justify-center shrink-0">
              <Gift :size="18" class="text-orange-500" />
            </div>
            <div>
              <p class="text-sm text-gray-700">
                Get <span class="font-bold">JOD 3.5</span> when you upload your inventory
              </p>
              <p class="text-xs text-gray-500 mt-0.5">Added JOD 3.5 to your wallet for Upload Your Inventory</p>
            </div>
          </div>

          <!-- Steps Row -->
          <div class="grid grid-cols-3 gap-3 mb-5">
            <StepCard :icon="Upload" title="File uploaded" subtitle="Smart matching" />
            <StepCard :icon="Sparkles" title="Inventory ready" subtitle="Marketplace activated" />
            <StepCard :icon="Activity" title="Live Monitoring" subtitle="Real-time tracking" />
          </div>

          <!-- Footer Banner -->
          <div class="flex items-center justify-between border border-gray-200 rounded-xl px-4 py-3 bg-gray-50">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center shrink-0">
                <CheckCircle :size="16" class="text-teal-600" />
              </div>
              <div>
                <p class="text-sm font-semibold text-gray-800">From upload to live in just a few seconds</p>
                <p class="text-xs text-gray-500">Welcome to Pulse on Aumet.</p>
              </div>
            </div>
            <span class="text-sm font-bold text-teal-600 shrink-0 ml-4">Ready. Set. Grow.</span>
          </div>
        </div>

        <!-- Right Panel -->
        <div class="w-80 p-5 flex flex-col gap-4 bg-white">
          <div class="rounded-2xl bg-[#0f766e] text-white p-5">
            <p class="text-xs font-medium text-teal-200 mb-2">What happens next</p>
            <h2 class="text-lg font-bold text-teal-300 leading-snug mb-2">
              Your pharmacy goes live instantly
            </h2>
            <p class="text-xs text-teal-100 leading-relaxed">
              Once your file is uploaded and verified, your inventory is automatically ready inside Pulse.
            </p>
          </div>

          <div>
            <p class="text-xs font-semibold text-gray-700 mb-3">You can immediately:</p>
            <div class="flex flex-col gap-3">
              <ImmediateItem label="Start selling directly on Point of Sales" />
              <ImmediateItem label="Start selling through P2P" />
              <ImmediateItem label="Buy products from other pharmacies" />
              <ImmediateItem label="Manage your inventory from one place" />
            </div>
          </div>

          <div class="rounded-xl bg-teal-50 border border-teal-100 p-4 flex items-start gap-3">
            <div class="w-8 h-8 rounded-lg bg-teal-100 flex items-center justify-center shrink-0">
              <Trophy :size="16" class="text-teal-600" />
            </div>
            <div>
              <p class="text-sm font-bold text-gray-800 mb-1">Leave the old system behind.</p>
              <p class="text-xs text-gray-500 leading-relaxed">We simplified the transition so you can move fast and start growing.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { RouterLink } from "vue-router";
import {
  Settings2, Upload, PlusCircle, Gift, Sparkles,
  Activity, CheckCircle, Trophy,
} from "lucide-vue-next";
import StepCard from "../components/StepCard.vue";
import ImmediateItem from "../components/ImmediateItem.vue";
</script>
