<template>
  <van-popup v-model:show="showPopup">
    <div class="chooseBg">
      <div class="chooseItems">
        <div
          v-for="(item, index) in props.chooesList"
          :key="index"
          :class="(judgeRight === '1' && tab === index) ? 'chooseItem right' : (judgeRight === '2' && tab === index) ? 'chooseItem wrong' : 'chooseItem'"
          @click="judge(index)"
        >
          <p>{{ item }}</p>
          <img v-if="judgeRight === '1' && tab === index" src="../assets/yes.png" alt="" class="yes">
          <img v-if="judgeRight === '2' && tab === index" src="../assets/no.png" alt="" class="no">
        </div>
      </div>
    </div>
    <img src="../assets/close.png" class="close" @click="close" alt="" />
  </van-popup>
</template>
  
<script setup lang="ts">
import { ref, watch } from "vue";
import EventBus from "@/utils/eventbus";
const props = defineProps({
  show: Boolean,
  chooesList: Array,
});

let showPopup = ref<boolean>(false);
let judgeRight = ref<string>('0'); //1正确 2错误
let tab = ref<Number>(0);

watch(props, (newProps) => {
  showPopup.value = newProps.show;
});

function judge(index: Number){
  tab.value = index;
  judgeRight.value = '2'
}

function close() {
  EventBus.fire("CLOSEPOP");
}
</script>
  
<style scoped>
.van-popup {
  background: none !important;
}

.close {
  width: 53px;
  height: 53px;
  margin-top: 45px;
}

.chooseBg {
  width: 614px;
  height: 1023px;
  background: url("../assets/popup_frame.png") no-repeat top left / 100% 100%;
  position: relative;
}
.chooseItem {
  width: 493px;
  height: 81px;
  background: #aeefdb;
  border-radius: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 44px;
}
.chooseItems{
  position: absolute;
  top: 380px;
  left: 50%;
  transform: translateX(-50%);
}
.yes{
  width: 53px;
  height: 37px;
  position: absolute;
  right: 30px;
}

.no{
  width: 40px;
  height: 40px;
  position: absolute;
  right: 30px;
}
.right{
  background: #39ebc7 !important;
}
.wrong{
  background: #dc654e !important;
}
</style>
  