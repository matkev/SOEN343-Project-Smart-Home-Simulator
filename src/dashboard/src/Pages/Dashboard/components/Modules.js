import React, {useEffect, useState} from 'react';
import useStyle from '../styles'
import Switch from "@material-ui/core/Switch";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import Button from "@material-ui/core/Button";
import {setRooms, useDashboardDispatch, useDashboardState} from "../../../context/DashboardContext";
import {Tab, Tabs} from "@material-ui/core";
import classNames from "classnames";
import {addLog, useLogDispatch} from "../../../context/LogContext";
import {getDoors, patchDoor, patchRoom} from "../../../Api/api_rooms";
import {toast} from "react-toastify";

const makeArr = (size) => {
  const arr = [];
  for (let i = 0; i < size; i++) {
    arr.push(i)
  }
  return arr;
};

const SHCModule = ({rooms}) => {

  const classes = useStyle();
  const dashboardDispatch = useDashboardDispatch();
  const logDispatch = useLogDispatch();
  const [selectedRoom, setSelectedRoom] = useState();
  const [selectedRoomDoors, setSelectedRoomDoors] = useState([]);
  const {activeAgentDetail, activeAgent} = useDashboardState();


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
    console.log(check);
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
    </div>
  </>
}

const Modules = () => {
  const classes = useStyle();
  const [module, setModule] = useState("SHS");
  const {activeAgentDetail, rooms} = useDashboardState();


  useEffect(() => {
    setModule()
  }, [activeAgentDetail]);

  const handleChangeTab = (e, newValue) => {
    setModule(newValue);
  };


  return (
    <div className={classes.modules}>
      <Tabs
        value={module}
        indicatorColor="primary"
        textColor="primary"
        className={classes.tabs}
        onChange={handleChangeTab}
        aria-label="disabled tabs example"
      >

        {(!activeAgentDetail || activeAgentDetail?.accessRights.shsRights) &&
        <Tab label={"SHS"} value={"SHS"} className={classNames(classes.tab, module === "SHS" && classes.tabActive)}/>}
        {(!activeAgentDetail || activeAgentDetail?.accessRights.shcRights) &&
        <Tab label={"SHC"} value={"SHC"} className={classNames(classes.tab, module === "SHC" && classes.tabActive)}/>}
        {(!activeAgentDetail || activeAgentDetail?.accessRights.shpRights) &&
        <Tab label={"SHP"} value={"SHP"} className={classNames(classes.tab, module === "SHP" && classes.tabActive)}/>}
        {(!activeAgentDetail || activeAgentDetail?.accessRights.shhRights) &&
        <Tab label={"SHH"} value={"SHH"} className={classNames(classes.tab, module === "SHH" && classes.tabActive)}/>}
      </Tabs>
      <div className={classes.moduleContent}>
        {module === "SHS" ? <p>to be updated...</p> :
          <SHCModule rooms={rooms}/>}
      </div>
    </div>
  );
};

export default Modules;