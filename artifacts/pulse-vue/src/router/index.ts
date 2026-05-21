import { createRouter, createWebHistory } from "vue-router";

const basePath = import.meta.env.BASE_URL;

const router = createRouter({
  history: createWebHistory(basePath),
  routes: [
    {
      path: "/",
      name: "inventory",
      component: () => import("../views/InventoryPage.vue"),
    },
    {
      path: "/update-stock",
      name: "update-stock",
      component: () => import("../views/UpdateStockPage.vue"),
    },
    {
      path: "/manual-update-stock",
      name: "manual-update-stock",
      component: () => import("../views/ManualUpdateStockPage.vue"),
    },
    {
      path: "/add-product",
      redirect: "/manual-update-stock",
    },
    {
      path: "/go-live",
      redirect: "/",
    },
    {
      path: "/:pathMatch(.*)*",
      redirect: "/",
    },
  ],
});

export default router;
