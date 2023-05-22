<template>
  <van-popup v-model:show="props.show" title="标题">
    <div class="ruleBg">

    </div>
    <img src="../assets/close.png" class="close" @click="close" alt="">
  </van-popup>
</template>
  
<script setup lang="ts">
import { ref, defineComponent } from "vue";
import EventBus from "@/utils/eventbus";
const props = defineProps({
  show: Boolean,
});
console.log(props.show,'-----s')

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
    height: 884px;
    background: url('../assets/popup_rules.png') no-repeat top left / 100% 100%;;
}
</style>
  