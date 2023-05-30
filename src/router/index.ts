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
    path: "/picPage/:info/:status",
    name: "picPage",
    component: () => import("../views/long_pic_page/index.vue"),
  }
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

// router.beforeEach((to, from, next) => {
//   console.log('跳转前的页面：', from);
//   console.log('即将跳转到的页面：', to);

//   next();
//   if(from.fullPath == "/game" && to.fullPath == '/homepage'){
//     location.reload()
//   }
// });

export default router;
