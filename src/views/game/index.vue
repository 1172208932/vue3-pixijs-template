<template>
  <div class="box">
    <audio ref="audio" preload="true" :src="mp3Path"></audio>
    <div class="bg">
      <!-- <div class="rand"></div> -->
      <canvas id="canvas1"></canvas>
      <canvas id="canvas2"></canvas>
      <div class="game-box" id="canvas" ref="canvasRef"></div>
    </div>
    <div class="time"><span>{{ timenum }}</span><span class="timenum2">s</span></div>
    <div class="glod"><span>{{ glodNum }}</span></div>
    <div class="guid1" v-if="showGuid1" @click="clickGuid1"></div>
    <div class="guid2" v-if="showGuid2" @click="clickGuid2">
      <img src="../../assets/guid2.png" alt="">
    </div>
    <div class="down-time" v-if="showDownTime">
      <div class="down-title">倒计时</div>
      <div class="down-num">{{ downTimeNum }}</div>
    </div>

  </div>
  <choose-pop v-model:show="showChoosePop" :startId="questionStartId" :chooesList=question @answer="answerFn"></choose-pop>
  <over-pop v-model:show="showOverPop" :isFirst="isFirst" :glodNum="glodNum" @resurgence="getQuestionList"></over-pop>
  <guid-pop v-model:show="showguidPop" @closeGuid="guid3Over"></guid-pop>
  <wrong-pop :showWrontTitle="showWrontTitle" v-model:show="showWrongPop" @closeGuid="guid3Over"></wrong-pop>
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
import { SOUND_TYPE, SOUND_LIST } from "./soundEnum";
import PixiEngine from "./systems/engine";
import ChoosePop from "@/components/ChoosePop.vue";
import OverPop from "@/components/overPop.vue";
import GuidPop from "@/components/guidPop.vue";

import WrongPop from "@/components/wrongPop.vue";
import RightPop from "@/components/rightPop.vue";


import { Downloader, Parser, Player } from 'svga-web'
import { completeGuide, getQuestion, gameSubmit,gameReborn } from "@/api/resource";
import EventBus from "@/utils/eventbus";
import { throttle } from "@/utils/throttle"
import { useStore } from "vuex";

let firstGlofNum: number = 0;

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
    const store = useStore();
    const { index } = store.state;

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
      console.log(index.healthInfo, '------ss',)
      if (index.healthInfo.guidStatus == 0) {
        showGuid1.value = true
      } else if (index.healthInfo.guidStatus == void 0){
        window.location.href =  window.location.href = "https://www.ysupup.com/china_life_hi_fun_playground/"
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
      store.commit("getHealthInfo");
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
    const resurgenceGame = async () => {
      const { index } = store.state;
      let res = await gameReborn(index.gameId)
      if(res.success){
        store.commit("getHealthInfo");
        store.commit("setGameId", res.data.startId);
        showOverPop.value = false
        timenum.value = 30
        isFirst.value = false
        guid3Over()
      }
    }

    let timer

    const begin = () => {
      playerTree.set({
        loop: true
      })
      playerTree.start()

      EventBus.fire("BEGIN_GAME");

      timer = setInterval(() => {
        timenum.value--;
        if (timenum.value == 0) {
          clearInterval(timer)
          // gameOver()
          EventBus.fire('GAME_OVER_WORLD')
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

    const initGameData = () => {
      glodNum.value = 0;
      timenum.value = 60;
    }

    const closePop = () => {
      showChoosePop.value = false
    }

    const showPopChoose = () => {
      showChoosePop.value = true
    }
    const svgaplayerweb = () => {
      const downloader = new Downloader()
      const parser = new Parser()
      playerTree = new Player('#canvas2');

      (async () => {
        const fileData = await downloader.get(`${isTextUrl}gameTree.svga`)
        const svgaData = await parser.do(fileData)

        playerTree.set({
          loop: 1,
          endFrame: 1
        })

        await playerTree.mount(svgaData)

        playerTree.start()

      })()
    }

    const gameOver = async () => {
      const { index } = store.state;
      if (isFirst.value) {
        let res = await gameSubmit(index.gameId, glodNum.value)
        if (res?.success) {
          firstGlofNum = glodNum.value
          showOverPop.value = true
        }
      } else {
        let res = await gameSubmit(index.gameId, glodNum.value - firstGlofNum)
        if (res?.success) {
          showOverPop.value = true
        }
      }

      playerTree.set({
        loop: 1,
        endFrame: 1
      })
      playerTree.start()
      clearInterval(timer)
    }

    const svgaplayerweb1 = () => {
      const downloader = new Downloader()
      const parser = new Parser()
      const player = new Player('#canvas1');

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
      let res = await getQuestion({ gameStartId: index.gameId })
      console.log(index, 'index', res)

      if (res) {
        // const { question } = res
        showOverPop.value = false;
        showChoosePop.value = true;
        state.question = res;
        state.questionStartId = res['startId']
      }
    }

    onMounted(async () => {

      svgaplayerweb()
      svgaplayerweb1()
      EventBus.on("GET_STARE", getScore);
      EventBus.on("GAME_OVER", gameOver);
      // // SOUND_LIST.forEach((elm,index) => {
      // //                   this.audio[index] = document.getElementById(`${'play'+index}`)
      // //                   this.audioUrlArr.push(elm)
      // //                });

      EventBus.on("CLOSEPOP", closePop);
      let PixiEngineObj = new PixiEngine(750, 1400);
      const canvasInfo = PixiEngineObj.getCanvas();
      document.querySelector("#canvas")!.appendChild(canvasInfo);
      init()


    });



    return {
      ...toRefs(state),
      showBg,
      SOUND_LIST,
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
      isFirst
    };
  },
});
</script>

<style lang="scss" >
@import "./style/common.scss";
</style>
