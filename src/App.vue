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
onMounted(async () => {
  let res = await start([Weixin], () => { }, {
    openTagList: ['wx-open-launch-weapp']
  })

  console.log(res, 'sharrrrrrrrrrrrrrr')

  setTimeout(() => {
    updateShare({
      url: "https://www.ysupup.com/act-gateway/act-user-biz/wechat/autoLogin?appId=2&appSecret=ea8b2408d8af4c36867752f84dd52ef6&scope=0&redirect=" + 'https%3A%2F%2Fwww.ysupup.com%2Fchina_life_hi_fun_playground%2F',
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
