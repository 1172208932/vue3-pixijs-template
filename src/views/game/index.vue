<template>
  <div class="gamebox">
    <canvas id="canvas"></canvas>
    <div class="debugger"></div>
  </div>
</template>

<script lang="ts">
import { resource, Game, GameObject, RESOURCE_TYPE } from "@eva/eva.js";
import { Render, RenderSystem } from "@eva/plugin-renderer-render";
import { RendererSystem } from "@eva/plugin-renderer";
import { Event, EventSystem, HIT_AREA_TYPE } from "@eva/plugin-renderer-event";
import { Text, TextSystem } from "@eva/plugin-renderer-text";

import { Sprite, SpriteSystem } from "@eva/plugin-renderer-sprite";
import {
  SpriteAnimation,
  SpriteAnimationSystem,
} from "@eva/plugin-renderer-sprite-animation";
// SpriteAnimation;
import { Transition, TransitionSystem } from "@eva/plugin-transition";
import Matter from "matter-js";

import {
  TilingSprite,
  TilingSpriteSystem,
} from "@eva/plugin-renderer-tiling-sprite";
import { PhysicsSystem, Physics, PhysicsType } from "@eva/plugin-matterjs";
import { Img, ImgSystem } from "@eva/plugin-renderer-img";
import { Graphics, GraphicsSystem } from "@eva/plugin-renderer-graphics";
import sources from "./resource";
import createBackground from "./gameObjects/background";
import createRole from "./gameObjects/role";

import {
  defineComponent,
  reactive,
  toRefs,
  onMounted,
  SetupContext,
} from "vue";

export default defineComponent({
  name: "gameIndex",
  setup(props, { emit }: SetupContext) {
    const state: any = reactive({
      sceneWidth: 750,
      sceneHeight: (window.innerHeight / window.innerWidth) * 750,
      game: null,
      start: false,
      over: false,
      playing: false,
      walls: [],
      itemPhys: [],
      physicsSystem: null,
    });

    const createWall = (x, y, width, height) => {
      const go = new GameObject("graphics", {
        position: { x: x + width / 2, y: y + height / 2 },
        size: { width, height },
        origin: { x: 0.5, y: 0.5 },
      });
      const graphics = go.addComponent(new Graphics());
      graphics.graphics.beginFill(0x00ff00);
      graphics.graphics.drawRect(0, 0, width, height);

      go.addComponent(
        new Physics({
          type: PhysicsType.RECTANGLE,
          bodyOptions: {
            isStatic: true, // Whether the object is still, any force acting on the object in a static state will not produce any effect
            restitution: 0.1,
            frictionAir: 0,
            friction: 0,
            frictionStatic: 0,
            force: {
              x: 0,
              y: 0,
            },
          },
          stopRotation: true, // default false, usually do not need to be set
        })
      );
      state.game.scene.addChild(go);

      return {
        drawColor(color) {
          graphics.graphics.beginFill(color);
          graphics.graphics.drawRect(0, 0, width, height);
        },
      };
    };

    const updateGravity = (event) => {
      // console.log("alpha:", event.alpha); // X
      // console.log("beta:", event.beta); // Y
      // console.log("gamma:", event.gamma); // Z
      var orientation =
          typeof window.orientation !== "undefined" ? window.orientation : 0,
        gravity = state.physicsSystem.engine.engine.world.gravity;

      if (orientation === 0) {
        gravity.x = Matter.Common.clamp(event.gamma, -90, 90) / 2;
        gravity.y = Matter.Common.clamp(event.beta, -90, 90) / 2;
      } else if (orientation === 180) {
        gravity.x = Matter.Common.clamp(event.gamma, -90, 90) / 2;
        gravity.y = Matter.Common.clamp(-event.beta, -90, 90) / 2;
      } else if (orientation === 90) {
        gravity.x = Matter.Common.clamp(event.beta, -90, 90) / 2;
        gravity.y = Matter.Common.clamp(-event.gamma, -90, 90) / 2;
      } else if (orientation === -90) {
        gravity.x = Matter.Common.clamp(-event.beta, -90, 90) / 2;
        gravity.y = Matter.Common.clamp(event.gamma, -90, 90) / 2;
      }
    };

    const show = () => {
      resource.addResource(sources);

      state.physicsSystem = new PhysicsSystem({
        resolution: window.devicePixelRatio / 2,
        isTest: true, // Whether to enable debugging mode
        // @ts-ignore
        element: document.querySelector(".debugger"), // Mount point of canvas node in debug mode
        world: {
          // @ts-ignore
          gravity: {
            y: 5, // gravity
          },
        },
      });
      state.game = new Game({
        frameRate: 61, // 兼容Eva自身bug, 帧率必须大于60
        autoStart: true, // 可选
        systems: [
          new RendererSystem({
            // @ts-ignore
            canvas: document.querySelector("#canvas"),
            width: state.sceneWidth,
            height: state.sceneHeight,
            resolution: window.devicePixelRatio / 2,
          }),
          new TilingSpriteSystem(),
          new TransitionSystem(),
          new SpriteAnimationSystem(),
          new RenderSystem(),
          new EventSystem({
            // moveWhenInside: true // 代表只有在元素内部才会执行move事件，默认为false
          }),
          new ImgSystem(),
          new TextSystem(),
          new SpriteSystem(),
          new GraphicsSystem(),
          state.physicsSystem,
        ],
      });

      state.game.scene.addChild(createBackground());

      state.walls = [
        createWall(0, 0, 60, state.sceneHeight),
        createWall(750 - 60, 0, 60, state.sceneHeight),
        createWall(0, state.sceneHeight - 60, 750, 60),
        createWall(0, 0, 750, 60),
      ];

      const randomX = Math.random() * state.sceneWidth;
      const { role } = createRole({ x: randomX, y: 600 });
      state.game.scene.addChild(role);
      window.game = state.game;
      window.game.playing = false;

      setTimeout(() => {
        console.log(222);
        window.addEventListener("deviceorientation", updateGravity, false);
      }, 3000);
    };

    onMounted(() => {
      show();
    });

    return {
      ...toRefs(state),
    };
  },
});
</script>

<style lang="scss">
@import "./style/common";
</style>
