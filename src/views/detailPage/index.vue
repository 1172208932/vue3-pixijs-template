<template>
  <div class="detailPageBox">
    <div class="detailPage"></div>
    <div class="detailList">
      <span class="list"></span>
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
export default defineComponent({
  name: "index",
  components: {},
  setup(props, { emit }: SetupContext) {
    const state: {} = reactive({});

    onMounted(async () => {});

    return {
      ...toRefs(state),
    };
  },
});
</script>

<style lang="scss">
.detailPageBox {
  width: 100%;
  height: 100%;
}
.detailPage {
  width: 750px;
  height: 810px;
  background: url("../../assets/xiaobaozhishiyuedu.png") no-repeat top left /
    100% 100%;
  position: fixed;
}

.detailList {
  width: 750px;
  height: 1195px;
  background: url("../../assets/neirong_kuang.png") no-repeat top left / 100%
    100%;
  position: fixd;
  bottom: 0;
}
</style>
