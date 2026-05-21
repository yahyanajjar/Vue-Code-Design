<template>
  <div v-if="!hasImportedInventory" class="flex h-full min-h-0 flex-col bg-gray-50 overflow-hidden">
    <ImportInventoryDialog
      :open="importDialogOpen"
      variant="onboarding"
      @update:open="importDialogOpen = $event"
      @importSuccess="handleImportSuccess"
    />
    <div class="p-6 flex-1">
      <div class="mx-auto flex min-h-[calc(100vh-180px)] max-w-7xl items-center justify-center">
        <div class="grid w-full gap-7 rounded-[32px] border border-gray-200 bg-white p-6 shadow-sm lg:grid-cols-[1.35fr_0.85fr] lg:p-8 xl:p-10">
          <div class="flex flex-col gap-5">
            <div class="space-y-5">
              <div class="inline-flex w-fit items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs font-medium tracking-[0.08em] text-gray-500">
                <Sparkles class="size-4" />
                {{ t("inventoryOnboardingBadge") }}
              </div>
              <div class="space-y-2.5">
                <h1 class="max-w-3xl text-2xl font-semibold tracking-tight text-gray-900 lg:text-3xl">{{ t("inventoryOnboardingTitle") }}</h1>
                <p class="max-w-3xl text-base leading-7 text-gray-600">{{ t("inventoryOnboardingDescription") }}</p>
              </div>
              <div class="grid gap-4 pt-3 sm:grid-cols-2">
                <button
                  @click="importDialogOpen = true"
                  class="h-16 w-full rounded-2xl bg-teal-600 px-8 text-base font-semibold text-white shadow-md hover:bg-teal-700 inline-flex items-center justify-center gap-2"
                >
                  <Upload class="size-5" />
                  {{ t("inventoryOnboardingPrimaryCta") }}
                </button>
                <button
                  @click="goManualOnboarding"
                  class="h-16 w-full rounded-2xl border border-gray-300 bg-gray-50 px-8 text-base font-semibold text-gray-800 hover:bg-gray-100 inline-flex items-center justify-center gap-2"
                >
                  <FileEdit class="size-5" />
                  {{ t("inventoryOnboardingSecondaryCta") }}
                </button>
              </div>
            </div>
            <div class="space-y-4 pt-2">
              <div class="grid gap-4 lg:grid-cols-3">
                <div v-for="step in onboardingSteps" :key="step.title" class="flex min-h-[148px] flex-col rounded-2xl border border-white/80 bg-white/80 p-4 shadow-sm backdrop-blur">
                  <div class="mb-3 flex size-10 items-center justify-center rounded-2xl bg-teal-100 text-teal-700">
                    <component :is="step.icon" class="size-5" />
                  </div>
                  <h2 class="text-base font-semibold leading-6 text-gray-900">{{ step.title }}</h2>
                  <p class="mt-1.5 text-sm leading-6 text-gray-600">{{ step.description }}</p>
                </div>
              </div>
            </div>
          </div>
          <div class="rounded-[28px] border border-teal-100 bg-white/90 p-6 shadow-sm">
            <div class="rounded-[24px] bg-gradient-to-br from-teal-600 to-cyan-600 p-5 text-white">
              <p class="text-sm font-medium text-white/80">{{ t("inventoryOnboardingPreviewLabel") }}</p>
              <h2 class="mt-2 text-2xl font-semibold leading-tight">{{ t("inventoryOnboardingPreviewTitle") }}</h2>
              <p class="mt-2 text-sm leading-6 text-white/85">{{ t("inventoryOnboardingPreviewDescription") }}</p>
            </div>
            <div class="mt-4 space-y-3">
              <div v-for="benefit in benefits" :key="benefit" class="flex items-start gap-3 rounded-2xl border border-gray-100 bg-gray-50 px-4 py-3">
                <div class="mt-0.5 flex size-6 items-center justify-center rounded-full bg-teal-100 text-teal-700">
                  <CheckCircle2 class="size-4" />
                </div>
                <p class="text-sm leading-6 text-gray-700">{{ benefit }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div v-else class="flex flex-col h-full bg-gray-50">
    <AddProductSourceDialog
      :open="addProductModeOpen"
      @update:open="addProductModeOpen = $event"
      @selectSource="handleAddProductSource"
    />
    <CreateProductDialog :open="createProductOpen" @update:open="createProductOpen = $event" />
    <ImportInventoryDialog
      :open="importDialogOpen"
      @update:open="importDialogOpen = $event"
      @importSuccess="handleImportSuccess"
    />
    <InventoryBatchActionDialog
      :open="batchActionDialogOpen"
      :mode="batchActionMode"
      :target="batchActionTarget"
      @update:open="batchActionDialogOpen = $event"
    />
    <ProductRulesDialog
      :open="rulesDialogProductId !== null"
      :product="selectedRulesProduct"
      @update:open="(o) => { if (!o) rulesDialogProductId = null }"
    />
    <AumetReferenceDialog
      :open="aumetReferenceDialogProductId !== null"
      :inventory-product="selectedAumetReferenceProductForDialog"
      :selected-reference-id="selectedAumetReferenceProduct?.aumetReferenceId ?? null"
      @update:open="(o) => { if (!o) aumetReferenceDialogProductId = null }"
      @saveReference="handleSaveAumetReference"
    />

    <div class="p-6 space-y-3 flex-1">
      <div class="px-1 py-0.5">
        <div class="flex items-center justify-between gap-3">
          <div class="min-w-0 flex-1">
            <div class="flex flex-wrap items-center gap-x-2.5 gap-y-0.5">
              <h1 class="text-lg font-semibold tracking-tight text-gray-900">{{ t("inventory") }}</h1>
              <span class="text-xs text-gray-300">•</span>
              <p class="text-xs text-gray-500">Monitor inventory performance and manage stock in one place.</p>
            </div>
          </div>
          <button
            @click="quickActionsOpen = !quickActionsOpen"
            class="inline-flex h-8 shrink-0 items-center justify-center gap-1.5 rounded-full border border-gray-200 bg-gray-50 px-2.5 text-xs font-medium text-gray-700 shadow-sm hover:border-teal-200 hover:bg-teal-50 hover:text-teal-700 relative"
          >
            <Sparkles class="size-3 text-teal-600" />
            {{ language === "ar" ? "الإجراءات السريعة" : "Quick Actions" }}
            <ChevronDown class="size-3" />
          </button>
        </div>

        <div v-if="quickActionsOpen" class="relative">
          <div class="absolute end-0 top-0 z-50 w-[320px] rounded-2xl border border-gray-200 bg-white p-1.5 shadow-xl">
            <button @click="openAddProductMode" class="w-full text-start rounded-xl px-2.5 py-2.5 hover:bg-gray-50 text-xs font-medium text-gray-900 flex items-center gap-2">
              <PackagePlus class="size-4 text-teal-600" />
              {{ language === "ar" ? "إنشاء منتج جديد" : "Create New Product" }}
            </button>
            <button @click="goUpdateStock" class="w-full text-start rounded-xl px-2.5 py-2.5 hover:bg-gray-50 text-xs font-medium text-gray-900 flex items-center gap-2">
              <History class="size-4 text-teal-600" />
              {{ t("stockHistory") }}
            </button>
            <button @click="openImportDialog" class="w-full text-start rounded-xl px-2.5 py-2.5 hover:bg-gray-50 text-xs font-medium text-gray-900 flex items-center gap-2">
              <Upload class="size-4 text-teal-600" />
              {{ t("uploadStockFile") }}
            </button>
            <button @click="goManualUpdate" class="w-full text-start rounded-xl px-2.5 py-2.5 hover:bg-gray-50 text-xs font-medium text-gray-900 flex items-center gap-2">
              <FileEdit class="size-4 text-teal-600" />
              {{ t("manualUpdateStock") }}
            </button>
          </div>
        </div>
      </div>

      <div class="flex min-h-0 flex-1 flex-col bg-white border border-gray-200 rounded-2xl">
        <div class="border-b border-gray-200 p-4">
          <div class="flex flex-col gap-4">
            <div class="grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
              <button
                v-for="item in quickFilterCards"
                :key="item.key"
                type="button"
                @click="handleQuickFilterChange(item.key)"
                :disabled="isTableLoading"
                :class="['group overflow-hidden rounded-2xl border text-start transition-all p-3.5 min-h-[90px]',
                  activeQuickFilter === item.key ? 'border-teal-300 bg-teal-50 text-teal-900 shadow-sm' : 'border-gray-200 bg-white text-gray-900 hover:border-teal-200 hover:shadow-sm',
                  isTableLoading ? 'cursor-wait opacity-80' : 'cursor-pointer']"
              >
                <div class="flex items-start justify-between gap-3">
                  <div class="min-w-0">
                    <div class="text-[12px] font-semibold">{{ item.label }}</div>
                    <p class="mt-1.5 max-w-[22ch] text-[10px] leading-4 opacity-70">{{ item.helper }}</p>
                  </div>
                  <div class="shrink-0 text-[18px] font-semibold leading-none sm:text-[21px]">{{ item.value }}</div>
                </div>
              </button>
            </div>

            <div class="flex flex-col gap-3 lg:flex-row lg:items-center">
              <div class="relative flex-1 min-w-[240px]">
                <Search class="absolute start-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                <input type="text" :placeholder="t('searchByNameIdBarcodeHatch')" class="ps-9 h-9 text-sm border border-gray-300 rounded-full w-full" />
              </div>
              <div class="flex flex-wrap items-center gap-2 lg:ms-auto">
                <button @click="filtersOpen = !filtersOpen" :class="['h-9 gap-2 px-3 text-sm rounded-full border border-gray-300 inline-flex items-center', filtersOpen ? 'bg-teal-50 border-teal-600 text-teal-600' : '']">
                  <Filter class="size-4" /> {{ t("filters") }}
                </button>
                <button @click="openAddProductMode" class="h-9 gap-2 px-3 text-sm rounded-full border border-teal-200 bg-teal-50 text-teal-700 inline-flex items-center hover:bg-teal-100">
                  <Plus class="size-4" /> {{ language === "ar" ? "منتج جديد" : "New Product" }}
                </button>
                <button class="h-9 gap-2 px-3 text-sm rounded-full border border-gray-300 inline-flex items-center">
                  <Download class="size-4" /> {{ t("export") }}
                </button>
              </div>
            </div>
          </div>
        </div>

        <FiltersSection :is-open="filtersOpen" type="products" />

        <div class="mt-4 flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div class="relative min-h-0 flex-1 overflow-auto">
            <div v-if="isTableLoading" class="pointer-events-none absolute inset-0 z-10 flex items-center justify-center px-4">
              <div class="flex items-center gap-2 rounded-full bg-white/80 px-4 py-3 shadow-sm backdrop-blur-sm">
                <span class="size-2.5 rounded-full bg-teal-500 animate-pulse" />
                <span class="size-2.5 rounded-full bg-teal-400 animate-pulse" />
                <span class="size-2.5 rounded-full bg-teal-300 animate-pulse" />
              </div>
            </div>
            <table class="w-full caption-bottom text-sm bg-white">
              <thead>
                <tr class="border-b border-gray-200 bg-gray-50">
                  <th class="h-11 px-2 w-10" />
                  <th class="h-11 px-2 text-start text-[10px] font-semibold uppercase tracking-[0.08em] text-gray-500">{{ t("code") }}</th>
                  <th class="h-11 px-2 text-start text-[10px] font-semibold uppercase tracking-[0.08em] text-gray-500">{{ language === "ar" ? "معلومات المنتج" : "Product Info" }}</th>
                  <th class="h-11 px-2 text-start text-[10px] font-semibold uppercase tracking-[0.08em] text-gray-500">{{ language === "ar" ? "الدفعة / الانتهاء" : "Batch / Expiry" }}</th>
                  <th class="h-11 px-2 text-start text-[10px] font-semibold uppercase tracking-[0.08em] text-gray-500">{{ language === "ar" ? "آخر بيع" : "Last Sale" }}</th>
                  <th class="h-11 px-2 text-start text-[10px] font-semibold uppercase tracking-[0.08em] text-gray-500">{{ language === "ar" ? "الكمية" : "Qty" }}</th>
                  <th class="h-11 px-2 text-start text-[10px] font-semibold uppercase tracking-[0.08em] text-gray-500">{{ language === "ar" ? "متوسط الكلفة" : "Avg Cost" }}</th>
                  <th class="h-11 px-2 text-start text-[10px] font-semibold uppercase tracking-[0.08em] text-gray-500">{{ language === "ar" ? "سعر البيع" : "Sell Price" }}</th>
                  <th class="h-11 px-2 text-start text-[10px] font-semibold uppercase tracking-[0.08em] text-gray-500">{{ t("tax") }}</th>
                  <th class="h-11 px-2 text-start text-[10px] font-semibold uppercase tracking-[0.08em] text-gray-500">{{ language === "ar" ? "الموقع" : "Location" }}</th>
                  <th class="h-11 px-2 text-start text-[10px] font-semibold uppercase tracking-[0.08em] text-gray-500">{{ t("status") }}</th>
                  <th class="h-11 px-2 text-start text-[10px] font-semibold uppercase tracking-[0.08em] text-gray-500">{{ language === "ar" ? "مرجع Aumet" : "Aumet Ref" }}</th>
                  <th class="h-11 px-2 text-start text-[10px] font-semibold uppercase tracking-[0.08em] text-gray-500">{{ t("actions") }}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="displayedProducts.length === 0">
                  <td colspan="13" class="px-6 py-16 text-center">
                    <p class="text-sm font-medium text-gray-900">{{ language === "ar" ? "لا توجد منتجات" : "No products match this filter" }}</p>
                  </td>
                </tr>
                <template v-else v-for="product in displayedProducts" :key="product.id">
                  <tr class="border-b border-gray-200 hover:bg-gray-50">
                    <td class="py-2.5 px-2">
                      <button @click="toggleExpanded(product.id)" class="size-8 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center justify-center">
                        <component :is="expandedProductIds.includes(product.id) ? ChevronUp : ChevronDown" class="size-4 text-gray-600" />
                      </button>
                    </td>
                    <td class="text-[11px] text-gray-700 py-2.5 px-2 text-start">{{ product.code }}</td>
                    <td class="py-2.5 px-2 text-start">
                      <div class="flex min-w-0 items-start gap-3">
                        <div class="size-11 shrink-0 overflow-hidden rounded-xl border border-gray-200 bg-white">
                          <img v-if="product.imageUrl" :src="product.imageUrl" :alt="product.name" class="size-full object-cover" loading="lazy" />
                          <div v-else class="flex size-full items-center justify-center bg-gray-50 text-gray-400">
                            <PackageCheck class="size-4" />
                          </div>
                        </div>
                        <div class="min-w-0">
                          <div class="text-[11px] text-gray-900">{{ product.name }}</div>
                          <div class="flex items-center gap-1.5 text-[10px] text-gray-500 flex-wrap">
                            <span>{{ product.subtitle }}</span>
                            <span class="rounded-full bg-slate-100 px-1.5 py-0.5 text-[9px] text-slate-700">{{ product.batchCount }} {{ t("batches") }}</span>
                          </div>
                          <div class="mt-1 flex flex-wrap items-center gap-1.5 text-[10px] text-gray-500">
                            <span class="rounded-full bg-gray-100 px-1.5 py-0.5 text-gray-600">{{ t("barcode") }}: {{ product.barcode }}</span>
                            <span class="rounded-full bg-gray-100 px-1.5 py-0.5 text-gray-600">{{ t("category") }}: {{ product.category }}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td class="py-2.5 px-2 text-start">
                      <div class="min-w-[148px] space-y-1">
                        <div v-if="product.lotBatch" class="text-[11px] font-medium text-gray-900">{{ product.lotBatch }}</div>
                        <div v-if="product.expiry" class="text-[10px] text-gray-500">
                          {{ language === "ar" ? "الانتهاء: " : "Expiry: " }}
                          <span :class="['inline-flex rounded-full px-1.5 py-0.5 font-semibold', product.statusKey === 'productStatusExpired' ? 'bg-red-100 text-red-700' : product.statusKey === 'productStatusExpiringSoon' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-700']">{{ product.expiry }}</span>
                        </div>
                      </div>
                    </td>
                    <td class="text-[11px] text-gray-700 py-2.5 px-2 text-start">{{ product.lastSale }}</td>
                    <td class="py-2.5 px-2 text-start">
                      <span :class="['inline-flex rounded-full px-2 py-0.5 text-[11px] font-semibold', product.statusKey === 'productStatusOutOfStock' || product.statusKey === 'productStatusExpired' ? 'bg-red-100 text-red-700' : product.statusKey === 'productStatusLowStock' ? 'bg-orange-100 text-orange-700' : product.statusKey === 'productStatusExpiringSoon' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-700']">{{ product.stockQty }}</span>
                    </td>
                    <td class="text-[11px] text-gray-700 py-2.5 px-2 text-start">{{ product.avgCost }}</td>
                    <td class="text-[11px] text-gray-700 py-2.5 px-2 text-start">{{ product.sellPrice }}</td>
                    <td class="text-[11px] text-gray-700 py-2.5 px-2 text-start">{{ product.tax }}</td>
                    <td class="text-[11px] text-gray-700 py-2.5 px-2 text-start">{{ product.warehouse }}</td>
                    <td class="py-2.5 px-2 text-start">
                      <span v-if="product.status" :class="['text-[10px] px-1.5 py-0.5 rounded-full inline-block', product.statusColor === 'red' ? 'bg-red-100 text-red-700' : product.statusColor === 'orange' ? 'bg-orange-100 text-orange-700' : 'bg-yellow-100 text-yellow-700']">{{ product.status }}</span>
                    </td>
                    <td class="py-2.5 px-2 text-start">
                      <button
                        @click="aumetReferenceDialogProductId = product.id"
                        :class="['inline-flex min-h-8 items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-semibold',
                          product.aumetReferenceStatus === 'linked' ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : 'border-amber-200 bg-amber-50 text-amber-800']"
                      >
                        <Link2 class="size-3" />
                        <span>{{ product.aumetReferenceStatus === "linked" ? t("linked") : t("notLinked") }}</span>
                      </button>
                    </td>
                    <td class="py-2.5 px-2">
                      <div class="flex items-center gap-1">
                        <button v-if="product.ruleIssues.length > 0" @click="rulesDialogProductId = product.id" class="relative size-7 rounded-full border border-red-200 bg-red-50 p-0 text-red-700 hover:bg-red-100 inline-flex items-center justify-center">
                          <ShieldAlert class="size-3.5" />
                          <span class="absolute -end-1 -top-1 flex min-w-4 items-center justify-center rounded-full bg-red-600 px-1 text-[9px] font-bold text-white">{{ product.ruleIssues.length }}</span>
                        </button>
                        <button @click="openBatchActionDialog('stockIn', productTarget(product))" class="size-7 rounded-full border border-emerald-200 bg-emerald-50 p-0 text-emerald-700 hover:bg-emerald-100 inline-flex items-center justify-center">
                          <ArrowDownToLine class="size-3.5" />
                        </button>
                        <button @click="openBatchActionDialog('stockOut', productTarget(product))" class="size-7 rounded-full border border-rose-200 bg-rose-50 p-0 text-rose-700 hover:bg-rose-100 inline-flex items-center justify-center">
                          <ArrowUpFromLine class="size-3.5" />
                        </button>
                        <button @click="openBatchActionDialog('editBatch', productTarget(product))" class="size-7 rounded-full border border-amber-200 bg-amber-50 p-0 text-amber-700 hover:bg-amber-100 inline-flex items-center justify-center">
                          <PencilLine class="size-3.5" />
                        </button>
                        <button @click="openBatchActionDialog('addBatch', productTarget(product))" class="size-7 rounded-full border border-blue-200 bg-blue-50 p-0 text-blue-700 hover:bg-blue-100 inline-flex items-center justify-center">
                          <PackagePlus class="size-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                  <tr v-if="expandedProductIds.includes(product.id)" class="bg-gray-50/70 border-b border-gray-200">
                    <td colspan="13" class="p-0">
                      <div class="px-5 py-4">
                        <div class="rounded-2xl border border-gray-200 bg-white overflow-hidden">
                          <div class="px-4 py-3 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
                            <div class="text-sm font-semibold text-gray-900">{{ t("batches") }}</div>
                            <div class="text-xs text-gray-500">{{ product.batchCount }} {{ t("batches") }}</div>
                          </div>
                          <table class="w-full">
                            <thead>
                              <tr class="border-b border-gray-200 bg-white">
                                <th class="text-xs font-semibold text-gray-700 h-10 text-start px-2">{{ t("batchNumber") }}</th>
                                <th class="text-xs font-semibold text-gray-700 h-10 text-start px-2">{{ t("expiry") }}</th>
                                <th class="text-xs font-semibold text-gray-700 h-10 text-start px-2">{{ t("warehouseLocation") }}</th>
                                <th class="text-xs font-semibold text-gray-700 h-10 text-start px-2">{{ t("stockQty") }}</th>
                                <th class="text-xs font-semibold text-gray-700 h-10 text-start px-2">{{ t("avgCostPrice") }}</th>
                                <th class="text-xs font-semibold text-gray-700 h-10 text-start px-2">{{ t("sellPrice") }}</th>
                                <th class="text-xs font-semibold text-gray-700 h-10 text-start px-2">{{ t("actions") }}</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr v-for="batch in product.batches" :key="batch.id" class="border-b border-gray-200 last:border-b-0">
                                <td class="text-[11px] text-gray-700 py-2.5 px-2">{{ batch.batchNumber }}</td>
                                <td class="text-[11px] text-gray-700 py-2.5 px-2">{{ batch.expiry }}</td>
                                <td class="text-[11px] text-gray-700 py-2.5 px-2">{{ t("main") }} · {{ batch.warehouseZone }}</td>
                                <td class="text-[11px] text-gray-700 py-2.5 px-2">{{ batch.stockQty }}</td>
                                <td class="text-[11px] text-gray-700 py-2.5 px-2">{{ batch.avgCost }}</td>
                                <td class="text-[11px] text-gray-700 py-2.5 px-2">{{ batch.sellPrice }}</td>
                                <td class="py-2.5 px-2">
                                  <div class="flex items-center gap-1.5 flex-wrap">
                                    <button @click="openBatchActionDialog('editBatch', batchTarget(product, batch))" class="size-7 rounded-full border border-amber-200 bg-amber-50 text-amber-700 inline-flex items-center justify-center"><PencilLine class="size-3.5" /></button>
                                    <button @click="openBatchActionDialog('stockIn', batchTarget(product, batch))" class="size-7 rounded-full border border-emerald-200 bg-emerald-50 text-emerald-700 inline-flex items-center justify-center"><ArrowDownToLine class="size-3.5" /></button>
                                    <button @click="openBatchActionDialog('stockOut', batchTarget(product, batch))" class="size-7 rounded-full border border-rose-200 bg-rose-50 text-rose-700 inline-flex items-center justify-center"><ArrowUpFromLine class="size-3.5" /></button>
                                  </div>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </td>
                  </tr>
                </template>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { useRouter } from "vue-router";
