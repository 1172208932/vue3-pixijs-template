<template>
  <div class="box">
    <audio ref="audio" preload="true" src="src/assets/glod.mp3"></audio>
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

  </div>
  <choose-pop v-model:show="showChoosePop"></choose-pop>
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
import { Downloader, Parser, Player } from 'svga-web'
import { completeGuide } from "@/api/resource";
import EventBus from "@/utils/eventbus";
import { throttle } from "@/utils/throttle"
let isFirst = true;
export default defineComponent({
  name: "gameIndex",
  components: {
    ChoosePop
  },
  setup(props, { emit }: SetupContext) {
    let timenum = ref<number>(60);
    let glodNum = ref<number>(0);
    let usd = ref<number>(1);
    let audio = ref<any>(null);
    let showGuid1 = ref<boolean>(true);
    let showGuid2 = ref<boolean>(false);

    let showPop = ref<boolean>(false);
    let showChoosePop = ref<boolean>(true);
    let svgaPath = ref('../../assets/gameTree.svga')

    let gameStart = ref<boolean>(false);
    let overlap = ref(false);
    let autoSwitch = ref(false)
    let canSetAuto = ref(false)

    
    
    let playerTree
    const state: {
      percentage: number;
      isDisabled: boolean;
      isBegin: boolean;
      money: number;
    } = reactive({
      swperList2: [],
      worksList: [],
      percentage: 0,
      isDisabled: false,
      isBegin: false,
      money: 0,
    });

    const clickGuid1 = () => {
      showGuid1.value = false
      showGuid2.value = true
    }
    const clickGuid2 = async () => {
      showGuid2.value = false;
      completeGuideApi()
      begin()
    }

    const completeGuideApi = ()=>{
      completeGuide()
    }

    let timer

    const begin = () => {
      playerTree.set({
        loop: true
      })
      playerTree.start()

      EventBus.fire("BEGIN_GAME");

      timer = setInterval(()=>{
        timenum.value --;
        if(timenum.value == 0){
          clearInterval(timer)
          gameOver()
        }
      },1000)
      // EventBus.fire("AGAIN_GAME");
    };

    const getScore = () => {
      audio.value.currentTime = 0; // 重新播放
      audio.value.play();
      glodNum.value ++
      // gameStart.value = true;
      // state.money = Number((state.money + usd.value).toFixed(2));
      // usd.value = Number((usd.value + 0.2).toFixed(2));
      // state.percentage = state.money / 22 * 100
    }

    const initGameData = ()=>{
      glodNum.value = 0;
      timenum.value = 60;
    }

    const setAutoConfig = () => {
      canSetAuto.value = true
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
        const fileData = await downloader.get('../../../src/assets/gameTree.svga')
        const svgaData = await parser.do(fileData)

        playerTree.set({
          loop: 1,
          endFrame: 1
        })

        await playerTree.mount(svgaData)

        playerTree.start()

      })()
    }

    const gameOver = () =>{
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
        const fileData = await downloader.get('../../../src/assets/game_yun.svga')
        const svgaData = await parser.do(fileData)
        player.set({
          loop: 0,
        })
        await player.mount(svgaData)
        player.start()
      })()
    }

    onMounted(async () => {
      svgaplayerweb()
      svgaplayerweb1()
      EventBus.on("GET_STARE", getScore);
      EventBus.on("GAME_OVER", gameOver);
      // EventBus.on("CLOSEPOP", closePop);
      // // SOUND_LIST.forEach((elm,index) => {
      // //                   this.audio[index] = document.getElementById(`${'play'+index}`)
      // //                   this.audioUrlArr.push(elm)
      // //                });
      EventBus.on("CLOSEPOP", closePop);
      let PixiEngineObj = new PixiEngine(750, 1400);
      const canvasInfo = PixiEngineObj.getCanvas();
      document.querySelector("#canvas")!.appendChild(canvasInfo);

    });



    return {
      ...toRefs(state),
      SOUND_LIST,
      audio,
      showPop,
      showChoosePop,
      usd,
      overlap,
      autoSwitch,
      gameStart,
      svgaPath,
      showGuid1,
      showGuid2,
      timenum,
      glodNum,
      clickGuid1,
      clickGuid2,
      showPopChoose,
      begin,
    };
  },
});
</script>

<style lang="scss">
@import "./style/common.scss";
</style>
