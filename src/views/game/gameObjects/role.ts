import { GameObject } from "@eva/eva.js";
import { Img } from "@eva/plugin-renderer-img";
import { SpriteAnimation } from "@eva/plugin-renderer-sprite-animation";
import { Physics, PhysicsType } from "@eva/plugin-matterjs";

export default function createRole(position: any) {
  const role = new GameObject("role", {
    size: { width: 100, height: 100 },
    origin: { x: 0.5, y: 0.5 },
    position,
    scale: {
      x: -1,
      y: 1,
    },
  });

  role.addComponent(
    new SpriteAnimation({
      resource: "bird",
      speed: 500,
    })
  );

  const physics = role.addComponent(
    new Physics({
      type: PhysicsType.RECTANGLE,
      bodyOptions: {
        isStatic: false,
        // restitution: 0,
        frictionAir: 0.1,
        friction: 0.1,
        frictionStatic: 0.5,
        force: {
          x: 0,
          y: 0,
        },
      },
      stopRotation: false,
    })
  );

  return { role, physics };
}
