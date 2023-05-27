<template>
  <div class="box">
    <div class="readPage">
      <img src="../../assets/back.png" class="back" alt="" @click="backHome">
      <div class="btns">
        <span class="run_btn" @click="goGame"></span>
        <span class="read_btn" @click="goRead"></span>
      </div>
    </div>
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
import { useRouter } from "vue-router";
import { healthInfoIndex } from "@/api/resource";
import { useStore } from "vuex";
import EventBus from "@/utils/eventbus";
export default defineComponent({
  name: "readPage",
  components: {},
  setup(props, { emit }: SetupContext) {
    const router = useRouter();
    const store = useStore();
    const state: {
      healthInfo: any;
    } = reactive({
      healthInfo: {},
    });

    onMounted(async () => {
      getHealthInfo();
    });

    const goRead = () => {
      router.push({
        name: "detailPage",
      });
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

    const goGame = () => {
      router.push({
        name: "homepage",
      });
    };

    const backHome = ()=>{
      window.location.href = "https://www.ysupup.com/china_life_hi_fun_playground/"
    }

    return {
      ...toRefs(state),
      goRead,
      goGame,
      getHealthInfo,
      backHome
    };
  },
});
</script>

<style lang="scss">
.readPage {
  width: 750px;
  height: 1624px;
  background: url("../../assets/xiaobaozhuanqu.png") no-repeat top left / 100%
    100%;
  position: fixed;
  .btns {
    padding-top: 688px;
  }
  .back{
    width: 127px;
    height: 60px;
    position: absolute;
    left: 0%;
    top: 6%;
  }
}
.run_btn {
  width: 489px;
  height: 150px;
  background: url("../../assets/btn_run.png") no-repeat top left / 100% 100%;
  display: flex;
  margin: 0 auto 88px auto;
}
.read_btn {
  width: 489px;
  height: 150px;
  background: url("../../assets/btn_read.png") no-repeat top left / 100% 100%;
  display: flex;
  margin: 0 auto;
}
</style>
