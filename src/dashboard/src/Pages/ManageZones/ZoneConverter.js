import {getZoneList} from "../../Api/api_zones";

function getListOfAdaptedZones(rooms){
  const convertedZones = getZoneList(localStorage.getItem("houseId")).then((dbZones)=>{
    return adaptZones(dbZones, rooms);
  });
  return convertedZones;
  //from zone: {id, house_id, name, periods{id, startTime, temperatureSetting}}
  // to  zone: {id, name, morning, day, night, rooms:[ roomId1, roomId2, ...]}
}

function adaptZones(zones, rooms){
  return zones.map((element)=>adaptZone(element, rooms));
  //from zone: {id, house_id, name, periods{id, startTime, temperatureSetting}}
  // to  zone: {id, name, morning, day, night, rooms:[ roomId1, roomId2, ...]}
}

function adaptZone(zone, rooms){
  const roomsOfZone = [];
  rooms.forEach((room)=>{
    if (room.zone_id == zone.id){
      roomsOfZone.push(room.id);
    }
  });
  return {
    id: zone.id, 
    name: zone.name, 
    morning: {
      temp: zone.periods[0]?.temperatureSetting,
      start: zone.periods[0]?.startTime
    },
    day: {
      temp: zone.periods[1]?.temperatureSetting,
      start: zone.periods[1]?.startTime
    },
    night: {
      temp: zone.periods[2]?.temperatureSetting,
      start: zone.periods[2]?.startTime
    },
    rooms: roomsOfZone
  };
  //from zone: {id, house_id, name, periods{id, startTime, temperatureSetting}}
  // to  zone: {id, name, morning, day, night, rooms:[ roomId1, roomId2, ...]}
}

function convertZone(zone){
  const dayPeriods = ["morning", "day", "night"];
  const roomOfZone = zone.rooms;

  function makePeriod({temp, start}){
    return {
      startTime: start,
      temperatureSetting: temp
    }
  }
  const periods = dayPeriods.map((p)=>makePeriod(zone[p]));
  const convertedZone = {
    id: zone.id,
    name: zone.name,
    house_id: localStorage.getItem("houseId"),
    periods: periods
  }

  return {
    zone: convertedZone,
    rooms: roomOfZone
  }
  //from zone: {id, name, morning, day, night, rooms:[ roomId1, roomId2, ...]}
  // to  {zone: {id, house_id, name, [periods{id, startTime, temperatureSetting}]},
  //      rooms: [roomId1, roomId2, ...]}.
}

export {
  getListOfAdaptedZones,
  adaptZones,
  adaptZone,
  convertZone
};