<template>
  <main class="p-6 max-w-[1100px] mx-auto">
    <!-- Page Header -->
    <div class="flex items-center gap-3 mb-6">
      <RouterLink to="/" class="text-gray-400 hover:text-gray-600 transition-colors">
        <ArrowLeft :size="17" />
      </RouterLink>
      <h1 class="text-lg font-bold text-gray-900">Manual Update Stock</h1>
      <span class="text-gray-300 text-sm">·</span>
      <p class="text-sm text-gray-500">Manually update stock for selected products using an editable table.</p>
    </div>

    <!-- Main Card -->
    <div class="bg-white rounded-2xl border border-gray-200 shadow-sm">
      <div v-if="addedProducts.length === 0" class="flex items-stretch min-h-[420px]">
        <!-- Left: Empty State -->
        <div class="flex-1 p-10 flex flex-col justify-center">
          <div class="w-12 h-12 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center mb-5">
            <Package :size="22" class="text-teal-600" />
          </div>

          <h2 class="text-xl font-bold text-gray-900 mb-2">No products added yet</h2>
          <p class="text-sm text-gray-500 mb-6 max-w-sm leading-relaxed">
            Browse Aumet Core products and add them here to start updating stock manually.
          </p>

          <!-- Reward Banner -->
          <div class="flex items-start gap-3 border border-orange-100 bg-orange-50 rounded-xl px-4 py-3.5 mb-7 max-w-sm">
            <div class="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center shrink-0 mt-0.5">
              <Gift :size="16" class="text-orange-500" />
            </div>
            <div>
              <p class="text-[10px] font-bold text-orange-500 uppercase tracking-wider mb-0.5">Welcome Reward</p>
              <p class="text-sm font-bold text-gray-800">Get JOD 3.5 when you upload your inventory</p>
              <p class="text-xs text-gray-500 mt-0.5">Added JOD 3.5 to your wallet for Upload Your Inventory</p>
            </div>
          </div>

          <button
            class="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors w-fit shadow-sm"
            @click="showModal = true"
          >
            <Plus :size="15" />
            Add Product
          </button>
        </div>

        <!-- Right: Illustration -->
        <div class="w-72 p-8 flex items-center justify-center border-l border-gray-100">
          <div class="w-full rounded-xl border-2 border-dashed border-gray-200 p-4 space-y-2.5">
            <div class="flex items-center gap-2 mb-3">
              <div class="w-2.5 h-2.5 rounded-full bg-teal-400"></div>
              <div class="h-2.5 bg-gray-200 rounded-full flex-1"></div>
            </div>
            <div v-for="i in 4" :key="i" class="flex items-center gap-2">
              <div class="w-8 h-6 rounded bg-gray-100 shrink-0"></div>
              <div class="flex-1 space-y-1.5">
                <div class="h-2 bg-gray-100 rounded-full" :style="{ width: `${70 - i * 8}%` }"></div>
                <div class="h-2 bg-gray-100 rounded-full w-2/3"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Products Table (when products added) -->
      <div v-else class="p-6">
        <div class="flex items-center justify-between mb-4">
          <p class="text-sm font-semibold text-gray-700">{{ addedProducts.length }} product{{ addedProducts.length > 1 ? 's' : '' }} added</p>
          <button
            class="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
            @click="showModal = true"
          >
            <Plus :size="13" />
            Add Product
          </button>
        </div>
        <div class="border border-gray-200 rounded-xl overflow-hidden">
          <table class="w-full text-sm">
            <thead class="bg-gray-50 border-b border-gray-200">
              <tr>
                <th class="text-left px-4 py-2.5 text-xs font-semibold text-gray-500">PRODUCT</th>
                <th class="text-left px-4 py-2.5 text-xs font-semibold text-gray-500">CATEGORY</th>
                <th class="text-left px-4 py-2.5 text-xs font-semibold text-gray-500">MANUFACTURER</th>
                <th class="text-left px-4 py-2.5 text-xs font-semibold text-gray-500">AVG COST PRICE</th>
                <th class="text-left px-4 py-2.5 text-xs font-semibold text-gray-500">SELL PRICE</th>
                <th class="text-left px-4 py-2.5 text-xs font-semibold text-gray-500">QTY</th>
                <th class="px-4 py-2.5"></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="p in addedProducts" :key="p.barcode" class="border-b border-gray-100 last:border-0 hover:bg-gray-50">
                <td class="px-4 py-3">
                  <div class="flex items-center gap-3">
                    <div class="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
                      <Pill :size="14" class="text-gray-400" />
                    </div>
                    <div>
                      <p class="font-medium text-gray-800 text-xs leading-snug">{{ p.name }}</p>
                      <p class="text-[11px] text-teal-600 font-semibold">{{ p.code }}</p>
                      <p class="text-[10px] text-gray-400 font-mono">{{ p.barcode }}</p>
                    </div>
                  </div>
                </td>
                <td class="px-4 py-3 text-xs text-gray-600">{{ p.category }}</td>
                <td class="px-4 py-3 text-xs text-gray-600">{{ p.manufacturer }}</td>
                <td class="px-4 py-3 text-xs text-gray-700 font-medium">JOD {{ p.costPrice }}</td>
                <td class="px-4 py-3">
                  <input
                    v-model="p.sellPrice"
                    type="number"
                    step="0.01"
                    class="w-20 border border-gray-200 rounded-lg px-2 py-1 text-xs text-gray-800 focus:outline-none focus:ring-1 focus:ring-teal-500"
                  />
                </td>
                <td class="px-4 py-3">
                  <input
                    v-model="p.qty"
                    type="number"
                    min="0"
                    class="w-16 border border-gray-200 rounded-lg px-2 py-1 text-xs text-gray-800 focus:outline-none focus:ring-1 focus:ring-teal-500"
                  />
                </td>
                <td class="px-4 py-3">
                  <button class="text-gray-300 hover:text-red-400 transition-colors" @click="removeProduct(p.barcode)">
                    <X :size="14" />
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="flex justify-end mt-4">
          <button class="flex items-center gap-2 bg-teal-600 text-white px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-teal-700 transition-colors">
            <Save :size="14" />
            Save Stock Update
          </button>
        </div>
      </div>
    </div>

    <!-- ── Add Product Modal ── -->
    <Transition name="fade">
      <div v-if="showModal" class="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" @click.self="showModal = false">
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-[1000px] h-[85vh] flex flex-col overflow-hidden">
          <!-- Modal Header -->
          <div class="flex items-start justify-between px-6 pt-6 pb-4 border-b border-gray-100">
            <div>
              <h3 class="text-lg font-bold text-gray-900">Add Product</h3>
              <p class="text-sm text-gray-500 mt-0.5">Choose the right source to add products to the table</p>
            </div>
            <button class="text-gray-400 hover:text-gray-700 transition-colors p-1" @click="showModal = false">
              <X :size="18" />
            </button>
          </div>

          <!-- Source Tabs -->
          <div class="px-6 pt-4 pb-3 flex gap-3">
            <button
              class="flex-1 flex items-start gap-3 border rounded-xl px-4 py-3.5 text-left transition-all"
              :class="activeTab === 'browse'
                ? 'border-teal-400 bg-teal-50 ring-1 ring-teal-300'
                : 'border-gray-200 hover:border-gray-300 bg-white'"
              @click="activeTab = 'browse'"
            >
              <div class="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                   :class="activeTab === 'browse' ? 'bg-teal-100' : 'bg-gray-100'">
                <Search :size="15" :class="activeTab === 'browse' ? 'text-teal-600' : 'text-gray-400'" />
              </div>
              <div>
                <p class="text-sm font-semibold" :class="activeTab === 'browse' ? 'text-teal-700' : 'text-gray-700'">Browse Aumet Core</p>
                <p class="text-xs text-gray-500 mt-0.5">Search and add from the Aumet Core catalog</p>
              </div>
            </button>

            <button
              class="flex-1 flex items-start gap-3 border rounded-xl px-4 py-3.5 text-left transition-all"
              :class="activeTab === 'create'
                ? 'border-violet-400 bg-violet-50 ring-1 ring-violet-300'
                : 'border-gray-200 hover:border-gray-300 bg-white'"
              @click="activeTab = 'create'"
            >
              <div class="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                   :class="activeTab === 'create' ? 'bg-violet-100' : 'bg-gray-100'">
                <Gem :size="15" :class="activeTab === 'create' ? 'text-violet-600' : 'text-gray-400'" />
              </div>
              <div>
                <p class="text-sm font-semibold" :class="activeTab === 'create' ? 'text-violet-700' : 'text-gray-700'">Create Product</p>
                <p class="text-xs text-gray-500 mt-0.5">Create a new product and add it directly to the table</p>
              </div>
            </button>
          </div>

          <!-- Browse Tab Content -->
          <div v-if="activeTab === 'browse'" class="flex flex-col flex-1 overflow-hidden px-6 pb-2">
            <!-- Search Bar -->
            <div class="flex gap-2 mb-3">
              <div class="relative flex-1">
                <Search :size="14" class="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  v-model="searchQuery"
                  type="text"
                  placeholder="Search by code, product name, barcode, or manufacturer..."
                  class="w-full border border-gray-200 rounded-lg pl-9 pr-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>
              <button class="flex items-center gap-1.5 border border-gray-200 text-gray-600 px-3.5 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
                <SlidersHorizontal :size="14" />
                Filters
              </button>
            </div>

            <!-- Product List -->
            <div class="flex-1 min-h-0 overflow-y-auto border border-gray-100 rounded-xl">
              <table class="w-full text-sm">
                <thead class="sticky top-0 bg-white border-b border-gray-200 z-10">
                  <tr>
                    <th class="text-left py-3 px-4 text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Product</th>
                    <th class="text-left py-3 px-4 text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Category</th>
                    <th class="text-left py-3 px-4 text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Manufacturer</th>
                    <th class="text-left py-3 px-4 text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Avg Cost Price</th>
                    <th class="text-left py-3 px-4 text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Sell Price</th>
                    <th class="py-3 px-4 text-[10px] font-semibold text-gray-400 uppercase tracking-wider text-right">Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="p in filteredCatalog"
                    :key="p.barcode"
                    class="border-b border-gray-100 last:border-0 hover:bg-gray-50 cursor-pointer transition-colors"
                    @click="toggleSelect(p)"
                  >
                    <td class="py-3 px-4">
                      <div class="flex items-center gap-3">
                        <ProductThumbnail :variant="p.thumb" />
                        <div>
                          <p class="font-semibold text-gray-800 text-[13px] leading-snug">{{ p.name }}</p>
                          <div class="flex items-center gap-1.5 mt-0.5">
                            <span class="text-[10px] text-teal-600 font-semibold">{{ p.code }}</span>
                            <span class="text-gray-300 text-[10px]">·</span>
                            <span class="text-[10px] text-gray-400 font-mono">{{ p.barcode }}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td class="py-3 px-4 text-xs text-gray-600">{{ p.category }}</td>
                    <td class="py-3 px-4 text-xs text-gray-600">{{ p.manufacturer }}</td>
                    <td class="py-3 px-4 text-xs font-medium text-gray-700">JOD {{ p.costPrice }}</td>
                    <td class="py-3 px-4 text-xs font-medium text-gray-700">JOD {{ p.sellPrice }}</td>
                    <td class="py-3 px-4">
                      <div class="flex justify-end">
                        <div
                          class="w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors"
                          :class="isSelected(p) ? 'bg-teal-600 border-teal-600' : 'border-gray-300 bg-white'"
                        >
                          <Check v-if="isSelected(p)" :size="10" class="text-white" stroke-width="3" />
                        </div>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Create Product Tab Content -->
          <div v-if="activeTab === 'create'" class="px-6 py-5 flex-1 overflow-y-auto">
            <div class="grid grid-cols-2 gap-x-5 gap-y-5">
              <!-- Code -->
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-1.5">Code</label>
                <input
                  v-model="newProduct.code"
                  type="text"
                  placeholder="Enter product code"
                  class="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                />
              </div>

              <!-- Barcode -->
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-1.5">Barcode</label>
                <div class="relative">
                  <Barcode :size="14" class="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    v-model="newProduct.barcode"
                    type="text"
                    placeholder="Enter barcode"
                    class="w-full border border-gray-200 rounded-lg pl-10 pr-3.5 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                  />
                </div>
              </div>

              <!-- Product Name EN -->
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-1.5">Product Name EN</label>
                <input
                  v-model="newProduct.name"
                  type="text"
                  placeholder="Enter English product name"
                  class="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                />
              </div>

              <!-- Product Name AR -->
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-1.5">Product Name AR</label>
                <input
                  v-model="newProduct.nameAr"
                  type="text"
                  dir="rtl"
                  placeholder="Enter Arabic product name"
                  class="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent text-right"
                />
              </div>

              <!-- Category -->
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-1.5">Category</label>
                <select
                  v-model="newProduct.category"
                  class="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent bg-white appearance-none bg-no-repeat bg-right pr-9"
                  style="background-image: url(&quot;data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E&quot;); background-position: right 0.75rem center;"
                >
                  <option v-for="c in createCategories" :key="c" :value="c">{{ c }}</option>
                </select>
              </div>

              <!-- Current Stock -->
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-1.5">Current Stock</label>
                <input
                  v-model="newProduct.qty"
                  type="number"
                  min="0"
                  class="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          <!-- Modal Footer -->
          <div class="px-6 py-4 border-t border-gray-100 flex items-center justify-between bg-white">
            <p v-if="activeTab === 'browse'" class="text-xs text-gray-500">
              <span class="font-semibold text-teal-600">{{ selectedProducts.length }}</span> product{{ selectedProducts.length !== 1 ? 's' : '' }} selected
            </p>
            <p v-else class="text-xs text-gray-500">
              This product will be added as a normal editable row in the manual stock table.
            </p>
            <div class="flex gap-3 items-center">
              <button
                class="text-sm font-medium text-gray-600 hover:text-gray-800 px-5 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                @click="showModal = false"
              >
                Cancel
              </button>
              <button
                v-if="activeTab === 'browse'"
                class="flex items-center gap-2 bg-teal-600 text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-teal-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                :disabled="selectedProducts.length === 0"
                @click="confirmAdd"
              >
                <Plus :size="14" />
                Add {{ selectedProducts.length || '' }} Product{{ selectedProducts.length !== 1 ? 's' : '' }}
              </button>
              <button
                v-else
                class="flex items-center gap-2 bg-violet-500 text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-violet-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                :disabled="!newProduct.name"
                @click="confirmAdd"
              >
                Add Product
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </main>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from "vue";
import { RouterLink } from "vue-router";
import {
  ArrowLeft, Package, Gift, Plus, X, Search, SlidersHorizontal,
  Check, Sparkles, Save, Pill, Gem, Barcode,
} from "lucide-vue-next";
import ProductThumbnail from "../components/ProductThumbnail.vue";

