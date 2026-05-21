<template>
  <div class="flex flex-col h-full bg-gray-50 overflow-y-auto">
    <input
      ref="importInputRef"
      type="file"
      accept=".csv,.xlsx,.xls"
      class="hidden"
      @change="handleImportFileChange"
    />

    <AddProductDialog
      :open="addProductDialogOpen"
      :active-source="activeSource"
      :available-sources="availableAddProductSources"
      :selected-codes="selectedCodes"
      @update:open="(v) => (addProductDialogOpen = v)"
      @update:active-source="(s) => (activeSource = s)"
      @add-core-products="addCoreProductsToTable"
      @add-inventory-products="addInventoryProductsToTable"
      @add-custom-product="addCustomProductToTable"
    />

    <div
      v-if="importConfirmationOpen"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      @click.self="handleCancelImportConfirmation"
    >
      <div class="max-w-lg w-full bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
        <div>
          <h3 class="text-lg font-semibold text-gray-900">
            {{ language === "ar" ? "تأكيد استيراد الملف" : "Confirm file import" }}
          </h3>
          <p class="text-sm text-gray-600 mt-1">
            {{ importDescriptionText }}
          </p>
        </div>
        <div class="rounded-xl border border-teal-100 bg-teal-50 px-4 py-3 text-sm text-teal-900">
          {{ language === "ar"
            ? "سيتم إدراج المنتجات المستوردة داخل جدول التحديث اليدوي ويمكنك تعديلها قبل الحفظ."
            : "Imported products will be inserted into the manual update table and remain editable before saving." }}
        </div>
        <div v-if="skippedImportedRows.length > 0" class="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          {{ language === "ar"
            ? `سيتم تخطي ${skippedImportedRows.length} صف لأنه موجود مسبقًا في الجدول.`
            : `${skippedImportedRows.length} row(s) will be skipped because they already exist in the table.` }}
        </div>
        <div class="flex items-center justify-end gap-3">
          <button
            type="button"
            @click="handleCancelImportConfirmation"
            class="h-10 rounded-full border border-gray-300 bg-white px-5 text-sm hover:bg-gray-50"
          >
            {{ t("cancel") }}
          </button>
          <button
            type="button"
            @click="handleConfirmImport"
            class="h-10 rounded-full bg-teal-500 text-white px-5 text-sm hover:bg-teal-600"
          >
            {{ language === "ar" ? "إضافة إلى الجدول" : "Add to table" }}
          </button>
        </div>
      </div>
    </div>

    <div class="p-6 space-y-3.5 flex-1" :dir="isRTL ? 'rtl' : 'ltr'">
      <div :class="isRTL ? 'text-right' : 'text-left'">
        <div class="flex items-center gap-4 flex-wrap">
          <h1 class="text-2xl font-bold text-gray-900">{{ t("manualUpdateStock") }}</h1>
          <span class="text-gray-300 text-xl leading-none" aria-hidden>•</span>
          <p class="text-gray-500 text-base">{{ t("manualUpdateStockDescription") }}</p>
        </div>
      </div>

      <div
        v-if="showResetExistingStockOption"
        class="bg-gradient-to-br from-teal-50 to-cyan-50 border border-teal-200 rounded-2xl p-3"
      >
        <div class="flex items-center gap-2 mb-2.5 flex-wrap">
          <div class="size-5 bg-teal-600 rounded-full flex items-center justify-center">
            <Sparkles class="size-3 text-white" />
          </div>
          <h3 class="text-sm font-bold text-gray-900">{{ t("manualStockOptions") }}</h3>
          <span class="text-[11px] text-teal-700 bg-teal-100 px-2 py-0.5 rounded-full font-semibold">
            {{ t("configureBeforeManualUpdate") }}
          </span>
        </div>

        <div class="grid grid-cols-1 gap-2">
          <div class="bg-white border border-orange-200 rounded-xl px-3 py-2 hover:border-orange-300 transition-all">
            <div class="flex items-start justify-between gap-3">
              <div class="flex items-start gap-2 min-w-0">
                <div class="size-7 bg-orange-100 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
                  <AlertTriangle class="size-3.5 text-orange-600" />
                </div>
                <div :class="isRTL ? 'text-right' : 'text-left'">
                  <p class="text-xs font-bold text-gray-900 leading-5">{{ t("resetOldStock") }}</p>
                  <p class="text-[11px] text-gray-600 leading-4 mt-0.5">{{ t("setStockToZero") }}</p>
                </div>
              </div>
              <label class="inline-flex items-center cursor-pointer">
                <input type="checkbox" v-model="resetExistingStock" class="sr-only peer" />
                <div class="relative w-9 h-5 bg-gray-200 peer-checked:bg-teal-500 rounded-full transition-colors">
                  <span
                    class="absolute top-0.5 start-0.5 size-4 bg-white rounded-full transition-transform peer-checked:translate-x-4"
                    :class="resetExistingStock ? (isRTL ? '-translate-x-4' : 'translate-x-4') : ''"
                  />
                </div>
              </label>
            </div>
          </div>
        </div>
      </div>

      <div class="-mx-6 sm:mx-0 bg-white border border-gray-200 rounded-none sm:rounded-2xl overflow-visible">
        <div
          v-if="stockItems.length > 0"
          class="p-4 border-b border-gray-200 space-y-3 bg-gradient-to-b from-gray-50 to-white"
        >
          <div class="flex items-center gap-3">
            <div class="relative flex-1">
              <Search class="absolute start-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
              <input
                v-model="searchQuery"
                :placeholder="t('searchManualStockTable')"
                :dir="isRTL ? 'rtl' : 'ltr'"
                :class="[
                  'ps-9 pe-4 h-10 text-sm border border-gray-300 rounded-full w-full focus:border-teal-500 focus:outline-none',
                  isRTL ? 'text-right' : 'text-left',
                ]"
              />
            </div>
            <button
              type="button"
              @click="openAddProductDialog('core')"
              class="h-10 gap-2 rounded-full bg-teal-500 px-4 text-sm text-white whitespace-nowrap hover:bg-teal-600 inline-flex items-center"
            >
              <Plus class="size-4" />
              {{ t("addProduct") }}
            </button>
          </div>
        </div>

        <template v-if="stockItems.length > 0">
          <div class="p-3 space-y-3 bg-gray-50">
            <div
              v-if="groupedVisibleRows.length > 0"
              class="bg-white border border-gray-200 rounded-xl overflow-auto"
            >
              <table class="w-full text-[11px] sm:text-xs">
                <thead>
                  <tr class="bg-gray-50 border-b border-gray-200">
                    <th :class="['h-9 px-3 text-[10px] sm:text-[11px] font-semibold text-gray-700', isRTL ? 'text-right' : 'text-left']">
                      {{ productLabel }}
                    </th>
                    <th class="h-9 px-3 text-[10px] sm:text-[11px] font-semibold text-gray-700 text-center">{{ sourceLabel }}</th>
                    <th class="h-9 px-3 text-[10px] sm:text-[11px] font-semibold text-gray-700 text-center">{{ t("batches") }}</th>
                    <th class="h-9 px-3 text-[10px] sm:text-[11px] font-semibold text-gray-700 text-center">{{ unitsLabel }}</th>
                    <th class="h-9 px-3 text-[10px] sm:text-[11px] font-semibold text-gray-700 text-center">{{ aumetReferenceLabel }}</th>
                    <th class="h-9 px-3 text-[10px] sm:text-[11px] font-semibold text-gray-700 text-center">{{ t("actions") }}</th>
                  </tr>
                </thead>
                <tbody>
                  <template v-for="group in groupedVisibleRows" :key="`summary-${group.key}`">
                    <tr
                      @click="toggleGroupSelection(group.key)"
                      :class="[
                        'border-b border-gray-100',
                        selectedGroupKey === group.key
                          ? 'bg-teal-50 ring-1 ring-inset ring-teal-200'
                          : 'hover:bg-gray-50 cursor-pointer',
                      ]"
                    >
                      <td :class="['px-3 py-2', isRTL ? 'text-right' : 'text-left']">
                        <div class="font-medium text-gray-900 truncate whitespace-nowrap" :dir="isRTL ? 'rtl' : 'ltr'">
                          {{ language === "ar" ? group.productNameAr : group.productNameEn }}
                          <span class="text-[10px] text-gray-500" dir="ltr">
                            • {{ group.productCode }} • {{ group.barcode }}
                          </span>
                        </div>
                      </td>
                      <td class="px-3 py-2 text-center">
                        <span class="inline-flex rounded-full px-2 py-0.5 text-[10px] bg-gray-100 text-gray-700">
                          {{ t(`productSource.${group.source}`) }}
                        </span>
                      </td>
                      <td class="px-3 py-2 text-center text-gray-700 font-medium">{{ group.rows.length }}</td>
                      <td class="px-3 py-2 text-center text-gray-700">
                        {{ unitLabels[group.largestUnit] }} / {{ unitLabels[group.smallestUnit] }}
                      </td>
                      <td class="px-3 py-2 text-center">
                        <span
                          :class="[
                            'inline-flex rounded-full px-2 py-0.5 text-[10px]',
                            group.source === 'core'
                              ? 'bg-emerald-100 text-emerald-700'
                              : 'bg-amber-100 text-amber-700',
                          ]"
                        >
                          {{ group.source === "core" ? t("linked") : t("notLinked") }}
                        </span>
                      </td>
                      <td class="px-3 py-2 text-center">
                        <div class="flex items-center justify-center gap-1 flex-wrap">
                          <button
                            type="button"
                            @click.stop="toggleGroupSelection(group.key)"
                            class="h-7 px-2 text-[10px] sm:text-xs rounded-full border border-gray-300 bg-white inline-flex items-center gap-1 hover:bg-gray-50"
                          >
                            <ChevronUp v-if="selectedGroupKey === group.key" class="size-3.5" />
                            <PencilLine v-else class="size-3.5" />
                            {{
                              selectedGroupKey === group.key
                                ? (language === "ar" ? "تصغير" : "Minimize")
                                : (language === "ar" ? "تعديل" : "Edit")
                            }}
                          </button>
                          <button
                            type="button"
                            @click.stop="addNewBatchRow(group.key)"
                            class="h-7 px-2 text-[10px] sm:text-xs rounded-full bg-teal-50 hover:bg-teal-100 text-teal-700 border border-teal-200 inline-flex items-center"
                          >
                            {{ t("addBatch") }}
                          </button>
                          <button
                            type="button"
                            @click.stop="removeProductGroup(group.key)"
                            class="h-7 px-2 text-[10px] sm:text-xs rounded-full border border-red-300 bg-red-50 text-red-700 hover:bg-red-100 inline-flex items-center"
                          >
                            {{ language === "ar" ? "حذف" : "Delete" }}
                          </button>
                        </div>
                      </td>
                    </tr>

                    <tr v-if="selectedGroupKey === group.key" class="bg-white">
                      <td colspan="6" class="p-3">
                        <div class="rounded-xl border border-gray-200 bg-gray-50 p-3 space-y-3">
                          <div :class="['flex items-start justify-between gap-3 flex-wrap', isRTL ? 'flex-row-reverse' : 'flex-row']">
                            <div class="flex items-center gap-2 whitespace-nowrap overflow-x-auto pb-1 flex-1 min-w-0">
                              <input
                                :value="language === 'ar' ? group.productNameAr : group.productNameEn"
                                @input="(e) => updateProductIdentityMeta(group.key, language === 'ar' ? 'productNameAr' : 'productNameEn', (e.target as HTMLInputElement).value)"
                                :dir="isRTL ? 'rtl' : 'ltr'"
                                :class="['h-7 rounded-full w-[220px] text-xs border border-gray-300 px-3 bg-white', isRTL ? 'text-right' : 'text-left']"
                              />
                              <input
                                :value="group.barcode"
                                @input="(e) => updateProductIdentityMeta(group.key, 'barcode', (e.target as HTMLInputElement).value)"
                                dir="ltr"
                                class="h-7 rounded-full w-[150px] text-xs border border-gray-300 px-3 bg-white"
                              />
                              <span class="text-[10px] sm:text-[11px] text-gray-600">{{ largestUnitLabel }}</span>
                              <select
                                :value="group.largestUnit"
                                @change="(e) => updateProductGroupMeta(group.key, 'largestUnit', (e.target as HTMLSelectElement).value)"
                                class="h-7 rounded-full w-[104px] text-xs border border-gray-300 px-2 bg-white"
                              >
                                <option v-for="opt in unitOptions" :key="opt" :value="opt">{{ unitLabels[opt] }}</option>
                              </select>
                              <span class="text-[10px] sm:text-[11px] text-gray-600">{{ smallestUnitLabel }}</span>
                              <select
                                :value="group.smallestUnit"
                                @change="(e) => updateProductGroupMeta(group.key, 'smallestUnit', (e.target as HTMLSelectElement).value)"
                                class="h-7 rounded-full w-[104px] text-xs border border-gray-300 px-2 bg-white"
                              >
                                <option v-for="opt in unitOptions" :key="opt" :value="opt">{{ unitLabels[opt] }}</option>
                              </select>
                              <span class="text-[10px] sm:text-[11px] text-gray-600">{{ conversionCountLabel }}</span>
                              <input
                                type="number"
                                min="0"
                                :value="group.smallestUnitsPerLargePack"
                                @input="(e) => updateProductGroupMeta(group.key, 'smallestUnitsPerLargePack', (e.target as HTMLInputElement).value)"
                                dir="ltr"
                                class="h-7 rounded-full w-[92px] text-xs text-center border border-gray-300 px-2 bg-white"
                              />
                            </div>

                            <div :class="['flex items-center gap-2 flex-wrap shrink-0', isRTL ? 'justify-start' : 'justify-end']">
                              <button
                                type="button"
                                @click="addNewBatchRow(group.key)"
                                class="h-9 px-4 rounded-full text-xs bg-teal-50 hover:bg-teal-100 text-teal-700 border border-teal-200 shadow-sm gap-2 inline-flex items-center"
                              >
                                <Plus class="size-4" />
                                {{ t("addBatch") }}
                              </button>
                            </div>
                          </div>

                          <div v-if="group.rows.length > 0" class="overflow-x-auto border border-gray-200 rounded-xl bg-white">
                            <table class="w-full text-[11px] sm:text-xs">
                              <thead>
                                <tr class="border-b border-gray-200 bg-white">
                                  <th class="text-[10px] sm:text-[11px] font-semibold text-gray-700 h-8 sm:h-10 px-2 text-start">{{ t("batchNumber") }}</th>
                                  <th class="text-[10px] sm:text-[11px] font-semibold text-gray-700 h-8 sm:h-10 px-2 text-start">{{ t("expiry") }}</th>
                                  <th class="text-[10px] sm:text-[11px] font-semibold text-gray-700 h-8 sm:h-10 px-2 text-start">{{ t("warehouseLocation") }}</th>
                                  <th class="text-[10px] sm:text-[11px] font-semibold text-gray-700 h-8 sm:h-10 px-2 text-start">{{ t("stockTypeUpdate") }}</th>
                                  <th class="text-[10px] sm:text-[11px] font-semibold text-gray-700 h-8 sm:h-10 px-2 text-center">{{ t("currentStock") }}</th>
                                  <th class="text-[10px] sm:text-[11px] font-semibold text-gray-700 h-8 sm:h-10 px-2 text-center">{{ t("newStockQty") }}</th>
                                  <th class="text-[10px] sm:text-[11px] font-semibold text-gray-700 h-8 sm:h-10 px-2 text-center">{{ t("cost") }}</th>
                                  <th class="text-[10px] sm:text-[11px] font-semibold text-gray-700 h-8 sm:h-10 px-2 text-center">{{ t("sellingPrice") }}</th>
                                  <th class="text-[10px] sm:text-[11px] font-semibold text-gray-700 h-8 sm:h-10 px-2 text-center">{{ t("newStockLevel") }}</th>
                                  <th class="text-[10px] sm:text-[11px] font-semibold text-gray-700 h-8 sm:h-10 px-2 text-start">{{ t("reason") }}</th>
                                  <th class="text-[10px] sm:text-[11px] font-semibold text-gray-700 h-8 sm:h-10 px-2 text-center">{{ t("actions") }}</th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr v-for="item in group.rows" :key="`inline-${item.id}`">
                                  <td class="py-2 px-2">
                                    <input
                                      :value="item.batchNumber"
                                      @input="(e) => updateStockItem(item.id, 'batchNumber', (e.target as HTMLInputElement).value)"
                                      :placeholder="t('batchNumber')"
                                      dir="ltr"
                                      class="h-9 rounded-full w-[118px] text-[11px] border border-gray-300 px-3 bg-white"
                                    />
                                  </td>
                                  <td class="py-2 px-2">
                                    <input
                                      :value="item.expiry"
                                      @input="(e) => updateStockItem(item.id, 'expiry', (e.target as HTMLInputElement).value)"
                                      :placeholder="t('expiry')"
                                      dir="ltr"
                                      class="h-9 rounded-full w-[110px] text-[11px] border border-gray-300 px-3 bg-white"
                                    />
                                  </td>
                                  <td class="py-2 px-2">
                                    <input
                                      :value="item.warehouseZone"
                                      @input="(e) => updateStockItem(item.id, 'warehouseZone', (e.target as HTMLInputElement).value)"
                                      :placeholder="t('warehouseLocation')"
                                      class="h-9 rounded-full w-[128px] text-[11px] border border-gray-300 px-3 bg-white"
                                    />
                                  </td>
                                  <td class="py-2 px-2">
                                    <select
                                      :value="item.stockTypeUpdate"
                                      @change="(e) => updateStockItem(item.id, 'stockTypeUpdate', (e.target as HTMLSelectElement).value)"
                                      class="w-[120px] rounded-full h-9 text-[11px] border border-gray-300 px-3 bg-white"
                                    >
                                      <option value="stockIn">{{ t("stockIn") }}</option>
                                      <option value="stockOut">{{ t("stockOut") }}</option>
                                    </select>
                                  </td>
                                  <td class="py-2 px-2 text-center">{{ item.currentStock }}</td>
                                  <td class="py-2 px-2 text-center">
                                    <input
                                      type="number"
                                      min="0"
                                      :value="item.newStockQty"
                                      @input="(e) => updateStockItem(item.id, 'newStockQty', (e.target as HTMLInputElement).value)"
                                      :placeholder="language === 'ar' ? 'الكمية' : 'Qty'"
                                      dir="ltr"
                                      class="w-[90px] h-9 rounded-full text-center mx-auto text-[11px] border border-gray-300 px-2 bg-white"
                                    />
                                  </td>
                                  <td class="py-2 px-2 text-center">
                                    <input
                                      type="number"
                                      min="0"
                                      step="0.01"
                                      :value="item.avgCost"
                                      @input="(e) => updateStockItem(item.id, 'avgCost', (e.target as HTMLInputElement).value)"
                                      :placeholder="language === 'ar' ? 'التكلفة' : 'Cost'"
                                      class="w-[90px] h-9 rounded-full text-center mx-auto text-[11px] border border-gray-300 px-2 bg-white"
                                    />
                                  </td>
                                  <td class="py-2 px-2 text-center">
                                    <input
                                      type="number"
                                      min="0"
                                      step="0.01"
                                      :value="item.sellPrice"
                                      @input="(e) => updateStockItem(item.id, 'sellPrice', (e.target as HTMLInputElement).value)"
                                      :placeholder="language === 'ar' ? 'السعر' : 'Price'"
                                      class="w-[90px] h-9 rounded-full text-center mx-auto text-[11px] border border-gray-300 px-2 bg-white"
                                    />
                                  </td>
                                  <td class="py-2 px-2 text-center">
                                    <span class="inline-flex min-w-[64px] items-center justify-center rounded-md px-2 py-1 text-[11px] font-semibold bg-gray-50 text-gray-900">
                                      {{ computeNextLevel(item) }}
                                    </span>
                                  </td>
                                  <td class="py-2 px-2">
                                    <input
                                      :value="item.reason"
                                      @input="(e) => updateStockItem(item.id, 'reason', (e.target as HTMLInputElement).value)"
                                      :placeholder="t('enterAdjustmentReason')"
                                      :class="['h-9 rounded-full w-[168px] text-[11px] border border-gray-300 px-3 bg-white', isRTL ? 'text-right' : 'text-left']"
                                    />
                                  </td>
                                  <td class="py-2 px-2 text-center">
                                    <button
                                      type="button"
                                      @click="removeStockItem(item.id)"
                                      class="size-8 p-0 hover:bg-red-50 text-red-600 rounded-full inline-flex items-center justify-center"
                                    >
                                      <Trash2 class="size-4" />
                                    </button>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>

                          <div v-else class="px-4 py-4 text-center border border-gray-200 rounded-xl bg-white">
                            <div class="text-sm font-semibold text-gray-900">{{ t("noBatchRowsYet") }}</div>
                            <div class="text-xs text-gray-500 mt-1">{{ t("addExistingOrCreateNewBatch") }}</div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  </template>
                </tbody>
              </table>
            </div>
          </div>

          <div class="px-4 py-3 border-t border-gray-200 bg-white flex items-center justify-between gap-3">
            <div class="text-sm text-gray-600">
              {{ t("manualStockRowsCount") }} {{ visibleRows.length }}
            </div>
            <div class="flex items-center gap-3">
              <div
                v-if="isOnboardingEntry"
                class="hidden items-center gap-3 rounded-2xl border border-amber-100 bg-amber-50/80 px-3 py-2 text-left sm:flex"
              >
                <div class="flex size-9 items-center justify-center rounded-xl bg-white text-orange-600 shadow-sm">
                  <Gift class="size-4" :stroke-width="2.2" />
                </div>
                <div class="space-y-0.5">
                  <p class="text-xs font-semibold uppercase tracking-[0.14em] text-orange-700/80">
                    <template v-if="language === 'ar'">
                      مكافأة الرفع • <span class="font-bold">3.5 دينار</span>
                    </template>
                    <template v-else>
                      Upload reward • <span class="font-bold">JOD 3.5</span>
                    </template>
                  </p>
                  <p class="text-sm font-medium text-gray-900">
                    {{ rewardCalloutMessage }}
                  </p>
                </div>
              </div>
              <button
                type="button"
                @click="handleCancel"
                class="h-10 px-4 rounded-full border border-gray-300 bg-white text-sm hover:bg-gray-50"
              >
                {{ t("cancel") }}
              </button>
              <button
                v-if="!usesGuidedAddProductsFlow"
                type="button"
                @click="handleSaveDraft"
                class="h-10 px-4 rounded-full border border-gray-300 bg-white text-gray-700 text-sm hover:bg-gray-50"
              >
                {{ t("saveAsDraft") }}
              </button>
              <button
                type="button"
                @click="handleUpdateStock"
                class="bg-teal-500 hover:bg-teal-600 h-10 px-5 text-white rounded-full gap-2 text-sm inline-flex items-center"
              >
                <Save class="size-4" />
                {{ t("updateStock") }}
              </button>
            </div>
          </div>
        </template>

        <div v-else class="p-4 sm:p-6 lg:p-7">
          <div class="mx-auto max-w-[72rem] rounded-[28px] border border-gray-200 bg-white p-5 shadow-sm sm:p-6 lg:p-7">
            <div class="grid gap-5 lg:grid-cols-[1.15fr_0.95fr] lg:items-center lg:gap-6">
              <div :class="isRTL ? 'text-right' : 'text-left'">
                <div class="flex size-16 items-center justify-center rounded-2xl bg-teal-100 text-teal-700">
                  <Package class="size-8" />
                </div>
                <h3 class="mt-3 text-2xl font-semibold tracking-tight text-gray-950">
                  {{ t("noProductsAddedYet") }}
                </h3>
                <p class="mt-3 max-w-xl text-sm leading-7 text-gray-600 sm:text-base">
                  {{ t("manualStockEmptyStateDescription") }}
                </p>
                <div class="mt-4 space-y-3 lg:max-w-[44rem]">
                  <div
                    v-if="entryPoint === 'onboarding'"
                    class="rounded-[24px] border border-amber-100 bg-gradient-to-r from-amber-50/80 via-white to-orange-50/70 p-3.5 sm:p-4"
                  >
                    <div class="flex items-start gap-3">
                      <div class="mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-2xl bg-white text-orange-600 shadow-sm">
                        <Gift class="size-4" :stroke-width="2.2" />
                      </div>
                      <div class="min-w-0 flex-1 space-y-1.5">
                        <p class="text-xs font-semibold uppercase tracking-[0.16em] text-orange-700/80">
                          {{ language === "ar" ? "مكافأة الترحيب" : "Welcome reward" }}
                        </p>
                        <p class="text-base font-semibold leading-6 text-gray-900">
                          <template v-if="language === 'ar'">
                            سوف تحصل على <span class="font-bold">3.5 دينار</span> عند رفع المخزون
                          </template>
                          <template v-else>
                            Get <span class="font-bold">JOD 3.5</span> when you upload your inventory
                          </template>
                        </p>
                        <p class="max-w-2xl text-sm leading-6 text-gray-600">
                          {{ t("rewardWalletMessage") }}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div class="grid gap-3 sm:max-w-[44rem] sm:grid-cols-2 sm:items-stretch">
                    <button
                      type="button"
                      @click="openAddProductDialog('core')"
                      class="h-12 w-full justify-center rounded-2xl bg-teal-600 px-6 text-sm font-semibold text-white shadow-md shadow-teal-600/20 hover:bg-teal-700 hover:shadow-lg hover:shadow-teal-600/30 inline-flex items-center gap-2"
                    >
                      <Plus class="size-4" />
                      {{ t("addProduct") }}
                    </button>
                    <button
                      v-if="showResetExistingStockOption && hasExistingInventoryProducts"
                      type="button"
                      @click="handleUseExistingInventoryProducts"
                      class="h-12 w-full justify-center rounded-2xl border border-teal-200 bg-white px-5 text-sm font-medium text-teal-700 hover:bg-teal-50 hover:text-teal-800 inline-flex items-center gap-2"
                    >
                      <Boxes class="size-4" />
                      {{ language === "ar" ? "استخدم منتجاتي الحالية" : "Use my existing products" }}
                    </button>
                  </div>
                </div>
              </div>

              <div class="rounded-[24px] border border-gray-200 bg-gray-50 p-3.5 lg:p-4">
                <div class="rounded-[20px] border border-dashed border-teal-200 bg-white p-3.5 shadow-sm lg:p-4">
                  <div class="flex items-center gap-3 border-b border-gray-100 pb-3">
                    <div class="h-2.5 w-2.5 rounded-full bg-teal-500" />
                    <div class="h-2.5 w-24 rounded-full bg-gray-200" />
                  </div>
                  <div class="mt-3 space-y-2.5">
                    <div
                      v-for="row in [0, 1, 2]"
                      :key="row"
                      class="grid grid-cols-[1.2fr_0.8fr_0.7fr] gap-3 rounded-2xl border border-gray-100 bg-gray-50 px-3 py-2.5"
                    >
                      <div class="h-9 rounded-full bg-white" />
                      <div class="h-9 rounded-full bg-white" />
                      <div class="h-9 rounded-full bg-white" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <footer
      class="sticky bottom-0 z-40 border-t border-gray-200 bg-white px-6 py-3"
      :dir="isRTL ? 'rtl' : 'ltr'"
    >
      <div class="flex items-center justify-between">
        <div class="text-sm text-gray-600">{{ t("poweredByPulse") }}</div>
        <div class="flex items-center gap-4">
          <button type="button" class="text-teal-600 hover:text-teal-700 p-0 h-auto text-sm bg-transparent">
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
import { computed, onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import {
  AlertTriangle,
  Boxes,
  ChevronUp,
  Gift,
  Package,
  PencilLine,
  Plus,
  Save,
  Search,
  Sparkles,
  Trash2,
} from "lucide-vue-next";
import { useLanguage } from "../composables/useLanguage";
import AddProductDialog from "../components/dialogs/AddProductDialog.vue";
import { PHARMACY_INVENTORY_PRODUCTS_V2 } from "../data/pharmacyInventoryProducts";
import type { InventoryProduct } from "../data/inventoryModels";
import type { AumetCoreProduct } from "../data/aumetCoreProductsSample";
import type {
  AddProductSource,
  ManualCustomProductInput,
  SelectedInventoryProductWithBatches,
} from "../types/manualStock";

type StockItemSource = "core" | "inventory" | "custom";
type UnitOption =
  | "box"
  | "pack"
  | "bottle"
  | "blister"
  | "strip"
  | "vial"
  | "ampoule"
  | "tablet"
  | "capsule"
  | "piece";

interface StockItem {
  id: string;
  source: StockItemSource;
  productCode: string;
  productNameEn: string;
  productNameAr: string;
  subtitleEn: string;
  subtitleAr: string;
  barcode: string;
  categoryKey: string;
  batchNumber: string;
  expiry: string;
  warehouseZone: string;
  currentStock: number;
  stockTypeUpdate: "stockIn" | "stockOut";
  newStockQty: string;
  avgCost: string;
  sellPrice: string;
  reason: string;
}

interface ProductGroupMeta {
  key: string;
  source: StockItemSource;
  productCode: string;
  productNameEn: string;
  productNameAr: string;
  subtitleEn: string;
  subtitleAr: string;
  barcode: string;
  categoryKey: string;
  largestUnit: UnitOption;
  smallestUnit: UnitOption;
  smallestUnitsPerLargePack: string;
}

type ProductGroupWithRows = ProductGroupMeta & { rows: StockItem[] };

type ImportedStockRow = {
  productCode: string;
  productNameEn: string;
  productNameAr: string;
  barcode: string;
  categoryKey: string;
  batchNumber: string;
  expiry: string;
  warehouseZone: string;
  currentStock: number;
  stockTypeUpdate: "stockIn" | "stockOut";
  newStockQty: string;
  avgCost: string;
  sellPrice: string;
  reason: string;
};

const { t, language } = useLanguage();
const router = useRouter();
const route = useRoute();
const isRTL = computed(() => language.value === "ar");

const entryPointParam = computed<"default" | "onboarding" | "createManyProducts">(() => {
  const raw = route.query.entry;
  if (raw === "onboarding" || raw === "createManyProducts") return raw;
  return "default";
});
const entryPoint = entryPointParam;
const isOnboardingEntry = computed(() => entryPoint.value === "onboarding");
const isCreateManyProductsEntry = computed(() => entryPoint.value === "createManyProducts");
const usesGuidedAddProductsFlow = computed(
  () => isOnboardingEntry.value || isCreateManyProductsEntry.value,
);
const showResetExistingStockOption = computed(() => !usesGuidedAddProductsFlow.value);
const availableAddProductSources = computed<AddProductSource[]>(() =>
  usesGuidedAddProductsFlow.value ? ["core", "custom"] : ["core", "inventory", "custom"],
);

const largestUnitLabel = computed(() => (language.value === "ar" ? "أكبر وحدة" : "Largest Unit"));
const smallestUnitLabel = computed(() => (language.value === "ar" ? "أصغر وحدة" : "Smallest Unit"));
const conversionCountLabel = computed(() =>
  language.value === "ar" ? "عدد الصغرى/كبرى" : "Smallest Unit Count",
);
const productLabel = computed(() => (language.value === "ar" ? "المنتج" : "Product"));
const sourceLabel = computed(() => (language.value === "ar" ? "المصدر" : "Source"));
const unitsLabel = computed(() => (language.value === "ar" ? "الوحدات" : "Units"));
const aumetReferenceLabel = computed(() =>
  language.value === "ar" ? "مرجع Aumet" : "Aumet Reference",
);

const unitLabels = computed<Record<UnitOption, string>>(() =>
  language.value === "ar"
    ? {
        box: "صندوق",
        pack: "عبوة",
        bottle: "زجاجة",
        blister: "شريط",
        strip: "ستريب",
        vial: "فيال",
        ampoule: "أمبول",
        tablet: "قرص",
        capsule: "كبسولة",
        piece: "قطعة",
      }
    : {
        box: "Box",
        pack: "Pack",
        bottle: "Bottle",
        blister: "Blister",
        strip: "Strip",
        vial: "Vial",
        ampoule: "Ampoule",
        tablet: "Tablet",
        capsule: "Capsule",
        piece: "Piece",
      },
);
const unitOptions: UnitOption[] = [
  "box",
  "pack",
  "bottle",
  "blister",
  "strip",
  "vial",
  "ampoule",
  "tablet",
  "capsule",
  "piece",
];

const searchQuery = ref("");
const addProductDialogOpen = ref(false);
const importConfirmationOpen = ref(false);
const pendingImportedRows = ref<ImportedStockRow[]>([]);
const skippedImportedRows = ref<ImportedStockRow[]>([]);
const pendingImportFileName = ref("");
const activeSource = ref<AddProductSource>("inventory");
const stockItems = ref<StockItem[]>([]);
const productGroups = ref<ProductGroupMeta[]>([]);
const selectedGroupKey = ref<string | null>(null);
const resetExistingStock = ref(false);
const importInputRef = ref<HTMLInputElement | null>(null);

const selectedCodes = computed(() => stockItems.value.map((i) => i.productCode));

const visibleRows = computed(() => {
  const q = searchQuery.value.trim().toLowerCase();
  if (!q) return stockItems.value;
  return stockItems.value.filter((item) =>
    [
      item.productCode,
      item.barcode,
      item.productNameEn,
      item.productNameAr,
      item.subtitleEn,
      item.subtitleAr,
      item.batchNumber,
      item.expiry,
      item.warehouseZone,
    ].some((v) => v.toLowerCase().includes(q)),
  );
});

const hasExistingInventoryProducts = computed(
  () => PHARMACY_INVENTORY_PRODUCTS_V2.length > 0,
);
const onboardingRewardTarget = 10;
const onboardingProductCount = computed(() => productGroups.value.length);
const remainingOnboardingProducts = computed(() =>
  Math.max(onboardingRewardTarget - onboardingProductCount.value, 0),
);
const hasReachedOnboardingReward = computed(
  () => onboardingProductCount.value >= onboardingRewardTarget,
);

const rewardCalloutMessage = computed(() => {
  if (hasReachedOnboardingReward.value) {
    return language.value === "ar"
      ? "حدّث المخزون الآن لتحصل على المكافأة."
      : "Update stock now to get the reward.";
  }
  if (language.value === "ar") {
    return `أضف ${remainingOnboardingProducts.value} منتجات أخرى للوصول إلى 10 والحصول على المكافأة.`;
  }
  return `Add ${remainingOnboardingProducts.value} more product${remainingOnboardingProducts.value === 1 ? "" : "s"} to reach 10 and unlock the reward.`;
});

const importDescriptionText = computed(() => {
  if (language.value === "ar") {
    return `تم العثور على ${pendingImportedRows.value.length} صف جديد في ${pendingImportFileName.value}.${skippedImportedRows.value.length > 0 ? ` يوجد أيضًا ${skippedImportedRows.value.length} صف مضاف مسبقًا وسيتم تخطيه.` : ""} هل تريد إضافتها مباشرة إلى الجدول؟`;
  }
  return `Found ${pendingImportedRows.value.length} new row(s) in ${pendingImportFileName.value}.${skippedImportedRows.value.length > 0 ? ` ${skippedImportedRows.value.length} row(s) are already in the table and will be skipped.` : ""} Do you want to add them directly to the table?`;
});

const groupedVisibleRows = computed<ProductGroupWithRows[]>(() => {
  const rowsMap = new Map<string, StockItem[]>();
  visibleRows.value.forEach((item) => {
    const key = `${item.source}::${item.productCode}`;
    const list = rowsMap.get(key) ?? [];
    list.push(item);
    rowsMap.set(key, list);
  });
  const q = searchQuery.value.trim().toLowerCase();
  return productGroups.value
    .filter((group) => {
      if (!q) return true;
      return [
        group.productCode,
        group.barcode,
        group.productNameEn,
        group.productNameAr,
        group.subtitleEn,
        group.subtitleAr,
      ].some((v) => v.toLowerCase().includes(q));
    })
    .map((group) => ({ ...group, rows: rowsMap.get(group.key) ?? [] }));
});

watch(groupedVisibleRows, (groups) => {
  if (groups.length === 0) {
    selectedGroupKey.value = null;
    return;
  }
  if (
    selectedGroupKey.value &&
    !groups.some((g) => g.key === selectedGroupKey.value)
  ) {
    selectedGroupKey.value = null;
  }
});

onMounted(() => {
  if (isCreateManyProductsEntry.value) {
    activeSource.value = "core";
    addProductDialogOpen.value = true;
  }
});

function openAddProductDialog(source: AddProductSource) {
  activeSource.value = source;
  addProductDialogOpen.value = true;
}

function toggleGroupSelection(key: string) {
  selectedGroupKey.value = selectedGroupKey.value === key ? null : key;
}

function handleUseExistingInventoryProducts() {
  activeSource.value = "inventory";
  addProductDialogOpen.value = true;
}

function buildCoreStockItem(product: AumetCoreProduct): StockItem {
  return {
    id: product.id,
    source: "core",
    productCode: product.code,
    productNameEn: product.nameEn,
    productNameAr: product.nameAr,
    subtitleEn: product.subtitleEn,
    subtitleAr: product.subtitleAr,
    barcode: product.barcode,
    categoryKey: product.categoryKey,
    batchNumber: "",
    expiry: "",
    warehouseZone: "",
    currentStock: product.currentStock,
    stockTypeUpdate: "stockIn",
    newStockQty: "",
    avgCost: product.avgCost,
    sellPrice: product.sellPrice,
    reason: "",
  };
}

function buildCustomStockItem(product: ManualCustomProductInput): StockItem {
  return {
    id: `custom-${product.productCode}`,
    source: "custom",
    productCode: product.productCode,
    productNameEn: product.productNameEn,
    productNameAr: product.productNameAr,
    subtitleEn: "",
    subtitleAr: "",
    barcode: product.barcode,
    categoryKey: product.categoryKey,
    batchNumber: "NEW-BATCH",
    expiry: "",
    warehouseZone: "",
    currentStock: Number(product.currentStock) || 0,
    stockTypeUpdate: "stockIn",
    newStockQty: "",
    avgCost: product.avgCost,
    sellPrice: product.sellPrice,
    reason: "",
  };
}

function buildInventoryFallbackStockItem(product: InventoryProduct): StockItem {
  return {
    id: `inventory-${product.code}`,
    source: "inventory",
    productCode: product.code,
    productNameEn: product.nameEn,
    productNameAr: product.nameAr,
    subtitleEn: product.subtitleEn,
    subtitleAr: product.subtitleAr,
    barcode: product.barcode,
    categoryKey: product.categoryKey,
    batchNumber: "NEW-BATCH",
    expiry: "",
    warehouseZone: "",
    currentStock: 0,
    stockTypeUpdate: "stockIn",
    newStockQty: "",
    avgCost: "",
    sellPrice: "",
    reason: "",
  };
}

function addCoreProductsToTable(products: AumetCoreProduct[]) {
  const existingCodes = new Set(productGroups.value.map((g) => g.productCode));
  const newGroups: ProductGroupMeta[] = products
    .filter((p) => !existingCodes.has(p.code))
    .map((p) => ({
      key: `core::${p.code}`,
      source: "core",
      productCode: p.code,
      productNameEn: p.nameEn,
      productNameAr: p.nameAr,
      subtitleEn: p.subtitleEn,
      subtitleAr: p.subtitleAr,
      barcode: p.barcode,
      categoryKey: p.categoryKey,
      largestUnit: "box",
      smallestUnit: "piece",
      smallestUnitsPerLargePack: "",
    }));
  productGroups.value = [...productGroups.value, ...newGroups];

  const existingItemCodes = new Set(stockItems.value.map((i) => i.productCode));
  const newItems = products
    .filter((p) => !existingItemCodes.has(p.code))
    .map(buildCoreStockItem);
  stockItems.value = [...stockItems.value, ...newItems];
}

function addInventoryProductsToTable(
  products: SelectedInventoryProductWithBatches[],
) {
  const existingCodes = new Set(productGroups.value.map((g) => g.productCode));
  const newGroups: ProductGroupMeta[] = products
    .filter(({ product }) => !existingCodes.has(product.code))
    .map(({ product }) => ({
      key: `inventory::${product.code}`,
      source: "inventory",
      productCode: product.code,
      productNameEn: product.nameEn,
      productNameAr: product.nameAr,
      subtitleEn: product.subtitleEn,
      subtitleAr: product.subtitleAr,
      barcode: product.barcode,
      categoryKey: product.categoryKey,
      largestUnit: "box",
      smallestUnit: "piece",
      smallestUnitsPerLargePack: "",
    }));
  productGroups.value = [...productGroups.value, ...newGroups];

  const existingRowKeys = new Set(
    stockItems.value.map((i) => `${i.productCode}::${i.batchNumber}`),
  );

  const newItems = products.flatMap(({ product, selectedBatchIds }) => {
    const normalized = PHARMACY_INVENTORY_PRODUCTS_V2.find(
      (p) => p.code === product.code,
    );
    if (!normalized) {
      const fallback = buildInventoryFallbackStockItem(product);
      return existingRowKeys.has(`${fallback.productCode}::${fallback.batchNumber}`)
        ? []
        : [fallback];
    }
    if (selectedBatchIds.length === 0) {
      const newBatchRow: StockItem = {
        id: `inventory-${product.code}-new-${stockItems.value.length + Math.random()}`,
        source: "inventory",
        productCode: product.code,
        productNameEn: product.nameEn,
        productNameAr: product.nameAr,
        subtitleEn: product.subtitleEn,
        subtitleAr: product.subtitleAr,
        barcode: product.barcode,
        categoryKey: product.categoryKey,
        batchNumber: "",
        expiry: "",
        warehouseZone: "",
        currentStock: 0,
        stockTypeUpdate: "stockIn",
        newStockQty: "",
        avgCost: "",
        sellPrice: "",
        reason: "",
      };
      return [newBatchRow];
    }
    return normalized.batches
      .filter((batch) => selectedBatchIds.includes(batch.id))
      .map<StockItem>((batch) => ({
        id: `inventory-${product.code}-${batch.id}`,
        source: "inventory",
        productCode: product.code,
        productNameEn: product.nameEn,
        productNameAr: product.nameAr,
        subtitleEn: product.subtitleEn,
        subtitleAr: product.subtitleAr,
        barcode: product.barcode,
        categoryKey: product.categoryKey,
        batchNumber: batch.batchNumber,
        expiry: batch.expiry,
        warehouseZone: batch.warehouseZone,
        currentStock: Number(batch.stockQty) || 0,
        stockTypeUpdate: "stockIn",
        newStockQty: "",
        avgCost: batch.avgCost,
        sellPrice: batch.sellPrice,
        reason: "",
      }))
      .filter(
        (item) =>
          !existingRowKeys.has(`${item.productCode}::${item.batchNumber}`),
      );
  });
  stockItems.value = [...stockItems.value, ...newItems];
}

function addCustomProductToTable(product: ManualCustomProductInput) {
  const existingCodes = new Set(productGroups.value.map((g) => g.productCode));
  if (existingCodes.has(product.productCode)) return;
  productGroups.value = [
    ...productGroups.value,
    {
      key: `custom::${product.productCode}`,
      source: "custom",
      productCode: product.productCode,
      productNameEn: product.productNameEn,
      productNameAr: product.productNameAr,
      subtitleEn: "",
      subtitleAr: "",
      barcode: product.barcode,
      categoryKey: product.categoryKey,
      largestUnit: "box",
      smallestUnit: "piece",
      smallestUnitsPerLargePack: "",
    },
  ];
  const existingItemCodes = new Set(stockItems.value.map((i) => i.productCode));
  if (!existingItemCodes.has(product.productCode)) {
    stockItems.value = [...stockItems.value, buildCustomStockItem(product)];
  }
}

function handleImportFileChange(event: Event) {
  const input = event.target as HTMLInputElement;
  input.value = "";
}

function handleConfirmImport() {
  importConfirmationOpen.value = false;
  pendingImportedRows.value = [];
  skippedImportedRows.value = [];
  pendingImportFileName.value = "";
}

function handleCancelImportConfirmation() {
  importConfirmationOpen.value = false;
  pendingImportedRows.value = [];
  skippedImportedRows.value = [];
  pendingImportFileName.value = "";
}

function removeStockItem(id: string) {
  stockItems.value = stockItems.value.filter((i) => i.id !== id);
}

function removeProductGroup(groupKey: string) {
  const parts = groupKey.split("::");
  const productCode = parts[1] ?? "";
  productGroups.value = productGroups.value.filter(
    (g) => g.productCode !== productCode,
  );
  stockItems.value = stockItems.value.filter(
    (i) => i.productCode !== productCode,
  );
}

function updateStockItem(
  id: string,
  field: keyof StockItem,
  value: string | number,
) {
  stockItems.value = stockItems.value.map((item) => {
    if (item.id !== id) return item;
    return { ...item, [field]: value } as StockItem;
  });
}

function updateProductGroupMeta(
  groupKey: string,
  field: "largestUnit" | "smallestUnit" | "smallestUnitsPerLargePack",
  value: string,
) {
  productGroups.value = productGroups.value.map((g) =>
    g.key === groupKey ? ({ ...g, [field]: value } as ProductGroupMeta) : g,
  );
}

function updateProductIdentityMeta(
  groupKey: string,
  field: "productNameEn" | "productNameAr" | "barcode",
  value: string,
) {
  const parts = groupKey.split("::");
  const source = parts[0] ?? "";
  const productCode = parts[1] ?? "";
  productGroups.value = productGroups.value.map((g) =>
    g.key === groupKey ? { ...g, [field]: value } : g,
  );
  stockItems.value = stockItems.value.map((item) =>
    item.productCode === productCode && item.source === source
      ? { ...item, [field]: value }
      : item,
  );
}

function addNewBatchRow(groupKey: string) {
  const parts = groupKey.split("::");
  const productCode = parts[1] ?? "";
  const baseRow = stockItems.value.find((i) => i.productCode === productCode);
  const groupMeta = productGroups.value.find((g) => g.key === groupKey);
  if (!baseRow && !groupMeta) return;
  const source = (baseRow?.source ?? groupMeta?.source ?? "inventory") as StockItemSource;
  stockItems.value = [
    ...stockItems.value,
    {
      id: `${source}-${productCode}-new-${Date.now()}-${Math.random()}`,
      source,
      productCode,
      productNameEn: baseRow?.productNameEn ?? groupMeta?.productNameEn ?? "",
      productNameAr: baseRow?.productNameAr ?? groupMeta?.productNameAr ?? "",
      subtitleEn: baseRow?.subtitleEn ?? groupMeta?.subtitleEn ?? "",
      subtitleAr: baseRow?.subtitleAr ?? groupMeta?.subtitleAr ?? "",
      barcode: baseRow?.barcode ?? groupMeta?.barcode ?? "",
      categoryKey: baseRow?.categoryKey ?? groupMeta?.categoryKey ?? "",
      batchNumber: "",
      expiry: "",
      warehouseZone: "",
      currentStock: 0,
      stockTypeUpdate: "stockIn",
      newStockQty: "",
      avgCost: "",
      sellPrice: "",
      reason: "",
    },
  ];
}

function computeNextLevel(item: StockItem) {
  const qty = Number(item.newStockQty) || 0;
  return item.stockTypeUpdate === "stockIn"
    ? item.currentStock + qty
    : Math.max(0, item.currentStock - qty);
}

function handleSaveDraft() {
  console.log("Saving stock adjustments as draft:", stockItems.value);
}

function handleUpdateStock() {
  console.log("Updating stock:", stockItems.value);
}

function handleCancel() {
  stockItems.value = [];
  router.push({ name: "update-stock" });
}
</script>
