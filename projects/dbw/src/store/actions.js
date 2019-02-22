import axios from 'axios'
import *as types from './mutation-types'

const base_url = 'https://gitguanqi.github.io/js/main.json'

export const getAdsData = (context) => {
	axios
	 .get(base_url)
	 .then(res => {
	 	context.commit(types.GET_ADS_DATA,res.data)
	 })
	 .catch(err => {
	 	throw new Error(err)
	 })
}