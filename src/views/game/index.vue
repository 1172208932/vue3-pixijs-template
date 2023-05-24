<template>
  <div class="box">
    <div class="bg">
      <!-- <div class="rand"></div> -->
      <canvas id="canvas1"></canvas>
      <canvas id="canvas2"></canvas>
      <div class="game-box" id="canvas" ref="canvasRef"></div>
    </div>
    <div class="time"></div>
    <div class="glod"></div>
    <div class="guid1" v-if="showGuid1" @click="clickGuid1"></div>
    <div class="guid2" v-if="showGuid2" @click="clickGuid2">
      <img src="../../assets/guid2.png" alt="" />
    </div>
  </div>
  <choose-pop v-model:show="showChoosePop" :chooesList="chooesList"></choose-pop>
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
import { Downloader, Parser, Player } from "svga-web";

import EventBus from "@/utils/eventbus";
import { throttle } from "@/utils/throttle";
let isFirst = true;
export default defineComponent({
  name: "gameIndex",
  components: {
    ChoosePop,
  },
  setup(props, { emit }: SetupContext) {
    let mines = ref<number>(1);
    let usd = ref<number>(1);
    let audio = ref<any>(null);
    let showGuid1 = ref<boolean>(true);
    let showGuid2 = ref<boolean>(false);

    let showPop = ref<boolean>(false);
    let showChoosePop = ref<boolean>(false);
    let svgaPath = ref("../../assets/gameTree.svga");

    let gameStart = ref<boolean>(false);
    let overlap = ref(false);
    let autoSwitch = ref(false);
    let canSetAuto = ref(false);

    const state: {
      audioUrl: string;
      percentage: number;
      isDisabled: boolean;
      isBegin: boolean;
      money: number;
      chooesList: any;
    } = reactive({
      chooesList: ['选项1','选项2','选项3','选项4'],
      worksList: [],
      audioUrl: SOUND_TYPE.BEGIN,
      percentage: 0,
      isDisabled: false,
      isBegin: false,
      money: 0,
    });

    const clickGuid1 = () => {
      showGuid1.value = false;
      showGuid2.value = true;
    };
    const clickGuid2 = () => {
      showGuid2.value = false;
    };

    const begin = () => {
      if (isFirst) {
        state.isDisabled = true;
        setTimeout(() => {
          state.isDisabled = false;
          isFirst = false;
          state.isBegin = true;
          audio.value.play();
          EventBus.fire("BEGIN_GAME");
        }, 600);
      } else {
        state.isDisabled = true;
        setTimeout(() => {
          state.isDisabled = false;
          isFirst = false;
          state.isBegin = true;
          audio.value.play();
          EventBus.fire("AGAIN_GAME");
        }, 600);
      }
    };

    const getScore = () => {
      gameStart.value = true;
      state.money = Number((state.money + usd.value).toFixed(2));
      usd.value = Number((usd.value + 0.2).toFixed(2));
      state.percentage = (state.money / 22) * 100;
    };

    const playSound = (res) => {
      switch (res.detail) {
        case "win":
          state.audioUrl = SOUND_TYPE.WIN;
          nextTick(() => {
            audio.value.play();
          });
          break;
        case "bomb":
          state.audioUrl = SOUND_TYPE.BOMB;
          nextTick(() => {
            audio.value.play();
            state.isBegin = false;
            state.money = 0;
            state.percentage = 0;
            usd.value = 1;
          });
          break;
        case "mines3":
          state.audioUrl = SOUND_TYPE.MINES3;
          nextTick(() => {
            audio.value.play();
          });
          break;
        case "switch":
          state.audioUrl = SOUND_TYPE.SWITCH;
          nextTick(() => {
            audio.value.play();
          });
          break;
      }
    };

    const setAutoConfig = () => {
      canSetAuto.value = true;
    };

    const closePop = () => {
      showChoosePop.value = false;
    };

    const showPopChoose = () => {
      showChoosePop.value = true;
    };
    const svgaplayerweb = () => {
      const downloader = new Downloader();
      const parser = new Parser();
      const player = new Player("#canvas2");
      (async () => {
        const fileData = await downloader.get(
          "../../../src/assets/gameTree.svga"
        );
        const svgaData = await parser.do(fileData);

        player.set({
          loop: 1,
          endFrame: 1,
        });

        await player.mount(svgaData);

        player.start();

        // setTimeout(()=>{
        //   player.set({
        //   loop: 0,
        //   endFrame:0
        // })
        // player.start()
        // },2000)
        // player.pause()
        // player.stop()
        // player.clear()
      })();
    };

    const svgaplayerweb1 = () => {
      const downloader = new Downloader();
      const parser = new Parser();
      const player = new Player("#canvas1");
      (async () => {
        const fileData = await downloader.get(
          "../../../src/assets/game_yun.svga"
        );
        const svgaData = await parser.do(fileData);
        player.set({
          loop: 0,
        });
        await player.mount(svgaData);
        player.start();
      })();
    };

    onMounted(async () => {
      svgaplayerweb();
      svgaplayerweb1();

      // EventBus.on("PLAY_SOUND", playSound);
      // EventBus.on("GET_STARE", getScore);
      // EventBus.on("CAN_AUTO_SET", setAutoConfig);
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
      mines,
      showPop,
      showChoosePop,
      usd,
      overlap,
      autoSwitch,
      gameStart,
      svgaPath,
      showGuid1,
      showGuid2,
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
