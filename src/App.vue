<template>
  <el-config-provider>
    <router-view #="{ Component, route }">
      <component :is="Component" :key="route.path" />
    </router-view>
  </el-config-provider>
</template>

<style>
#app {
  font-family: "Inter", "PingFang SC", system-ui, -apple-system, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #0f172a;
}

body {
  background: linear-gradient(180deg, #f8fafc 0%, #e9edf5 40%, #f8fafc 100%);
  margin: 0;
}

* {
  box-sizing: border-box;
}
</style>
