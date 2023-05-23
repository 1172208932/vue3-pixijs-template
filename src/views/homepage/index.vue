<template>
  <div class="box">
    <div class="homePage">
      <span class="rule" @click="showRule"></span>
      <span class="task" @click="showTask"></span>
      <span class="go_btn"></span>
    </div>
  </div>
  <rule-pop :show="showRulePop"></rule-pop>
  <task-Pop ref="taskPop" :show="showTaskPop"></task-Pop>
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
import EventBus from "@/utils/eventbus";
import './index.scss'
import RulePop from "../../components/RulePop.vue"
import TaskPop from "@/components/TaskPop.vue";
export default defineComponent({
  name: "index",
  components: {
    RulePop,
    TaskPop
  },
  setup(props, { emit }: SetupContext) {
    let showRulePop = ref<boolean>(false);
    let showTaskPop = ref<boolean>(false);
  
    const taskPop = ref()
    const state: {
    } = reactive({
    });

    const showRule = () => {
      showRulePop.value = true
    };

    const showTask = () => {
      taskPop.value.showPop()
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

</style>
