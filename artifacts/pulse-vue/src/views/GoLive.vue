<template>
  <main class="p-6 max-w-[1000px] mx-auto">
    <!-- Back -->
    <RouterLink to="/" class="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 mb-5 transition-colors">
      <ArrowLeft :size="15" />
      Back to Inventory Setup
    </RouterLink>

    <!-- Step Indicator -->
    <div class="flex items-center gap-3 mb-6">
      <StepBadge v-for="(s, i) in steps" :key="i" :number="i + 1" :label="s" :active="currentStep === i" :done="currentStep > i" />
    </div>

    <div class="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">

      <!-- ── STEP 0: Download Template & Upload ── -->
      <div v-if="currentStep === 0" class="p-8">
        <div class="flex items-start gap-4 mb-7">
          <div class="w-10 h-10 rounded-xl bg-teal-100 flex items-center justify-center shrink-0">
            <FileSpreadsheet :size="20" class="text-teal-600" />
          </div>
          <div>
            <h2 class="text-xl font-bold text-gray-900 mb-1">Upload your inventory file</h2>
            <p class="text-sm text-gray-500">Download our template, fill in your products, then upload. Pulse will do the rest.</p>
          </div>
        </div>

        <!-- Download Template -->
        <div class="flex items-center justify-between border border-dashed border-teal-300 bg-teal-50 rounded-xl px-5 py-4 mb-5">
          <div class="flex items-center gap-3">
            <div class="w-9 h-9 rounded-lg bg-teal-100 flex items-center justify-center">
              <Download :size="17" class="text-teal-600" />
            </div>
            <div>
              <p class="text-sm font-semibold text-gray-800">Inventory Template.xlsx</p>
              <p class="text-xs text-gray-500">Ready to fill — includes all required columns</p>
            </div>
          </div>
          <button class="flex items-center gap-1.5 text-sm font-semibold text-teal-600 hover:text-teal-800 border border-teal-300 bg-white px-4 py-2 rounded-lg transition-colors">
            <Download :size="14" />
            Download
          </button>
        </div>

        <!-- Dropzone -->
        <div
          class="border-2 border-dashed rounded-xl p-10 text-center transition-colors cursor-pointer"
          :class="dragOver ? 'border-teal-400 bg-teal-50' : 'border-gray-200 hover:border-teal-300 hover:bg-gray-50'"
          @dragover.prevent="dragOver = true"
          @dragleave="dragOver = false"
          @drop.prevent="handleDrop"
          @click="fileInput?.click()"
        >
          <div v-if="!uploadedFile">
            <div class="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
              <Upload :size="24" class="text-gray-400" />
            </div>
            <p class="text-sm font-semibold text-gray-700 mb-1">Drop your Excel file here</p>
            <p class="text-xs text-gray-400">or <span class="text-teal-600 underline">browse from computer</span></p>
            <p class="text-xs text-gray-400 mt-2">.xlsx or .xls, max 10 MB</p>
          </div>
          <div v-else class="flex items-center justify-center gap-3">
            <div class="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
              <FileCheck :size="20" class="text-green-600" />
            </div>
            <div class="text-left">
              <p class="text-sm font-semibold text-gray-800">{{ uploadedFile.name }}</p>
              <p class="text-xs text-gray-500">{{ (uploadedFile.size / 1024).toFixed(1) }} KB — ready to process</p>
            </div>
            <button class="ml-4 text-gray-400 hover:text-red-500 transition-colors" @click.stop="uploadedFile = null">
              <X :size="16" />
            </button>
          </div>
        </div>
        <input ref="fileInput" type="file" accept=".xlsx,.xls,.csv" class="hidden" @change="handleFileChange" />

        <!-- Reward badge -->
        <div class="flex items-center gap-3 mt-4 border border-orange-100 bg-orange-50 rounded-xl px-4 py-3">
          <Gift :size="17" class="text-orange-500 shrink-0" />
          <p class="text-xs text-gray-700">Earn <span class="font-bold text-orange-600">JOD 3.5</span> added to your wallet once your file is verified.</p>
        </div>

        <div class="flex justify-end mt-7">
          <button
            class="flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-semibold transition-colors"
            :class="uploadedFile ? 'bg-teal-600 text-white hover:bg-teal-700' : 'bg-gray-100 text-gray-400 cursor-not-allowed'"
            :disabled="!uploadedFile"
            @click="nextStep"
          >
            Continue
            <ArrowRight :size="15" />
          </button>
        </div>
      </div>

      <!-- ── STEP 1: Smart Matching Preview ── -->
      <div v-if="currentStep === 1" class="p-8">
        <div class="flex items-start gap-4 mb-7">
          <div class="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center shrink-0">
            <Sparkles :size="20" class="text-blue-600" />
          </div>
          <div>
            <h2 class="text-xl font-bold text-gray-900 mb-1">Smart matching preview</h2>
            <p class="text-sm text-gray-500">Pulse matched your products to our database. Review and confirm before going live.</p>
          </div>
        </div>

        <!-- Stats row -->
        <div class="grid grid-cols-3 gap-4 mb-6">
          <StatCard label="Products found" value="248" icon-color="text-teal-600" bg-color="bg-teal-50" />
          <StatCard label="Matched automatically" value="231" icon-color="text-green-600" bg-color="bg-green-50" />
          <StatCard label="Needs review" value="17" icon-color="text-orange-500" bg-color="bg-orange-50" />
        </div>

        <!-- Product table preview -->
        <div class="border border-gray-200 rounded-xl overflow-hidden mb-6">
          <table class="w-full text-sm">
            <thead class="bg-gray-50 border-b border-gray-200">
              <tr>
                <th class="text-left px-4 py-2.5 text-xs font-semibold text-gray-500">Product Name</th>
                <th class="text-left px-4 py-2.5 text-xs font-semibold text-gray-500">Barcode</th>
                <th class="text-left px-4 py-2.5 text-xs font-semibold text-gray-500">Qty</th>
                <th class="text-left px-4 py-2.5 text-xs font-semibold text-gray-500">Price (JOD)</th>
                <th class="text-left px-4 py-2.5 text-xs font-semibold text-gray-500">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="p in previewProducts" :key="p.name" class="border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors">
                <td class="px-4 py-3 font-medium text-gray-800">{{ p.name }}</td>
                <td class="px-4 py-3 text-gray-500 font-mono text-xs">{{ p.barcode }}</td>
                <td class="px-4 py-3 text-gray-700">{{ p.qty }}</td>
                <td class="px-4 py-3 text-gray-700">{{ p.price }}</td>
                <td class="px-4 py-3">
                  <span
                    class="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full"
                    :class="p.status === 'matched' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'"
                  >
                    <CheckCircle v-if="p.status === 'matched'" :size="10" />
                    <AlertCircle v-else :size="10" />
                    {{ p.status === 'matched' ? 'Matched' : 'Review' }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
          <div class="px-4 py-2.5 bg-gray-50 text-xs text-gray-500 border-t border-gray-200">
            Showing 5 of 248 products · <span class="text-teal-600 cursor-pointer hover:underline">View all</span>
          </div>
        </div>

        <div class="flex justify-between mt-2">
          <button class="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors" @click="prevStep">
            <ArrowLeft :size="15" />
            Back
          </button>
          <button class="flex items-center gap-2 bg-teal-600 text-white px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-teal-700 transition-colors" @click="nextStep">
            Confirm & Continue
            <ArrowRight :size="15" />
          </button>
        </div>
      </div>

      <!-- ── STEP 2: Success ── -->
      <div v-if="currentStep === 2" class="p-8 text-center">
        <div class="w-16 h-16 rounded-full bg-teal-100 flex items-center justify-center mx-auto mb-5">
          <CheckCircle :size="32" class="text-teal-600" />
        </div>
        <h2 class="text-2xl font-bold text-gray-900 mb-2">Your pharmacy is now live!</h2>
        <p class="text-sm text-gray-500 mb-6 max-w-md mx-auto">
          248 products have been loaded into Pulse. Your inventory is active on Point of Sales and the Marketplace.
        </p>

        <!-- Reward claimed -->
        <div class="inline-flex items-center gap-2 bg-orange-50 border border-orange-100 rounded-xl px-5 py-3 mb-8">
          <Gift :size="18" class="text-orange-500" />
          <p class="text-sm font-semibold text-gray-800"><span class="text-orange-600">JOD 3.5</span> has been added to your wallet!</p>
        </div>

        <!-- What's ready -->
        <div class="grid grid-cols-2 gap-4 text-left mb-8 max-w-lg mx-auto">
          <ReadyCard icon="point-of-sale" label="Point of Sales" desc="Start selling immediately" />
          <ReadyCard icon="p2p" label="P2P Marketplace" desc="Trade with other pharmacies" />
          <ReadyCard icon="monitoring" label="Live Monitoring" desc="Track stock in real-time" />
          <ReadyCard icon="purchase" label="Smart Purchasing" desc="Replenish automatically" />
        </div>

        <div class="flex items-center justify-center gap-3">
          <RouterLink to="/" class="flex items-center gap-2 border border-gray-200 text-gray-600 px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-gray-50 transition-colors">
            Back to Setup
          </RouterLink>
          <button class="flex items-center gap-2 bg-teal-600 text-white px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-teal-700 transition-colors">
            Go to Dashboard
            <ArrowRight :size="15" />
          </button>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { RouterLink } from "vue-router";
import {
  ArrowLeft, ArrowRight, Upload, Download, FileSpreadsheet,
  FileCheck, X, Gift, Sparkles, CheckCircle, AlertCircle,
} from "lucide-vue-next";
import StepBadge from "../components/StepBadge.vue";
import StatCard from "../components/StatCard.vue";
import ReadyCard from "../components/ReadyCard.vue";

const currentStep = ref(0);
const steps = ["Upload File", "Review Matches", "Go Live"];
const dragOver = ref(false);
const uploadedFile = ref<File | null>(null);
const fileInput = ref<HTMLInputElement | null>(null);

function handleDrop(e: DragEvent) {
  dragOver.value = false;
  const file = e.dataTransfer?.files[0];
  if (file) uploadedFile.value = file;
}

function handleFileChange(e: Event) {
  const input = e.target as HTMLInputElement;
  const file = input.files?.[0];
  if (file) uploadedFile.value = file;
}

function nextStep() {
  if (currentStep.value < steps.length - 1) currentStep.value++;
}

function prevStep() {
  if (currentStep.value > 0) currentStep.value--;
}

const previewProducts = [
  { name: "Paracetamol 500mg", barcode: "6291041502682", qty: 120, price: "0.85", status: "matched" },
  { name: "Amoxicillin 250mg", barcode: "6291041523450", qty: 45, price: "2.10", status: "matched" },
  { name: "Vitamin D3 1000 IU", barcode: "6291041589231", qty: 200, price: "3.50", status: "matched" },
  { name: "Ibuprofen 400mg", barcode: "6291041567813", qty: 88, price: "1.20", status: "review" },
  { name: "Omeprazole 20mg", barcode: "6291041534199", qty: 60, price: "4.75", status: "review" },
];
</script>
