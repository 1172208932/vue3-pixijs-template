<template>
  <van-popup v-model:show="showPopup" position="bottom" title="标题">
    <div class="taskBg">
      <div class="taskList">
        <p class="title">分享活动</p>
        <p class="text">每日三次，游戏次数+1</p>
        <span class="taskBtn"></span>
      </div>
    </div>
  </van-popup>
</template>
  
<script setup lang="ts">
import { ref, defineComponent, onMounted, watch } from "vue";
import EventBus from "@/utils/eventbus";
const props = defineProps({
  show: Boolean,
});

let showPopup = ref<boolean>(false);

watch(props, (newProps) => {
  console.log(newProps,'--new')
  showPopup.value = newProps.show;
});


onMounted(() => {});
</script>
  
<style scoped>
.close {
  width: 53px;
  height: 53px;
  margin-top: 45px;
}
.taskBg {
  width: 750px;
  height: 973px;
  background: url("../assets/bankground.png") no-repeat top left / 100% 100%;
  position: relative;
}
.taskList {
  width: 677px;
  height: 116px;
  background: url("../assets/share.png") no-repeat top left / 100% 100%;
  position: absolute;
  top: 330px;
  left: 50%;
  transform: translateX(-50%);
}
.title {
  font-size: 29px;
  color: #396459;
  font-weight: bold;
  margin: 20px 0 9px 155px;
  text-align: start;
}
.text {
  text-align: start;
  margin-left: 155px;
  font-size: 25px;
  color: #396459;
  font-weight: normal;
}
.taskBtn {
  width: 226px;
  height: 84px;
  background: url("../assets/btn_1.png") no-repeat top left / 100% 100%;
  display: inline-block;
  position: absolute;
  right: 0;
  top: 60%;
  transform: translateY(-50%);
}
</style>
  