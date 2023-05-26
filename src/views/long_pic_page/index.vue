<template>
  <div class="picBox">
    <img v-if="userImg" :src="userImg" class="pic" />
    <guid-pop v-model:show="showBackPop" ></guid-pop>
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
import { useRoute } from "vue-router";
import { useStore } from "vuex";
import { healthInfoComplete } from "../../api/resource";
import { Toast } from "vant";
import BackPop from "@/components/backPop.vue"
export default defineComponent({
  name: "index",
  components: { BackPop },
  setup(props, { emit }: SetupContext) {
    const store = useStore();
    const route = useRoute();
    let timer: any;
    let countdown = ref<number>(5);
    let userImg = ref<any>("");
    const state: {} = reactive({});
    
    let showBackPop = ref<boolean>(true);


    onMounted(async () => {
      timer = setInterval(() => {
        if (countdown.value <= 0) {
          clearInterval(timer);
          timer = "";
          complete();
        }
        countdown.value--;
      }, 1000);
      console.log(route.params,'userImg')
      userImg.value = route.params.userImg;
    });

    const complete = async () => {
      let res = await healthInfoComplete({
        healInfoId: route.params.healInfoId,
      });
      if (res) {
        Toast.success("阅读成功");
      }
    };

    return {
      ...toRefs(state),
      userImg,
      readList,
      showBackPop
    };
  },
});
</script>

<style lang="scss">
.picBox {
  width: 750px;
  height: 100vh;
  position: relative;
  img {
    width: 100%;
    height: 100%;
  }
}
</style>
