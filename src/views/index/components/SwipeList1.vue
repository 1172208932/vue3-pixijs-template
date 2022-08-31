<template>
  <van-swipe class="my-swipe" :autoplay="3000">
    <van-swipe-item v-for="(item, index) in swiper1List" :key="index">
      <img :src="'https://ohudong.cztv.com/' + item.thumb"
    /></van-swipe-item>
    <template #indicator="{ active, total }">
      <div class="custom-box">
        <div
          class="custom-indicator"
          v-for="(item, index) in swiper1List"
          :key="index"
        >
          <img
            :class="active == index ? '' : 'unactive-icon'"
            src="../../../assets/icon.png"
          />
        </div>
      </div>
    </template>
  </van-swipe>
</template>
<script lang="ts">
import { getHomeInfo } from "@/api/resource";
import { defineComponent, SetupContext, toRefs, onMounted } from "vue";

export default defineComponent({
  name: "swipeList1",
  setup(props, { emit }: SetupContext) {
    const state: any = reactive({
      swiper1List: [],
    });

    const getInfoData = async () => {
      const data: any = await getHomeInfo({
        category_id: 214,
        channel_id: 1,
        sort: 0,
        size: 10,
        page: 1,
      });
      state.swiper1List = data.list;
      console.log(data);
    };

    onMounted(() => {
      getInfoData();
    });

    return {
      ...toRefs(state),
    };
  },
});
</script>

<style lang="scss" scoped>
.custom-indicator {
  width: 54px;
  height: 6px;
  margin-right: 6px;

  img {
    position: relative;
    top: -20px;
    width: 54px;
    height: 6px;
  }

  .unactive-icon {
    opacity: 0.5;
  }
}

.custom-box {
  position: absolute;
  bottom: 176px;
  left: 48px;
  display: flex;
}

.my-swipe .van-swipe-item {
  color: #fff;
  font-size: 20px;
  width: 750px;
  height: 697px;
  text-align: center;
  background-color: #39a9ed;

  img {
    width: 750px;
    height: 697px;
  }
}
</style>