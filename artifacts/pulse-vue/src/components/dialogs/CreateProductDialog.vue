<template>
  <div v-if="open" class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" @click.self="close">
    <div class="max-w-[1100px] w-[80vw] bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col max-h-[92vh]">
      <div class="px-6 py-5 border-b border-gray-200">
        <div class="flex items-center gap-3">
          <div class="size-10 bg-teal-100 rounded-xl flex items-center justify-center">
            <Package class="size-5 text-teal-600" :stroke-width="2" />
          </div>
          <h2 class="text-xl font-bold text-gray-900">{{ t("quickNewProductCreation") }}</h2>
        </div>
      </div>

      <div class="px-6 py-4 overflow-y-auto flex-1">
        <div class="mb-4 rounded-2xl border border-teal-200 bg-gradient-to-r from-teal-50 via-white to-cyan-50 p-4">
          <div class="flex items-start gap-3">
            <div class="flex size-10 items-center justify-center rounded-2xl bg-teal-600 text-white shadow-sm">
              <Sparkles class="size-4" />
            </div>
            <div>
              <p class="text-sm font-semibold text-gray-900">
                {{ language === "ar" ? "استكشف دليل المنتجات لتعبئة البيانات بسرعة" : "Explore the product catalog for faster setup" }}
              </p>
              <p class="mt-1 text-sm text-gray-600">
                {{ language === "ar" ? "ابحث عن المنتج المناسب، اختره، ثم أكمل التفاصيل المتبقية." : "Find the right product, select it, then complete remaining details." }}
              </p>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 gap-4 xl:grid-cols-[1fr_0.95fr]">
          <div class="space-y-3 rounded-[28px] border border-gray-200 bg-white p-5 shadow-sm">
            <h3 class="text-sm font-bold text-gray-900">{{ t("productDetails") }}</h3>

            <div class="space-y-1.5">
              <label class="text-xs font-semibold text-gray-900">{{ t("searchAumetProducts") }} *</label>
              <div class="relative">
                <Search class="absolute start-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                <input v-model="productName" type="text" :placeholder="t('searchProductName')" class="w-full h-11 ps-10 pe-40 border border-gray-300 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" />
              </div>
            </div>

            <div class="space-y-1.5">
              <label class="text-xs font-semibold text-gray-900">{{ t("barcode") }} *</label>
              <div class="relative">
                <input v-model="barcode" type="text" :placeholder="t('enterOrScanBarcode')" class="w-full h-11 ps-3 pe-28 border border-gray-300 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" />
                <div class="absolute end-1 top-1/2 -translate-y-1/2 flex items-center gap-1">
                  <button type="button" @click="generateBarcode" class="h-9 px-3 bg-teal-50 hover:bg-teal-100 text-teal-600 rounded-full text-xs font-semibold flex items-center gap-1.5">
                    <Barcode class="size-3.5" /> {{ t("generate") }}
                  </button>
                </div>
              </div>
            </div>

            <div class="space-y-1.5">
              <label class="text-xs font-semibold text-gray-900">{{ t("category") }} *</label>
              <select v-model="category" class="w-full h-11 px-3 pe-9 border border-gray-300 rounded-full text-sm bg-white">
                <option value="">{{ t("selectCategory") }}</option>
                <option value="medicine">{{ t("medicine") }}</option>
                <option value="supplement">{{ t("supplement") }}</option>
                <option value="equipment">{{ t("equipment") }}</option>
              </select>
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div class="space-y-1.5">
                <label class="text-xs font-semibold text-gray-900">{{ t("unitType") }} *</label>
                <select v-model="unitType" class="w-full h-11 px-3 border border-gray-300 rounded-full text-sm bg-white">
                  <option value="">{{ t("selectUnit") }}</option>
                  <option value="tablet">{{ t("tablet") }}</option>
                  <option value="capsule">{{ t("capsule") }}</option>
                  <option value="bottle">{{ t("bottle") }}</option>
                  <option value="box">{{ t("box") }}</option>
                </select>
              </div>
              <div class="space-y-1.5">
                <label class="text-xs font-semibold text-gray-900">{{ t("count") }} *</label>
                <input v-model="unitCount" type="text" :placeholder="t('count')" class="w-full h-11 px-3 border border-gray-300 rounded-full text-sm" />
              </div>
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div class="space-y-1.5">
                <label class="text-xs font-semibold text-gray-900">{{ t("sellingPrice") }} *</label>
                <div class="relative">
                  <span class="absolute start-3 top-1/2 -translate-y-1/2 text-xs text-gray-500 font-medium">JOD</span>
                  <input v-model="sellingPrice" type="text" placeholder="0.00" class="w-full h-11 ps-11 pe-3 border border-gray-300 rounded-full text-sm" />
                </div>
              </div>
              <div class="space-y-1.5">
                <label class="text-xs font-semibold text-gray-900">{{ t("taxRate") }} *</label>
                <select v-model="taxPercent" class="w-full h-11 px-3 border border-gray-300 rounded-full text-sm bg-white">
                  <option value="">{{ t("taxRate") }} %</option>
                  <option value="0">0%</option>
                  <option value="5">5%</option>
                  <option value="10">10%</option>
                  <option value="15">15%</option>
                </select>
              </div>
            </div>
          </div>

          <div class="bg-gradient-to-br from-teal-50 to-cyan-50 border-2 border-teal-200 rounded-[28px] p-4 max-h-[500px] overflow-y-auto">
            <div class="flex items-center gap-2 mb-3">
              <div class="size-7 bg-teal-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <Package class="size-4 text-white" :stroke-width="2" />
              </div>
              <div>
                <h3 class="text-sm font-bold text-gray-900">{{ t("firstBatchOptional") }}</h3>
                <p class="text-xs text-gray-600">{{ t("addInitialStock") }}</p>
              </div>
            </div>

            <div class="space-y-4">
              <div v-for="(batch, index) in batches" :key="batch.id" class="space-y-3 pb-3 border-b border-teal-200 last:border-0">
                <div v-if="index > 0" class="flex items-center justify-between">
                  <span class="text-xs font-semibold text-gray-700">{{ t("batchNumber") }} {{ index + 1 }}</span>
                  <button @click="removeBatch(batch.id)" class="text-red-600 hover:text-red-700 p-1">
                    <Trash2 class="size-3.5" />
                  </button>
                </div>

                <div class="grid grid-cols-2 gap-3">
                  <div class="space-y-1.5">
                    <label class="text-xs font-semibold text-gray-900">{{ t("warehouse") }}</label>
                    <select v-model="batch.warehouse" class="w-full h-10 px-3 border border-gray-300 rounded-full text-xs bg-white">
                      <option value="main">{{ t("main") }}</option>
                      <option value="warehouse2">Warehouse 2</option>
                    </select>
                  </div>
                  <div class="space-y-1.5">
                    <label class="text-xs font-semibold text-gray-900">{{ t("expiryDate") }}</label>
                    <input v-model="batch.expiryDate" type="text" :placeholder="t('selectDate')" class="w-full h-10 px-3 border border-gray-300 rounded-full text-xs bg-white" />
                  </div>
                </div>

                <div class="space-y-1.5">
                  <label class="text-xs font-semibold text-gray-900">{{ t("batchNumber") }}</label>
                  <input v-model="batch.batchNumber" type="text" :placeholder="t('batchNumber')" class="w-full h-10 px-3 border border-gray-300 rounded-full text-xs bg-white" />
                </div>

                <div class="grid grid-cols-3 gap-2">
                  <div class="space-y-1.5"><label class="text-xs font-semibold text-gray-900">{{ t("qty") }}</label><input v-model="batch.physicalQty" type="text" placeholder="0" class="w-full h-10 px-3 border border-gray-300 rounded-full text-xs bg-white" /></div>
                  <div class="space-y-1.5"><label class="text-xs font-semibold text-gray-900">{{ t("cost") }}</label><input v-model="batch.costPrice" type="text" placeholder="0.00" class="w-full h-10 px-3 border border-gray-300 rounded-full text-xs bg-white" /></div>
                  <div class="space-y-1.5"><label class="text-xs font-semibold text-gray-900">{{ t("price") }}</label><input v-model="batch.sellingPrice" type="text" placeholder="2.00" class="w-full h-10 px-3 border border-gray-300 rounded-full text-xs bg-white" /></div>
                </div>

                <div class="space-y-1.5">
                  <label class="text-xs font-semibold text-gray-900">{{ t("reason") }}</label>
                  <select v-model="batch.reason" class="w-full h-10 px-3 border border-gray-300 rounded-full text-xs bg-white">
                    <option value="">{{ t("selectReason") }}</option>
                    <option value="new">{{ t("newStock") }}</option>
                    <option value="restock">{{ t("restock") }}</option>
                  </select>
                </div>
              </div>

              <button @click="addBatch" class="text-xs font-semibold text-teal-700 hover:text-teal-800 flex items-center gap-1.5 pt-2 border-t border-teal-200 w-full">
                <Plus class="size-3.5" /> {{ t("addAnotherBatch") }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="px-6 py-4 border-t border-gray-200 bg-white flex items-center justify-between">
        <button @click="close" class="text-sm font-semibold text-teal-600 hover:text-teal-700">{{ t("needMoreFields") }}</button>
        <div class="flex items-center gap-3">
          <button @click="close" class="h-10 px-5 rounded-full text-sm font-semibold border border-gray-300">{{ t("cancel") }}</button>
          <button disabled class="h-10 px-6 bg-gray-300 text-gray-500 rounded-full text-sm font-semibold cursor-not-allowed">{{ t("saveProduct") }}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { Search, Barcode, Sparkles, Package, Plus, Trash2 } from "lucide-vue-next";
import { useLanguage } from "../../composables/useLanguage";

interface Batch { id: string; warehouse: string; expiryDate: string; batchNumber: string; physicalQty: string; costPrice: string; sellingPrice: string; reason: string }

const props = defineProps<{ open: boolean }>();
const emit = defineEmits<{ "update:open": [v: boolean] }>();
const { t, language } = useLanguage();

const productName = ref(""); const barcode = ref(""); const category = ref("");
const unitType = ref(""); const unitCount = ref(""); const sellingPrice = ref(""); const taxPercent = ref("");

const batches = ref<Batch[]>([{ id: "1", warehouse: "", expiryDate: "", batchNumber: "", physicalQty: "", costPrice: "", sellingPrice: "", reason: "" }]);

function addBatch() {
  batches.value.push({ id: Date.now().toString(), warehouse: "", expiryDate: "", batchNumber: "", physicalQty: "", costPrice: "", sellingPrice: "", reason: "" });
}
function removeBatch(id: string) {
  if (batches.value.length > 1) batches.value = batches.value.filter((b) => b.id !== id);
}
function generateBarcode() {
  barcode.value = Math.floor(100000000000 + Math.random() * 900000000000).toString();
}
function close() { emit("update:open", false); }

watch(() => props.open, (o) => {
  if (!o) {
    productName.value = ""; barcode.value = ""; category.value = "";
    unitType.value = ""; unitCount.value = ""; sellingPrice.value = ""; taxPercent.value = "";
  }
});
void language;
</script>
