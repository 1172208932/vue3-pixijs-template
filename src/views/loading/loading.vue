<template>
  <div class="loading">
    <img src="https://swiperjs.com/demos/images/nature-3.jpg" alt="" />
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  reactive,
  toRefs,
  onMounted,
  SetupContext,
} from "vue";
import { useRouter } from "vue-router";

import { ShockwaveFilter } from "@pixi/filter-shockwave";
import * as PIXI from "pixi.js";
import shaderFrag from "./shaderWav.frag";
import vertex from "./default.vert";

export default defineComponent({
  name: "gameIndex",
  components: {},
  setup(props, { emit }: SetupContext) {
    const router = useRouter();
    const state: any = reactive({
      swperList2: [],
      worksList: [],
    });

    const initLoading = () => {
      let app = new PIXI.Application({
        width: 256,
        height: 256,
        transparent: true,
      });
      document.body.appendChild(app.view);
      app.renderer.view.style.position = "absolute";
      app.renderer.view.style.display = "block";
      app.renderer.autoResize = true;
      app.renderer.resize(window.innerWidth, window.innerHeight);

      //         let container = new PIXI.Container();
      //         container.filterArea = app.screen;
      //         container.width = app.screen.width;
      //   container.height = app.screen.height;
      //         app.stage.addChild(container);
      const isTextUrl = import.meta.env.VITE_RESOURCE_URL;

      const container = PIXI.Sprite.from(`${isTextUrl}bg.png`);
      container.width = app.screen.width;
      container.height = app.screen.height;
      container.filterArea = app.screen;
      app.stage.addChild(container);
      let filter: {
        uniforms: {
          amplitude: number;
          center: number[];
          wavelength: number;
          brightness: number;
          speed: number;
          radius: number;
          time: number;
        };
      } = new PIXI.Filter(vertex, shaderFrag);
      // filter.uniforms.iResolution = [window.innerWidth, window.innerHeight, 1.0];
      // filter.uniforms.filterArea = app.screen;
      filter.uniforms.amplitude = 22;
      filter.uniforms.center = [window.innerWidth / 2, window.innerHeight / 2];
      filter.uniforms.wavelength = 160.0;
      filter.uniforms.brightness = 1.0;
      filter.uniforms.speed = 500.0;
      filter.uniforms.radius = 1500.0;
      filter.uniforms.time = 0;

      let filter2 = new ShockwaveFilter([0.5, 0.5], {}, 0);

      //   container.filters = [filter2];
      // @ts-ignore
      container.filters = [filter];
      console.log(app, "container");

      let isplaying = false;

      app.ticker.add(function (delta) {
        if (isplaying) return;
        filter.uniforms.time += app.ticker.elapsedMS / 1000;
        if (filter.uniforms.time >= 2) {
          isplaying = true;
          console.log("REMOVE");
          document.body.removeChild(app.view);
          // router.replace("/home");
        }

        // filter2.time += app.ticker.elapsedMS / 1000;
      });
    };

    onMounted(() => {
      initLoading();
    });

    return {
      ...toRefs(state),
    };
  },
});
</script>

<style lang="scss">
.loading {
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  img {
    width: 100vw;
    height: 100vh;
  }
}
</style>
