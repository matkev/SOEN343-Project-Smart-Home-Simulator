import {getAxiosInstance} from "./api";

export const getUserList = () => {
  return new Promise((resolve, reject) => {
    getAxiosInstance().get("/users").then(res => {
      resolve(res.data);
    }).catch(err => reject(err));
  })
};
export const createNewUser = (user) => {
  return new Promise((resolve, reject) => {
    getAxiosInstance().post("/users", user).then(res => {
      resolve(res.data);
    }).catch(err => reject(err));
  })
};
export const deleteUser = (userId) => {
  return new Promise((resolve, reject) => {
    getAxiosInstance().delete(`/users/${userId}`).then(res => {
      resolve();
    }).catch(err => reject(err));
  })
};
export const patchUser = (userId, user) => {
  return new Promise((resolve, reject) => {
    getAxiosInstance().patch(`/users/${userId}`, user).then(res => {
      resolve();
    }).catch(err => reject(err));
  })
};
