import {getAxiosInstance} from "./api";

// export const cacheApi = (data, type) => {
//   localStorage.setItem("cache:" + type, JSON.stringify(data));
// };
//
// export const getCachedApi = (type) => {
//   return JSON.parse(localStorage.getItem("cache:" + type));
// };

export const getRoomList = (houseId) => {
  return new Promise((resolve, reject) => {
    // const cachedData = getCachedApi("getRoomList");
    // if (cachedData)
    //   resolve(cachedData);
    getAxiosInstance().get(`/rooms?house_id=${houseId}`).then(res => {
      // cacheApi(res.data,"getRoomList");
      resolve(res.data);
    }).catch(err => reject(err));
  })
};


export const deleteRoom = (roomId) => {
  return new Promise((resolve, reject) => {
    getAxiosInstance().delete(`/rooms/${roomId}`).then(res => {
      resolve();
    }).catch(err => reject(err));
  })
};
