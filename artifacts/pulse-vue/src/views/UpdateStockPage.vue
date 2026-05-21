<template>
  <div class="flex flex-col h-full bg-gray-50 overflow-y-auto">
    <div class="p-6 space-y-5 flex-1">
      <div class="flex items-start justify-between gap-4 flex-wrap">
        <div class="space-y-1">
          <h1 class="text-2xl font-bold tracking-tight text-gray-900">
            {{ t("bulkStocksHistory") }}
          </h1>
          <p class="text-sm text-gray-500">{{ t("trackStocksMovements") }}</p>
        </div>
        <div class="flex items-center gap-3 relative">
          <button
            type="button"
            @click="updateMenuOpen = !updateMenuOpen"
            class="bg-teal-500 hover:bg-teal-600 h-10 gap-2 px-4 text-sm rounded-full inline-flex items-center justify-center text-white font-medium transition-all duration-200 hover:shadow-lg hover:shadow-teal-500/30"
          >
            <Plus class="size-4" />
            {{ t("updateYourStock") }}
            <ChevronDown class="size-4 ms-1" />
          </button>
          <div
            v-if="updateMenuOpen"
            class="fixed inset-0 z-40"
            @click="updateMenuOpen = false"
          />
          <div
            v-if="updateMenuOpen"
            class="absolute top-12 z-50 w-56 rounded-xl bg-white shadow-xl border border-gray-100 p-1.5"
            :class="language === 'ar' ? 'start-0' : 'end-0'"
          >
            <button
              type="button"
              @click="openImport(); updateMenuOpen = false"
              class="w-full cursor-pointer gap-3 text-sm hover:bg-gray-50 hover:text-gray-900 rounded-lg px-3 py-2.5 transition-all duration-150 text-start inline-flex items-center"
            >
              <Upload class="size-4 text-teal-600" />
              <span>{{ t("uploadStockFile") }}</span>
            </button>
            <button
              type="button"
              @click="goManualUpdateStock(); updateMenuOpen = false"
              class="w-full cursor-pointer gap-3 text-sm hover:bg-gray-50 hover:text-gray-900 rounded-lg px-3 py-2.5 transition-all duration-150 text-start inline-flex items-center"
            >
              <FileEdit class="size-4 text-teal-600" />
              <span>{{ t("manualUpdateStock") }}</span>
            </button>
          </div>
        </div>

        <ImportInventoryDialog
          :open="importDialogOpen"
          @update:open="importDialogOpen = $event"
        />
      </div>

      <div class="flex flex-wrap gap-2">
        <button
          v-for="stat in stats"
          :key="stat.titleKey"
          type="button"
          @click="handleQuickFilterChange(stat.titleKey)"
          :class="[
            'cursor-pointer inline-flex min-w-[150px] items-center gap-2.5 rounded-full border px-3 py-2 text-start transition-all duration-200',
            activeQuickFilter === stat.titleKey
              ? 'border-teal-300 bg-teal-50 text-teal-900'
              : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300',
          ]"
        >
          <div
            class="flex size-7 shrink-0 items-center justify-center rounded-full"
            :class="stat.iconClassName"
          >
            <component :is="stat.icon" class="size-3.5" />
          </div>
          <div class="min-w-0 flex-1">
            <div class="flex items-center gap-2">
              <p class="truncate text-sm font-medium text-current">
                {{
                  stat.titleKey === "all"
                    ? language === "ar"
                      ? "الكل"
                      : "All"
                    : t(stat.titleKey)
                }}
              </p>
              <span class="text-xs text-gray-400">/</span>
              <p class="text-sm font-semibold text-current">{{ stat.value }}</p>
            </div>
          </div>
        </button>
      </div>

      <div class="bg-white border border-gray-200 rounded-2xl overflow-hidden">
        <div class="p-4 border-b border-gray-200">
          <div class="flex items-center gap-3">
            <div class="relative flex-1">
              <Search
                class="absolute start-3 top-1/2 -translate-y-1/2 size-4 text-gray-400"
                :stroke-width="2"
              />
              <input
                :placeholder="t('searchAdjustmentHistory')"
                class="ps-9 h-10 text-sm border border-gray-300 rounded-full w-full px-3 outline-none focus:border-teal-500"
              />
            </div>
            <button
              type="button"
              @click="filtersOpen = !filtersOpen"
              :class="[
                'h-10 gap-2 px-4 text-sm rounded-full border whitespace-nowrap inline-flex items-center',
                filtersOpen
                  ? 'bg-teal-50 border-teal-600 text-teal-600'
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50',
              ]"
            >
              <Filter class="size-4" :stroke-width="2" />
              {{ t("filters") }}
            </button>
            <button
              type="button"
              @click="openImport"
              class="h-10 gap-2 px-4 text-sm rounded-full border border-teal-200 bg-teal-50 text-teal-700 whitespace-nowrap hover:bg-teal-100 hover:text-teal-800 inline-flex items-center"
            >
              <Upload class="size-4" :stroke-width="2" />
              {{ language === "ar" ? "استيراد" : "Import" }}
            </button>
          </div>
        </div>

        <div v-if="filtersOpen" class="border-b border-gray-200 bg-gray-50/50 p-4">
          <div class="grid grid-cols-1 md:grid-cols-4 gap-3">
            <div>
              <label class="text-xs text-gray-600 mb-1 block">{{ t("createdDateRange") }}</label>
              <input type="date" class="w-full h-9 border border-gray-300 rounded-lg px-2 text-sm" />
            </div>
            <div>
              <label class="text-xs text-gray-600 mb-1 block">{{ t("createdUserFilter") }}</label>
              <select class="w-full h-9 border border-gray-300 rounded-lg px-2 text-sm">
                <option>{{ t("allUsers") }}</option>
              </select>
            </div>
            <div>
              <label class="text-xs text-gray-600 mb-1 block">{{ t("status") }}</label>
              <select class="w-full h-9 border border-gray-300 rounded-lg px-2 text-sm">
                <option>{{ t("allStatus") }}</option>
              </select>
            </div>
            <div class="flex items-end gap-2">
              <button class="h-9 px-4 text-sm rounded-full border border-gray-300 hover:bg-gray-50">
                {{ t("reset") }}
              </button>
              <button class="h-9 px-4 text-sm rounded-full bg-teal-600 text-white hover:bg-teal-700">
                {{ t("apply") }}
              </button>
            </div>
          </div>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead>
              <tr class="border-b border-gray-200 bg-gray-50">
                <th class="text-xs font-semibold text-gray-700 h-11 text-start px-4">{{ t("stockId") }}</th>
                <th class="text-xs font-semibold text-gray-700 h-11 text-start px-4">{{ t("createdAt") }}</th>
                <th class="text-xs font-semibold text-gray-700 h-11 text-start px-4">{{ t("status") }}</th>
                <th class="text-xs font-semibold text-gray-700 h-11 text-start px-4">{{ t("createdUser") }}</th>
                <th class="text-xs font-semibold text-gray-700 h-11 text-start px-4">{{ t("updatedAt") }}</th>
                <th class="text-xs font-semibold text-gray-700 h-11 text-center w-[120px] px-2">{{ t("totalNumberOfProducts") }}</th>
                <th class="text-xs font-semibold text-gray-700 h-11 text-center w-[120px] px-2">{{ t("autoMigrated") }}</th>
                <th class="text-xs font-semibold text-gray-700 h-11 text-center w-[120px] px-2">{{ t("failedMigrated") }}</th>
                <th class="text-xs font-semibold text-gray-700 h-11 text-start px-4">{{ t("actions") }}</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="item in stockHistory"
                :key="item.id"
                class="border-b border-gray-200 hover:bg-gray-50"
              >
                <td class="text-sm font-medium text-gray-900 py-4 text-start px-4">{{ item.id }}</td>
                <td class="text-xs text-gray-600 py-4 whitespace-pre-line text-start px-4">{{ item.createdAt }}</td>
                <td class="py-4 text-start px-4">
                  <span
                    class="text-xs px-2 py-1 rounded-full inline-flex items-center"
                    :class="badgeClass(item.statusColor)"
                  >
                    {{ item.status }}
                  </span>
                </td>
                <td class="text-sm text-gray-900 py-4 text-start px-4">{{ item.createdUser }}</td>
                <td class="text-xs text-gray-600 py-4 whitespace-pre-line text-start px-4">{{ item.updatedAt }}</td>
                <td class="py-4 text-center align-middle px-2">
                  <div class="inline-flex min-w-[96px] flex-col items-center justify-center rounded-md bg-gray-50 px-2 py-1 text-center leading-4">
                    <span class="text-sm font-semibold text-gray-900">{{ item.totalProducts }}</span>
                  </div>
                </td>
                <td class="py-4 text-center align-middle px-2">
                  <div
                    v-if="item.autoMigrated"
                    class="inline-flex min-w-[96px] flex-col items-center justify-center rounded-md bg-green-50 px-2 py-1 text-center text-xs leading-4 text-green-700"
                  >
                    <span class="font-medium">{{ item.autoMigrated.split(" - ")[0] }}</span>
                    <span>{{ item.autoMigrated.split(" - ")[1] }}</span>
                  </div>
                  <span v-else class="text-gray-400">{{ t("notAvailableMark") }}</span>
                </td>
                <td class="py-4 text-center align-middle px-2">
                  <div
                    v-if="item.failedMigrated"
                    class="inline-flex min-w-[96px] flex-col items-center justify-center rounded-md bg-red-50 px-2 py-1 text-center text-xs leading-4 text-red-700"
                  >
                    <span class="font-medium">{{ item.failedMigrated.split(" - ")[0] }}</span>
                    <span>{{ item.failedMigrated.split(" - ")[1] }}</span>
                  </div>
                  <span v-else class="text-gray-400">{{ t("notAvailableMark") }}</span>
                </td>
                <td class="py-4 text-start px-4 relative">
                  <button
                    type="button"
                    class="size-8 p-0 inline-flex items-center justify-center hover:bg-gray-100 rounded-full transition-colors"
                    :aria-label="t('actions')"
                    @click="rowMenuId = rowMenuId === item.id ? null : item.id"
                  >
                    <MoreVertical class="size-4 text-gray-600" />
                  </button>
                  <div
                    v-if="rowMenuId === item.id"
                    class="fixed inset-0 z-40"
                    @click="rowMenuId = null"
                  />
                  <div
                    v-if="rowMenuId === item.id"
                    class="absolute z-50 mt-1 w-56 rounded-xl bg-white shadow-xl border border-gray-100 p-1.5"
                    :class="language === 'ar' ? 'start-4' : 'end-4'"
                  >
                    <button
                      type="button"
                      @click="rowMenuId = null"
                      class="w-full cursor-pointer gap-2 text-start text-sm hover:bg-gray-50 rounded-lg px-3 py-2 inline-flex items-center"
                    >
                      <Eye class="size-4" />
                      {{ t("viewEditDetails") }}
                    </button>
                    <button
                      type="button"
                      class="w-full cursor-pointer gap-2 text-start text-sm hover:bg-gray-50 rounded-lg px-3 py-2 inline-flex items-center"
                    >
                      <Download class="size-4" />
                      {{ t("exportReport") }}
                    </button>
                    <button
                      v-if="canCancelRow(item.statusKey)"
                      type="button"
                      @click="cancelAdjustment(item.id); rowMenuId = null"
                      class="w-full cursor-pointer gap-2 text-start text-sm hover:bg-gray-50 rounded-lg px-3 py-2 inline-flex items-center"
                    >
                      <RotateCcw class="size-4" />
                      {{ t("cancelAdjustment") }}
                    </button>
                    <button
                      v-else
                      type="button"
                      disabled
                      class="w-full gap-2 text-start text-sm rounded-lg px-3 py-2 inline-flex items-center opacity-50 cursor-not-allowed"
                    >
                      <RotateCcw class="size-4" />
                      {{
                        isLockedRow(item.statusKey)
                          ? t("actionNotAvailable")
                          : t("cancelAdjustment")
                      }}
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="px-4 py-3 border-t border-gray-200 bg-white">
          <div class="flex items-center justify-between text-sm">
            <div class="text-gray-600">{{ t("stockHistoryPaginationSummary") }}</div>
            <div class="flex items-center gap-2">
              <button
                type="button"
                class="size-8 flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded"
                :aria-label="t('paginationPreviousPage')"
              >
                <ChevronLeft class="size-4" />
              </button>
              <button
                v-for="n in [1, 2, 3, 4, 5]"
                :key="n"
                type="button"
                :class="[
                  'size-8 flex items-center justify-center rounded',
                  n === 1 ? 'bg-teal-500 text-white rounded-full' : 'text-gray-600 hover:bg-gray-100',
                ]"
                :aria-label="String(n)"
              >
                {{ n }}
              </button>
              <button
                type="button"
                class="size-8 flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded"
                :aria-label="t('paginationNextPage')"
              >
                <ChevronRight class="size-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="text-sm text-gray-500">
        {{ t("lastStockAdjustmentPrefix") }} {{ lastAdjustmentDateLabel }}
      </div>
    </div>

    <footer class="sticky bottom-0 z-40 border-t border-gray-200 bg-white px-6 py-3">
      <div class="flex items-center justify-between">
        <div class="text-sm text-gray-600">{{ t("poweredByPulse") }}</div>
        <div class="flex items-center gap-4">
          <button
            class="text-teal-600 hover:text-teal-700 p-0 h-auto text-sm bg-transparent"
          >
            {{ t("startTour") }}
          </button>
          <button class="bg-slate-900 hover:bg-slate-800 h-9 px-4 text-sm rounded-full text-white">
            {{ t("help") }}
          </button>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import {
  Plus,
  Search,
  Filter,
  MoreVertical,
  Eye,
  Download,
  Upload,
  FileEdit,
  ChevronDown,
  PackageCheck,
  AlertTriangle,
  PackageX,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Layers3,
} from "lucide-vue-next";
import { useLanguage } from "../composables/useLanguage";
import ImportInventoryDialog from "../components/dialogs/ImportInventoryDialog.vue";

