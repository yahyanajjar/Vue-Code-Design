<template>
  <div v-if="open" class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" @click.self="close">
    <div class="max-w-[1080px] w-full overflow-hidden rounded-[28px] border border-gray-200 bg-white shadow-xl flex flex-col max-h-[90vh]">
      <div class="border-b border-gray-200 px-6 py-5">
        <div class="flex items-start gap-3">
          <div class="flex size-11 items-center justify-center rounded-2xl bg-teal-50 text-teal-600">
            <Link2 class="size-5" :stroke-width="2.2" />
          </div>
          <div class="min-w-0">
            <h2 class="text-lg font-semibold text-gray-900">
              {{ language === "ar" ? "ربط مرجع Aumet" : "Manage Aumet Reference" }}
            </h2>
            <p class="mt-1 text-sm text-gray-500">
              {{ language === "ar" ? "ابحث في بيانات Aumet Core لربط هذا المنتج أو تعديل المرجع الحالي." : "Search Aumet Core data to link this inventory product or update its current reference." }}
            </p>
          </div>
        </div>
      </div>

      <div class="grid gap-0 lg:grid-cols-[360px_minmax(0,1fr)] flex-1 min-h-0 overflow-hidden">
        <div class="border-b border-gray-200 bg-gray-50 p-5 lg:border-b-0 lg:border-e overflow-y-auto">
          <div class="rounded-3xl border border-gray-200 bg-white p-4 shadow-sm">
            <p class="text-xs font-semibold uppercase tracking-[0.16em] text-gray-500">
              {{ language === "ar" ? "منتج المخزون" : "Inventory Product" }}
            </p>
            <h3 class="mt-3 text-base font-semibold text-gray-900">{{ inventoryProduct?.name }}</h3>
            <div class="mt-3 flex flex-wrap gap-2 text-xs text-gray-600">
              <span class="rounded-full bg-gray-100 px-2.5 py-1">{{ t("code") }}: {{ inventoryProduct?.code }}</span>
              <span class="rounded-full bg-gray-100 px-2.5 py-1">{{ t("barcode") }}: {{ inventoryProduct?.barcode }}</span>
            </div>

            <hr class="my-4 border-gray-200" />

            <div class="space-y-3">
              <div>
                <p class="text-xs font-semibold uppercase tracking-[0.16em] text-gray-500">
                  {{ language === "ar" ? "المرجع الحالي" : "Current Reference" }}
                </p>
                <div v-if="currentReference" class="mt-2 rounded-2xl border border-emerald-200 bg-emerald-50 p-3">
                  <div class="flex items-center justify-between gap-3">
                    <div>
                      <p class="text-sm font-semibold text-emerald-900">{{ language === "ar" ? currentReference.nameAr : currentReference.nameEn }}</p>
                      <p class="mt-1 text-xs text-emerald-700">{{ currentReference.code }}</p>
                    </div>
                    <span class="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] text-emerald-700">{{ t("linked") }}</span>
                  </div>
                </div>
                <div v-else class="mt-2 rounded-2xl border border-dashed border-gray-300 bg-white p-3 text-sm text-gray-500">
                  {{ language === "ar" ? "لا يوجد مرجع مرتبط حالياً." : "No Aumet reference is linked yet." }}
                </div>
              </div>

              <div>
                <p class="text-xs font-semibold uppercase tracking-[0.16em] text-gray-500">
                  {{ language === "ar" ? "الاختيار الجديد" : "New Selection" }}
                </p>
                <div v-if="selectedReference" class="mt-2 rounded-2xl border border-teal-200 bg-gradient-to-br from-teal-50 to-cyan-50 p-3">
                  <div class="flex items-start justify-between gap-3">
                    <div class="min-w-0">
                      <p class="truncate text-sm font-semibold text-teal-900">{{ language === "ar" ? selectedReference.nameAr : selectedReference.nameEn }}</p>
                      <p class="mt-1 text-xs text-teal-700">{{ selectedReference.code }}</p>
                      <p class="mt-1 text-xs text-teal-700/80">{{ language === "ar" ? selectedReference.manufacturerAr : selectedReference.manufacturerEn }}</p>
                    </div>
                    <button @click="draftReferenceId = null" class="inline-flex size-8 items-center justify-center rounded-full border border-red-200 bg-white text-red-600 hover:bg-red-50">
                      <Unlink2 class="size-4" />
                    </button>
                  </div>
                </div>
                <div v-else class="mt-2 rounded-2xl border border-dashed border-gray-300 bg-white p-3 text-sm text-gray-500">
                  {{ language === "ar" ? "اختر منتجاً من نتائج البحث لربطه بهذا المنتج." : "Choose a product from the search results to link it to this inventory item." }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="flex min-h-0 flex-col bg-white">
          <div class="border-b border-gray-200 px-6 py-4">
            <div class="relative">
              <Search class="absolute start-3 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
              <input
                v-model="query"
                :placeholder="language === 'ar' ? 'ابحث بالاسم أو الكود أو الباركود في Aumet Core' : 'Search Aumet Core by name, code, or barcode'"
                class="h-11 w-full rounded-full border border-gray-300 ps-10 pe-4 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>
          <div class="h-[420px] overflow-y-auto px-6 py-4">
            <div v-if="filteredProducts.length === 0" class="rounded-3xl border border-dashed border-amber-300 bg-gradient-to-br from-amber-50 to-orange-50 px-4 py-10 text-center">
              <p class="text-sm font-semibold text-gray-900">{{ language === "ar" ? "لم يتم العثور على نتائج مطابقة" : "No matching Aumet Core products found" }}</p>
            </div>
            <div v-else class="space-y-3 pb-1">
              <button
                v-for="p in filteredProducts"
                :key="p.id"
                type="button"
                @click="toggleSelect(p.id)"
                :class="['flex w-full items-start gap-3 rounded-2xl border p-3 text-start transition-colors', draftReferenceId === p.id ? 'border-teal-300 bg-teal-50' : 'border-gray-200 bg-white hover:border-teal-200 hover:bg-teal-50/40']"
              >
                <div class="size-12 shrink-0 overflow-hidden rounded-xl border border-gray-200 bg-gray-50">
                  <img :src="p.imageUrl" :alt="language === 'ar' ? p.nameAr : p.nameEn" class="size-full object-cover" loading="lazy" />
                </div>
                <div class="min-w-0 flex-1">
                  <div class="flex items-start justify-between gap-3">
                    <div class="min-w-0">
                      <p class="truncate text-sm font-semibold text-gray-900">{{ language === "ar" ? p.nameAr : p.nameEn }}</p>
                      <p class="mt-1 text-xs text-gray-500">{{ language === "ar" ? p.subtitleAr : p.subtitleEn }}</p>
                    </div>
                    <div :class="['flex size-5 shrink-0 items-center justify-center rounded-full border', draftReferenceId === p.id ? 'border-teal-500 bg-teal-500 text-white' : 'border-gray-300 bg-white text-transparent']">
                      <Check class="size-3" />
                    </div>
                  </div>
                  <div class="mt-2 flex flex-wrap gap-2 text-[11px] text-gray-600">
                    <span class="rounded-full bg-gray-100 px-2 py-0.5">{{ p.code }}</span>
                    <span class="rounded-full bg-gray-100 px-2 py-0.5">{{ p.barcode }}</span>
                    <span class="rounded-full bg-gray-100 px-2 py-0.5">{{ language === "ar" ? p.manufacturerAr : p.manufacturerEn }}</span>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="border-t border-gray-200 px-6 py-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
        <button @click="close" class="rounded-full border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
          {{ language === "ar" ? "إلغاء" : "Cancel" }}
        </button>
        <button @click="removeRef" class="rounded-full border border-red-200 text-red-700 hover:bg-red-50 px-4 py-2 text-sm">
          {{ language === "ar" ? "إزالة المرجع" : "Remove Reference" }}
        </button>
        <button :disabled="!selectedReference && !currentReference" @click="save" class="rounded-full bg-teal-500 text-white px-4 py-2 hover:bg-teal-600 text-sm disabled:opacity-50">
          {{ language === "ar" ? "حفظ المرجع" : "Save Reference" }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { Check, Link2, Search, Unlink2 } from "lucide-vue-next";
import { useLanguage } from "../../composables/useLanguage";
import { AUMET_CORE_PRODUCTS, type AumetCoreProduct } from "../../data/aumetCoreProductsSample";

interface InvProd { id: string; code: string; name: string; barcode: string; aumetReferenceStatus: "linked" | "notLinked" }

const props = defineProps<{
  open: boolean;
  inventoryProduct: InvProd | null;
  selectedReferenceId: string | null;
}>();
const emit = defineEmits<{ "update:open": [v: boolean]; saveReference: [r: AumetCoreProduct | null] }>();

const { t, language } = useLanguage();
const query = ref("");
const draftReferenceId = ref<string | null>(null);

watch(() => props.open, (o) => {
  if (!o) { query.value = ""; return; }
  draftReferenceId.value = props.selectedReferenceId;
});

const filteredProducts = computed(() => {
  const q = query.value.trim().toLowerCase();
  if (!q) return AUMET_CORE_PRODUCTS;
  return AUMET_CORE_PRODUCTS.filter((p) =>
    [p.code, p.barcode, p.nameEn, p.nameAr, p.subtitleEn, p.subtitleAr, p.manufacturerEn, p.manufacturerAr]
      .some((v) => v.toLowerCase().includes(q))
  );
});

const selectedReference = computed(() => AUMET_CORE_PRODUCTS.find((p) => p.id === draftReferenceId.value) ?? null);
const currentReference = computed(() => AUMET_CORE_PRODUCTS.find((p) => p.id === props.selectedReferenceId) ?? null);

function toggleSelect(id: string) {
  draftReferenceId.value = draftReferenceId.value === id ? null : id;
}
function save() {
  emit("saveReference", selectedReference.value);
  close();
}
function removeRef() {
  emit("saveReference", null);
  close();
}
function close() { emit("update:open", false); }
</script>
