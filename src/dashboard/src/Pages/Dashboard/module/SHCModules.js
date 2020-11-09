import React, {useEffect, useState} from 'react';
import useStyle from "../styles";
import {setRooms, useDashboardDispatch, useDashboardState} from "../../../context/DashboardContext";
import {addLog, useLogDispatch} from "../../../context/LogContext";
import {getHouseList, patchHouse} from "../../../Api/api_houses";
import {toast} from "react-toastify";
import {getDoors, patchDoor, patchRoom} from "../../../Api/api_rooms";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import Button from "@material-ui/core/Button";
import Switch from "@material-ui/core/Switch/Switch";
import Grid from "@material-ui/core/Grid";
import {Typography} from "@material-ui/core";

const SHCModule = ({rooms, setCoreChanges}) => {


  const classes = useStyle();
  const dashboardDispatch = useDashboardDispatch();
  const logDispatch = useLogDispatch();
  const [selectedRoom, setSelectedRoom] = useState();
  const [selectedRoomDoors, setSelectedRoomDoors] = useState([]);
  const {activeAgentDetail, activeAgent} = useDashboardState();
  const [autoMode, setAutoMode] = useState();

  useEffect(() => {
    getHouseList(localStorage.userId).then(houses => {
      const house = houses.find(item => localStorage.houseId === item.id);
      console.log("house", house);
      if (house)
        setAutoMode(house.autoMode);
    }).catch(err => {
      toast.error(err);
    })
  }, []);

  const handleAutoModeChange = (newValue) => {
    getHouseList(localStorage.userId).then(houses => {
      const index = houses.findIndex(item => localStorage.houseId === item.id);
      const house = houses[index];
      const newHouse = {
        ...house,
        autoMode: newValue,
      };
      patchHouse(localStorage.houseId, newHouse);
      setAutoMode(newValue);
      addLog(logDispatch, `${newValue ? "activated" : "deactivated"} auto mode `, activeAgent === localStorage.getItem("username") ? activeAgent : activeAgentDetail.agentname);
    }).catch(err => {
      toast.error(err);
    })
    setCoreChanges(true);
  }

  useEffect(() => {
    const index = rooms.findIndex(item => item.id === selectedRoom?.id);
    if (index !== -1)
      setRooms(dashboardDispatch, [...rooms.slice(0, index), selectedRoom, ...rooms.slice(index + 1)])
  }, [selectedRoom]);

  useEffect(() => {
    if (selectedRoom && selectedRoom.id) {
      setSelectedRoomDoors([]);
      getDoors(selectedRoom.id).then(doors => {
        setSelectedRoomDoors(doors);
      }).catch(err => {
        toast.error(err);
      })
    }
  }, [selectedRoom?.id]);

  const LightButton = ({item, index}) => {

    const onButtonClick = (key) => {
      if (key === item)
        return;
      const room = {
        ...selectedRoom,
        lights: [...selectedRoom.lights.slice(0, index), {
          ...selectedRoom.lights[index],
          lightIsOn: key === "on"
        }, ...selectedRoom.lights.slice(index + 1)]
      };
      patchRoom(selectedRoom.id, room).then(res => {
        setSelectedRoom(selectedRoom => ({...room}));
        addLog(logDispatch, `set state of ${selectedRoom.lights[index].name} of ${selectedRoom.name} to ${key}`, activeAgentDetail?.agentname || activeAgent);
      }).catch(err => {
        toast.error(err)
      });
    };

    return <ButtonGroup size={'small'} color="secondary" aria-label="outlined primary button group">
      <Button variant={'on' === item && "contained"} onClick={() => onButtonClick("on")}>On</Button>
      {/*<Button variant={"auto" === item && "contained"} onClick={() => onButtonClick("auto")}>Auto Mode</Button>*/}
      <Button variant={'off' === item && "contained"} onClick={() => onButtonClick("off")}>Off</Button>
    </ButtonGroup>
  };

  const changeCheckWindow = (index, check) => {
    const room = {
      ...selectedRoom,
      windows: [...selectedRoom.windows.slice(0, index), {
        ...selectedRoom.windows[index],
        windowIsLocked: !check,
        windowIsOpen: check
      }, ...selectedRoom.windows.slice(index + 1)]
    };
    patchRoom(selectedRoom.id, room).then(res => {
      setSelectedRoom(selectedRoom => ({...room}));
      addLog(logDispatch, `set state of Window #${index + 1} of ${selectedRoom.name} to ${check ? "On" : "Off"}`, activeAgentDetail?.agentname || activeAgent);
    }).catch(err => {
      toast.error(err)
    });
    setCoreChanges(true);
  };
  const changeCheckDoor = (index, check) => {
    const currentDoor = selectedRoomDoors[index];
    const doors = [...selectedRoomDoors.slice(0, index), {
      ...currentDoor,
      doorIsLocked: !check,
    }, ...selectedRoomDoors.slice(index + 1)];
    patchDoor(selectedRoomDoors[index].id, doors[index]).then(res => {
      setSelectedRoomDoors(lastDoors => ([...doors]));
      addLog(logDispatch, `${check ? "opened" : "closed"}  ${currentDoor.fromRoom} Door to ${currentDoor.toRoom}`, activeAgentDetail?.agentname || activeAgent);
    }).catch(err => {
      toast.error(err)
    });
    setCoreChanges(true);

  };

  return <>
    <div className={classes.moduleBox}>
      <div className={classes.moduleBoxHeader}>Rooms</div>
      <ul>
        {rooms.map(item =>
          <li onClick={() => setSelectedRoom(item)}
              className={selectedRoom?.id === item.id && "activeRoom"}>{item.name}</li>
        )}
      </ul>
    </div>
    <div className={classes.roomDetailParent}>
      <div className={classes.otherModuleBox}>
        <div className={classes.moduleBoxHeader}>Doors</div>
        <ul>
          {selectedRoomDoors.map((item, index) =>
            <li>{"to : " + (selectedRoomDoors[index]?.toRoom === selectedRoom.name ? selectedRoomDoors[index]?.fromRoom : selectedRoomDoors[index]?.toRoom)}
              <Switch
                checked={!selectedRoomDoors[index]?.doorIsLocked}
                onChange={({target}) => changeCheckDoor(index, target.checked)}/></li>)}
        </ul>
      </div>
      <div className={classes.otherModuleBox}>
        <div className={classes.moduleBoxHeader}>Windows</div>
        <ul>
          {selectedRoom?.windows.map((item, index) => <li>{"Window " + (index + 1)}<Switch checked={item.windowIsOpen}
                                                                                           onChange={({target}) => changeCheckWindow(index, target.checked)}/>
          </li>)}
        </ul>
      </div>
      <div className={classes.otherModuleBox}>
        <div className={classes.moduleBoxHeader}>Lights</div>
        <ul>
          {selectedRoom?.lights.map((item, index) =>
            <li>{item.name} <LightButton item={item.lightIsOn ? "on" : "off"} index={index}/></li>)}
        </ul>
      </div>
      <div className={classes.shpBoxes}>
        <div className={classes.moduleBoxHeader}>House Lights Auto Mode</div>
        <div className={classes.moduleBoxBody}>
          <Grid container>
            <Typography>Enable Auto Mode</Typography>
            <ButtonGroup size={'small'} color="secondary" aria-label="outlined primary button group">
              <Button variant={autoMode && "contained"} onClick={() => handleAutoModeChange(true)}>On</Button>
              <Button variant={!autoMode && "contained"} onClick={() => handleAutoModeChange(false)}>Off</Button>
            </ButtonGroup>
          </Grid>
        </div>
      </div>
    </div>
  </>
}

export default SHCModule;