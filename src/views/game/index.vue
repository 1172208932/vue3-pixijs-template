<template>
  <div class="box">
    <audio ref="audio" preload="true" :src="mp3Path"></audio>
    <div class="bg">
      <!-- <div class="rand"></div> -->
      <div id="canvas2"></div>
      <div class="game-box" id="canvas" ref="canvasRef"></div>
    <!-- <div class="glod"><span>{{ glodNum }}</span></div> -->

    </div>
    <!-- <div class="time"><span>{{ timenum }}</span><span class="timenum2">s</span></div>
    <div class="guid1" v-if="showGuid1" @click="clickGuid1"></div>
    <div class="guid2" v-if="showGuid2" @click="clickGuid2">
      <img src="../../assets/guid2.png" alt="">
    </div>
    <div class="down-time" v-if="showDownTime">
      <div class="down-title">倒计时</div>
      <div class="down-num">{{ downTimeNum }}</div>
    </div> -->

  </div>
  <choose-pop v-model:show="showChoosePop" :startId="questionStartId" :chooesList=question @answer="answerFn"></choose-pop>
  <over-pop v-model:show="showOverPop" :isFirst="isFirst" :glodNum="glodNum" @resurgence="getQuestionList"></over-pop>
  <guid-pop v-model:show="showguidPop" @closeGuid="guid3Over"></guid-pop>
  <wrong-pop :showWrontTitle="showWrontTitle" v-model:show="showWrongPop" @showNext="showOverFn"></wrong-pop>
  <right-pop @resurgenceGame='resurgenceGame' v-model:show="showRightPop" @closeGuid="guid3Over"></right-pop>
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
import PixiEngine from "./systems/engine";
import ChoosePop from "@/components/ChoosePop.vue";
import OverPop from "@/components/overPop.vue";
import GuidPop from "@/components/guidPop.vue";

import WrongPop from "@/components/wrongPop.vue";
import RightPop from "@/components/rightPop.vue";
import treejson from './tree.json'


import { Downloader, Parser, Player } from 'svga-web'
// import { Downloader, Parser, Player } from 'svga.lite'
import { completeGuide, getQuestion, gameSubmit,gameReborn } from "@/api/resource";
import EventBus from "@/utils/eventbus";
import { throttle } from "@/utils/throttle"
import { useStore } from "vuex";
let firstGlofNum: number = 0;
import lottie from 'lottie-web';

