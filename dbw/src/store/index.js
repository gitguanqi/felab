import Vue from 'vue'
import Vuex from 'vuex'
import * as actions from './actions'
import mutations from './mutations'

Vue.use(Vuex)

const store = new Vuex.Store({
	state: {
		adsdata: [],
		addsave: []
	},
	actions,
	mutations
})

export default store