<template>
  <van-popup v-model:show="showPopup">
    <div class="chooseBg">
      <div class="chooseInner">
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
    </div>
    <img src="../assets/close.png" class="close" @click="close" alt="" />
  </van-popup>
</template>
  
<script setup lang="ts">
import { ref, watch } from "vue";
import { chooseSubmit } from "@/api/resource";
import { showSuccessToast } from "vant";
import EventBus from "@/utils/eventbus";
import { useRouter } from "vue-router";
import { throttle } from "@/utils/throttle";


const router = useRouter();

const emit = defineEmits(["answer"]);
const props = defineProps({
  show: Boolean,
  chooesList: Object,
  startId: Number,
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

const judge = throttle(async (index: number) => {
  tab.value = index;
  let res = await chooseSubmit({
    startId: props.startId,
    choose: index + 1,
  });
  if (res) {
    EventBus.fire("CLOSEPOP");
    if (res["correct"]) {
      right.value = index + 1;
      // 回答正确
      setTimeout(() => {
        emit("answer", [], true);
      }, 500);
    } else {
      // 回答错误
      wrong.value = index + 1;
      right.value = res["rightOpion"];
      let item = state.questionList.filter((i, key, arr) => {
        return key + 1 === res["rightOption"];
      });
      setTimeout(() => {
        emit("answer", item[0], false);
      }, 500);
    }
  }
},3000) ;

function close() {
  EventBus.fire("CLOSEPOP");
  router.replace({
    name: "homepage",
    query: {
      form: "game",
    },
  });
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
  display: flex;
  align-items: flex-end;
  justify-content: center;
  .title {
    font-size: 30px;
    font-weight: bold;
    width: 90%;
    // height: 360px;
    margin: 0px auto 15px auto;
  }
}
.chooseInner {
  height: 90%;
  display: flex;
  flex-direction: column;
  justify-content: center;
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
  // margin-bottom: 44px;
}
.chooseItems {
  // margin: 0 auto;
  // display: inline-block;
  align-items: center;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  min-height: 41%;
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
  right: 60px;
}
.right {
  background: #39ebc7 !important;
}
.wrong {
  background: #dc654e !important;
}
</style>
  