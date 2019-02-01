import *as types from './mutation-types'

export const mutations = {
   [types.GET_ADS_DATA] (state,data) {
	   state.adsdata = data
   },
   [types.ADD_SAVE] (state,mid) {
		let addsave = state.adsdata.find(element => element.id === mid)
		if(!addsave.isSaved){
		   addsave.isSaved = true		
			state.addsave.push(addsave)
		}else{
			alert("亲,您已经搜藏过了！")
		}
	}
}

export default mutations