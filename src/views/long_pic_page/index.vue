<template>
  <div class="picBox">
    <img v-if="userImg" :src="userImg" class="pic" />
    <img src="../../assets/back.png" class="back" alt="" @click="back">
    <img  v-if="countdown>=0 && haveGift" src="../../assets/down_time_bg.png" class="down_time_bg" alt="" @click="back">
    <div class="blackNum left-top" v-if="countdown > 3 && haveGift"><span>{{countdown}}</span><span>s</span></div>
    <div class="redNum left-top" v-if="countdown <= 3 && countdown >=0 && haveGift"><span>{{countdown}}</span><span>s</span></div>
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

    let haveGift = ref<boolean>(false);
    let iscomp = false

    onMounted(async () => {
      const { info,status } = route.params
      console.log(route.params,status,'info')
      haveGift.value = Number(status) == 0;
      const { index } = store.state
      if( index.healthInfo?.guidStatus === void 0){
        // window.location.href = import.meta.env.VITE_APP_INDEX_URL
      }
      healInfoId.value = Number(info);
      userImg.value = index.img;
      if(haveGift.value){
        beginTimeDown()
      }
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
        healInfoId:healInfoId.value,
      });
      if (res) {
        readGlodNum.value = Number(res)
        iscomp = true
        // showReadPop.value = true
      }
    };

    const backPopCall = () =>{
      showBackPop.value = false;
      beginTimeDown()
    }

    const back = () => {
      if(countdown.value  > 0 && haveGift.value){
        clearInterval(timer)
        showBackPop.value = true
      }else{
        if(iscomp){
            router.replace({
            name: "detailPage",
            query:{
              glodNum:readGlodNum.value
            }
          });
        }else{
          router.replace({
            name: "detailPage"
          });
        }

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
      countdown,
      haveGift,
      backPopCall
    };
  },
});
</script>

<style lang="scss" scoped >
.picBox {
  width: 750px;
  // height: 100vh;
  position: relative;

  img {
    width: 100%;
    height: 100%;
  }

  .down_time_bg{
    width: calc(164px/2) ;
    height:  calc(199px/2);
    position: fixed;
    left:  10px;
    top: 200px;
  }

  .left-top{
    width: calc(164px/2) ;
    height:  calc(199px/2);
    position: fixed;
    left:  10px;
    top: 205px;
    text-align: center;
    font-size: 40px;
    font-weight: bold;
    line-height: calc(199px/2);
  }

  .blackNum{
    color: black;
  }
  .redNum{
    color: red;
  }

  .back {
    width: 127px;
    height: 60px;
    position: fixed;
    left: 0%;
    top: 6%;
  }
}
</style>