type StatusColor = "green" | "blue" | "yellow" | "red" | "purple" | "gray";
type StockHistoryQuickFilter =
  | "all"
  | "adjustmentStatusDraft"
  | "adjustmentStatusPending"
  | "adjustmentStatusConfirmed"
  | "adjustmentStatusReversal"
  | "adjustmentStatusFailed";

interface StockHistoryRaw {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  statusKey: string;
  statusColor: StatusColor;
  userKey: string;
  totalProducts: number;
  autoMigrated: string | null;
  failedMigrated: string | null;
}

const { t, language } = useLanguage();
const router = useRouter();

const filtersOpen = ref(false);
const importDialogOpen = ref(false);
const updateMenuOpen = ref(false);
const rowMenuId = ref<string | null>(null);
const activeQuickFilter = ref<StockHistoryQuickFilter>("all");

const stockHistoryRows = ref<StockHistoryRaw[]>([
  {
    id: "#Stock-21316",
    createdAt: new Date(2025, 0, 15, 14, 51),
    updatedAt: new Date(2025, 0, 15, 14, 51),
    statusKey: "adjustmentStatusConfirmed",
    statusColor: "green",
    userKey: "userSarahWilson",
    totalProducts: 10000,
    autoMigrated: "2600 - 96.7%",
    failedMigrated: "87 - 3.2%",
  },
  {
    id: "#Stock-21315",
    createdAt: new Date(2025, 0, 15, 11, 12),
    updatedAt: new Date(2025, 0, 15, 14, 55),
    statusKey: "adjustmentStatusProcessing",
    statusColor: "blue",
    userKey: "userAhmedRashid",
    totalProducts: 2687,
    autoMigrated: null,
    failedMigrated: null,
  },
  {
    id: "#Stock-21314",
    createdAt: new Date(2025, 0, 14, 16, 45),
    updatedAt: new Date(2025, 0, 14, 16, 45),
    statusKey: "adjustmentStatusPending",
    statusColor: "yellow",
    userKey: "userFatimaHassan",
    totalProducts: 3212,
    autoMigrated: "2100 - 65.3%",
    failedMigrated: "1312 - 34.6%",
  },
  {
    id: "#Stock-21313",
    createdAt: new Date(2025, 0, 14, 10, 30),
    updatedAt: new Date(2025, 0, 14, 11, 15),
    statusKey: "adjustmentStatusFailed",
    statusColor: "red",
    userKey: "userSarahWilson",
    totalProducts: 1203,
    autoMigrated: "1100 - 91.4%",
    failedMigrated: "103 - 8.6%",
  },
  {
    id: "#Stock-21312",
    createdAt: new Date(2025, 0, 13, 9, 20),
    updatedAt: new Date(2025, 0, 13, 10, 5),
    statusKey: "adjustmentStatusReversal",
    statusColor: "purple",
    userKey: "userAhmedRashid",
    totalProducts: 845,
    autoMigrated: "800 - 94.7%",
    failedMigrated: "45 - 5.3%",
  },
  {
    id: "#Stock-21311",
    createdAt: new Date(2025, 0, 12, 8, 10),
    updatedAt: new Date(2025, 0, 12, 8, 10),
    statusKey: "adjustmentStatusDraft",
    statusColor: "gray",
    userKey: "userFatimaHassan",
    totalProducts: 432,
    autoMigrated: null,
    failedMigrated: null,
  },
]);

