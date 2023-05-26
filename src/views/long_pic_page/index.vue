<template>
  <div class="picBox">
    <img v-if="userImg" :src="userImg" class="pic" />
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
import { showSuccessToast } from "vant";
export default defineComponent({
  name: "index",
  components: {},
  setup(props, { emit }: SetupContext) {
    const store = useStore();
    const route = useRoute();
    let timer: any;
    let countdown = ref<number>(10);
    let userImg = ref<any>("");
    let healInfoId = ref<string>("")
    const state: {} = reactive({});

    onMounted(async () => {
      timer = setInterval(() => {
        if (countdown.value <= 0) {
          clearInterval(timer);
          timer = "";
          complete();
        }
        countdown.value--;
      }, 1000);
      const { info } = route.params
      userImg.value = info.toString().split('&')[1];
      healInfoId.value = info.toString().split('&')[1];
    });

    const complete = async () => {
      let res = await healthInfoComplete({
        healInfoId,
      });
      if (res) {
        showSuccessToast("阅读成功");
      }
    };

    return {
      ...toRefs(state),
      userImg,
      healInfoId,
      readList,
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
