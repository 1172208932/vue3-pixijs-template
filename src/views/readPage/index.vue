<template>
  <div class="box">
    <div class="readPage">
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
import EventBus from "@/utils/eventbus";
export default defineComponent({
  name: "index",
  components: {
  },
  setup(props, { emit }: SetupContext) {
    const router = useRouter();
    const state: {
    } = reactive({
    });

    onMounted(async () => {
    });

    const goRead = () => {
      router.push({
        name: "detailPage",
      });
    }

    const goGame = () => {
      router.push({
        name: "homepage",
      });
    }

    return {
      ...toRefs(state),
      goRead,
      goGame
    };
  },
});
</script>

<style lang="scss">
.readPage{
  width: 750px;
  height: 1624px;
  background: url('../../assets/xiaobaozhuanqu.png') no-repeat top left / 100% 100%;
  position: fixed;
  .btns{
    padding-top: 688px;
  }
}
.run_btn{
  width: 489px;
  height: 150px;
  background: url('../../assets/btn_run.png') no-repeat top left / 100% 100%;
  display: flex;
  margin: 0 auto 88px auto;
}
.read_btn{
  width: 489px;
  height: 150px;
  background: url('../../assets/btn_read.png') no-repeat top left / 100% 100%;
  display: flex;
  margin: 0 auto;
}
</style>
