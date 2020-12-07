import {getAxiosInstance} from "./api";


export const getZoneList = (houseId) => {
  return new Promise((resolve, reject) => {
    
    getAxiosInstance().get(`/zones?house_id=${houseId}`).then(res => {
      resolve(res.data);
    }).catch(err => reject("(getZoneList): " + err));
  })
};
export const createNewZone = (agent) => {
  return new Promise((resolve, reject) => {
    getAxiosInstance().post("/zones", agent).then(res => {
      resolve(res.data);
    }).catch(err => reject("(createNewZone): " + err));
  })
};
export const deleteZone = (agentId) => {
  return new Promise((resolve, reject) => {
    getAxiosInstance().delete(`/zones/${agentId}`).then(res => {
      resolve();
    }).catch(err => reject("(deleteZone): " + err));
  })
};
export const patchZone = (agentId, agent) => {
  return new Promise((resolve, reject) => {
    getAxiosInstance().patch(`/zones/${agentId}`, agent).then(res => {
      resolve();
    }).catch(err => reject("(patchZone): " + err));
  })
};
