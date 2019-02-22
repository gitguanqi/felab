import originJsonp from 'jsonp'

export function jsonp (url,data,options) {
	url += params(data)
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
	return data.id
}
