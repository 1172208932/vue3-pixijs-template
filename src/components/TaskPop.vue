<template>
  <van-popup v-model:show="showPopup" position="bottom">
    <div class="taskBg">
      <div class="taskBox">
        <div class="taskList" v-for="(item, index) in list" :key="index">
          <p class="title">{{ item.title }}</p>
          <p class="text">{{ item.subTitle }}</p>
          <span
            v-if="
              Number(item.completeTimes) < item.limitTimes &&
              (item?.pendingRecordCodeList?.length || []) <= 0
            "
            class="taskBtn"
            @click="share(item)"
          ></span>

          <span
            v-else-if="item?.pendingRecordCodeList?.length > 0"
            class="taskGetBtn"
            @click="getGift(item)"
          >
            <span class="span-text">待领取</span></span
          >
          <span v-else class="taskComBtn"></span>
        </div>
      </div>
    </div>
    <img src="../assets/close.png" class="close" @click="close" alt="" />
  </van-popup>
</template>
  
<script setup lang="ts">
import { showShareGuide } from "@/utils/show-share-guide/index";
import { completeTask, taskList, receiveTaskPrize } from "@/api/resource";
import { showToast } from "vant";
import { useStore } from "vuex";
import { ref, onMounted, watch } from "vue";
import EventBus from "@/utils/eventbus";
import { throttle } from "@/utils/throttle";

const props = defineProps({
  show: Boolean,
});
let list = ref<any[]>([]);
let showPopup = ref<boolean>(false);
const store = useStore();

function close() {
  EventBus.fire("CLOSEPOP");
}

const share = async (item) => {
  EventBus.fire("CLOSEPOP");
  showShareGuide("点击...分享哦", 0.7, 0, async () => {
    let res = await completeTask();
    if (res["success"]) {
      getTask();
    }
  });
};

const getGift = async (item) => {
  console.log(item.code, item?.pendingRecordCodeList?.join(","));
  const res = await receiveTaskPrize({
    taskCode: item.code,
    pendingRecordCode: item?.pendingRecordCodeList[0],
  });
  if (res.success) {
    store.dispatch("getHealthInfo");
    showToast("领取成功");
    getTask();
  }
};

watch(props, (newProps: any) => {
  showPopup.value = newProps.show;
});

const getTask = async () => {
  let res = await taskList();

  list.value = res.data.taskItemList;
  // [
  //     {
  //       "code": "share",
  //       "completeTimes": null,
  //       "cycleType": "DAY",
  //       "desc": "每日增加的次数不超过三次",
  //       "icon": "https://ysupup.oss-cn-hangzhou.aliyuncs.com/%E5%9B%BD%E5%AF%BF%E5%AE%A2%E6%88%B7%E8%8A%82/long/%E5%9B%BE%E5%B1%82%204524.png",
  //       "limitTimes": 3,
  //       "pendingRecordCodeList": ['ffffd'],
  //       "ruleCode": null,
  //       "spCode": "sp_parkour_daily_times",
  //       "spQuantity": 1,
  //       "subTitle": "每分享一次增加一次游戏次数,每日增加的次数不超过三次",
  //       "title": "分享任务"
  //     }
  //   ]

  console.log(res, "fff");
};

onMounted(() => {
  getTask();
});
</script>
  
<style scoped>
.close {
  width: 53px;
  height: 53px;
  margin-top: 45px;
  position: absolute;
  top: 60px;
  right: 11px;
}

.taskBg {
  width: 750px;
  height: 974px;
  background: url("../assets/bankground.png") no-repeat top left / 100% 100%;
  position: relative;
}

.taskBox {
  width: 750px;
  position: absolute;
  margin-top: 300px;
  height: 640px;
  overflow: scroll;
}

.taskList {
  width: 677px;
  height: 116px;
  background: url("../assets/share.png") no-repeat top left / 100% 100%;
  position: relative;
  /* top: 330px; */
  left: 40px;
  /* left: 0%;
  transform: translateX(-50%); */
}

.title {
  font-size: 29px;
  width: 280px;
  color: #396459;
  font-weight: bold;
  padding-top: 10px;
  margin: 20px 0 2px 155px;
  text-align: start;
}

.text {
  text-align: start;
  margin-left: 155px;
  font-size: 20px;
  color: #396459;
  font-weight: normal;
  width: 280px;
}

.taskBtn {
  width: 226px;
  height: 84px;
  background: url("../assets/btn_1.png") no-repeat top left / 100% 100%;
  display: inline-block;
  position: absolute;
  right: 0;
  top: 60%;
  transform: translateY(-50%);
}

.taskComBtn {
  width: 226px;
  height: 84px;
  background: url("../assets/btn_comp.png") no-repeat top left / 100% 100%;
  display: inline-block;
  position: absolute;
  right: 0;
  top: 60%;
  transform: translateY(-50%);
}

.taskGetBtn {
  width: 226px;
  height: 84px;
  background: url("../assets/btn_bgtask.png") no-repeat top left / 100% 100%;
  display: inline-block;
  position: absolute;
  right: 0;
  top: 60%;
  transform: translateY(-50%);
  font-size: 30px;
  line-height: 64px;
  color: #ffffff;
  font-weight: bold;
  text-align: left;
}

.span-text {
  margin-left: 50px;
}
</style>
  