<template>
  <div class="box">
    <div class="readPage">
      <img src="../../assets/back.png" class="back" alt="" @click="backHome" />
      <img src="../../assets/logo.png" class="titleImg" />

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
      // const { index } = store.state;
      // if( index.healthInfo?.guidStatus == void 0){
      //   window.location.href =  window.location.href = "https://www.ysupup.com/china_life_hi_fun_playground/"
      // }
      store.dispatch("getHealthInfo");
      const { index } = store.state;
      if(index.healthInfoList?.healthInfoList?.length > 0) state.healthInfo = index.healthInfoList;
    });

    const goRead = () => {
      router.replace({
        name: "detailPage",
      });
    };

    const goGame = () => {
      router.replace({
        name: "homepage",
      });
    };

    const backHome = () => {
      window.location.href = import.meta.env.VITE_APP_INDEX_URL
        
    };

    return {
      ...toRefs(state),
      goRead,
      goGame,
      backHome,
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
  .back {
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
.titleImg {
  width: 332px;
  height: 45px;
  display: flex;
  // margin-top: 140px;
  position: absolute;
  top: 120px;
  left: 50%;
  transform: translateX(-50%);
}
.read_btn {
  width: 489px;
  height: 150px;
  background: url("../../assets/btn_read.png") no-repeat top left / 100% 100%;
  display: flex;
  margin: 0 auto;
}
</style>
