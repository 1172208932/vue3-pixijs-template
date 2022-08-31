<template>
  <div class="indexbox">
    <SwipeList1 />
    <div class="background-box">
      <div class="beautiful-box">
        <div class="beautiful-t1">浙江这么美</div>
        <div class="beautiful-t2">全部</div>
        <div class="beautiful-list">
          <img
            v-for="(item, index) in swperList2"
            :key="index"
            :src="'https://ohudong.cztv.com/' + item.thumb"
          />
        </div>
      </div>
      <swiper
        class="swiper-next"
        :autoHeight="true"
        :slides-per-view="1"
        :space-between="20"
        navigation
        :modules="modules"
        @swiper="onSwiper"
        @slideChange="onSlideChange"
      >
        <swiper-slide>Slide 1</swiper-slide>
        <swiper-slide>Slide 2</swiper-slide>
        <swiper-slide>Slide 3</swiper-slide>
        <swiper-slide>Slide 4</swiper-slide>
        <swiper-slide>Slide 5</swiper-slide>
      </swiper>

      <swiper
        :effect="'cube'"
        :grabCursor="true"
        :cubeEffect="{
          shadow: true,
          slideShadows: true,
          shadowOffset: 20,
          shadowScale: 0.94,
        }"
        :pagination="true"
        :modules="modules"
        class="swiper3"
      >
        <swiper-slide class="slide-img"
          ><img src="https://swiperjs.com/demos/images/nature-1.jpg"
        /></swiper-slide>
        <swiper-slide class="slide-img"
          ><img
            src="https://swiperjs.com/demos/images/nature-2.jpg" /></swiper-slide
        ><swiper-slide class="slide-img"
          ><img
            src="https://swiperjs.com/demos/images/nature-3.jpg" /></swiper-slide
        ><swiper-slide class="slide-img"
          ><img src="https://swiperjs.com/demos/images/nature-4.jpg"
        /></swiper-slide>
      </swiper>

      <div class="video-list">
        <div class="video-title">
          <div class="video-t1">等你来打卡</div>
          <div class="video-t2">更多</div>
        </div>
        <div class="video-index" style="width: 100%; margin: auto">
          <div style="width: 100%; margin: auto">
            <div
              v-masonry
              fit-width="true"
              transition-duration="0.3s"
              item-selector=".card"
              origin-left="true"
              class="imgs-list"
            >
              <div
                v-masonry-tile
                v-for="(item, index) in worksList"
                :key="index"
                class="card"
              >
                <img :src="'https://ohudong.cztv.com/' + item.thumb" alt="" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Swiper, SwiperSlide } from "swiper/vue";
import { Navigation, EffectCube, Pagination, Scrollbar, A11y } from "swiper";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/effect-cube";
import "swiper/css";
import {
  defineComponent,
  reactive,
  toRefs,
  onMounted,
  SetupContext,
} from "vue";

import SwipeList1 from "./components/SwipeList1.vue";
import { getHomeInfo } from "@/api/resource";

export default defineComponent({
  name: "gameIndex",
  components: {
    Swiper,
    SwiperSlide,
    SwipeList1,
  },
  setup(props, { emit }: SetupContext) {
    const onSwiper = (swiper) => {
      console.log(swiper);
    };
    const onSlideChange = () => {
      console.log("slide change");
    };

    const state: {
      swperList2:any;
      worksList:any
    } = reactive({
      swperList2: [],
      worksList: [],
      list: [
        {
          img: "https://swiperjs.com/demos/images/nature-1.jpg",
        },
        {
          img: "https://img1.baidu.com/it/u=1223669517,3326619488&fm=253&app=138&size=w931&n=0&f=JPEG&fmt=auto?sec=1661619600&t=5efd1fd369bc495c7c3e955474700129",
        },
        {
          img: "https://swiperjs.com/demos/images/nature-3.jpg",
        },
        {
          img: "https://swiperjs.com/demos/images/nature-4.jpg",
        },
        {
          img: "https://img1.baidu.com/it/u=1966616150,2146512490&fm=253&app=138&size=w931&n=0&f=JPEG&fmt=auto?sec=1661619600&t=e8072b5bd977855fce56f13f63ee3a71",
        },
        {
          img: "https://t14.baidu.com/it/u=1682967921,618817946&fm=224&app=112&size=w931&n=0&f=JPEG&fmt=auto?sec=1661619600&t=abe7e9f72a7f138100417efc74560260",
        },
      ],
    });
    const getInfoData = async () => {
      const data: any = await getHomeInfo({
        category_id: 216,
        channel_id: 1,
        sort: 0,
        size: 10,
        page: 1,
      });
      state.swperList2 = data.list;
      console.log(data);
    };

    const getWorksData = async () => {
      const data: any = await getHomeInfo({
        category_id: 223,
        channel_id: 1,
        sort: 0,
        size: 10,
        page: 1,
      });
      state.worksList = data.list;
      console.log(data);
    };
    onMounted(() => {
      getInfoData();
      getWorksData();
    });

    return {
      ...toRefs(state),
      onSwiper,
      onSlideChange,
      modules: [Navigation, EffectCube],
    };
  },
});
</script>

<style lang="scss">
@import "./style/common";
</style>
