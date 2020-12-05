import React, {useEffect, useRef, useState} from 'react';
import useStyle from "../styles";
import {setRooms, useDashboardDispatch, useDashboardState} from "../../../context/DashboardContext";
import {setZones, setWinterTemperature, setSummerTemperature, useSHHDispatch, useSHHState} from "../../../context/SHHContext";
import {useSHPDispatch, useSHPState} from "../../../context/SHPContext";
import {addLog, useLogDispatch} from "../../../context/LogContext";
import {patchRoom} from "../../../Api/api_rooms";
import {toast} from "react-toastify";
import ValueController from "../sidebar/ValueController";
import {getZoneList, patchZone} from "../../../Api/api_zones";
import classNames from 'classnames';

const SHHModule = ({setCoreChanges}) => {

  const classes = useStyle();
  const dashboardDispatch = useDashboardDispatch();
  const shhDispatch = useSHHDispatch();
  const shhState = useSHHState();
  const shpState = useSHPState();
  const logDispatch = useLogDispatch();
  const dashboardState = useDashboardState();
  const {rooms, activeAgentDetail, activeAgent} = dashboardState;
  
  const [selectedZone, setSelectedZone] = useState();
  const selectedZoneRef = useRef();

  const [isTemperatureOverridden, setIsTemperatureOverridden] = useState([]);

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
    if (shhState.zones.length === 0){
      getListofZonesAdapter().then((data)=> {
        setZones(shhDispatch, data);
      }).catch(err => {
        toast.error(err.message);
      });
    }

    //update database of last selected zone when SHH Module is removed from the DOM.
    return function cleanup(){
      if (selectedZoneRef.current !== undefined){
        updateDBZones(selectedZoneRef.current);
        updateDBRooms(selectedZoneRef.current.rooms);
      }
    }
  }, []);// only run on mount and unmount


  //update database of previous selected zone when new zone is selected.
  useEffect(()=>{
    updateDBZones(prevSelectedZone);

    //update saved temperature per room of zone.
    if (prevSelectedZone !== undefined){
      updateDBRooms(prevSelectedZone.rooms);
    }
    
    //update ref
    selectedZoneRef.current = selectedZone;

    //update show which temperatures are overridden
    if (selectedZone !== undefined){
      const initIsOveridden = [];
      selectedZone.rooms.forEach((item, index) => {
        const room = rooms.find(el => el.id==item);
        initIsOveridden[index] = room.overridden_temperature!==null
      });
      setIsTemperatureOverridden(initIsOveridden);
    }
  }, [selectedZone]);

  const updateDBZones = (newZone) => {
    getListofZonesAdapter().then((zonesEl) => {
      const oldZone = zonesEl.find(element => element.id == newZone.id);
      patchZone(newZone.id, {...oldZone, ...convertZoneAdapter(newZone)}).catch(err => {
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

  //since the format of the zone isn't determined yet, this function acts like an adapter.
  //to be used when getting zones from the DB.
  function getListofZonesAdapter(){
    return getZoneList();
    //from zone: ??
    // to  zone: {id, name, morning, day, night, rooms:[ roomId1, roomId2, ...]}
  }
  //since the format of the zone isn't determined yet, this function acts like an adpater
  //to be used when patching/creating a zone for the DB.
  function convertZoneAdapter(zone){
    return zone;
    //from zone: {id, name, morning, day, night, rooms:[ roomId1, roomId2, ...]}
    // to  zone: ??
  }

  return <>
    <div className={classes.moduleBox}>
      <div className={classes.moduleBoxHeader}>Zones</div>
      <ul>
        {shhState.zones?.map(item =>
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
                onValueChangeCommitted = {(e, v)=> {
                  setSummerTemperature(shhDispatch, v);
                  addLog(logDispatch, `Default Summer target temperature set to ${v}°C. `);
                }} 
              />
            </li>
            <li>
              {"Winter : " }
              <ValueController 
                slider={false}
                min={-50}
                max={50}
                value={shhState.wintertemperature} 
                onValueChangeCommitted = {(e, v)=> {
                  setWinterTemperature(shhDispatch, v);
                  addLog(logDispatch, `Default Winter target temperature set to ${v}°C. `);
                }} 
              />
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
                onValueChangeCommitted = {(e, v)=> {
                  selectedZone[dayPeriod] = v;
                  addLog(logDispatch, `Target temperature of zone ${selectedZone.name} during ${dayPeriod} is set to ${v}°C. `);
                }} 
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
                    value={
                      (room.overridden_temperature==null)
                      ? "" 
                      : room.overridden_temperature
                    } 
                    onValueChangeCommitted = {(e, v)=> {
                      room.overridden_temperature = v==="" ? null : v;
                      overrideTemperature(index, room.overridden_temperature!==null);
                      const msg = 
                        (room.overridden_temperature==null)
                        ? `Disable override of temperature in room ${room.name}. `
                        : `Override temperature of room ${room.name} to ${v}°C. `;
                      addLog(logDispatch, msg);
                    }} 
                  />
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  </>
}

export default SHHModule;