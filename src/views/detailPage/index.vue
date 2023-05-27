<template>
  <div class="detailPageBox">
    <div class="detailPage"></div>
    <img src="../../assets/back.png" class="back" alt="" @click="back">
    <div class="detailList">
      <div class="lists">
        <div
          v-for="(item, index) in list"
          :key="index"
          class="list"
          @click="handleJump2LongPicPage(item)"
        >
          <div>
            <!-- <p>{{ item.time }}</p> -->
            <p class="title">{{ item.text }}</p>
            <span class="bottomtext">
              <p class="read">阅读{{ item.dailyClickCount }}</p>
              <!-- <p>赞{{ item.good }}</p> -->
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
import { healthInfoComplete, healthInfoDetail } from "@/api/resource";
import { throttle } from "@/utils/throttle";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import EventBus from "@/utils/eventbus";
export default defineComponent({
  name: "detailPage",
  components: {},
  setup(props, { emit }: SetupContext) {
    const store = useStore();
    const router = useRouter();
    const state: {
      list: any;
    } = reactive({
      list: [],
    });

    const handleJump2LongPicPage = async (item: any) => {
      const res = await healthInfoDetail({
        healInfoId: item.id,
      });
      if (res) {
        let temp: number = item.id;
        store.commit("setGameId", item.userImg);
        router.push({
          name: "picPage",
          params: { info: temp },
        });
      }
    };

    const back = () =>{
      router.back();
    }

    onMounted(async () => {
      const { index } = store.state;
      state.list = index.healthInfo.healthInfoList;
    });

    return {
      ...toRefs(state),
      readList,
      back,
      handleJump2LongPicPage,
    };
  },
});
</script>

<style lang="scss">
.detailPageBox {
  width: 750px;
  height: 100vh;
  position: relative;
  
  .back{
    width: 127px;
    height: 60px;
    position: absolute;
    left: 0%;
    top: 6%;
  }
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
      width: 67%;
      overflow: hidden;
      text-overflow: ellipsis;
      -webkit-line-clamp: 3;
      display: -webkit-box;
      -webkit-box-orient: vertical;
    }
    .read {
      margin-right: 39px;
    }
    img {
      width: 159px;
      height: 168px;
      position: absolute;
      right: 79px;
    }
  }
}
</style>
