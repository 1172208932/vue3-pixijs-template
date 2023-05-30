<template>
  <van-popup v-model:show="showPopup">
    <div class="chooseBg">
      <p class="title">{{ state.question?.title }}</p>
      <div class="chooseItems">
        <div
          v-for="(item, index) in state.questionList"
          :key="index"
          :class="
            right === index + 1 && tab === index
              ? 'chooseItem right'
              : wrong === index + 1 && tab === index
              ? 'chooseItem wrong'
              : 'chooseItem'
          "
          @click="judge(index)"
        >
          <p>{{ item }}</p>
          <img
            v-if="right === index + 1 && tab === index"
            src="../assets/yes.png"
            alt=""
            class="yes"
          />
          <img
            v-if="wrong === index + 1 && tab === index"
            src="../assets/no.png"
            alt=""
            class="no"
          />
        </div>
      </div>
    </div>
    <img src="../assets/close.png" class="close" @click="close" alt="" />
  </van-popup>
</template>
  
<script setup lang="ts">
import { ref, watch } from "vue";
import { chooseSubmit } from "@/api/resource";
import { showSuccessToast } from "vant";
import EventBus from "@/utils/eventbus";

const emit = defineEmits(['answer'])
const props = defineProps({
  show: Boolean,
  chooesList: Object,
  startId:Number
});
const state: {
  question: any;
  questionList: any;
} = reactive({
  question: {},
  questionList: [],
});

let showPopup = ref<boolean>(false);
let right = ref<number>(0); //1正确 2错误
let wrong = ref<number>(0); //1正确 2错误
let tab = ref<Number>(0);

watch(props, (newProps) => {
  showPopup.value = newProps.show;
  const { chooesList } = newProps;
  if (chooesList) {
    state.question = chooesList.question;
    state.questionList = chooesList.question.options?.split("||") || [];
  }
});

const judge = async ( index: number) => {
  tab.value = index;
  let res = await chooseSubmit({
    startId: props.startId,
    choose: index + 1,
  });
  console.log(res,'res------')
  if (res) {
    close();
    if (res['correct']) {
      right.value = index + 1;
      // 回答正确
      setTimeout(()=>{
        emit('answer',[],true)
      },500)
    } else {
      // 回答错误
      wrong.value = index + 1;
      console.log(res['rightOption'],typeof(res['rightOption']))
      right.value = res['rightOpion'];
      let item = state.questionList.filter((i, key, arr) => {
        return key + 1 === res['rightOption']
      })
      console.log(item,'item11')
      setTimeout(()=>{
        emit('answer', item[0],false)
      },500)
    }
  }
};

function close() {
  EventBus.fire("CLOSEPOP");
}
</script>
  
<style scoped lang="scss">
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
  .title {
    font-size: 30px;
    font-weight: bold;
    position: relative;
    top: 22%;
    width: 90%;
    height: 360px;
    margin: 0 auto;
    overflow: hidden;
    text-overflow: ellipsis;
    -webkit-line-clamp: 3;
    display: -webkit-box;
    -webkit-box-orient: vertical;
  }
}
.chooseItem {
  width: 493px;
  height: auto;
  padding: 20px;
  background: #aeefdb;
  border-radius: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 44px;
}
.chooseItems {
  position: absolute;
  top: 380px;
  left: 50%;
  transform: translateX(-50%);
}
.yes {
  width: 53px;
  height: 37px;
  position: absolute;
  right: 30px;
}

.no {
  width: 40px;
  height: 40px;
  position: absolute;
  right: 30px;
}
.right {
  background: #39ebc7 !important;
}
.wrong {
  background: #dc654e !important;
}
</style>
  