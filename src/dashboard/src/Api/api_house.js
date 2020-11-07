import {getAxiosInstance} from "./api";
// import {getCachedApi,cacheApi} from "./api_room";

export const getHouseList = () => {
  return new Promise((resolve, reject) => {
    // const cachedData = getCachedApi("getHouseList");
    // if (cachedData)
    //   resolve(cachedData);
    getAxiosInstance().get("/houses").then(res => {
      // cacheApi(res.data,"getHouseList");
      resolve(res.data);
    }).catch(err => reject(err));
  })
};