const LAST_STOCK_ADJUSTMENT_DATE = new Date(2025, 3, 15);

const STATUS_DISPLAY_ORDER = [
  "adjustmentStatusDraft",
  "adjustmentStatusPending",
  "adjustmentStatusProcessing",
  "adjustmentStatusConfirmed",
  "adjustmentStatusFailed",
  "adjustmentStatusReversal",
] as const;

function getStatusOrder(statusKey: string) {
  const i = STATUS_DISPLAY_ORDER.indexOf(
    statusKey as (typeof STATUS_DISPLAY_ORDER)[number],
  );
  return i === -1 ? STATUS_DISPLAY_ORDER.length : i;
}

function formatStockDateTime(d: Date): string {
  const locale = language.value === "ar" ? "ar" : "en-GB";
  const datePart = d.toLocaleDateString(locale, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
  const timePart = d.toLocaleTimeString(locale, {
    hour: "numeric",
    minute: "2-digit",
  });
  return `${datePart}\n${timePart}`;
}

const stats = computed(() => {
  const rows = stockHistoryRows.value;
  const countBy = (k: string) => rows.filter((r) => r.statusKey === k).length;
  return [
    {
      titleKey: "all" as StockHistoryQuickFilter,
      value: String(rows.length),
      icon: Layers3,
      iconClassName: "bg-teal-50 text-teal-600",
    },
    {
      titleKey: "adjustmentStatusDraft" as StockHistoryQuickFilter,
      value: String(countBy("adjustmentStatusDraft")),
      icon: FileEdit,
      iconClassName: "bg-slate-100 text-slate-700",
    },
    {
      titleKey: "adjustmentStatusPending" as StockHistoryQuickFilter,
      value: String(countBy("adjustmentStatusPending")),
      icon: AlertTriangle,
      iconClassName: "bg-amber-50 text-amber-600",
    },
    {
      titleKey: "adjustmentStatusConfirmed" as StockHistoryQuickFilter,
      value: String(countBy("adjustmentStatusConfirmed")),
      icon: PackageCheck,
      iconClassName: "bg-green-50 text-green-600",
    },
    {
      titleKey: "adjustmentStatusReversal" as StockHistoryQuickFilter,
      value: String(countBy("adjustmentStatusReversal")),
      icon: RotateCcw,
      iconClassName: "bg-purple-50 text-purple-600",
    },
    {
      titleKey: "adjustmentStatusFailed" as StockHistoryQuickFilter,
      value: String(countBy("adjustmentStatusFailed")),
      icon: PackageX,
      iconClassName: "bg-red-50 text-red-600",
    },
  ];
});

const filteredRows = computed(() => {
  if (activeQuickFilter.value === "all") return stockHistoryRows.value;
  return stockHistoryRows.value.filter(
    (r) => r.statusKey === activeQuickFilter.value,
  );
});

const stockHistory = computed(() =>
  [...filteredRows.value]
    .sort((a, b) => {
      const d = getStatusOrder(a.statusKey) - getStatusOrder(b.statusKey);
      if (d !== 0) return d;
      return b.createdAt.getTime() - a.createdAt.getTime();
    })
    .map((row) => ({
      id: row.id,
      statusKey: row.statusKey,
      createdAt: formatStockDateTime(row.createdAt),
      status: t(row.statusKey),
      statusColor: row.statusColor,
      createdUser: t(row.userKey),
      updatedAt: formatStockDateTime(row.updatedAt),
      totalProducts: row.totalProducts.toLocaleString("en-GB"),
      autoMigrated: row.autoMigrated,
      failedMigrated: row.failedMigrated,
    })),
);

const lastAdjustmentDateLabel = computed(() =>
  LAST_STOCK_ADJUSTMENT_DATE.toLocaleDateString(
    language.value === "ar" ? "ar" : "en-GB",
    { year: "numeric", month: "long", day: "numeric" },
  ),
);

function handleQuickFilterChange(next: StockHistoryQuickFilter) {
  activeQuickFilter.value =
    activeQuickFilter.value === next ? "all" : next;
}

function openImport() {
  importDialogOpen.value = true;
}

function goManualUpdateStock() {
  router.push({ name: "manual-update-stock" });
}

function canCancelRow(statusKey: string) {
  return (
    statusKey === "adjustmentStatusConfirmed" ||
    statusKey === "adjustmentStatusProcessing" ||
    statusKey === "adjustmentStatusFailed"
  );
}

function isLockedRow(statusKey: string) {
  return (
    statusKey === "adjustmentStatusPending" ||
    statusKey === "adjustmentStatusDraft" ||
    statusKey === "adjustmentStatusReversal"
  );
}

function cancelAdjustment(id: string) {
  stockHistoryRows.value = stockHistoryRows.value.map((row) =>
    row.id === id
      ? {
          ...row,
          statusKey: "adjustmentStatusReversal",
          statusColor: "purple",
          updatedAt: new Date(),
        }
      : row,
  );
}

function badgeClass(color: StatusColor) {
  switch (color) {
    case "green":
      return "bg-green-100 text-green-700";
    case "blue":
      return "bg-blue-100 text-blue-700";
    case "yellow":
      return "bg-yellow-100 text-yellow-700";
    case "purple":
      return "bg-purple-100 text-purple-700";
    case "gray":
      return "bg-gray-100 text-gray-700";
    default:
      return "bg-red-100 text-red-700";
  }
}
</script>
