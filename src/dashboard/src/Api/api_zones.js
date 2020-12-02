import {getAxiosInstance} from "./api";

const sampleZoneList = [
  {
    name : "someRooms",
    rooms : [],
    minDeg : {
      morning : 10,
      day : 15,
      night : 20
    },
    maxDeg: {
      morning : 12,
      day : 17,
      night : 25
    },
  }
];

export const getZoneList = () => {
  return new Promise((resolve, reject) => {
    resolve(sampleZoneList);
    getAxiosInstance().get(`/zones`).then(res => {
      resolve(res.data);
    }).catch(err => reject(err));
  })
};
export const createNewZone = (agent) => {
  return new Promise((resolve, reject) => {
    getAxiosInstance().post("/zones", agent).then(res => {
      resolve(res.data);
    }).catch(err => reject(err));
  })
};
export const deleteZone = (agentId) => {
  return new Promise((resolve, reject) => {
    getAxiosInstance().delete(`/zones/${agentId}`).then(res => {
      resolve();
    }).catch(err => reject(err));
  })
};
export const patchZone = (agentId, agent) => {
  return new Promise((resolve, reject) => {
    getAxiosInstance().patch(`/zones/${agentId}`, agent).then(res => {
      resolve();
    }).catch(err => reject(err));
  })
};
