import {getAxiosInstance} from "./api";


export const getRoomList = (houseId) => {
  return new Promise((resolve, reject) => {
    getAxiosInstance().get(`/rooms?house_id=${houseId}`).then(res => {
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