import {
  ChevronDown, ChevronUp, Plus, History, Upload, FileEdit, PackagePlus,
  Search, Filter, Download, ArrowDownToLine, ArrowUpFromLine, PencilLine,
  Link2, CheckCircle2, Sparkles, PackageCheck, ShieldAlert,
} from "lucide-vue-next";
import { useLanguage } from "../composables/useLanguage";
import FiltersSection from "../components/FiltersSection.vue";
import CreateProductDialog from "../components/dialogs/CreateProductDialog.vue";
import ImportInventoryDialog from "../components/dialogs/ImportInventoryDialog.vue";
import AumetReferenceDialog from "../components/dialogs/AumetReferenceDialog.vue";
import ProductRulesDialog, { type ProductRuleIssue } from "../components/dialogs/ProductRulesDialog.vue";
import InventoryBatchActionDialog, { type InventoryBatchActionDialogMode, type InventoryBatchActionTarget } from "../components/dialogs/InventoryBatchActionDialog.vue";
import AddProductSourceDialog, { type ProductSourceOption } from "../components/dialogs/AddProductSourceDialog.vue";
import { INVENTORY_PRODUCT_COUNT_V2, PHARMACY_INVENTORY_PRODUCTS_V2 } from "../data/pharmacyInventoryProducts";
import { AUMET_CORE_PRODUCTS, type AumetCoreProduct } from "../data/aumetCoreProductsSample";
import type { InventoryProduct, InventoryBatch } from "../data/inventoryModels";

