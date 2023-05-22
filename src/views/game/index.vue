<template>
  <div class="box">
    <div class="bg"></div>
    <div class="rand"></div>
    <div class="game-box" id="canvas" ref="canvasRef"></div>
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
import { SOUND_TYPE, SOUND_LIST } from "./soundEnum";
import  PixiEngine  from "./systems/engine";
import QuestionPop from "../../components/questionPop.vue";
import RulePop from "../../components/rulePop.vue";
import MinesJump from "../../components/minesJump.vue";


import EventBus from "@/utils/eventbus";
import { throttle } from "@/utils/throttle"
let isFirst = true;
export default defineComponent({
  name: "gameIndex",
  components: {
    QuestionPop,
    RulePop,
    MinesJump
  },
  setup(props, { emit }: SetupContext) {
    let mines = ref<number>(1);
    let usd = ref<number>(1);
    let audio = ref<any>(null);
    let showDown = ref<boolean>(false);
    let showMenus = ref<boolean>(false);

    let showPop = ref<boolean>(false);
    let showRulePop = ref<boolean>(false);


    let gameStart = ref<boolean>(false);
    let overlap = ref(false);
    let autoSwitch = ref(false)
    let canSetAuto = ref(false)
    const gradeList = Array.from(Array(20), (d, i) => i + 1);
    const gradeList2 = [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 1.2, 2, 4, 10, 20, 50, 100];

    const state: {
      audioUrl: string;
      percentage: number;
      isDisabled: boolean;
      isBegin: boolean;
      money: number;
    } = reactive({
      swperList2: [],
      worksList: [],
      audioUrl: SOUND_TYPE.BEGIN,
      percentage: 0,
      isDisabled: false,
      isBegin: false,
      money: 0,
    });

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

    const showDownList = () => {
      playSound({ detail: 'mines3' })
      showDown.value = !showDown.value;
    };

    const showMenusList = () => {
      showMenus.value = !showMenus.value;
    }

    /**
     * 切换
     */
    const chiceMines = (e: number) => {
      mines.value = e;
      usd.value = e;
      setTimeout(() => {
        showDown.value = false;
      }, 200);
    };
    /**
     * 自动切换
     */
    const switchChange = (value: boolean) => {
      if (state.isBegin) {
        return
      }
      playSound({ detail: 'switch' })

      if (value) {
        state.isDisabled = true;
        setTimeout(() => {
          audio.value.play();
          EventBus.fire('AUTO_SELECT')
        }, 600);
      } else {
        EventBus.fire('AUTO_SELECT_CLOSE')
        state.isDisabled = false
        canSetAuto.value = false
      }
    }

    const getScore = () => {
      gameStart.value = true;
      state.money = Number((state.money + usd.value).toFixed(2));
      usd.value = Number((usd.value + 0.2).toFixed(2));
      state.percentage = state.money / 22 * 100
    }

    const againGame = () => {
      if (canSetAuto.value) {
        showPop.value = true
      }
    };

    const overGame = () => {
      EventBus.fire('OVER_GAME')
      // 游戏结束后把auto的disable取消
      gameStart.value = false
      state.isBegin = false
      state.money = 0
      state.percentage = 0
      usd.value = 1
      state.isDisabled = true;
      setTimeout(() => {
        state.isDisabled = false;
      }, 600);
    }

    const random = throttle(() => {
      if (state.isBegin) {
        EventBus.fire("RANDOM");
      }
    }, 2000)

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
            state.isBegin = false
            state.money = 0
            state.percentage = 0
            usd.value = 1
          })
          break
        case 'mines3':
          state.audioUrl = SOUND_TYPE.MINES3;
          nextTick(() => {
            audio.value.play();
          });
          break
        case 'switch':
          state.audioUrl = SOUND_TYPE.SWITCH;
          nextTick(() => {
            audio.value.play();
          });
          break
      }
    };

    const setAutoConfig = () => {
      canSetAuto.value = true
    }

    const closePop = () => {
      showPop.value = false
      showRulePop.value = false
    }

    const showPopRule = () => {
      showRulePop.value = true
    }

    onMounted(async () => {
      // EventBus.on("PLAY_SOUND", playSound);
      // EventBus.on("GET_STARE", getScore);
      // EventBus.on("CAN_AUTO_SET", setAutoConfig);
      // EventBus.on("CLOSEPOP", closePop);
      // // SOUND_LIST.forEach((elm,index) => {
      // //                   this.audio[index] = document.getElementById(`${'play'+index}`)
      // //                   this.audioUrlArr.push(elm)
      // //                });

      let PixiEngineObj = new  PixiEngine(750, 1400);
      const canvasInfo = PixiEngineObj.getCanvas();
      document.querySelector("#canvas")!.appendChild(canvasInfo);
    });



    return {
      ...toRefs(state),
      SOUND_LIST,
      gradeList,
      gradeList2,
      showDown,
      audio,
      mines,
      showPop,
      showRulePop,
      usd,
      overlap,
      autoSwitch,
      gameStart,
      showMenus,
      showPopRule,
      switchChange,
      overGame,
      showDownList,
      chiceMines,
      begin,
      againGame,
      random,
      showMenusList,
    };
  },
});
</script>

<style lang="scss">
@import "./style/common.scss";
</style>
