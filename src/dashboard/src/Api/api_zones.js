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


    morning : 12,
    day : 17,
    night : 25,
    id: "1234abcd"
  },
  {
    name : "someRoomsA",
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

    
    morning : 10,
    day : 15,
    night : 20,
    id: "abcdef1234"
  }
];

export const getZoneList = () => {
  return new Promise((resolve, reject) => {
    {
      const zone = [{},{}];
      zone[0].name = sampleZoneList[0].name;
      zone[0].morning = sampleZoneList[0].morning;
      zone[0].day = sampleZoneList[0].day;
      zone[0].night = sampleZoneList[0].night;
      zone[0].id = sampleZoneList[0].id;
      zone[1].name = sampleZoneList[1].name;
      zone[1].morning = sampleZoneList[1].morning;
      zone[1].day = sampleZoneList[1].day;
      zone[1].night = sampleZoneList[1].night;
      zone[1].id = sampleZoneList[1].id;
      resolve(zone);
    }

    getAxiosInstance().get(`/zones`).then(res => {
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