const { t, language } = useLanguage();
const router = useRouter();

type QuickFilter = "all" | "stagnant" | "expiringSoon" | "lowStock";

const hasImportedInventory = ref(false);
const filtersOpen = ref(false);
const quickActionsOpen = ref(false);
const addProductModeOpen = ref(false);
const createProductOpen = ref(false);
const importDialogOpen = ref(false);
const activeQuickFilter = ref<QuickFilter>("all");
const pendingQuickFilter = ref<QuickFilter | null>(null);
const isTableLoading = ref(false);
const expandedProductIds = ref<string[]>([]);
const batchActionDialogOpen = ref(false);
const batchActionMode = ref<InventoryBatchActionDialogMode>("editBatch");
const batchActionTarget = ref<InventoryBatchActionTarget | null>(null);
const rulesDialogProductId = ref<string | null>(null);
const aumetReferenceDialogProductId = ref<string | null>(null);

const aumetReferenceByProductId = ref<Record<string, string | null>>(
  Object.fromEntries(
    PHARMACY_INVENTORY_PRODUCTS_V2.map((p, i) => [
      p.id,
      p.aumetReferenceStatus === "linked"
        ? AUMET_CORE_PRODUCTS[i % AUMET_CORE_PRODUCTS.length]?.id ?? null
        : null,
    ])
  )
);

