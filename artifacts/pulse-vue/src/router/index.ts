import { createRouter, createWebHistory } from "vue-router";
import InventorySetup from "../views/InventorySetup.vue";
import GoLive from "../views/GoLive.vue";
import AddProductManually from "../views/AddProductManually.vue";

const basePath = import.meta.env.BASE_URL;

const router = createRouter({
  history: createWebHistory(basePath),
  routes: [
    {
      path: "/",
      name: "inventory-setup",
      component: InventorySetup,
    },
    {
      path: "/go-live",
      name: "go-live",
      component: GoLive,
    },
    {
      path: "/add-product",
      name: "add-product",
      component: AddProductManually,
    },
  ],
});

export default router;
