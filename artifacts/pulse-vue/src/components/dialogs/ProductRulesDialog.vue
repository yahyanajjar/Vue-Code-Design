<template>
  <div v-if="open && product" class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" @click.self="close">
    <div class="!flex max-h-[88vh] w-[min(1120px,calc(100vw-1.5rem))] !flex-col overflow-hidden rounded-[30px] border border-gray-200 bg-white shadow-2xl">
      <div class="border-b border-gray-200 bg-gradient-to-r from-teal-50 via-white to-slate-50 px-6 py-5 text-start">
        <div class="flex items-start justify-between gap-4 pe-10">
          <div class="space-y-3">
            <div class="text-xs font-semibold uppercase tracking-[0.14em] text-teal-700">
              {{ language === "ar" ? "القواعد" : "Rules" }}
            </div>
            <div class="space-y-1.5">
              <h2 class="text-[30px] font-semibold tracking-tight text-gray-950">
                {{ product.name }}
                <span class="ms-2 text-gray-400">#{{ product.code }}</span>
              </h2>
              <p class="text-sm text-gray-600">
                {{ language === "ar" ? "راجع المشاكل التي تمنع هذا المنتج من التزامن أو البيع عبر القنوات المختلفة." : "Review the issues blocking this product from syncing or selling across channels." }}
              </p>
            </div>
            <div class="flex flex-wrap items-center gap-2">
              <span class="inline-flex items-center rounded-full border border-red-200 bg-red-50 px-3 py-1 text-xs font-semibold text-red-700">
                <AlertTriangle class="me-1 size-3.5" />
                {{ language === "ar" ? `${criticalCount} مشاكل حرجة` : `${criticalCount} Critical Issues` }}
              </span>
              <span v-if="warningCount > 0" class="inline-flex items-center rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
                <XCircle class="me-1 size-3.5" />
                {{ language === "ar" ? `${warningCount} تحتاج مراجعة` : `${warningCount} Needs Review` }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div class="min-h-0 flex-1 overflow-y-auto bg-slate-50/70 px-6 py-5">
        <div class="grid gap-4 md:grid-cols-2">
          <section
            v-for="issue in product.issues"
            :key="issue.id"
            :class="['rounded-[28px] border bg-white p-5 shadow-sm', issue.severity === 'critical' ? 'border-red-100/80' : 'border-amber-100/80']"
          >
            <div class="mb-4 flex items-start gap-4">
              <div :class="['flex size-11 shrink-0 items-center justify-center rounded-2xl', issue.severity === 'critical' ? 'bg-red-50 text-red-600' : 'bg-amber-50 text-amber-600']">
                <component :is="iconFor(issue.id)" class="size-5" />
              </div>
              <div class="min-w-0">
                <div class="flex flex-wrap items-center gap-2">
                  <div class="text-xl font-semibold text-gray-950">{{ issue.title }}</div>
                  <span :class="['rounded-full border px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em]', severityStyles[issue.severity]]">
                    {{ issue.severity === "critical" ? (language === "ar" ? "حرج" : "Critical") : (language === "ar" ? "مراجعة" : "Review") }}
                  </span>
                </div>
                <p class="mt-1 text-sm leading-6 text-gray-600">{{ issue.description }}</p>
              </div>
            </div>

            <div :class="['rounded-2xl border px-4 py-3 text-sm font-medium', severityStyles[issue.severity]]">
              {{ issue.severity === "critical" ? (language === "ar" ? "هذه المشكلة تمنع استخدام المنتج في القنوات المحددة حتى يتم إصلاحها." : "This issue blocks the product in the listed channels until it is fixed.") : (language === "ar" ? "هذه المشكلة تحتاج مراجعة قبل تفعيل المنتج بالكامل." : "This issue should be reviewed before fully enabling the product.") }}
            </div>

            <div class="mt-4 space-y-2">
              <div class="text-xs font-semibold uppercase tracking-[0.12em] text-gray-500">
                {{ language === "ar" ? "القنوات المتأثرة" : "Affected Channels" }}
              </div>
              <div class="flex flex-wrap gap-2">
                <span v-for="channel in issue.channels" :key="channel" class="rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs font-semibold text-gray-700">{{ channel }}</span>
              </div>
            </div>

            <div class="mt-5 rounded-[24px] border border-gray-200 bg-gray-50/80 p-4">
              <div class="mb-3 flex items-center gap-2">
                <div class="flex size-8 items-center justify-center rounded-xl bg-teal-100 text-teal-700">
                  <CheckCircle2 class="size-4" />
                </div>
                <div>
                  <p class="text-sm font-semibold text-gray-900">{{ language === "ar" ? "إصلاح المشكلة" : "Fix This Issue" }}</p>
                  <p class="text-xs text-gray-500">{{ language === "ar" ? "أدخل التعديل المناسب لهذا القسم ثم احفظه." : "Enter the required correction for this section and save it." }}</p>
                </div>
              </div>
              <div class="flex justify-end">
                <button class="rounded-2xl bg-teal-600 px-4 py-2 text-white hover:bg-teal-700 text-sm">
                  {{ language === "ar" ? "حفظ الإصلاح" : "Save Fix" }}
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>
      <div class="border-t border-gray-200 bg-white px-6 py-4 flex justify-end">
        <button @click="close" class="rounded-xl bg-teal-700 px-5 py-2 text-white hover:bg-teal-800 text-sm">
          {{ language === "ar" ? "إغلاق" : "Close" }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { AlertTriangle, CheckCircle2, CalendarDays, Link2, Percent, ShoppingBag, Tag, XCircle } from "lucide-vue-next";
import { useLanguage } from "../../composables/useLanguage";

export type RuleSeverity = "critical" | "warning";
export interface ProductRuleIssue {
  id: string;
  title: string;
  description: string;
  severity: RuleSeverity;
  channels: string[];
}
export interface ProductRulesProduct {
  name: string;
  code: string;
  issues: ProductRuleIssue[];
}

const props = defineProps<{ open: boolean; product: ProductRulesProduct | null }>();
const emit = defineEmits<{ "update:open": [v: boolean] }>();

const { language } = useLanguage();

const severityStyles: Record<RuleSeverity, string> = {
  critical: "border-red-200 bg-red-50 text-red-700",
  warning: "border-amber-200 bg-amber-50 text-amber-700",
};

function iconFor(id: string) {
  switch (id) {
    case "linking": return Link2;
    case "quantity": return ShoppingBag;
    case "sellingPrice": return Tag;
    case "discount": return Percent;
    case "expiryDate": return CalendarDays;
    default: return AlertTriangle;
  }
}

const criticalCount = computed(() => props.product?.issues.filter((i) => i.severity === "critical").length ?? 0);
const warningCount = computed(() => (props.product?.issues.length ?? 0) - criticalCount.value);

function close() { emit("update:open", false); }
</script>
