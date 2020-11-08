import {getAxiosInstance} from "./api";

export const getHouseList = (userId) => {
  return new Promise((resolve, reject) => {
    getAxiosInstance().get(`/houses?user_id=${userId}`).then(res => {
      resolve(res.data);
    }).catch(err => reject(err));
  })
};
export const patchHouse = (houseId, house) => {
  return new Promise((resolve, reject) => {
    getAxiosInstance().patch(`/houses/${houseId}`, house).then(res => {
      resolve();
    }).catch(err => reject(err));
  })
};
export const deleteHouse = (houseId) => {
  return new Promise((resolve, reject) => {
    getAxiosInstance().delete(`/houses/${houseId}`).then(res => {
      resolve();
    }).catch(err => reject(err));
  })
};


