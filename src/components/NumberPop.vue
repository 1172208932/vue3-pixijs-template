<template>
  <div class="switchs" style="margin: 15px auto 8px auto">
    <div style="display: flex; align-items: center; padding: 3px">
      <n-switch size="small" />
      <p>{{ title }}</p>
      <div class="boxNumber" id="boxNumber">
        <span class="sRound left" @click="subtract()">-</span>
        <span>{{ cash }}</span>
        <span class="sRound right" @click="add()">+</span>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import Vue, { ref, watch, onMounted } from "vue";
const props = defineProps({
  type: String,
});
const cash = ref<number>(0.0);
const title = ref<string>("");
const titleList = [
  "Stop if cash decreases by",
  " Stop if single win exceeds ",
  " Stop if cash increases by ",
];
function subtract() {
  if (cash.value > 0) {
    cash.value = cash.value - 1;
  }
}

function add() {
  cash.value = cash.value + 1;
}

if (props.type) {
  title.value = titleList[Number(props.type) - 1];
}
</script>