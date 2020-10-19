import axios from 'axios';

export const BASE_URL = "http://localhost:7000";
export const getAxiosInstance = () => {
  return axios.create({
    baseURL: BASE_URL
  })
};
