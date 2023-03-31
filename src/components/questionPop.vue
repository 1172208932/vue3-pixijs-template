<template>
  <div class="gray">
    <div class="popModule">
      <div class="title">
        <p>AUTO PLAY</p>
        <img src="../assets/close.png" alt="" @click="close()"/>
      </div>
      <div class="radios">
        <p>Number of rounds</p>
        <n-radio-group v-model:value="value" name="radiogroup">
          <n-space>
            <div v-for="song in songs" :key="song.value" class="onePart">
              <n-radio :value="song.value" size="small">
                {{ song.label }}
              </n-radio>
            </div>
          </n-space>
        </n-radio-group>
      </div>
      <number-pop type="1"></number-pop>
      <number-pop type="2"></number-pop>
      <div class="more" @click="showbottom()">More options</div>
      <div v-if="visible">
        <number-pop type="3"></number-pop>
        <div class="bottomBoxs radios">
          <p>If I lost</p>
          <div class="lTitle">Return to initial bet</div>
          <div style="display: flex">
            <percentage-pop type="1"></percentage-pop>
            <percentage-pop type="2"></percentage-pop>
          </div>
        </div>
        <div class="bottomBoxs radios">
          <p>If I win</p>
          <div class="lTitle">Return to initial bet</div>
          <div style="display: flex">
            <percentage-pop type="1"></percentage-pop>
            <percentage-pop type="2"></percentage-pop>
          </div>
        </div>
      </div>
      <div class="autoBtn">
        <n-button color="#8a2be2" class="begin-btn long">START AUTO</n-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, defineComponent } from "vue";
import EventBus from "@/utils/eventbus";
import NumberPop from "./NumberPop.vue";
import PercentagePop from "./PercentagePop.vue";
const value = ref(null);
const visible = ref(false)
const songs = [
  {
    value: "3",
    label: "3",
  },
  {
    value: "10",
    label: "10",
  },
  {
    value: "25",
    label: "25",
  },
  {
    value: "100",
    label: "100",
  },
  {
    value: "200",
    label: "200",
  },
  {
    value: "500",
    label: "500",
  },
];

function showbottom(){
  visible.value = true
}

function close(){
  EventBus.fire("CLOSEPOP")  
}
</script>

<style scoped>
.gray {
  position: fixed;
  top: 0;
  left: 0;
  width: 740px;
}
a {
  color: #42b983;
}

label {
  margin: 0 0.5em;
  font-weight: bold;
}

code {
  background-color: #eee;
  padding: 2px 4px;
  border-radius: 4px;
  color: #304455;
}
</style>
