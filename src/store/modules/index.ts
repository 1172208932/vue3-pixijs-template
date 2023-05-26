export interface UserState {
    healthInfo: any;
  }
  export interface GameState {
    gameId: any;
  }
  export default {
    state: {
        healthInfo: {},
        gameId:''
    },
    mutations: {
      setHealthInfo(state: UserState, data: string) {
        state.healthInfo = data;
      },
      setGameId(state: GameState, data: string) {
        state.gameId = data;
      },
    }
  };
  