const LOW_STOCK_THRESHOLD = 30;
const EXPIRING_SOON_MONTHS = 3;

function parseExpiry(s: string): Date | null {
  const [y, m] = s.split("-").map(Number);
  if (!y || !m) return null;
  return new Date(y, m - 1, 1);
}

function derived(p: InventoryProduct) {
  const totalStockQty = p.batches.reduce((sum, b) => sum + (Number(b.stockQty) || 0), 0);
  const dates = p.batches.map((b) => ({ raw: b.expiry, date: parseExpiry(b.expiry) }))
    .filter((x): x is { raw: string; date: Date } => x.date instanceof Date)
    .sort((a, b) => a.date.getTime() - b.date.getTime());
  const nearestExpiry = dates[0]?.raw ?? p.batches[0]?.expiry ?? "";
  const nearestDate = dates[0]?.date ?? null;
  const current = new Date(2026, 4, 1);
  const cutoff = new Date(current.getFullYear(), current.getMonth() + EXPIRING_SOON_MONTHS, 1);
  let statusKey: "productStatusExpiringSoon" | "productStatusExpired" | "productStatusLowStock" | "productStatusOutOfStock" | "" = "";
  let statusColor: "red" | "yellow" | "orange" | "" = "";
  if (totalStockQty <= 0) { statusKey = "productStatusOutOfStock"; statusColor = "red"; }
  else if (nearestDate && nearestDate < current) { statusKey = "productStatusExpired"; statusColor = "red"; }
  else if (nearestDate && nearestDate <= cutoff) { statusKey = "productStatusExpiringSoon"; statusColor = "yellow"; }
  else if (totalStockQty <= LOW_STOCK_THRESHOLD) { statusKey = "productStatusLowStock"; statusColor = "orange"; }
  return { statusKey, statusColor, nearestExpiry, totalStockQty };
}

