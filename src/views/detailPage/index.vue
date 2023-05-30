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
          <div class="title-item">
            <!-- <p>{{ item.time }}</p> -->
            <p class="title">{{ item.text }}</p>
            <span class="bottomtext">
              <p class="read">{{ item.title }}</p>
              <!-- <p>赞{{ item.good }}</p> -->
            </span>
          </div>
          <img :src="item.userImg" alt="" />
        </div>
      </div>
    </div>
    <read-pop :readGlodNum="readGlodNum" v-model:show="showReadPop"></read-pop>

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
import { healthInfoComplete, healthInfoDetail,readIndex } from "@/api/resource";
import { throttle } from "@/utils/throttle";
import { useStore } from "vuex";
import { useRouter,useRoute } from "vue-router";
import EventBus from "@/utils/eventbus";
import ReadPop from "@/components/readPop.vue"

export default defineComponent({
  name: "detailPage",
  components: {ReadPop},
  setup(props, { emit }: SetupContext) {
    const store = useStore();
    const router = useRouter();
    const route = useRoute();
    let showReadPop = ref<boolean>(false);
    let readGlodNum = ref<number>(0)

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
        store.commit("setHealthImg", res['link']);
        console.log(item.status,'item.status')
        router.replace({
          name: "picPage",
          params: { info: temp,
            status:item.status },
        });
      }
    };

    const back = () =>{
      // router.back();
      router.replace({
        name: "readPage",
      });
    }

    onMounted(async () => {
      const { index } = store.state;
      if( index.healthInfo?.guidStatus == void 0){
          window.location.href = import.meta.env.VITE_APP_INDEX_URL
      }
      const { glodNum } = route.query;
      readGlodNum.value = Number(glodNum);
      if(glodNum){
        showReadPop.value = true
      }
      let data = await readIndex();
      console.log(data,'333')
      state.list = data['healthInfoList'];
      // [
      //   {
      //     "dailyClickCount": 0, 
      //     "id": 1, 
      //     "link": null, 
      //     "rewardCoin": 20, 
      //     "status": 1, 
      //     "text": "标题1文案", 
      //     "title": "Parkour吃得少寿命长，饭量小衰老得慢？想长寿，吃得少不如吃得对", 
      //     "userImg": "https://ysupup.oss-cn-hangzhou.aliyuncs.com/%E5%9B%BD%E5%AF%BF%E5%AE%A2%E6%88%B7%E8%8A%82/banner/1.jpg"
      //   }, 
      //   {
      //     "dailyClickCount": 0, 
      //     "id": 2, 
      //     "link": null, 
      //     "rewardCoin": 20, 
      //     "status": 0, 
      //     "text": "标题2文案", 
      //     "title": "Parkour坚持每天走一万步，最后会怎样？研究发现：可降低3种疾病的风险", 
      //     "userImg": "https://ysupup.oss-cn-hangzhou.aliyuncs.com/%E5%9B%BD%E5%AF%BF%E5%AE%A2%E6%88%B7%E8%8A%82/banner/2.jpg"
      //   }, 
      //   {
      //     "dailyClickCount": 0, 
      //     "id": 3, 
      //     "link": null, 
      //     "rewardCoin": 20, 
      //     "status": 0, 
      //     "text": "标题3文案", 
      //     "title": "Parkour热水泡脚，到底是“养生”，还是“慢性自杀”？对5类人有害无益", 
      //     "userImg": "https://ysupup.oss-cn-hangzhou.aliyuncs.com/%E5%9B%BD%E5%AF%BF%E5%AE%A2%E6%88%B7%E8%8A%82/banner/3.jpg"
      //   }, 
      //   {
      //     "dailyClickCount": 0, 
      //     "id": 4, 
      //     "link": null, 
      //     "rewardCoin": 20, 
      //     "status": 0, 
      //     "text": "标题4文案", 
      //     "title": "Parkour每天早上吃一个鸡蛋，对身体好还是坏？多项研究给出答案", 
      //     "userImg": "https://ysupup.oss-cn-hangzhou.aliyuncs.com/%E5%9B%BD%E5%AF%BF%E5%AE%A2%E6%88%B7%E8%8A%82/banner/4.jpg"
      //   }
      // ]  
    });

    return {
      ...toRefs(state),
      readList,
      showReadPop,
      readGlodNum,
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

    .title-item{
      width: 600px;
    }
    .read {
      margin-right: 39px;
    }
    img {
      width: 159px;
      height: 168px;
      position: relative;
      right: 0px;
      border-radius: 10px;
    }
  }
}
</style>
