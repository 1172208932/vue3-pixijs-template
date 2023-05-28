<template>
  <van-popup v-model:show="showPopup" position="bottom">
    <div class="taskBg">
      <div class="taskList">
        <p class="title">分享活动</p>
        <p class="text">每日三次，游戏次数+1</p>
        <span class="taskBtn" @click="share"></span>
      </div>
    </div>
    <img src="../assets/close.png" class="close" @click="close" alt="" />
  </van-popup>
</template>
  
<script setup lang="ts">

import { showShareGuide } from '@/utils/show-share-guide/index';
import { completeTask } from "@/api/resource";

import { ref, onMounted, watch } from "vue";
import EventBus from "@/utils/eventbus";
const props = defineProps({
  show: Boolean,
});
const emit = defineEmits(['getHealthInfo'])

let showPopup = ref<boolean>(false);


function close() {
  EventBus.fire("CLOSEPOP");
}

const share = async () => {
  EventBus.fire("CLOSEPOP");
  showShareGuide('点击...分享哦', 0.7, 0, async () => {
    let res = await completeTask()
    if (res['success']) {
      emit('getHealthInfo')
    }
  })
}

watch(props, (newProps: any) => {
  showPopup.value = newProps.show;
});

onMounted(() => { });
</script>
  
<style scoped>
.close {
  width: 53px;
  height: 53px;
  margin-top: 45px;
  position: absolute;
  top: 60px;
  right: 11px;
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
}</style>
  