function ruleIssues(p: InventoryProduct): ProductRuleIssue[] {
  const issues: ProductRuleIssue[] = [];
  const total = p.batches.reduce((s, b) => s + (Number(b.stockQty) || 0), 0);
  const isAr = language.value === "ar";
  if (p.aumetReferenceStatus !== "linked") {
    issues.push({ id: "linking", title: isAr ? "ربط المنتج" : "Linking", description: isAr ? "يجب ربط المنتج." : "The product must be linked.", severity: "critical", channels: isAr ? ["البيع P2P"] : ["Selling P2P"] });
  }
  if (total <= 0) {
    issues.push({ id: "quantity", title: isAr ? "الكمية" : "Quantity", description: isAr ? "الكمية غير كافية." : "Quantity insufficient.", severity: "critical", channels: isAr ? ["نقاط البيع"] : ["POS"] });
  }
  return issues;
}

const products = computed(() => PHARMACY_INVENTORY_PRODUCTS_V2.map((p) => {
  const d = derived(p);
  const first = p.batches[0];
  const linkedId = aumetReferenceByProductId.value[p.id] ?? null;
  const linked = linkedId ? AUMET_CORE_PRODUCTS.find((c) => c.id === linkedId) ?? null : null;
  return {
    id: p.id,
    code: p.code,
    imageUrl: p.imageUrl,
    name: language.value === "ar" ? p.nameAr : p.nameEn,
    subtitle: language.value === "ar" ? p.subtitleAr : p.subtitleEn,
    barcode: p.barcode,
    category: t(p.categoryKey),
    aumetReferenceStatus: linked ? "linked" : "notLinked",
    aumetReferenceId: linked?.id ?? null,
    lotBatch: first?.batchNumber ?? "",
    expiry: d.nearestExpiry,
    lastSale: `${t("jod")} ${p.lastSaleAmount}`,
    stockQty: d.totalStockQty.toLocaleString("en-GB"),
    avgCost: first?.avgCost ?? "",
    sellPrice: first?.sellPrice ?? "",
    tax: p.tax,
    warehouse: first ? `${t("main")} · ${first.warehouseZone}` : "",
    status: d.statusKey ? t(d.statusKey) : "",
    statusColor: d.statusColor,
    statusKey: d.statusKey,
    batchCount: p.batches.length,
    batches: p.batches,
    ruleIssues: ruleIssues(p),
  };
}));

