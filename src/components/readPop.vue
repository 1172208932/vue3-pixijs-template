<template>
  <van-popup v-model:show="showPopup" :close-on-click-overlay="false">
    <div class="overBg">
      <div class="read-title">获得健康币X{{ readGlodNum || 20 }}</div>

      <div class="back-btn" @click="close">开心收下</div>
    </div>
    <img src="../assets/close.png" class="close" @click="close" alt="" />

  </van-popup>
</template>
  
<script setup lang="ts">
import { ref, watch } from "vue";
import { useRouter } from "vue-router";
const router = useRouter();

const props = defineProps({
  show: Boolean,
  readGlodNum: Number
});

let showPopup = ref<boolean>(false);

watch(props, (newProps) => {
  showPopup.value = newProps.show;
});

function close() {
  showPopup.value = false
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

.right_btn {
  width: 220px;
  height: 72px;
  position: absolute;
  top: 700px;
  left: 330px;
}

.glod_icon {
  width: 33px;
  height: 33px;
  position: absolute;
  top: 580px;
  left: 260px;
}

.title {
  width: 100%;
  text-align: center;
  position: absolute;
  top: 500px;
  font-size: 28px;
  font-weight: 700;
  color: #148c85;
}

.glod_num {
  width: 200px;
  text-align: left;
  position: absolute;
  top: 565px;
  left: 305px;
  font-size: 48px;
  font-weight: 700;
  color: #148c85;
}

.left_btn {
  width: 220px;
  height: 72px;
  position: absolute;
  top: 700px;
  left: 60px;
}


.back-btn {
  width: 280px;
  height: 92px;
  top: 750px;
  background: url("../assets/btn.png") no-repeat top left / 100% 100%;
  position: absolute;
  color: #ffffff;
  font-size: 40px;
  transform: translateX(-50%);
  left: 50%;
  text-align: center;
  font-weight: bold;
  line-height: 92px;
}

.overBg {
  width: 614px;
  height: 946px;
  background: url("../assets/read_over.png") no-repeat top left / 100% 100%;
  position: relative;
}


.begin-t2 {
  width: 100%;
  height: 92px;
  top: 320px;
  position: absolute;
  color: #36604b;
  font-size: 50px;
  transform: translateX(-50%);
  left: 50%;
  text-align: center;
  font-weight: 800;
  line-height: 92px;
}

.begin-t1 {
  width: 100%;
  height: 92px;
  top: 230px;
  position: absolute;
  color: #36604b;
  font-size: 50px;
  transform: translateX(-50%);
  left: 50%;
  text-align: center;
  font-weight: 800;
  line-height: 92px;
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

.read-title {
  width: 100%;
  text-align: center;
  position: absolute;
  top: 655px;
  left: 50%;
  transform: translateX(-50%);

  font-size: 29px;
  font-weight: 700;
  color: #148c85;
}
</style>
  