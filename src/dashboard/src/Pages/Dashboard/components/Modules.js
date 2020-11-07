import React, {useEffect, useState} from 'react';
import useStyle from '../styles'
import Switch from "@material-ui/core/Switch";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import Button from "@material-ui/core/Button";
import {setRooms, useDashboardDispatch, useDashboardState} from "../../../context/DashboardContext";
import {Tab, Tabs} from "@material-ui/core";
import classNames from "classnames";
import {addLog, useLogDispatch} from "../../../context/LogContext";

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
  const {activeAgentDetail, activeAgent} = useDashboardState();


  useEffect(() => {
    const index = rooms.findIndex(item => item.id === selectedRoom?.id);
    if (index !== -1)
      setRooms(dashboardDispatch, [...rooms.slice(0, index), selectedRoom, ...rooms.slice(index + 1)])
  }, [selectedRoom])


  const LightButton = ({item, index}) => {


    const onButtonClick = (key) => {
      if (key === item)
        return;
      addLog(logDispatch, `set state of light #${index + 1} of ${selectedRoom.name} to ${key}`, activeAgentDetail?.agentname || activeAgent);
      setSelectedRoom(room => ({
        ...room,
        lights: [...room.lights.slice(0, index), key, ...room.lights.slice(index + 1)]
      }))
    };

    return <ButtonGroup size={'small'} color="secondary" aria-label="outlined primary button group">
      <Button variant={'on' === item && "contained"} onClick={() => onButtonClick("on")}>On</Button>
      <Button variant={"auto" === item && "contained"} onClick={() => onButtonClick("auto")}>Auto Mode</Button>
      <Button variant={'off' === item && "contained"} onClick={() => onButtonClick("off")}>Off</Button>
    </ButtonGroup>
  };

  const changeCheckWindow = (index, check) => {
    console.log(check);
    addLog(logDispatch, `set state of Window #${index + 1} of ${selectedRoom.name} to ${check ? "On" : "Off"}`, activeAgentDetail?.agentname || activeAgent);
  };
  const changeCheckDoor = (doorsTo, check) => {
    console.log(check);
    addLog(logDispatch, `${check?"opened":"closed"}  ${selectedRoom.name} Door to ${doorsTo}`, activeAgentDetail?.agentname || activeAgent);
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
          {selectedRoom?.doorsTo.map(item => <li>{"to : " + item} <Switch onChange={({target}) => changeCheckDoor(item, target.checked)}/></li>)}
        </ul>
      </div>
      <div className={classes.otherModuleBox}>
        <div className={classes.moduleBoxHeader}>Windows</div>
        <ul>
          {makeArr(selectedRoom?.windows).map((item, index) => <li>{"Window " + (index + 1)}<Switch
              onChange={({target}) => changeCheckWindow(index, target.checked)}/></li>)}
        </ul>
      </div>
      <div className={classes.otherModuleBox}>
        <div className={classes.moduleBoxHeader}>Lights</div>
        <ul>
          {selectedRoom?.lights.map((item, index) => <li>{"Light " + (index + 1)}<LightButton item={item}
                                                                                              index={index}/></li>)}
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