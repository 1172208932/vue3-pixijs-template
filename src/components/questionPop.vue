<template>
  <div class="gray">
    <div class="popModule">
      <div class="title">
        <p>AUTO PLAY</p>
        <img src="../assets/close.png" alt="">
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, defineComponent } from 'vue'
defineComponent({
  name: "questionPop",
  components: {
    // questionPop
  },
})
// import { useRouter, useRoute } from 'vue-router';

// defineProps<{ }>()

</script>

<style scoped>
a {
  color: #42b983;
}

label {
  margin: 0 0.5em;
  font-weight: bold;
}

code {
  background-color: #eee;
  padding: 2px 4px;
  border-radius: 4px;
  color: #304455;
}
</style>
