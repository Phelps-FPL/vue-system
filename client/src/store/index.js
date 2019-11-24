import Vue from 'vue'
import Vuex from 'vuex'
import { startSession } from 'mongoose';

Vue.use(Vuex)
const types = {
  //判断用户的token类型是否存在
  SET_AUTHENTICATED:'SET_AUTHENTICATED',
  SET_USER: 'SET_USER'
};
const state = {
  //默认为false
  isAuthenticated:false,
  user:{}
};
const getters = {
  isAuthenticated: state => state.isAuthenticated,
  user: state => state.user
}
const mutations = {
  //更改state状态
  [types.SET_AUTHENTICATED](state, isAuthenticated){
    if(isAuthenticated)state.isAuthenticated = isAuthenticated;
    else state.isAuthenticated = false;
  },
  [types.SET_USER](state,user){
    if(user) state.user = user;
    else state.user = {};
  }
}
const actions = {
  setAuthenticated: ({commit},isAuthenticated)=>{
    commit(types.SET_AUTHENTICATED, isAuthenticated);
  },
  setUser:({commit}, user)=>{
    commit(types.SET_USER,user);
  },
  clearCurrentState:({commit})=>{
    commit(types.SET_AUTHENTICATED,false);
    commit(types.SET_USER,null);
  }
}
export default new Vuex.Store({
  state,
  getters,
  mutations,
  actions,
  
})
