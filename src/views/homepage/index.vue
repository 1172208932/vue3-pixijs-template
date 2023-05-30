<template>
  <div class="box">
    <div class="homepageFixed">
      <div class="homePage" v-show="begin">
        <img src="../../assets/back.png" class="back" alt="" @click="backRead">
        <canvas id="canvas1"></canvas>
        <img src="../../assets/logo.png" class="titleImg" />
        <!-- <span class="rule" @click="showRule"></span> -->
        <span class="task" @click="showTask"></span>
        <div class="btns">
          <span class="times"
            >剩余次数：{{ healthInfo.remainGameTimes || "0" }}</span
          >
          <span class="go_btn" @click="goGame"></span>
        </div>
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
  watch,
} from "vue";
import { useRouter,useRoute  } from "vue-router";
import { Downloader, Parser, Player } from "svga-web";
import EventBus from "@/utils/eventbus";
import RulePop from "@/components/RulePop.vue";
import TaskPop from "@/components/TaskPop.vue";
import { gameStart } from "@/api/resource";
import { useStore } from "vuex";
import { healthInfoIndex } from "@/api/resource";
import { throttle } from "@/utils/throttle";

export default defineComponent({
  name: "homeIndex",
  components: {
    RulePop,
    TaskPop,
  },
  setup(props, { emit }: SetupContext) {
    const router = useRouter();
    let showRulePop = ref<boolean>(false);
    let showTaskPop = ref<boolean>(false);
    let begin = ref<boolean>(false);

    const store = useStore();

    const state: {
      healthInfo: any;
    } = reactive({
      healthInfo: {},
    });

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

    const goGame = throttle(async () => {
      let res = await gameStart();
      console.log(res)
      if(res.success && res.data["startId"]){
        store.commit("setGameId", res.data["startId"] + "");
        router.replace({
          name: "game",
        });
      }
    },3000) 

    const backRead = () =>{
      router.replace({
        name: "readPage",
      });
    }

    const svgaplayerweb = () => {
      const downloader = new Downloader();
      const parser = new Parser();
      const player = new Player("#canvas1");
      const isTextUrl = import.meta.env.VITE_RESOURCE_URL;
      (async () => {
        const fileData = await downloader.get(`${isTextUrl}homepage.svga`);
        const svgaData = await parser.do(fileData);

        player.set({
          loop: true,
        });

        await player.mount(svgaData);

        player.start();
        begin.value = true;
      })();
    };

    const getHealthInfo = async () => {
      let res = await healthInfoIndex();
      if (res) {
        // const { index } = store.state;
        store.commit("setHealthInfo", res);
        state.healthInfo = res;
        // console.log(index.healthInfo.actEndTime, "------ss");
      }

      // if (res?.success) {
      //   healthInfo = res.data;
      //   if (res.data.readRewardCoin) {
      //     modalStore.pushPop("Success_modal", {
      //       coinCount: res.data.readRewardCoin,
      //     });
      //   }
      // }
    };

    const route = useRoute();


    onMounted(async () => {
      const { form } = route.query;
      console.log(form,'fffffffffffffffrom')
      if(form){
        router.replace({
          name:'homepage'
        })
        setTimeout(()=>{
        location.reload()
        })
      }
      getHealthInfo()
      svgaplayerweb();
      EventBus.on("CLOSEPOP", closePop);
      // const { index } = store.state;
      // if( index.healthInfo?.guidStatus == void 0){
      //   window.location.href =  window.location.href = "https://www.ysupup.com/china_life_hi_fun_playground/"
      // }else{
      //   state.healthInfo = index.healthInfo;
      // }
    });

    return {
      ...toRefs(state),
      showRule,
      showTask,
      closePop,
      goGame,
      backRead,
      begin,
      showRulePop,
      showTaskPop,
    };
  },
});
</script>

<style lang="scss" scoped >
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
  .back{
    width: 127px;
    height: 60px;
    position: absolute;
    left: 0%;
    top: 15%;
    z-index: 100;
  }
  .btns {
    position: absolute;
    bottom: 11%;
    width: 100%;
    .times {
      width: 192px;
      height: 54px;
      position: absolute;
      background: url("../../assets/times.png") no-repeat top left / 100% 100%;
      left: 20%;
      top: -15%;
      z-index: 999;
      font-weight: bold;
      color: #983b26;
      font-size: 26px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .go_btn {
      width: 362px;
      height: 135px;
      background: url("../../assets/btn_2.png") no-repeat top left / 100% 100%;
      display: inline-block;
      animation: myBreath1 1s linear infinite;
    }
  }

  @keyframes myBreath1 {
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
.img-dialog {
  width: 300px;
  height: 300px;
}
.titleImg {
  width: 332px;
  height: 45px;
  display: flex;
  // margin-top: 140px;
  position: absolute;
  top: 170px;
  left: 50%;
  transform: translateX(-50%);
}
</style>
