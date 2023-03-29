<template>
  <div class="box">
    <audio ref="audio" :src="audioUrl"></audio>
    <div class="top">
      <!-- 等级 -->
      <button class="btn-game" @click="() => showDownList()">
        <span class="centered-xy"> Mines: {{ mines }} </span>
        <img src="../../assets/shapeDown.png" />
      </button>
      <!-- 钱 -->
      <button class="money btn-game">
        <span class="centered-xy"> Next: {{ usd }} USD </span>
      </button>
    </div>
    <n-progress type="line" :color="'#28a745'" :rail-color="'#105181'" class="line" :percentage="percentage"
      :show-indicator="false" />

    <!-- 下拉菜单 -->
    <ul v-if="showDown" class="shadow dropdown-list-number dropdown-menu show">
      <li v-for="(item, index) in gradeList" :key="index" @click="chiceMines(item)"
        :class="mines === item ? 'clickTab' : ''">
        {{ item }}
      </li>
    </ul>
    <!-- </div> -->
    <div class="boox">
      <div class="game-box" id="canvas" ref="canvasRef"></div>
    </div>
    <div style="position: absolute;bottom: 5px;width: 100%;">
      <div class="bottomBtns">
        <div class="RANDOM" @click="random">RANDOM</div>
        <div class="Auto RANDOM">
          <img src="@/assets/reflush.png" />
          <n-space>
            <n-switch v-model:value="autoSwitch" :disabled="isBegin" @update:value="switchChange" size="small" />
          </n-space>
          <div class="auto">Auto Game</div>
        </div>
      </div>

      <div class="control-box">
        <div class="control-center">
          <n-button circle quaternary class="again-btn" @click="againGame">
            <template #icon>
              <n-icon size="30">
                <svg t="1679646099327" class="icon" viewBox="0 0 1024 1024" version="1.1"
                  xmlns="http://www.w3.org/2000/svg" p-id="2778" width="200" height="200">
                  <path
                    d="M920.43 430.03c-3.41 0-6.37-2.41-7.02-5.76C875.96 233.02 707.49 88.69 505.26 88.69c-163.63 0-305.18 94.49-373.08 231.88-2.36 4.77 1.11 10.36 6.43 10.36h28.24c2.65 0 5.06-1.47 6.32-3.8 63.24-117.2 187.13-196.85 329.65-196.85 178.1 0 327.11 124.39 365 291.02 1.02 4.47-2.41 8.72-7 8.72h-90.31c-6.14 0-9.44 7.21-5.42 11.85L888.7 585c2.93 3.39 8.21 3.29 11.01-0.2l114.94-143.13c3.77-4.69 0.43-11.66-5.59-11.66l-88.63 0.02zM103.57 593.97c3.41 0 6.37 2.41 7.02 5.76 37.45 191.26 205.92 335.58 408.14 335.58 163.63 0 305.17-94.49 373.08-231.88 2.36-4.77-1.11-10.36-6.43-10.36h-28.24c-2.65 0-5.06 1.47-6.32 3.8-63.22 117.2-187.12 196.84-329.64 196.84-178.11 0-327.11-124.39-365-291.02-1.02-4.47 2.41-8.72 7-8.72h90.31c6.14 0 9.44-7.21 5.42-11.85l-123.6-143.13c-2.93-3.39-8.21-3.29-11.01 0.2L9.36 582.31c-3.77 4.69-0.43 11.66 5.59 11.66h88.62z"
                    p-id="2779" fill="#A6BED8"></path>
                  <path
                    d="M706.23 498.03l-309.8-178.86c-10.77-6.23-24.24 1.56-24.24 13.99v357.72c0 12.41 13.43 20.17 24.19 13.96l309.85-178.89c10.75-6.2 10.75-21.72 0-27.92z"
                    p-id="2780" fill="#A6BED8"></path>
                </svg>
              </n-icon>
            </template>
          </n-button>
          <n-button v-if="!isBegin" :disabled="isDisabled" color="#8a2be2" class="begin-btn" @click="begin">
            <template #icon>
              <n-icon class="begin-icon" size="20">
                <svg t="1679646979880" class="icon" viewBox="0 0 1024 1024" version="1.1"
                  xmlns="http://www.w3.org/2000/svg" p-id="16964" width="200" height="200">
                  <path
                    d="M840.675206 557.64355 241.136477 942.336072c-32.617885 21.080108-76.31613 11.7056-76.31613-19.303648L164.820348 101.404528c0-35.950793 40.73782-38.3484 76.31613-19.264762l599.539752 384.64545C865.346095 491.873614 865.346095 532.547988 840.675206 557.64355z"
                    fill="#ffffff" p-id="16965"></path>
                </svg>
              </n-icon>
            </template>
            BET
          </n-button>
          <n-button v-else :disabled="money == 0" color="#8a2be2" class="over-btn" @click="overGame">
            <template #default>
              <div class="over-btn-text">CASH OUT</div>
              <div class="over-btn-text2">{{ money }}USD</div>
            </template>
          </n-button>
        </div>
        <div class="control-centerUnder">
          <div style="color: #fff; display: grid">
            <span>Bet, USD</span>
            <input />
          </div>
          <div class="round roundSmall">-</div>
          <div class="round"><img class="pc-money-icon" src="@/assets/moeny.png" /></div>
          <div class="round roundSmall">+</div>
        </div>
      </div>

      <div class="bottomPart">
        <button class="btn-game" style="height: 25px !important">
          <span class="centered-xy"> Mines</span>
          <img src="../../assets/shapeDown.png" />
        </button>
        <img @click="showPopRule" class="wen" src="../../assets/wenhao.png" />
        <div style="position: absolute; right: 68px; bottom: 0">
          2999.53
          <p>USD</p>
        </div>
        <n-popover trigger="click" raw :show-arrow="false">
          <template #trigger>
            <div style="position: absolute; right: 0px; bottom: 0" class="round roundSmall">
              <img class="mean" src="../../assets/mean.png" />
            </div>
          </template>
          <div class="large-text2">
            Who kicks a hole in the sky so the heaven cry over me.
          </div>
        </n-popover>
      </div>
    </div>
    <question-pop v-if="showPop"></question-pop>
    <rule-pop v-if="showRulePop"></rule-pop>
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
import { SOUND_TYPE } from "./soundEnum";
import { PixiEngine } from "./systems/engine";
import QuestionPop from "../../components/questionPop.vue";
import RulePop from "../../components/rulePop.vue";

