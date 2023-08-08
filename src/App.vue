<template>
  <!-- <el-config-provider> -->
  <router-view #="{ Component, route }">
    <!-- <transition :name="route.meta?.transition"> -->
    <component :is="Component" :key="route.path" />
    <!-- </transition> -->
  </router-view>
  <!-- </el-config-provider> -->
</template>

<script setup lang="ts">

import { Weixin, start, updateShare } from "./utils/share";
import { ref, onMounted, watch } from "vue";
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getPerformance } from "firebase/performance";

onMounted(async () => {

  const firebaseConfig = {
  apiKey: "AIzaSyCdqClrTzNZK4IbySqS58Qok884r_BV9yQ",
  authDomain: "drawh5.firebaseapp.com",
  projectId: "drawh5",
  storageBucket: "drawh5.appspot.com",
  messagingSenderId: "809039365807",
  appId: "1:809039365807:web:4241e1ec1586ecadff365a",
  measurementId: "G-K683S033GL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const perf = getPerformance(app);
  let res = await start([Weixin], () => { }, {
    openTagList: ['wx-open-launch-weapp']
  })

  setTimeout(() => {
    updateShare({
      url: "https://act-2.ysupup.com/act-gateway/act-user-biz/urlMapping/fed07d",
      title: "国寿养老嗨FUN乐园",
      content: "2023年“国寿616”客户节",
      thumbnail: 'https://ysupup.oss-cn-hangzhou.aliyuncs.com/%E5%9B%BD%E5%AF%BF%E5%AE%A2%E6%88%B7%E8%8A%82/share_img.png'
    })
  })

});
</script>


<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

* {
  padding: 0;
  margin: 0;
}

body {
  background: #eae6df;
}

.fade-enter-active {
  transition: opacity 0.5s ease;
}

.fade-leave-active {
  transition: none;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.van-popup {
  background: none !important;
}</style>
