
import { useStore } from "vuex";
import { healthInfoIndex } from "@/api/resource";

export interface UserState {
    healthInfo: any;
  }
  export interface GameState {
    gameInfo: any;
  }
  export interface HealthImgStage {
    img: any;
  }
  export default {
    state: {
        healthInfo: {},
        gameInfo:{},
        img:''
    },
    mutations: {
      setHealthInfo(state: UserState, data: string) {
        state.healthInfo = data;
      },
      setGameInfo(state: GameState, data: any) {
        state.gameInfo = data;
      },
      setHealthImg(state: HealthImgStage, data: string) {
        state.img = data;
      },
    },
    actions:{
      async getHealthInfo({commit}){
        let res = await healthInfoIndex();
        if (res) {
          commit("setHealthInfo", res);
        }
      }
    }
  };
  