<template>
  <div class="box">
    <div class="homepageFixed">
      <div class="homePage" v-show="begin">
        <canvas id="canvas1"></canvas>
        <img src="../../assets/logo.png" class="titleImg" />
        <span class="rule" @click="showRule"></span>
        <span class="task" @click="showTask"></span>
        <span class="go_btn" @click="goGame"></span>
      </div>
    </div>
  </div>
  <rule-pop v-model:show="showRulePop"></rule-pop>
  <task-Pop v-model:show="showTaskPop"></task-Pop>
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
import { useRouter } from "vue-router";
import { Downloader, Parser, Player } from "svga-web";
import EventBus from "@/utils/eventbus";
import RulePop from "@/components/RulePop.vue";
import TaskPop from "@/components/TaskPop.vue";
import { gameStart } from "@/api/resource";
import { useStore } from "vuex";

export default defineComponent({
  name: "index",
  components: {
    RulePop,
    TaskPop,
  },
  setup(props, { emit }: SetupContext) {
    const router = useRouter();
    let showRulePop = ref<boolean>(false);
    let showTaskPop = ref<boolean>(false);
    let begin = ref<boolean>(false)

    const store = useStore();


    const state: {} = reactive({});

    const showRule = () => {
      showRulePop.value = true;
    };

    const showTask = () => {
      showTaskPop.value = true;
    };

    const closePop = () => {
      showRulePop.value = false;
      showTaskPop.value = false;
    };

    const goGame = async () => {
      let res =  await gameStart()

      store.commit("setGameId", res['startId'] +'')
      if(res['startId']){
          router.push({
          name: "game",
        });
      }
    };

    const svgaplayerweb = () => {
      const downloader = new Downloader();
      const parser = new Parser();
      const player = new Player("#canvas1");
      const isTextUrl = import.meta.env.VITE_RESOURCE_URL;
      (async () => {
        const fileData = await downloader.get(
          `${isTextUrl}homepage.svga`
        );
        const svgaData = await parser.do(fileData);

        player.set({
          loop: true,
        });

        await player.mount(svgaData);

        player.start();
        begin.value = true
      })();
    };

    onMounted(async () => {
      svgaplayerweb();
      EventBus.on("CLOSEPOP", closePop);
    });

    return {
      ...toRefs(state),
      showRule,
      showTask,
      closePop,
      goGame,
      begin,
      showRulePop,
      showTaskPop,
    };
  },
});
</script>

<style lang="scss">
.box {
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: absolute;
  left: 0px;
  top: 0px;
  background: #4593d1;
}
.homepageFixed {
  width: 750px;
  height: 1624px;
  position: relative;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.homePage {
  width: 750px;
  height: 1624px;
  background: url("../../assets/homepage.png") no-repeat top left / 100% 100%;
  position: relative;

  canvas {
    width: 100%;
    height: 100%;
    margin-top: 30px;
  }
}
.rule {
  width: 98px;
  height: 46px;
  background: url("../../assets/icon_rules.png") no-repeat top left / 100% 100%;
  display: inline-block;
  position: absolute;
  right: 0;
  top: 440px;
}
.task {
  width: 211px;
  height: 150px;
  background: url("../../assets/tip.png") no-repeat top left / 100% 100%;
  display: inline-block;
  position: fixed;
  right: 36px;
  top: 1133px;
}
.go_btn {
  width: 362px;
  height: 135px;
  background: url("../../assets/btn_2.png") no-repeat top left / 100% 100%;
  display: inline-block;
  position: absolute;
  // right: 36px;
  bottom: 150px;
  left: 28%;
  animation: myBreath 1s linear infinite;
}
.img-dialog {
  width: 300px;
  height: 300px;
}
.titleImg {
  width: 225px;
  height: 59px;
  display: flex;
  // margin-top: 140px;
  position: absolute;
  top: 170px;
  left: 50%;
  transform: translateX(-50%);
}
@keyframes myBreath {
  0% {
    transform: scale(0.88);
  }
  50% {
    transform: scale(100%);
  }
  100% {
    transform: scale(0.88);
  }
}
</style>
