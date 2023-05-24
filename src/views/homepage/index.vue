<template>
  <div class="box">
    <div class="homePage">
      <span class="rule" @click="showRule"></span>
      <span class="task" @click="showTask"></span>
      <span class="go_btn"></span>
    </div>
  </div>
  <rule-pop :show="showRulePop"></rule-pop>
  <task-Pop v-model:show="showTaskPop" @close="closePop"></task-Pop>
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
import RulePop from "../../components/RulePop.vue"
import TaskPop from "@/components/TaskPop.vue";
export default defineComponent({
  name: "index",
  components: {
    RulePop,
    TaskPop
  },
  setup(props, { emit }: SetupContext) {
    const router = useRouter();
    let showRulePop = ref<boolean>(false);
    let showTaskPop = ref<boolean>(false);
  
    const state: {
    } = reactive({
    });

    const showRule = () => {
      showRulePop.value = true
    };

    const showTask = () => {
      showTaskPop.value = true;

    }

    const closePop = () => {
      showRulePop.value = false;
      showTaskPop.value = false
    }

    onMounted(async () => {
      EventBus.on("CLOSEPOP", closePop);
    });



    return {
      ...toRefs(state),
      showRule,
      showTask,
      showRulePop,
      showTaskPop
    };
  },
});
</script>

<style lang="scss">
.box{
    width: 100%;
    height: 100%;
}
.homePage{
    width: 750px;
    height: 1624px;
    background: url('../../assets/homepage.png') no-repeat top left / 100% 100%;
    position: relative;
}
.rule{
    width: 98px;
    height: 46px;
    background: url('../../assets/icon_rules.png') no-repeat top left / 100% 100%;
    display: inline-block;
    position: absolute;
    right: 0;
    top: 440px;
}
.task{
    width: 211px;
    height: 150px;
    background: url('../../assets/tip.png') no-repeat top left / 100% 100%;
    display: inline-block;
    position: fixed;
    right: 36px;
    top: 1133px;
}
.go_btn{
    width: 362px;
    height: 135px;
    background: url('../../assets/btn_2.png') no-repeat top left / 100% 100%;
    display: inline-block;
    position: fixed;
    // right: 36px;
    bottom: 0px;
    left: 50%;
    transform: translatex(-50%);
}
.img-dialog{
    width: 300px;
    height: 300px;
}
</style>
