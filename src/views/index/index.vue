<template>
  <div class="box">
 
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

import { throttle } from "@/utils/throttle"
export default defineComponent({
  name: "index",
  setup(props, { emit }: SetupContext) {
    let mines = ref<number>(1);
  

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
