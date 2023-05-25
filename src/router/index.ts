import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/homepage",
    name: "homepage",
    component: () => import("../views/homepage/index.vue"),
  },
  {
    path: "/game",
    name: "game",
    component: () => import("../views/game/index.vue"),
  },
  {
    path: "/",
    name: "readPage",
    component: () => import("../views/readPage/index.vue"),
  },
  {
    path: "/detailPage",
    name: "detailPage",
    component: () => import("../views/detailPage/index.vue"),
  },
  {
    path: "/picPage",
    name: "picPage",
    component: () => import("../views/long_pic_page/index.vue"),
  }
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
