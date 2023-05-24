<template>
  <div class="detailPageBox">
    <div class="detailPage"></div>
    <div class="detailList">
      <div class="lists">
        <div v-for="(item, index) in readList" :key="index" class="list">
          <div>
            <p>{{ item.time }}</p>
            <p class="title">{{ item.text }}</p>
            <span class="bottomtext">
              <p class="read">阅读{{ item.read }}</p>
              <p>赞{{ item.good }}</p>
            </span>
          </div>
          <img src="../../assets/icon.png" alt="" />
        </div>
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
import { readList } from "../../components/static";
export default defineComponent({
  name: "index",
  components: {},
  setup(props, { emit }: SetupContext) {
    const state: {} = reactive({});

    onMounted(async () => {});

    return {
      ...toRefs(state),
      readList,
    };
  },
});
</script>

<style lang="scss">
.detailPageBox {
  width: 750px;
  height: 100vh;
  position: relative;
}
.detailPage {
  width: 750px;
  height: 810px;
  background: url("../../assets/xiaobaozhishiyuedu.png") no-repeat top left /
    100% 100%;
}

.detailList {
  width: 750px;
  height: 70%;
  background: url("../../assets/neirong_kuang.png") no-repeat top left / 100%
    100%;
  position: absolute;
  bottom: 0;
  .lists {
    height: 94%;
    margin-top: 32px;
    overflow-x: hidden;
    overflow-y: scroll;
  }
  .list {
    width: 628px;
    height: 166px;
    background: url("../../assets/one.png") no-repeat top left / 100% 100%;
    display: flex;
    align-items: center;
    padding: 23px 26px;
    margin: 0 auto 31px auto;
    .bottomtext {
      display: flex;
    }
    p {
      text-align: start;
      line-height: 45px;
      font-size: 23px;
      font-weight: normal;
      color: #b3b6ac;
    }
    .title {
      font-size: 30px !important;
      font-weight: bold !important;
      color: #404040 !important;
    }
    .read {
      margin-right: 39px;
    }
    img {
      width: 159px;
      height: 168px;
    }
  }
}
</style>
