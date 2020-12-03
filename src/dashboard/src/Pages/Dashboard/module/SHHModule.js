import React, {useEffect, useRef, useState} from 'react';
import useStyle from "../styles";
import {setRooms, useDashboardDispatch, useDashboardState} from "../../../context/DashboardContext";
import {setWinterTemperature, setSummerTemperature, useSHHDispatch, useSHHState} from "../../../context/SHHContext";
import {useSHPDispatch, useSHPState} from "../../../context/SHPContext";
import {addLog, useLogDispatch} from "../../../context/LogContext";
import {getDoors, patchDoor, patchRoom} from "../../../Api/api_rooms";
import {toast} from "react-toastify";
import ValueController from "../sidebar/ValueController";
import {getZoneList, patchZone} from "../../../Api/api_zones";
import classNames from 'classnames';

const SHHModule = ({rooms, setCoreChanges}) => {

  const classes = useStyle();
  const dashboardDispatch = useDashboardDispatch();
  const shhDispatch = useSHHDispatch();
  const shhState = useSHHState();
  const shpState = useSHPState();
  const logDispatch = useLogDispatch();
  const dashboardState = useDashboardState();
  const {activeAgentDetail, activeAgent} = dashboardState;

  
  const [selectedZone, setSelectedZone] = useState();
  const selectedZoneRef = useRef();

  const [isTemperatureOverridden, setIsTemperatureOverridden] = useState([]);

  const [zones, setZones] = useState([]);

  const prevSelectedZone = usePrevious(selectedZone); 

  const dayPeriods = ["morning", "day", "night"];

  function usePrevious(value){
    const ref = useRef();
    useEffect(()=>{
      ref.current = value;
    });
    return ref.current;
  }

  useEffect(()=>{
    //initialize the list of zones to display.
    getZoneList().then((data)=> {
      setZones(data);
    }).catch(err => {
      toast.error(err.message);
    });;

    //update database of last selected zone when SHH Module is removed from the DOM.
    return function cleanup(){
      updateDBZones(selectedZoneRef.current);
      updateDBRooms(selectedZoneRef.current.rooms);
    }
  }, []);// only run on mount and unmount

  

  //update database of previous selected zone when new zone is selected.
  useEffect(()=>{
    updateDBZones(prevSelectedZone);

    //update saved temperature per room of zone.
    if (prevSelectedZone){
      updateDBRooms(prevSelectedZone.rooms);
    }
    
    //update ref
    selectedZoneRef.current = selectedZone;

    //update show which temperatures are overridden
    if (selectedZone){
      const initIsOveridden = [];
      selectedZone.rooms.forEach((item, index) => {
        const room = rooms.find(el => el.id==item);
        initIsOveridden[index] = room.overridden_temperature!==null
      });
      setIsTemperatureOverridden(initIsOveridden);
    }
  }, [selectedZone]);

  const updateDBZones = (newZone) => {
    getZoneList().then((zones) => {
      const oldZone = zones.find(element => element.id == newZone.id);
      patchZone(newZone.id, {...oldZone, ...newZone}).catch(err => {
        toast.error(err);
      });;
    }).catch(err => {
      toast.error(err);
    });
  }
  const updateDBRooms = (newRoomsId)=>{
    newRoomsId.forEach(item => {
      const room = rooms.find(el=> el.id==item);
      setDBRoomTemperature(item, room.overridden_temperature);
    });
  }

  const overrideTemperature = (roomIndex, isOverriden) => {
    const newIsTemperatureOverridden = [...isTemperatureOverridden];
    newIsTemperatureOverridden[roomIndex] = isOverriden;
    setIsTemperatureOverridden(newIsTemperatureOverridden);
  }

  const setDBRoomTemperature = (roomId, temperature)=>{
    if (temperature === "") temperature = null;

    const oldRoom = rooms.find(el => el.id == roomId);
    patchRoom(roomId, {...oldRoom, overridden_temperature: temperature}).catch(err => {
      toast.error(err);
    });
  }

  return <>
    <div className={classes.moduleBox}>
      <div className={classes.moduleBoxHeader}>Zones</div>
      <ul>
        {zones.map(item =>
          <li
            key={item.id} 
            onClick={() => setSelectedZone(item)}
            className={selectedZone?.id === item.id ? "activeZone" : ""}>{item.name}</li>
        )}
      </ul>
    </div>
    <div className={classes.zoneDetailParent}>
      <div className={classes.otherModuleBox}>
        <div className={classes.moduleBoxHeader}>Default Summer/Winter Temperatures</div>
        <ul>
            <li>
              {"Summer : "}
              <ValueController 
                slider={false}
                min={-50}
                max={50}
                value={shhState.summertemperature} 
                onValueChangeCommitted = {(e, v)=> setSummerTemperature(shhDispatch, v)} />
            </li>
            <li>
              {"Winter : " }
              <ValueController 
                slider={false}
                min={-50}
                max={50}
                value={shhState.wintertemperature} 
                onValueChangeCommitted = {(e, v)=> setWinterTemperature(shhDispatch, v)} />
            </li>
        </ul>
      </div>
      <div className={classes.otherModuleBox}>
        <div className={classes.moduleBoxHeader}>Zone temperature by day period</div>
        <ul>
          {dayPeriods.map((dayPeriod)=>
          (selectedZone)?(
            <li key={dayPeriod}>
              {dayPeriod + ":"}
              <ValueController 
                slider={false}
                min={-50}
                max={50}
                value={selectedZone[dayPeriod]} 
                onValueChangeCommitted = {(e, v)=> {selectedZone[dayPeriod] = v; console.log(selectedZone)}} 
              />
            </li>
          ): "" )}
        </ul>
      </div>
      <div className={classes.otherModuleBox}>
        <div className={classes.moduleBoxHeader}>Rooms in selected zone, option to override room temperature</div>
        <ul>
          {selectedZone?.rooms.map((item, index) => {
            const room = rooms.find(el => el.id==item); 
            return (
              <li 
                key={item}
                className={classNames({activeOverride: isTemperatureOverridden[index]})}>
                  {room.name} 
                  <ValueController 
                    slider={false}
                    min={-50}
                    max={50}
                    value={room.overridden_temperature} 
                    onValueChangeCommitted = {(e, v)=> {
                      room.overridden_temperature = v==="" ? null : v;
                      overrideTemperature(index, room.overridden_temperature!==null);
                    }} 
                  />
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  </>
}

export default SHHModule;