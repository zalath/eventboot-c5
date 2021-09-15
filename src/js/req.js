import axios from 'axios';
import ROAST_CONFIG from '../assets/config.js';
import qs from 'qs';
export default {
  get: function(url) {
    return axios.get(ROAST_CONFIG.API_URL + url);
  },
  post: function(url, data) {
    return axios.post(ROAST_CONFIG.API_URL + url, qs.stringify(data), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });
  }
};
