<template>
  <van-popup v-model:show="showPopup">
    <div class="ruleBg"></div>
    <img src="../assets/close.png" class="close" @click="close" alt="">
  </van-popup>
</template>
  
<script setup lang="ts">
import { ref, watch } from "vue";
import EventBus from "@/utils/eventbus";
const props = defineProps({
  show: Boolean,
});

let showPopup = ref<boolean>(true);

watch(props, (newProps) => {
  showPopup.value = newProps.show;
});

function close() {
  EventBus.fire("CLOSEPOP");
}
</script>
  
<style scoped>
.van-popup{
    background: none !important;
}

.close{
    width: 53px;
    height: 53px;
    margin-top: 45px ;
}
.ruleBg{
    width: 614px;
    height: 1023px;
    background: url('../assets/choose.jpg') no-repeat top left / 100% 100%;
}
</style>
  