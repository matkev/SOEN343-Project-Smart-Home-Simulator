import {getAxiosInstance} from "./api";

export const getAgentList = () => {
  return new Promise((resolve, reject) => {
    getAxiosInstance().get("/agents").then(res => {
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
