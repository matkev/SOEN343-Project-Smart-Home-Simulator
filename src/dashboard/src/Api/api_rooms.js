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


export const patchRoom = (roomId, room) => {
  const tempRoom = {...room};
  //omit havc properties.
  for (const property in tempRoom) {
    if (tempRoom.hasOwnProperty(property)) {
      if (property.startsWith("havc_")){
        delete tempRoom[property];
      }
    }
  }
  return new Promise((resolve, reject) => {
    getAxiosInstance().patch(`/rooms/${roomId}`, tempRoom).then(res => {
      resolve();
    }).catch(err => reject(err));
  })
};
export const getDoors = (roomId) => {
  return new Promise((resolve, reject) => {
    getAxiosInstance().get(`/rooms/getDoors/${roomId}`).then(res => {
      resolve(res.data);
    }).catch(err => reject(err));
  })
};

export const patchDoor = (doorId, door) => {
  return new Promise((resolve, reject) => {
    getAxiosInstance().patch(`/doors/${doorId}`, door).then(res => {
      resolve();
    }).catch(err => reject(err));
  })
};