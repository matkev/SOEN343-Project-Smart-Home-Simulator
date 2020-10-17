import {getAxiosInstance} from "./api";

export const getHouseList = () => {
  return new Promise((resolve, reject) => {
    getAxiosInstance().get("/houses").then(res => {
      resolve(res.data);
    }).catch(err => reject(err));
  })
};


