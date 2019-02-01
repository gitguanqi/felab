import originJsonp from 'jsonp'

export function jsonp (url,data,options) {
	url += (url.includes('?') ? '&' : '?') + params(data)
	//console.log(url)
	return new Promise((resolve,reject) => {
		originJsonp(url,options,(err,res) => {
			if(!err) {
				resolve(res)
			}else{
				reject(err)
			}
		})
	})
}

export function params (data) {
	let url = ''
	for(let key in data){
		url += `&${key}=${data[key]}`
	}
	return url ? url.slice(1) : ''
}
