<template>
  <div class="box">
    <div class="homePage">
      <span class="rule"></span>
      <span class="task"></span>
      <span class="go_btn"></span>
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

import './index.scss'
export default defineComponent({
  name: "index",
  setup(props, { emit }: SetupContext) {
    let mines = ref<number>(1);
    console.log(mines,'---')
  

    const state: {
    } = reactive({
    });

    const begin = () => {
     
    };

  
    onMounted(async () => {
    
    });



    return {
      ...toRefs(state),
     
    };
  },
});
</script>

<style lang="scss">

</style>
