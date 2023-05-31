
import { useStore } from "vuex";
import { healthInfoIndex } from "@/api/resource";

export interface UserState {
    healthInfo: any;
  }
  export interface GameState {
    gameId: any;
  }
  export interface HealthImgStage {
    img: any;
  }
  export default {
    state: {
        healthInfo: {},
        gameId:'',
        img:''
    },
    mutations: {
      setHealthInfo(state: UserState, data: string) {
        state.healthInfo = data;
      },
      setGameId(state: GameState, data: string) {
        state.gameId = data;
      },
      setHealthImg(state: HealthImgStage, data: string) {
        state.img = data;
      },
    },
    actions:{
      async getHealthInfo({commit}){
        let res = await healthInfoIndex();
        if (res) {
          console.log(res,'ssssssssssss')
          commit("setHealthInfo", res);
        }
      }
    }
  };
  