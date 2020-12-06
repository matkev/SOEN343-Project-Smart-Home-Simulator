import {useEffect, useState} from 'react';
import useStyle from "../styles";
import {useDashboardState} from "../../../context/DashboardContext";
import {setZones, useSHHDispatch, useSHHState} from "../../../context/SHHContext";
import {addLog, useLogDispatch} from "../../../context/LogContext";
import {useClockState} from "../../../context/ClockContext";
import {toast} from "react-toastify";
import {getListOfAdaptedZones} from "../../ManageZones/ZoneConverter";
//import moment from "moment";
import {getZoneList} from "../../../Api/api_zones";
import classNames from 'classnames';

const HAVCSystem = ({setCoreChanges, children}) => {
  const classes = useStyle();
  const shhDispatch = useSHHDispatch();
  const shhState = useSHHState();
  const clockState = useClockState();
  const logDispatch = useLogDispatch();
  const dashboardState = useDashboardState();
  const {rooms, weather} = dashboardState;
  const {zones} = shhState;
  const dayPeriods = ["morning", "day", "night"];

  const [currentDay, setCurrentDay] = useState();
  const [hasInitTemp, setHasInitTemp] = useState(false);
  const [hasInitRoom, setHasInitRoom] = useState(false);
  const [hasInitPeriods, setHasInitPeriods] = useState(false);
  const [hasInitClock, setHasInitClock] = useState(false);

  //power is the temperature the havc can change in a room per second.
  const havcPower = 0.1;
  //temperature margin is the minimum difference of room temperature to target to have the havc affect the room temperature.
  const havcTempMargin = 0.25;
  //cool down is natural rate per second of temperature decrease
  const havcCoolDown = 0.05;

  useEffect(()=>{
    //initialize the list of zones to display.
    if (zones.length === 0){
      getListofZonesAdapter().then((data)=> {
        setZones(shhDispatch, data);
      }).catch(err => {
        toast.error(err.message);
      });
    }
  }, []);// only run on mount and unmount

  //attempt to initialize havc period timings.
  useEffect(()=>{
    if (!hasInitPeriods){
      if (rooms !== undefined && rooms.length > 0 && clockState.start>5){
        initZonePeriods();

        setHasInitPeriods(true);
      }
    }
  }, [zones]);  //when the zones loads.

  //attempt to initialize rooms.
  useEffect(()=>{
    if (!hasInitRoom){
      if (rooms !== undefined && rooms.length > 0 ){
        getListofZonesAdapter().then((data)=> {
          setZones(shhDispatch, data);
        }).catch(err => {
          toast.error(err.message);
        });

        setHasInitRoom(true);
      }
    }
  }, [rooms]);  //when the rooms loads.

  //attempt to initialize room temperatures.
  useEffect(()=>{
    //only initialize temperatures after rooms are loaded.
    if (hasInitRoom && !hasInitTemp){
      if (weather.current !== undefined) {
        initRoomTemperatures();
        setHasInitTemp(true);
      }
    }
  }, [weather, hasInitRoom]);  //when the weather or rooms loads.

  //assume clockState.time updates only every second.
  useEffect(()=>{
    updateRoomTemperatures();
    if (!hasInitPeriods){
      trackZonePeriod();
    }
  }, [clockState.time]);

  //initialize room temperatures if new rooms are added.
  useEffect(()=>{
    //only after the initial temperature initialization.
    if (hasInitTemp){
      initRoomTemperatures();
    }
  }, [JSON.stringify(rooms)]);  //update whenever rooms changes in any manner.

  

  //listen on target temperature updates.
  useEffect(()=>{
    //only update if the temperatures have been initialized.
    if (hasInitTemp){
      updateTargetTemperatures();
    }
  }, [JSON.stringify(shhState.zones), JSON.stringify(rooms), weather.current?.temperature]);  //update whenever the zones or rooms update in any manner, or if the outside temperature changes.

  const initZonePeriods = () => {
    zones.forEach((zone)=>{
      dayPeriods.forEach((dayPeriod, index)=>{
        if (zone[dayPeriod].havc_start === undefined){
          const tempNow = dateNow(new Date(parseInt(zone[dayPeriod].start)));
          zone[dayPeriod].havc_start = tempNow.getTime();

          //define the next period if it isn't already.
          if(zone.havc_nextPeriod === undefined){
            //if the start time is after, then it is the next (start comparing with the smallest).
            if (clockState.time < zone[dayPeriod].havc_start){
              zone.havc_nextPeriod = index;
            }
          }
        }
      });
      //if current time is near end of day (after all start time), then the next is the morning period.
      if(zone.havc_nextPeriod === undefined){
        zone.havc_nextPeriod = 0;
      }
    });
    console.log("zonesPeriods");
    console.log(zones);
  };

  const initRoomTemperatures = () => {
    const tempTemperature = weather.current.temperature;
    //for each room, set the temperature to the outside temperature.
    rooms.forEach((room)=>{
      if (room.havc_temp === undefined){
        room.havc_temp = tempTemperature;
      }
    });
  };

  const trackZonePeriod = () => {
    zones.forEach((zone)=>{
      const nextPeriodDate = zone[dayPeriods[zone.havc_nextPeriod]].havc_start;
      if (clockState.time > nextPeriodDate){
        //enter next period

        //
      }

    });
  };

  //true if second date is greater than the first, false otherwise.
  function compareDate(dateA, dateB){
    const dateANow = dateNow(dateA);
    const dateBNow = dateNow(dateB);

    return dateANow < dateBNow;
  }
  function dateNow(date){
    const clockDate = new Date(clockState.time);
    console.log(clockState.time);
    console.log(clockDate);
    return new Date(new Date(clockState.time).setHours(date.getHours(), date.getMinutes(), date.getSeconds()));
  }

  //iterate for each room. target temp: if room doesn't have override temp, then check if there's a zone that has it.
  //  otherwise, target temp is current wheather temp.
  const updateTargetTemperatures = () => {
    //for each room,
    rooms.forEach((room)=>{
      //if the target temp is specific to room, use that.
      if(room.overridden_temperature != null){
        room.havc_target_temp = room.overridden_temperature;
      }
      else{
        //if it's in a zone, the target temperature is the zone's
        // otherwise, it is the current outside temperature.
        const zoneOfRoom = shhState.zones?.find((zone) => zone.rooms.includes(room.id));
        if (zoneOfRoom !== undefined && zoneOfRoom[dayPeriods[dashboardState.daycycle]].temp !== undefined){
          room.havc_target_temp = zoneOfRoom[dayPeriods[dashboardState.daycycle]].temp;
        }
        else{
          room.havc_target_temp = weather.current?.temperature??0;
        }
      }
    });
  };

  //update each room temperature towards its target if the system is on for that room, or towards the weather's if it's off.
  const updateRoomTemperatures=()=>{
    console.log("ROOMS HAVC: ");
    //iterate on all rooms.
    rooms.forEach((room)=>{
      //determine variation power based on whether the havc system is on for the room.
      let power, target;
      if (room.havc_paused){
        power = havcCoolDown;
        target = weather.current?.temperature ?? 0;
      }
      else{
        power = havcPower;
        target = room.havc_target_temp;
      }

      //check direction to vary temperature. chooses no variation if tempeartures are within margin.
      const direction = directionFromto(room.havc_temp, target, power);

      //no variation, so pause the system for the room.
      if (direction == 0){
        if (!room.havc_paused){
          room.havc_paused = true;
          addLog(logDispatch, `HAVC disabled in room ${room.name}. `);
        }
      }
      //variation
      else{
        //havc affects room temperature.
        room.havc_temp += direction * power;
        //restrict temperature to 2 deciamls (float point).
        room.havc_temp = parseFloat(room.havc_temp.toFixed(2));
      }

      if (room.havc_paused){
        //havc may reactivate if temp difference to target is enough.
        if(Math.abs(room.havc_target_temp-room.havc_temp) >= havcTempMargin){
          room.havc_paused = false;
          addLog(logDispatch, `HAVC reactivated in room ${room.name}. `);
        }
      }

      {//console logging debug.
        const tempRoom = {...room};
        for (const key in tempRoom) {
          if (tempRoom.hasOwnProperty(key)) {
            if (!["id", "name", "havc_temp", "havc_target_temp", "havc_paused"].includes(key)){
              delete tempRoom[key];
            }
          }
        }
        console.log(tempRoom);
      }
    });
  };

  //round the number away from 0. (JS Math.round always rounds up).
  function roundAway(number){
    const sign = Math.sign(number);
    return sign * Math.round(Math.abs(number));
  }

  //get direction between two numbers
  function directionFromto(from, to, precision){
    //calculated power's margin is used to calculate when the temperature is within the target's margin.
    const margin = 0.5/precision;

    const difference = to-from;
    const diff2 = parseFloat((margin*difference).toFixed(2));
    const direction = Math.sign(roundAway(diff2));
    return direction;
  }

  //since the format of the zone isn't determined yet, this function acts like an adapter.
  //to be used when getting zones from the DB.
  function getListofZonesAdapter(){
    return getListOfAdaptedZones(rooms);
    //from zone: {id, house_id, name, periods{id, startTime, temperatureSetting}}
    // to  zone: {id, name, morning, day, night, rooms:[ roomId1, roomId2, ...]}
  }

  return children;
}

export default HAVCSystem;