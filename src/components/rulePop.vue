<template>
  <van-popup v-model:show="showPopup">
    <div class="ruleBg">
      <span v-html="rule" class="innerText"></span>
    </div>
    <img src="../assets/close.png" class="close" @click="close" alt="" />
  </van-popup>
</template>
  
<script setup lang="ts">
import { ref, watch } from "vue";
import { rule } from "../components/static.js";
import EventBus from "@/utils/eventbus";
const props = defineProps({
  show: Boolean,
});

let showPopup = ref<boolean>(false);

watch(props, (newProps) => {
  showPopup.value = newProps.show;
});

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
.ruleBg {
  width: 614px;
  height: 884px;
  background: url("../assets/popup_rules.png") no-repeat top left / 100% 100%;
  position: relative;
}
.innerText {
  position: absolute;
  top: 280px;
  width: 80%;
  left: 50%;
  transform: translateX(-50%);
  font-size: 15px;
  line-height: 40px;
  height: 60%;
  overflow-y: scroll;
}
</style>
  