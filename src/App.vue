<template>
  <el-config-provider>
    <router-view #="{ Component, route }">
      <!-- <transition :name="route.meta?.transition"> -->
        <component :is="Component" :key="route.path" />
      <!-- </transition> -->
    </router-view>
  </el-config-provider>
</template>


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
</style>
