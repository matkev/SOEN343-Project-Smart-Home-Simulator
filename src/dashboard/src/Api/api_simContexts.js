import {getAxiosInstance} from "./api";

export const getSimContextList = () => {
  return new Promise((resolve, reject) => {
    getAxiosInstance().get("/simContexts").then(res => {
      resolve(res.data);
    }).catch(err => reject(err));
  })
};
export const createNewSimContext = (simContext) => {
  console.log("Hello");
  return new Promise((resolve, reject) => {
    getAxiosInstance().post("/simContexts", simContext).then(res => {
      resolve(res.data);
    }).catch(err => reject(err));
  })
};
export const deleteSimContext = (simContextId) => {
  return new Promise((resolve, reject) => {
    getAxiosInstance().delete(`/simContexts/${simContextId}`).then(res => {
      resolve();
    }).catch(err => reject(err));
  })
};
export const patchSimContext = (simContextId, simContext) => {
  return new Promise((resolve, reject) => {
    getAxiosInstance().patch(`/simContexts/${simContextId}`, simContext).then(res => {
      resolve();
    }).catch(err => reject(err));
  })
};
