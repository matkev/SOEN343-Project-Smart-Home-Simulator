import {getAxiosInstance} from "./api";
// import {cacheApi, getCachedApi} from "./api_room";

export const getAgentList = () => {
  return new Promise((resolve, reject) => {
    // const cachedData = getCachedApi("getAgentList");
    // if (cachedData)
    //   resolve(cachedData);
    getAxiosInstance().get("/agents").then(res => {
      // cacheApi(res.data, "getAgentList");
      resolve(res.data);
    }).catch(err => reject(err));
  })
};
export const createNewAgent = (agent) => {
  return new Promise((resolve, reject) => {
    getAxiosInstance().post("/agents", agent).then(res => {
      resolve(res.data);
    }).catch(err => reject(err));
  })
};
export const deleteAgent = (agentId) => {
  return new Promise((resolve, reject) => {
    getAxiosInstance().delete(`/agents/${agentId}`).then(res => {
      resolve();
    }).catch(err => reject(err));
  })
};
export const patchAgent = (agentId, agent) => {
  return new Promise((resolve, reject) => {
    getAxiosInstance().patch(`/agents/${agentId}`, agent).then(res => {
      resolve();
    }).catch(err => reject(err));
  })
};