const inventorySummary = computed(() => {
  const list = PHARMACY_INVENTORY_PRODUCTS_V2.map((p) => ({ p, d: derived(p) }));
  return {
    totalProducts: INVENTORY_PRODUCT_COUNT_V2,
    stagnantProducts: list.filter(({ p }) => Number(p.lastSaleAmount) <= 8).length,
    expiringSoonProducts: list.filter(({ d }) => d.statusKey === "productStatusExpiringSoon").length,
    lowStockProducts: list.filter(({ d }) => d.statusKey === "productStatusLowStock").length,
  };
});

const filteredProducts = computed(() => {
  switch (activeQuickFilter.value) {
    case "stagnant": return products.value.filter((p) => Number(p.lastSale.replace(/[^\d.]/g, "")) <= 8);
    case "expiringSoon": return products.value.filter((p) => p.statusKey === "productStatusExpiringSoon");
    case "lowStock": return products.value.filter((p) => p.statusKey === "productStatusLowStock");
    default: return products.value;
  }
});

const displayedProducts = computed(() => filteredProducts.value);

const quickFilterCards = computed(() => [
  { key: "all" as const, label: t("totalProducts"), value: inventorySummary.value.totalProducts, helper: language.value === "ar" ? "جميع المنتجات" : "All inventory products" },
  { key: "stagnant" as const, label: t("stagnantProducts"), value: inventorySummary.value.stagnantProducts, helper: language.value === "ar" ? "بدون مبيعات" : "No sales recently" },
  { key: "expiringSoon" as const, label: t("expiringsSoon"), value: inventorySummary.value.expiringSoonProducts, helper: language.value === "ar" ? "ستنتهي قريباً" : "Expiring in 90 days" },
  { key: "lowStock" as const, label: t("lowStock"), value: inventorySummary.value.lowStockProducts, helper: language.value === "ar" ? "أقل من الحد" : "Below minimum" },
]);

