<template>
  <main class="p-6 max-w-[860px] mx-auto">
    <RouterLink to="/" class="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 mb-5 transition-colors">
      <ArrowLeft :size="15" />
      Back to Inventory Setup
    </RouterLink>

    <div class="bg-white rounded-2xl border border-gray-200 shadow-sm">
      <!-- Header -->
      <div class="px-8 py-6 border-b border-gray-100 flex items-center gap-4">
        <div class="w-10 h-10 rounded-xl bg-teal-100 flex items-center justify-center shrink-0">
          <PlusCircle :size="20" class="text-teal-600" />
        </div>
        <div>
          <h2 class="text-xl font-bold text-gray-900">Add Product Manually</h2>
          <p class="text-sm text-gray-500">Fill in the product details below to add it to your inventory.</p>
        </div>
      </div>

      <form @submit.prevent="handleSubmit" class="p-8 space-y-7">

        <!-- Basic Info -->
        <section>
          <h3 class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Basic Information</h3>
          <div class="grid grid-cols-2 gap-4">
            <div class="col-span-2">
              <label class="block text-sm font-medium text-gray-700 mb-1.5">Product Name <span class="text-red-500">*</span></label>
              <input
                v-model="form.name"
                type="text"
                placeholder="e.g. Paracetamol 500mg"
                class="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
                required
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1.5">Barcode / SKU</label>
              <div class="relative">
                <input
                  v-model="form.barcode"
                  type="text"
                  placeholder="Scan or enter barcode"
                  class="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition pr-10"
                />
                <Barcode :size="16" class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1.5">Category</label>
              <select
                v-model="form.category"
                class="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition bg-white"
              >
                <option value="">Select category</option>
                <option v-for="c in categories" :key="c" :value="c">{{ c }}</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1.5">Manufacturer</label>
              <input
                v-model="form.manufacturer"
                type="text"
                placeholder="e.g. Hikma Pharmaceuticals"
                class="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1.5">Unit of Measure</label>
              <select
                v-model="form.unit"
                class="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition bg-white"
              >
                <option value="tablet">Tablet</option>
                <option value="capsule">Capsule</option>
                <option value="bottle">Bottle</option>
                <option value="box">Box</option>
                <option value="vial">Vial</option>
                <option value="tube">Tube</option>
                <option value="sachet">Sachet</option>
              </select>
            </div>
          </div>
        </section>

        <!-- Pricing & Stock -->
        <section>
          <h3 class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Pricing & Stock</h3>
          <div class="grid grid-cols-3 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1.5">Selling Price (JOD) <span class="text-red-500">*</span></label>
              <div class="relative">
                <span class="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-gray-400 font-medium">JOD</span>
                <input
                  v-model="form.sellingPrice"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  class="w-full border border-gray-200 rounded-lg pl-12 pr-3.5 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
                  required
                />
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1.5">Cost Price (JOD)</label>
              <div class="relative">
                <span class="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-gray-400 font-medium">JOD</span>
                <input
                  v-model="form.costPrice"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  class="w-full border border-gray-200 rounded-lg pl-12 pr-3.5 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
                />
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1.5">Opening Quantity <span class="text-red-500">*</span></label>
              <input
                v-model="form.quantity"
                type="number"
                min="0"
                placeholder="0"
                class="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
                required
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1.5">Low Stock Alert</label>
              <input
                v-model="form.lowStock"
                type="number"
                min="0"
                placeholder="e.g. 10"
                class="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1.5">VAT %</label>
              <select
                v-model="form.vat"
                class="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition bg-white"
              >
                <option value="0">0% (Exempt)</option>
                <option value="5">5%</option>
                <option value="10">10%</option>
                <option value="16">16%</option>
              </select>
            </div>
          </div>
        </section>

        <!-- Batch / Expiry -->
        <section>
          <h3 class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Batch & Expiry</h3>
          <div class="grid grid-cols-3 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1.5">Batch Number</label>
              <input
                v-model="form.batchNumber"
                type="text"
                placeholder="e.g. BT-2024-001"
                class="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1.5">Expiry Date</label>
              <input
                v-model="form.expiryDate"
                type="date"
                class="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1.5">Storage Condition</label>
              <select
                v-model="form.storage"
                class="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition bg-white"
              >
                <option value="room">Room Temperature</option>
                <option value="fridge">Refrigerated (2–8°C)</option>
                <option value="frozen">Frozen</option>
                <option value="controlled">Controlled Substance</option>
              </select>
            </div>
          </div>
        </section>

        <!-- Marketplace Toggle -->
        <section>
          <h3 class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Marketplace</h3>
          <div class="flex items-center justify-between border border-gray-200 rounded-xl px-4 py-3.5">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 rounded-lg bg-teal-100 flex items-center justify-center">
                <Store :size="15" class="text-teal-600" />
              </div>
              <div>
                <p class="text-sm font-semibold text-gray-800">List on P2P Marketplace</p>
                <p class="text-xs text-gray-500">Allow other pharmacies to purchase this item from you</p>
              </div>
            </div>
            <button
              type="button"
              class="relative w-11 h-6 rounded-full transition-colors duration-200"
              :class="form.listOnMarketplace ? 'bg-teal-500' : 'bg-gray-200'"
              @click="form.listOnMarketplace = !form.listOnMarketplace"
            >
              <span
                class="absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200"
                :class="form.listOnMarketplace ? 'translate-x-5' : 'translate-x-0.5'"
              />
            </button>
          </div>
        </section>

        <!-- Actions -->
        <div class="flex items-center justify-between pt-4 border-t border-gray-100">
          <RouterLink to="/" class="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors">
            Cancel
          </RouterLink>
          <div class="flex items-center gap-3">
            <button
              type="button"
              class="flex items-center gap-2 border border-gray-200 text-gray-600 px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-gray-50 transition-colors"
              @click="saveAndAddAnother"
            >
              <Plus :size="14" />
              Save & Add Another
            </button>
            <button
              type="submit"
              class="flex items-center gap-2 bg-teal-600 text-white px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-teal-700 transition-colors shadow-sm"
            >
              <Save :size="14" />
              Save Product
            </button>
          </div>
        </div>
      </form>
    </div>

    <!-- Success Toast -->
    <Transition name="slide-up">
      <div v-if="showToast" class="fixed bottom-6 right-6 flex items-center gap-3 bg-gray-900 text-white px-5 py-3.5 rounded-xl shadow-xl z-50">
        <CheckCircle :size="18" class="text-teal-400" />
        <p class="text-sm font-medium">{{ toastMsg }}</p>
      </div>
    </Transition>
  </main>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import { RouterLink } from "vue-router";
