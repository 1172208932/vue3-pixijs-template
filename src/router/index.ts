import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "homepage",
    component: () => import("../views/homepage/index.vue"),
  },
  {
    path: "/game",
    name: "game",
    component: () => import("../views/game/index.vue"),
  },
  {
    path: "/readPage",
    name: "readPage",
    component: () => import("../views/readPage/index.vue"),
  },
  {
    path: "/detailPage",
    name: "detailPage",
    component: () => import("../views/detailPage/index.vue"),
  }
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
