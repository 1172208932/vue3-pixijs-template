import { RESOURCE_TYPE,ResourceBase } from "@eva/eva.js";
const isTextUrl =
  process.env.NODE_ENV === "production"
    ? "https://ohudong.cztv.com/1/264531/static/"
    : "@/../static/";

const sources:ResourceBase[] =  [
  {
    name: "bg",
    type: RESOURCE_TYPE.IMAGE,
    src: {
      image: {
        type: "png",
        url: `${isTextUrl}bg.png`,
      },
    },
    preload: true,
  },
  {
    name: "bird",
    type: RESOURCE_TYPE.SPRITE_ANIMATION,
    src: {
      image: {
        type: "png",
        url: `${isTextUrl}bird/bird.png`,
      },
      json: {
        type: "json",
        url: `${isTextUrl}bird/bird.json`,
      },
    },
    preload: true,
  },
];
export default sources
