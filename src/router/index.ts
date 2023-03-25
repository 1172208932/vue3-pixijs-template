import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/home",
    name: "Home",
    component: () => import("../views/index/index.vue"),
    meta:{
      title: '首页',
      keepAlive: true,
      transition:'fade'
    }
  },
  {
    path: "/",
    name: "Loading",
    component: () => import("../views/loading/loading.vue"),
  },
  {
    path: "/game",
    name: "Game",
    component: () => import("../views/game/index.vue"),
  }
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