import EventBus from "@/utils/eventbus";
import { throttle } from "@/utils/throttle"
let isFirst = true;
export default defineComponent({
  name: "gameIndex",
  components: {
    QuestionPop,
    RulePop
  },
  setup(props, { emit }: SetupContext) {
    let mines = ref<number>(1);
    let usd = ref<number>(1);
    let audio = ref<any>(null);
    let showDown = ref<boolean>(false);
    let showPop = ref<boolean>(false);
    let showRulePop = ref<boolean>(false);

      
    let gameStart = ref<boolean>(false);
    let overlap = ref(false);
    let autoSwitch = ref(false)
    let canSetAuto = ref(false)
    const gradeList = Array.from(Array(20), (d, i) => i + 1);
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
      showDown.value = !showDown.value;
    };

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
      if(state.isBegin){
        return
      }
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
      }
    };

    const setAutoConfig = () => {
      canSetAuto.value = true
    }

    const closePop = () => {
      showPop.value = false
      showRulePop.value = false
    }

    const showPopRule = ()=>{
      showRulePop.value = true
    }

    onMounted(async () => {
      EventBus.on("PLAY_SOUND", playSound);
      EventBus.on("GET_STARE", getScore);
      EventBus.on("CAN_AUTO_SET", setAutoConfig);
      EventBus.on("CLOSEPOP", closePop);


      await PixiEngine.init(836, 648);
      const canvasInfo = PixiEngine.getCanvas();
      document.querySelector("#canvas")!.appendChild(canvasInfo);
    });



    return {
      ...toRefs(state),
      gradeList,
      showDown,
      audio,
      mines,
      showPop,
      showRulePop,
      usd,
      overlap,
      autoSwitch,
      gameStart,
      showPopRule,
      switchChange,
      overGame,
      showDownList,
      chiceMines,
      begin,
      againGame,
      random,
    };
  },
});
</script>

<style lang="scss">
@import "./style/common";

@media screen and (max-width: 769px) {
  @import "./style/mobileStyle";
}

@media screen and (min-width: 769px) {
  @import "./style/pcStyle";
}
</style>
