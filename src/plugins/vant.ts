import { Lazyload,Swipe, SwipeItem } from 'vant';
import type { App } from 'vue';
import '@vant/touch-emulator';
import 'vant/lib/index.css';

export const setupVant = (app: App) => {
  app.use(Lazyload);
  app.use(Swipe);
  app.use(SwipeItem);

};