const selectedRulesProduct = computed(() => {
  if (!rulesDialogProductId.value) return null;
  const p = products.value.find((x) => x.id === rulesDialogProductId.value);
  return p ? { name: p.name, code: p.code, issues: p.ruleIssues } : null;
});

const selectedAumetReferenceProduct = computed(() =>
  aumetReferenceDialogProductId.value
    ? products.value.find((p) => p.id === aumetReferenceDialogProductId.value) ?? null
    : null
);

const selectedAumetReferenceProductForDialog = computed(() => {
  const p = selectedAumetReferenceProduct.value;
  if (!p) return null;
  return {
    id: p.id,
    code: p.code,
    name: p.name,
    barcode: p.barcode,
    aumetReferenceStatus: p.aumetReferenceStatus as "linked" | "notLinked",
  };
});

const onboardingSteps = computed(() => [
  { icon: Upload, title: t("inventoryOnboardingFlowStepOne"), description: t("inventoryOnboardingFlowStepTwo") },
  { icon: Sparkles, title: t("inventoryOnboardingFlowStepThree"), description: t("inventoryOnboardingFlowStepFour") },
  { icon: CheckCircle2, title: language.value === "ar" ? "مراقبة مباشرة" : "Live Monitoring", description: language.value === "ar" ? "متابعة لحظية" : "Real-time tracking" },
]);