import {
  ArrowLeft, PlusCircle, Barcode, Store, Plus,
  Save, CheckCircle,
} from "lucide-vue-next";

const categories = [
  "Analgesics", "Antibiotics", "Vitamins & Supplements",
  "Antidiabetics", "Cardiovascular", "Dermatology",
  "Respiratory", "Gastrointestinal", "Ophthalmology",
  "Pediatrics", "OTC General",
];

const emptyForm = () => ({
  name: "",
  barcode: "",
  category: "",
  manufacturer: "",
  unit: "tablet",
  sellingPrice: "",
  costPrice: "",
  quantity: "",
  lowStock: "",
  vat: "0",
  batchNumber: "",
  expiryDate: "",
  storage: "room",
  listOnMarketplace: false,
});

const form = reactive(emptyForm());
const showToast = ref(false);
const toastMsg = ref("");

function showSuccess(msg: string) {
  toastMsg.value = msg;
  showToast.value = true;
  setTimeout(() => (showToast.value = false), 3000);
}

function handleSubmit() {
  showSuccess(`"${form.name}" saved to inventory!`);
}

function saveAndAddAnother() {
  if (!form.name || !form.sellingPrice || !form.quantity) return;
  showSuccess(`"${form.name}" saved — add another product.`);
  Object.assign(form, emptyForm());
}
</script>

<style scoped>
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.3s ease;
}
.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(12px);
  opacity: 0;
}
</style>
