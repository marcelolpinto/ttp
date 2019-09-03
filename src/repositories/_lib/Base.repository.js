import axios from "axios";
import { toast } from "react-toastify";

const ROOT_URL = 'http://localhost:3001/api/v1';

export class BaseRepository {

	async get(endpoint) {
		return await this.resolvePromise(axios.get(`${ROOT_URL}${endpoint}`));
  }
  
	async post(endpoint, body) {
		return await this.resolvePromise(axios.post(`${ROOT_URL}${endpoint}`, body));
	}

	async put(endpoint, body) {
		return await this.resolvePromise(axios.put(`${ROOT_URL}${endpoint}`, body));
	}

	async delete(endpoint) {
		return await this.resolvePromise(axios.delete(`${ROOT_URL}${endpoint}`));
	}

	async resolvePromise(promise) {
    let data;
		let err;
    
		try {
      const result = await promise;
      if(result.data.success) data = result.data.data;
      
			else if(result.data) err = result.data.msg;
			
			else err = { code: 502, msg: "Unkown error." };
		
		} catch({ response }) {
      err = response.data.err || response.data;
      if(err.toast) toast(err.msg);
		}

		return { err, data };
	}
}