<template>
  <div v-if="open && target" class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" @click.self="close">
    <div class="max-w-[760px] w-[92vw] bg-white rounded-3xl overflow-hidden shadow-xl">
      <div class="px-6 py-5 border-b border-gray-200">
        <div class="flex items-center gap-3 min-w-0">
          <div :class="['size-10 rounded-xl flex items-center justify-center', meta.iconWrapperClassName]">
            <component :is="meta.icon" :class="['size-5', meta.iconClass]" :stroke-width="2" />
          </div>
          <div :class="isRTL ? 'text-right' : 'text-left'">
            <h2 class="text-xl font-bold text-gray-900">{{ meta.title }}</h2>
            <p class="text-sm text-gray-500 mt-1">{{ meta.description }}</p>
          </div>
        </div>
      </div>

      <div class="p-6 bg-gray-50 space-y-5" :dir="isRTL ? 'rtl' : 'ltr'">
        <div class="rounded-2xl border border-gray-200 bg-white p-4">
          <div class="flex items-start gap-3">
            <div class="size-10 rounded-xl bg-slate-100 flex items-center justify-center shrink-0">
              <Boxes class="size-5 text-slate-600" :stroke-width="2" />
            </div>
            <div class="min-w-0">
              <div class="text-sm font-semibold text-gray-900">{{ target.productName }}</div>
              <div class="text-xs text-gray-500 mt-1">{{ language === "ar" ? "الكود" : "Code" }}: {{ target.productCode }}</div>
            </div>
          </div>
        </div>

        <div v-if="!isAddBatchMode" class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="space-y-2">
            <label class="text-sm">{{ language === "ar" ? "اختر الدفعة" : "Select Batch" }}</label>
            <select
              v-model="form.selectedBatchId"
              :disabled="target.type === 'batch'"
              class="w-full h-11 rounded-full border border-gray-300 px-3 text-sm bg-white"
            >
              <option v-for="b in target.batches" :key="b.id" :value="b.id">{{ b.batchNumber }} · {{ b.expiry }} · {{ b.warehouseZone }}</option>
            </select>
          </div>
          <div class="space-y-2">
            <label class="text-sm">{{ language === "ar" ? "الكمية الحالية" : "Current Quantity" }}</label>
            <input v-model="form.stockQty" readonly dir="ltr" class="w-full h-11 rounded-full bg-gray-100 px-3 text-sm" />
          </div>
        </div>

        <div v-if="isEditMode || isAddBatchMode" class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="space-y-2"><label class="text-sm">{{ language === "ar" ? "رقم الدفعة" : "Batch Number" }}</label><input v-model="form.batchNumber" dir="ltr" class="w-full h-11 rounded-full border border-gray-300 px-3 text-sm" /></div>
          <div class="space-y-2"><label class="text-sm">{{ language === "ar" ? "تاريخ الانتهاء" : "Expiry" }}</label><input v-model="form.expiry" dir="ltr" class="w-full h-11 rounded-full border border-gray-300 px-3 text-sm" /></div>
          <div class="space-y-2"><label class="text-sm">{{ language === "ar" ? "موقع المستودع" : "Warehouse Zone" }}</label><input v-model="form.warehouseZone" class="w-full h-11 rounded-full border border-gray-300 px-3 text-sm" /></div>
          <div class="space-y-2"><label class="text-sm">{{ language === "ar" ? "الكمية" : "Quantity" }}</label><input v-model="form.stockQty" type="number" dir="ltr" class="w-full h-11 rounded-full border border-gray-300 px-3 text-sm" /></div>
          <div class="space-y-2"><label class="text-sm">{{ language === "ar" ? "متوسط التكلفة" : "Average Cost" }}</label><input v-model="form.avgCost" type="number" step="0.01" dir="ltr" class="w-full h-11 rounded-full border border-gray-300 px-3 text-sm" /></div>
          <div class="space-y-2"><label class="text-sm">{{ language === "ar" ? "سعر البيع" : "Sell Price" }}</label><input v-model="form.sellPrice" type="number" step="0.01" dir="ltr" class="w-full h-11 rounded-full border border-gray-300 px-3 text-sm" /></div>
        </div>

        <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="space-y-2">
            <label class="text-sm">{{ isStockInMode ? (language === "ar" ? "الكمية المراد إضافتها" : "Quantity to Add") : (language === "ar" ? "الكمية المراد إخراجها" : "Quantity to Remove") }}</label>
            <input v-model="form.qtyChange" type="number" placeholder="0" dir="ltr" class="w-full h-11 rounded-full border border-gray-300 px-3 text-sm" />
          </div>
          <div class="space-y-2">
            <label class="text-sm">{{ language === "ar" ? "ملاحظات" : "Notes" }}</label>
            <input v-model="form.notes" :placeholder="language === 'ar' ? 'ملاحظة اختيارية' : 'Optional note'" class="w-full h-11 rounded-full border border-gray-300 px-3 text-sm" />
          </div>
        </div>
      </div>

      <div class="border-t border-gray-200 bg-white px-6 py-4 flex flex-col-reverse gap-2 sm:flex-row sm:items-center sm:justify-end">
        <button @click="close" class="h-10 rounded-full border border-gray-300 px-5 text-sm">{{ t("cancel") }}</button>
        <button @click="close" :class="['h-10 rounded-full px-5 text-white text-sm', isAddBatchMode ? 'bg-blue-600 hover:bg-blue-700' : isEditMode ? 'bg-amber-600 hover:bg-amber-700' : isStockInMode ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-rose-600 hover:bg-rose-700']">{{ meta.actionLabel }}</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, reactive } from "vue";