export default defineComponent({
  name: "gameIndex",
  components: {
    ChoosePop,
    OverPop,
    GuidPop,
    RightPop,
    WrongPop
  },
  setup(props, { emit }: SetupContext) {
    let timenum = ref<number>(60);  // 游戏倒计时
    let downTimeNum = ref<number>(3); // 新手引导倒计时
    let glodNum = ref<number>(0);
    let usd = ref<number>(1);
    let audio = ref<any>(null);
    let showGuid1 = ref<boolean>(false);
    let showGuid2 = ref<boolean>(false);
    let showDownTime = ref<boolean>(false); // 倒计时
    let showBg = ref<boolean>(false); // 倒计时

    let showPop = ref<boolean>(false);
    let showChoosePop = ref<boolean>(false);
    let showOverPop = ref<boolean>(false);
    let showguidPop = ref<boolean>(false);
    let showWrongPop = ref<boolean>(false);
    let showWrontTitle = ref<string>('');
    let showRightPop = ref<boolean>(false);
    let isFirst = ref<boolean>(true);


    const isTextUrl = import.meta.env.VITE_RESOURCE_URL;
    let mp3Path = ref(`${isTextUrl}glod.mp3`)


    let playerTree
    let animation

    const store = useStore();

    const state: {
      percentage: number;
      isDisabled: boolean;
      isBegin: boolean;
      money: number;
      question: any,
      questionStartId: number
    } = reactive({
      question: [],
      worksList: [],
      percentage: 0,
      isDisabled: false,
      isBegin: false,
      money: 0,
      questionStartId:0
    });

    const init = () => {
      const { index } = store.state;
      if (index.healthInfo.guidStatus === 0) {
        showGuid1.value = true
      } else if (index.healthInfo.guidStatus === void 0){
        // window.location.href = import.meta.env.VITE_APP_INDEX_URL
      }else {
        guid3Over()
      }
    }
    

    const clickGuid1 = () => {
      showGuid1.value = false
      showGuid2.value = true
    }
    const clickGuid2 = async () => {
      showGuid2.value = false;
      showguidPop.value = true
    }

    const guid3Over = async () => {
      showguidPop.value = false
      showDownTime.value = true;
      store.dispatch("getHealthInfo");
      let timerGuid = setInterval(() => {
        if (downTimeNum.value == 1) {
          clearInterval(timerGuid)
          showDownTime.value = false
          downTimeNum.value = 3
          completeGuideApi()
          begin()
          return
        }
        downTimeNum.value--
      }, 1000)

    }

    const completeGuideApi = () => {
      completeGuide()
    }

    const answerFn = (item, isTrue) => {
      console.log(item, isTrue)
      showChoosePop.value = false
      if (isTrue) {
        showRightPop.value = true
      } else {
        showWrontTitle.value = item
        showWrongPop.value = true
      }
    }

    /**
     * 点击答题成功复活
     */
    const resurgenceGame = throttle(async () => {
      const { index } = store.state;
      let res = await gameReborn(index.gameInfo.startId)
      if(res.success){
        // store.commit("getHealthInfo");
        store.commit("setGameInfo", res.data);
        showOverPop.value = false;
        timenum.value = 30;
        isFirst.value = false;
        EventBus.fire("RESET_GAME");

        guid3Over()
      }
    },3000)

    let timer

    const begin = () => {
      animation.play();


      EventBus.fire("BEGIN_GAME");

      timer = setInterval(() => {
        timenum.value--;
        if (timenum.value == 0) {
          clearInterval(timer)
          // gameOver()
          EventBus.fire('GAME_OVER_WORLD')
        }

        if (timenum.value == 50) {
          EventBus.fire('SEEP_UP',{speed:1.2})
          EventBus.fire('SET_GLOD_SEEP',{speed:0.02})
        }
        if (timenum.value == 40) {
          EventBus.fire('SET_GLOD_SEEP',{speed:0.04})

        }
        if (timenum.value == 30) {
          EventBus.fire('SEEP_UP',{speed:1.4})
          EventBus.fire('SET_GLOD_SEEP',{speed:0.05})
        }
        if (timenum.value == 20) {
          EventBus.fire('SET_GLOD_SEEP',{speed:0.06})
        }

      }, 1000)
      // EventBus.fire("AGAIN_GAME");
    };

    const getScore = () => {
      audio.value.currentTime = 0; // 重新播放
      audio.value.play();
      glodNum.value++
      // state.money = Number((state.money + usd.value).toFixed(2));
      // usd.value = Number((usd.value + 0.2).toFixed(2));
      // state.percentage = state.money / 22 * 100
    }

    const closePop = () => {
      showChoosePop.value = false
    }

    const showPopChoose = () => {
      showChoosePop.value = true
    }
    const svgaplayerweb = () => {
      // console.log(document.getElementById('canvas2'),'document.getElementById(#canvas2)')
      // animation = lottie.loadAnimation({
      //   //@ts-ignore
      //     container: document.getElementById('canvas2'),
      //     renderer: 'svg',
      //     loop: true,
      //     autoplay: false,
      //     animationData: treejson,
      // });
      // lottie.loadAnimation({
      //   container: element, // the dom element that will contain the animation
      //   renderer: 'svg',
      //   loop: true,
      //   autoplay: true,
      //   path: 'data.json' // the path to the animation json
      // });

      // const downloader = new Downloader()
      // const parser = new Parser()
      // playerTree = new Player('##');

      // (async () => {
      //   const fileData = await downloader.get(`${isTextUrl}gameTree.svga`)
      //   const svgaData = await parser.do(fileData)

      //   playerTree.set({
      //     loop: 1,
      //     endFrame: 1
      //   })

      //   await playerTree.mount(svgaData)

      //   playerTree.start()

      // })()
    }

    const gameOver = throttle(async () => {
      const { index } = store.state;
      if(timenum.value == 0){
        isFirst.value = false
      }
      console.log(index.gameInfo.startId,'index.gameInfo.startId')
      if (isFirst.value) {
        let res = await gameSubmit(index.gameInfo.startId, glodNum.value)
        if (res?.success) {
          firstGlofNum = glodNum.value
          showOverPop.value = true
        }
      } else {
        console.log(index.gameInfo.startId,'index.gameInfo.startId')

        let res = await gameSubmit(index.gameInfo.startId, glodNum.value - firstGlofNum)
        if (res?.success) {
          showOverPop.value = true
        }
      }

      animation.stop()
      // playerTree.set({
      //   loop: 1,
      //   endFrame: 1
      // })
      // playerTree.start()
      clearInterval(timer)
    },3000) 

    const svgaplayerweb1 = () => {
      const downloader = new Downloader()
      const parser = new Parser()

      (async () => {
        const fileData = await downloader.get(`${isTextUrl}game_yun.svga`)
        const svgaData = await parser.do(fileData)
        player.set({
          loop: 0,
        })
        await player.mount(svgaData)
        player.start()
      })()
    }

    /**
     * 获取题目
     */
    const getQuestionList = async () => {
      const { index } = store.state
      let res = await getQuestion({ gameStartId: index.gameInfo.startId })
      console.log(index, 'index', res)

      if (res) {
        // const { question } = res
        showOverPop.value = false;
        showChoosePop.value = true;
        state.question = res;
        state.questionStartId = res['startId']
      }
    }

    const showOverFn=()=>{
      isFirst.value =false
      showOverPop.value = true
    }

    onMounted(async () => {

      svgaplayerweb()
      // svgaplayerweb1()
      EventBus.on("GET_STARE", getScore);
      EventBus.on("GAME_OVER", gameOver);


      EventBus.on("CLOSEPOP", closePop);
      let PixiEngineObj = new PixiEngine(750, 1400);
      const canvasInfo = PixiEngineObj.getCanvas();
      document.querySelector("#canvas")!.appendChild(canvasInfo);
      init()


    });



    return {
      ...toRefs(state),
      showBg,
      audio,
      showPop,
      showOverPop,
      showguidPop,
      showRightPop,
      showWrongPop,
      showDownTime,
      showChoosePop,
      usd,
      mp3Path,
      showGuid1,
      showGuid2,
      timenum,
      glodNum,
      downTimeNum,
      showWrontTitle,
      clickGuid1,
      clickGuid2,
      showPopChoose,
      begin,
      resurgenceGame,
      getQuestionList,
      guid3Over,
      answerFn,
      showOverFn,
      isFirst
    };
  },
});
</script>

<style lang="scss" >
@import "./style/common.scss";
</style>
