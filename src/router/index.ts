import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "Minesweeper",
    component: () => import("../views/minesweeper/index.vue"),
    meta: {
      title: "移动端扫雷",
      keepAlive: true,
      transition: "fade",
    },
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
