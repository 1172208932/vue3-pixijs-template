<template>
  <div class="picBox">
    <img v-if="userImg" :src="userImg" class="pic" />
    <img src="../../assets/back.png" class="back" alt="" @click="back">
    <back-pop v-model:show="showBackPop" @closePop="backPopCall"></back-pop>
    <read-pop :readGlodNum="readGlodNum" v-model:show="showReadPop"></read-pop>

  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  reactive,
  toRefs,
  onMounted,
  SetupContext,
  ref,
} from "vue";
import { readList } from "../../components/static";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";
import { healthInfoComplete } from "../../api/resource";
import { showSuccessToast } from "vant";
import BackPop from "@/components/backPop.vue";
import ReadPop from "@/components/readPop.vue"
export default defineComponent({
  name: "picPage",
  components: { ReadPop, BackPop },
  setup(props, { emit }: SetupContext) {
    const store = useStore();
    const router = useRouter();
    const route = useRoute();
    let timer: any;
    let countdown = ref<number>(10);
    let userImg = ref<any>("");
    let healInfoId = ref<number>(0)
    const state: {} = reactive({});

    let showBackPop = ref<boolean>(false);
    let showReadPop = ref<boolean>(false);
    let readGlodNum = ref<number>(0)

    onMounted(async () => {
      const { info } = route.params
      const { index } = store.state
      healInfoId.value = Number(info);
      userImg.value = index.img;
      beginTimeDown()
    });

    /* 开始倒计时 */
    const beginTimeDown = () => {
      timer = setInterval(() => {
        if (countdown.value <= 0) {
          clearInterval(timer);
          timer = "";
          complete();
        }
        countdown.value--;
      }, 1000);
    }

    const complete = async () => {
      let res = await healthInfoComplete({
        healInfoId,
      });
      if (res) {
        readGlodNum.value = Number(res)
        showReadPop.value = true
      }
    };

    const backPopCall = () =>{
      showBackPop.value = false;
      beginTimeDown()
    }

    const back = () => {
      if(countdown.value  > 0){
        clearInterval(timer)
        showBackPop.value = true
      }else{
        router.back();
      }
    }

    return {
      ...toRefs(state),
      back,
      readGlodNum,
      showReadPop,
      userImg,
      healInfoId,
      readList,
      showBackPop,
      backPopCall
    };
  },
});
</script>

<style lang="scss">
.picBox {
  width: 750px;
  height: 100vh;
  position: relative;

  img {
    width: 100%;
    height: 100%;
  }

  .back {
    width: 127px;
    height: 60px;
    position: absolute;
    left: 0%;
    top: 6%;
  }
}
</style>