const showModal = ref(false);
const activeTab = ref<"browse" | "create">("browse");
const searchQuery = ref("");
const selectedProducts = ref<typeof catalog>([]);

interface Product {
  name: string; code: string; barcode: string; category: string;
  manufacturer: string; costPrice: string; sellPrice: string;
  thumb: string; qty: number;
}

const addedProducts = ref<Product[]>([]);

const catalog: Product[] = [
  { name: "Pantoprazole Sodium 40 mg", code: "AC-201-1", barcode: "6250123451123", category: "Gastrointestinal", manufacturer: "Aumet Pharma", costPrice: "11.20", sellPrice: "18.50", thumb: "capsule", qty: 0 },
  { name: "Amoxicillin 500 mg Capsules", code: "AC-105-1", barcode: "6250123451234", category: "Antibiotics", manufacturer: "Hikma", costPrice: "5.40", sellPrice: "9.75", thumb: "pill", qty: 0 },
  { name: "Atorvastatin 20 mg Tablets", code: "AC-330-1", barcode: "6250123451345", category: "Cardiovascular", manufacturer: "Pfizer", costPrice: "14.30", sellPrice: "22.00", thumb: "heart", qty: 0 },
  { name: "Vitamin D3 1,000 IU Softgels", code: "AC-410-1", barcode: "6250123451456", category: "Vitamins & Supplements", manufacturer: "Jamjoom Pharma", costPrice: "8.90", sellPrice: "14.25", thumb: "vitamin", qty: 0 },
  { name: "Metformin 500 mg Tablets", code: "AC-220-1", barcode: "6250123451567", category: "Antidiabetics", manufacturer: "Hikma", costPrice: "3.20", sellPrice: "6.00", thumb: "tablet", qty: 0 },
  { name: "Omeprazole 20 mg Capsules", code: "AC-202-1", barcode: "6250123451678", category: "Gastrointestinal", manufacturer: "Aumet Pharma", costPrice: "4.80", sellPrice: "8.50", thumb: "capsule", qty: 0 },
  { name: "Cetirizine 10 mg Tablets", code: "AC-315-1", barcode: "6250123451789", category: "Antihistamines", manufacturer: "Pharma Int.", costPrice: "2.10", sellPrice: "4.50", thumb: "tablet", qty: 0 },
  { name: "Amlodipine 5 mg Tablets", code: "AC-332-1", barcode: "6250123451890", category: "Cardiovascular", manufacturer: "Pfizer", costPrice: "6.75", sellPrice: "11.00", thumb: "heart", qty: 0 },
  { name: "Salbutamol Inhaler 100 mcg", code: "AC-540-1", barcode: "6250123451901", category: "Respiratory", manufacturer: "GSK", costPrice: "12.00", sellPrice: "19.50", thumb: "bottle", qty: 0 },
  { name: "Cough Syrup 120 ml", code: "AC-545-1", barcode: "6250123452012", category: "Respiratory", manufacturer: "Hikma", costPrice: "3.90", sellPrice: "7.25", thumb: "bottle", qty: 0 },
  { name: "Hydrocortisone Cream 1%", code: "AC-620-1", barcode: "6250123452123", category: "Dermatology", manufacturer: "Galderma", costPrice: "4.50", sellPrice: "8.00", thumb: "cream", qty: 0 },
  { name: "Insulin Glargine 100 IU/ml", code: "AC-225-1", barcode: "6250123452234", category: "Antidiabetics", manufacturer: "Sanofi", costPrice: "28.00", sellPrice: "42.00", thumb: "syringe", qty: 0 },
  { name: "Eye Drops Lubricant 10 ml", code: "AC-710-1", barcode: "6250123452345", category: "Ophthalmology", manufacturer: "Alcon", costPrice: "5.80", sellPrice: "9.50", thumb: "drops", qty: 0 },
  { name: "Ibuprofen 400 mg Tablets", code: "AC-110-1", barcode: "6250123452456", category: "Analgesics", manufacturer: "Hikma", costPrice: "2.40", sellPrice: "4.75", thumb: "pill", qty: 0 },
  { name: "Paracetamol 500 mg Tablets", code: "AC-111-1", barcode: "6250123452567", category: "Analgesics", manufacturer: "Aumet Pharma", costPrice: "1.20", sellPrice: "2.80", thumb: "tablet", qty: 0 },
  { name: "Multivitamin Complex Tablets", code: "AC-415-1", barcode: "6250123452678", category: "Vitamins & Supplements", manufacturer: "Pharma Int.", costPrice: "9.50", sellPrice: "15.00", thumb: "vitamin", qty: 0 },
  { name: "Loratadine 10 mg Tablets", code: "AC-316-1", barcode: "6250123452789", category: "Antihistamines", manufacturer: "Bayer", costPrice: "3.80", sellPrice: "6.90", thumb: "pill", qty: 0 },
  { name: "Azithromycin 500 mg", code: "AC-106-1", barcode: "6250123452890", category: "Antibiotics", manufacturer: "Pfizer", costPrice: "8.20", sellPrice: "13.50", thumb: "capsule", qty: 0 },
];

