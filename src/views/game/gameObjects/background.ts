import { GameObject } from '@eva/eva.js';
import { Img } from '@eva/plugin-renderer-img'
export default function createBackground() {
  const bg = new GameObject('bg', {
    size: { width: 720, height: 1280 },
    origin: { x: 0.5, y: 0.5 },
    position: {
      x: 310+15,
      y: 640,
    },
    anchor: {
      x: 0.5,
      y: 1,
    },
  });

  bg.addComponent(
    new Img({
      resource: 'bg',
    })
  );
  return bg;
}
