<template>
  <div v-if="open" class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" @click.self="close">
    <div class="max-w-[760px] w-[calc(100vw-2rem)] bg-white rounded-3xl shadow-xl overflow-hidden">
      <div class="px-6 py-4 border-b border-gray-200">
        <h2 class="text-xl font-bold text-gray-900">{{ t("updateStockTitle") }}</h2>
      </div>

      <div class="px-6 py-4 space-y-4">
        <div class="bg-teal-50 border border-teal-200 rounded-xl p-3 flex items-center gap-3">
          <Sparkles class="size-5 text-teal-600 flex-shrink-0" :stroke-width="2" />
          <p class="text-sm text-gray-700"><span class="font-bold text-gray-900">{{ t("uploadProductsFile") }}</span> - {{ t("excelCsvFormat") }}</p>
        </div>

        <div
          role="button"
          tabindex="0"
          @click="handleChooseFile"
          @dragover.prevent="isDragActive = true"
          @dragleave.prevent="isDragActive = false"
          @drop.prevent="handleDrop"
          :class="['relative overflow-hidden border-2 border-dashed rounded-[24px] flex flex-col items-center justify-center text-center transition-all cursor-pointer min-h-[300px] p-8',
            isDragActive ? 'border-teal-500 bg-teal-100' : selectedFile ? 'border-teal-300 bg-white' : 'border-teal-200 bg-gradient-to-br from-teal-50 via-white to-cyan-50/70']"
        >
          <input ref="fileInputRef" type="file" accept=".csv,.xlsx,.xls" @change="handleFileSelect" class="hidden" />
          <template v-if="!selectedFile">
            <div class="mb-4 flex size-20 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-100 to-cyan-50">
              <FileSpreadsheet class="size-10 text-teal-600" :stroke-width="2" />
            </div>
            <h4 class="mb-1.5 text-xl font-semibold text-gray-900">{{ t("dropFileHere") }}</h4>
            <p class="mb-5 max-w-sm text-sm text-gray-500">{{ t("orClickBrowse") }}</p>
            <button type="button" @click.stop="handleChooseFile" class="bg-teal-600 hover:bg-teal-700 text-white rounded-full font-semibold px-7 py-2.5 text-sm">{{ t("chooseFileComputer") }}</button>
            <p class="mt-3 text-[11px] text-gray-400">CSV, XLSX, XLS</p>
          </template>
          <div v-else class="w-full max-w-xl">
            <div class="mb-4 flex items-center gap-3 rounded-2xl border border-teal-200 bg-teal-50/60 p-5">
              <div class="size-12 rounded-xl border border-teal-100 bg-white flex items-center justify-center">
                <FileSpreadsheet class="size-6 text-teal-600" :stroke-width="2" />
              </div>
              <div class="flex-1 min-w-0 text-start">
                <p class="truncate text-sm font-semibold text-gray-900">{{ selectedFile.name }}</p>
                <p class="text-xs text-gray-500">{{ formatFileSize(selectedFile.size) }}</p>
              </div>
              <button type="button" @click.stop="handleRemoveFile" class="size-8 flex items-center justify-center rounded-full hover:bg-red-50 text-gray-400 hover:text-red-600">
                <Trash2 class="size-4" />
              </button>
            </div>
            <div class="flex items-center justify-center gap-2 rounded-xl border border-teal-100 bg-white p-3.5 text-teal-700">
              <CheckCircle2 class="size-4" />
              <span class="text-xs font-semibold">{{ t("fileReadyUpload") }}</span>
            </div>
          </div>
        </div>

        <button @click="handleDownloadTemplate" class="w-full rounded-2xl border border-gray-200 bg-gray-50 p-4 text-start hover:border-teal-300 hover:bg-teal-50/40 transition-all flex items-center gap-3">
          <div class="flex size-10 items-center justify-center rounded-xl bg-white text-teal-700 shadow-sm">
            <Download class="size-5" />
          </div>
          <div>
            <p class="text-sm font-semibold text-gray-900">{{ t("downloadSample") }}</p>
            <p class="text-xs text-gray-500">{{ t("getTemplate") }}</p>
          </div>
        </button>

        <div v-if="!isOnboardingVariant" class="rounded-2xl border border-orange-200 bg-orange-50/60 p-4">
          <div class="flex items-start justify-between gap-3">
            <div class="flex items-start gap-3">
              <div class="mt-0.5 flex size-9 items-center justify-center rounded-xl bg-orange-100 text-orange-600">
                <AlertTriangle class="size-4" />
              </div>
              <div>
                <p class="text-sm font-bold text-gray-900">{{ t("resetOldStock") }}</p>
                <p class="mt-1 text-xs text-gray-600">{{ t("setStockToZero") }}</p>
              </div>
            </div>
            <button @click="resetExistingStock = !resetExistingStock" :class="['inline-flex h-6 w-11 items-center rounded-full transition-colors', resetExistingStock ? 'bg-teal-600' : 'bg-gray-200']">
              <span :class="['inline-block h-4 w-4 transform rounded-full bg-white transition-transform', resetExistingStock ? 'translate-x-6' : 'translate-x-1']" />
            </button>
          </div>
        </div>
      </div>

      <div class="px-6 py-4 border-t border-gray-200 bg-white flex items-center justify-between gap-2">
        <button class="text-gray-700 rounded-full text-sm py-1.5 px-3 flex items-center gap-2">
          <CirclePlay class="size-4" /> {{ t("viewTour") }}
        </button>
        <div class="flex gap-2.5">
          <button @click="close" class="text-gray-700 rounded-full text-sm py-1.5 px-5 border border-gray-300">{{ t("cancel") }}</button>
          <button
            @click="handleImport"
            :disabled="!selectedFile || isProcessingImport"
            :class="['rounded-full px-6 text-sm py-1.5 flex items-center gap-2', selectedFile && !isProcessingImport ? 'bg-teal-600 hover:bg-teal-700 text-white' : 'bg-gray-300 text-gray-500 cursor-not-allowed']"
          >
            <LoaderCircle v-if="isProcessingImport" class="size-4 animate-spin" />
            <Upload v-else class="size-4" />
            {{ isProcessingImport ? t("processingImport") : t("uploadProcess") }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { FileSpreadsheet, Download, Sparkles, CirclePlay, Upload, Trash2, CheckCircle2, AlertTriangle, LoaderCircle } from "lucide-vue-next";
import { useLanguage } from "../../composables/useLanguage";
import { PHARMACY_INVENTORY_PRODUCTS_V2 } from "../../data/pharmacyInventoryProducts";

const props = defineProps<{ open: boolean; variant?: "default" | "onboarding" }>();
const emit = defineEmits<{ "update:open": [v: boolean]; importSuccess: [] }>();
const { t } = useLanguage();

const isOnboardingVariant = computed(() => props.variant === "onboarding");
const resetExistingStock = ref(false);
const selectedFile = ref<File | null>(null);
const isProcessingImport = ref(false);
const isDragActive = ref(false);
const fileInputRef = ref<HTMLInputElement | null>(null);

function handleFileSelect(e: Event) {
  const f = (e.target as HTMLInputElement).files?.[0];
  if (f) { selectedFile.value = f; isDragActive.value = false; }
}
function handleRemoveFile() { selectedFile.value = null; if (fileInputRef.value) fileInputRef.value.value = ""; }
function handleChooseFile() { fileInputRef.value?.click(); }
function handleDrop(e: DragEvent) {
  const f = e.dataTransfer?.files?.[0];
  if (f) { selectedFile.value = f; }
  isDragActive.value = false;
}
function handleImport() {
  if (!selectedFile.value || isProcessingImport.value) return;
  isProcessingImport.value = true;
  window.setTimeout(() => {
    isProcessingImport.value = false;
    emit("importSuccess");
    close();
  }, 1800);
}
function close() { isProcessingImport.value = false; isDragActive.value = false; emit("update:open", false); }
function formatFileSize(b: number) {
  if (b < 1024) return b + " B";
  if (b < 1024 * 1024) return (b / 1024).toFixed(1) + " KB";
  return (b / (1024 * 1024)).toFixed(1) + " MB";
}
function escapeCsv(v: string) { return `"${v.replace(/"/g, '""')}"`; }
function handleDownloadTemplate() {
  const headers = ["productCode","productNameEn","productNameAr","barcode","category","batchNumber","expiryDate","quantity","avgCost","sellPrice","tax","warehouseZone","subtitleEn","subtitleAr"];
  const rows = PHARMACY_INVENTORY_PRODUCTS_V2.flatMap((p) => p.batches.map((b) => [p.code,p.nameEn,p.nameAr,p.barcode,t(p.categoryKey),b.batchNumber,b.expiry,b.stockQty,b.avgCost,b.sellPrice,p.tax,b.warehouseZone,p.subtitleEn,p.subtitleAr]));
  const csv = [headers, ...rows].map((r) => r.map((v) => escapeCsv(String(v ?? ""))).join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = "inventory-import-template.csv";
  document.body.appendChild(a); a.click(); document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
</script>