const benefits = computed(() => [
  t("inventoryOnboardingBenefitOne"),
  t("inventoryOnboardingBenefitTwo"),
  t("inventoryOnboardingBenefitThree"),
  t("inventoryOnboardingBenefitFour"),
]);

function toggleExpanded(id: string) {
  const i = expandedProductIds.value.indexOf(id);
  if (i === -1) expandedProductIds.value.push(id);
  else expandedProductIds.value.splice(i, 1);
}
function handleQuickFilterChange(next: QuickFilter) {
  if (isTableLoading.value || next === activeQuickFilter.value) return;
  pendingQuickFilter.value = next;
}
watch(pendingQuickFilter, (p) => {
  if (!p || p === activeQuickFilter.value) return;
  isTableLoading.value = true;
  setTimeout(() => {
    activeQuickFilter.value = p;
    expandedProductIds.value = [];
    isTableLoading.value = false;
    pendingQuickFilter.value = null;
  }, 800);
});

type ProductView = (typeof products.value)[number];

function productTarget(p: ProductView): InventoryBatchActionTarget {
  return { type: "product", productId: p.id, productCode: p.code, productName: p.name, batches: p.batches };
}
function batchTarget(p: ProductView, b: InventoryBatch): InventoryBatchActionTarget {
  return { type: "batch", productId: p.id, productCode: p.code, productName: p.name, batch: b, batches: p.batches };
}
function openBatchActionDialog(mode: InventoryBatchActionDialogMode, target: InventoryBatchActionTarget) {
  batchActionMode.value = mode;
  batchActionTarget.value = target;
  batchActionDialogOpen.value = true;
}
function handleSaveAumetReference(ref: AumetCoreProduct | null) {
  if (!aumetReferenceDialogProductId.value) return;
  aumetReferenceByProductId.value = {
    ...aumetReferenceByProductId.value,
    [aumetReferenceDialogProductId.value]: ref?.id ?? null,
  };
}
function handleImportSuccess() {
  hasImportedInventory.value = true;
}
function openAddProductMode() { quickActionsOpen.value = false; addProductModeOpen.value = true; }
function openImportDialog() { quickActionsOpen.value = false; importDialogOpen.value = true; }
function goUpdateStock() { quickActionsOpen.value = false; router.push({ name: "update-stock" }); }
function goManualUpdate() { quickActionsOpen.value = false; router.push({ name: "manual-update-stock" }); }
function goManualOnboarding() { router.push({ name: "manual-update-stock", query: { entry: "onboarding" } }); }

function handleAddProductSource(source: ProductSourceOption) {
  addProductModeOpen.value = false;
  if (source === "core" || source === "custom") {
    createProductOpen.value = true;
  } else {
    router.push({ name: "manual-update-stock", query: { entry: "createManyProducts" } });
  }
}
</script>
