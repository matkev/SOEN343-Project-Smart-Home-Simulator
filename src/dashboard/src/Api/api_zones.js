import {getAxiosInstance} from "./api";


export const getZoneList = () => {
  return new Promise((resolve, reject) => {
    
    getAxiosInstance().get(`/zones`).then(res => {
      resolve(res.data);
    }).catch(err => reject("(getZoneList): " + err));
  })
};
export const createNewZone = (zone) => {
  return new Promise((resolve, reject) => {
    getAxiosInstance().post("/zones", zone).then(res => {
      resolve(res.data);
    }).catch(err => reject("(createNewZone): " + err));
  })
};
export const deleteZone = (zoneId) => {
  return new Promise((resolve, reject) => {
    getAxiosInstance().delete(`/zones/${zoneId}`).then(res => {
      resolve();
    }).catch(err => reject("(deleteZone): " + err));
  })
};
export const patchZone = (zoneId, zone) => {
  const tempZone = {...zone};
  //omit havc properties.
  for (const property in tempZone) {
    if (tempZone.hasOwnProperty(property)) {
      const element = tempZone[property];
      if (property.startsWith("havc_")){
        delete tempZone[property];
      }
    }
  }
  return new Promise((resolve, reject) => {
    getAxiosInstance().patch(`/zones/${zoneId}`, zone).then(res => {
      resolve();
    }).catch(err => reject("(patchZone): " + err));
  })
};