import { ArrowDownToLine, ArrowUpFromLine, Boxes, PencilLine } from "lucide-vue-next";
import { useLanguage } from "../../composables/useLanguage";

export type InventoryBatchActionDialogMode = "editBatch" | "stockIn" | "stockOut" | "addBatch";
export type BatchOption = { id: string; batchNumber: string; expiry: string; warehouseZone: string; stockQty: string; avgCost: string; sellPrice: string };
export type InventoryBatchActionTarget =
  | { type: "product"; productId: string; productCode: string; productName: string; batches: BatchOption[] }
  | { type: "batch"; productId: string; productCode: string; productName: string; batch: BatchOption; batches: BatchOption[] };

const props = defineProps<{ open: boolean; mode: InventoryBatchActionDialogMode; target: InventoryBatchActionTarget | null }>();
const emit = defineEmits<{ "update:open": [v: boolean] }>();
const { t, language } = useLanguage();
const isRTL = computed(() => language.value === "ar");

const INITIAL = { selectedBatchId: "", batchNumber: "", expiry: "", warehouseZone: "", stockQty: "", qtyChange: "", avgCost: "", sellPrice: "", notes: "" };
const form = reactive({ ...INITIAL });

const isEditMode = computed(() => props.mode === "editBatch");
const isStockInMode = computed(() => props.mode === "stockIn");
const isAddBatchMode = computed(() => props.mode === "addBatch");

watch(() => [props.target, props.open, props.mode], () => {
  if (!props.target || !props.open) { Object.assign(form, INITIAL); return; }
  if (props.mode === "addBatch") { Object.assign(form, INITIAL, { selectedBatchId: "new-batch" }); return; }
  const defaultBatch = props.target.type === "batch" ? props.target.batch : props.target.batches[0] ?? null;
  Object.assign(form, {
    selectedBatchId: defaultBatch?.id ?? "",
    batchNumber: defaultBatch?.batchNumber ?? "",
    expiry: defaultBatch?.expiry ?? "",
    warehouseZone: defaultBatch?.warehouseZone ?? "",
    stockQty: defaultBatch?.stockQty ?? "",
    qtyChange: "",
    avgCost: defaultBatch?.avgCost ?? "",
    sellPrice: defaultBatch?.sellPrice ?? "",
    notes: "",
  });
}, { immediate: true });

watch(() => form.selectedBatchId, (id) => {
  if (!props.target) return;
  const b = props.target.batches.find((x) => x.id === id);
  if (b) {
    form.batchNumber = b.batchNumber; form.expiry = b.expiry;
    form.warehouseZone = b.warehouseZone; form.stockQty = b.stockQty;
    form.avgCost = b.avgCost; form.sellPrice = b.sellPrice;
  }
});

const meta = computed(() => {
  if (isAddBatchMode.value) return { title: language.value === "ar" ? "إضافة دفعة جديدة" : "Add New Batch", description: language.value === "ar" ? "أضف دفعة جديدة لهذا المنتج مباشرة من الجدول." : "Add a new batch for this product directly from the table.", icon: Boxes, iconClass: "text-blue-600", iconWrapperClassName: "bg-blue-100", actionLabel: language.value === "ar" ? "إضافة الدفعة" : "Add Batch" };
  if (isEditMode.value) return { title: language.value === "ar" ? "تعديل الدفعة" : "Edit Batch", description: language.value === "ar" ? "حدّث بيانات هذه الدفعة." : "Update batch details.", icon: PencilLine, iconClass: "text-amber-600", iconWrapperClassName: "bg-amber-100", actionLabel: language.value === "ar" ? "حفظ تعديلات الدفعة" : "Save Batch Changes" };
  if (isStockInMode.value) return { title: language.value === "ar" ? "إدخال مخزون" : "Stock In", description: language.value === "ar" ? "زد كمية المخزون." : "Increase stock quantity.", icon: ArrowDownToLine, iconClass: "text-emerald-600", iconWrapperClassName: "bg-emerald-100", actionLabel: language.value === "ar" ? "تأكيد إدخال المخزون" : "Confirm Stock In" };
  return { title: language.value === "ar" ? "إخراج مخزون" : "Stock Out", description: language.value === "ar" ? "أنقص كمية المخزون." : "Decrease stock quantity.", icon: ArrowUpFromLine, iconClass: "text-rose-600", iconWrapperClassName: "bg-rose-100", actionLabel: language.value === "ar" ? "تأكيد إخراج المخزون" : "Confirm Stock Out" };
});

function close() { emit("update:open", false); }
void ref;
</script>