const filteredCatalog = computed(() => {
  const q = searchQuery.value.toLowerCase();
  if (!q) return catalog;
  return catalog.filter(p =>
    p.name.toLowerCase().includes(q) ||
    p.code.toLowerCase().includes(q) ||
    p.barcode.includes(q) ||
    p.manufacturer.toLowerCase().includes(q)
  );
});

function isSelected(p: Product) {
  return selectedProducts.value.some(s => s.barcode === p.barcode);
}

function toggleSelect(p: Product) {
  if (isSelected(p)) {
    selectedProducts.value = selectedProducts.value.filter(s => s.barcode !== p.barcode);
  } else {
    selectedProducts.value = [...selectedProducts.value, p];
  }
}

const newProduct = reactive({
  code: "", barcode: "", name: "", nameAr: "",
  category: "OTC & Allergy", qty: "0",
  manufacturer: "", sellPrice: "",
});

const createCategories = [
  "OTC & Allergy", "Prescription", "Analgesics", "Antibiotics",
  "Vitamins & Supplements", "Antidiabetics", "Cardiovascular",
  "Gastrointestinal", "Antihistamines", "Dermatology",
  "Respiratory", "Ophthalmology", "Pediatrics",
];

function confirmAdd() {
  if (activeTab.value === "browse") {
    const toAdd = selectedProducts.value.filter(
      s => !addedProducts.value.some(a => a.barcode === s.barcode)
    );
    addedProducts.value.push(...toAdd.map(p => ({ ...p })));
    selectedProducts.value = [];
  } else {
    if (!newProduct.name) return;
    addedProducts.value.push({
      name: newProduct.name,
      code: newProduct.code || `AC-${Math.floor(Math.random() * 900 + 100)}-1`,
      barcode: newProduct.barcode || `6250${Math.floor(Math.random() * 1e9).toString().padStart(9, "0")}`,
      category: newProduct.category || "General",
      manufacturer: newProduct.manufacturer || "—",
      costPrice: newProduct.sellPrice ? (parseFloat(newProduct.sellPrice) * 0.6).toFixed(2) : "0.00",
      sellPrice: newProduct.sellPrice || "0.00",
      thumb: "pill",
      qty: parseInt(newProduct.qty) || 0,
    });
    Object.assign(newProduct, {
      code: "", barcode: "", name: "", nameAr: "",
      category: "OTC & Allergy", qty: "0",
      manufacturer: "", sellPrice: "",
    });
  }
  showModal.value = false;
}

function removeProduct(barcode: string) {
  addedProducts.value = addedProducts.value.filter(p => p.barcode !== barcode);
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
