export interface UserState {
    healthInfo: any;
  }
  
  export default {
    state: {
        healthInfo: {}
    },
    mutations: {
      setHealthInfo(state: UserState, data: string) {
        state.healthInfo = data;
      },
    }
  };
  