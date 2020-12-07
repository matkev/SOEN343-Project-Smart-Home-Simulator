import useStyle from '../styles'
import Typography from "@material-ui/core/Typography";
import Canvas from './Canvas'

import React, {useEffect, useState} from 'react';
import FormControl from "@material-ui/core/FormControl";
import MenuItem from "@material-ui/core/MenuItem";
import InputLabel from "@material-ui/core/InputLabel/InputLabel";
import Select from "@material-ui/core/Select/Select";
import classNames from "classnames";
import {getDoors, getRoomList} from "../../../Api/api_rooms";
import {toast} from "react-toastify";
import {useDashboardState} from "../../../context/DashboardContext";
import {useClockState} from "../../../context/ClockContext";
import Grid from "@material-ui/core/Grid";

const draw = (ctx, width, height, offset, room) => {
  ctx.strokeStyle = "#000000";
  ctx.beginPath();
  ctx.moveTo(offset, offset);
  ctx.lineTo(width-offset, offset);
  ctx.stroke();
  ctx.lineTo(width-offset, height-offset);
  ctx.stroke();
  ctx.lineTo(offset, height-offset);
  ctx.stroke();
  ctx.lineTo(offset, offset);
  ctx.stroke();
  ctx.font = "20px Arial";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(room, width/2, height/2);
}


const Preview = ({coreChanges, setCoreChanges}) => {
  const classes = useStyle();
  const width = 300;
  const height = 200;
  const offset = 10;

  const {activeAgentLoc, rooms} = useDashboardState();
  const [activeRoom, setActiveRoom] = useState(localStorage.getItem("activeRoom") === "undefined" ? "undefined" : localStorage.getItem("activeRoom"));
  const [canvasRoom, setCanvasRoom] = useState("None");
  const [roomDoors, setRoomDoors] = useState([]);

  //keeps the preview updated to simulation ticks.
  const clockState = useClockState();


  useEffect(() => {
    getRoomList(localStorage.houseId).then(
      getDoors(activeRoom).then(doors => {
        setRoomDoors(doors);
      }).catch(err => {
        toast.error(err);
      })
    );
  }, [activeRoom]);

  useEffect(() => {
    getRoomList(localStorage.houseId).then(
      getDoors(activeRoom).then(doors => {
        setRoomDoors(doors);
      }).catch(err => {
        toast.error(err);
      })
    );
    setCoreChanges(false);
  }, [coreChanges]);

  useEffect(() => {
    if (activeAgentLoc === "None") {
      setActiveRoom(undefined);
      setCanvasRoom("None");
    } else if (activeAgentLoc !== "" && activeAgentLoc !== undefined) {
      setActiveRoom(rooms.filter(item => item.name === activeAgentLoc)[0].id);
      setCanvasRoom(activeAgentLoc);
    }
  }, [activeAgentLoc]);

  const handleChangeActiveRoom = (e) => {
    localStorage.setItem("activeRoom", e.target.value);
    setActiveRoom(e.target.value);
    if (e.target.value === "") {
      setCanvasRoom("None");
    } else {
      setCanvasRoom(rooms.filter(item => item.id === localStorage.getItem("activeRoom"))[0]["name"]);
    }
  };

  return (
    <Grid container direction="column">
      <div className={classes.preview}>
        <Typography className={classes.sidebarTitle}>Preview</Typography>
        <FormControl variant="outlined" className={classNames(classes.formControl, "uni_m_b_small")}>
          <InputLabel id="active-rooms-label">Active Room</InputLabel>
          <Select
            labelId="active-rooms-label"
            id="active-rooms"
            value={activeRoom}
            onChange={handleChangeActiveRoom}
            label="Active Room"
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            {rooms.map && rooms.map(item => <MenuItem value={item.id}>{item.name}</MenuItem>)}
          </Select>
        </FormControl>
        <Canvas draw={draw} width={width} height={height} offset={offset} room={canvasRoom}/>
        <table>
          <tr>
            <td><b>Doors</b></td>
            <td><b>Windows</b></td>
            <td><b>Lights</b></td>
            <td><b>Temperature</b></td>
          </tr>
          <tr valign="top">
            <td>
              {roomDoors.map((item, index) => <div>{"to " + (roomDoors[index]?.toRoom === canvasRoom ? roomDoors[index]?.fromRoom : roomDoors[index]?.toRoom) + ' - ' + (roomDoors[index]?.doorIsLocked? " Locked" : " Unlocked")}</div>)}
            </td>
            <td>
              {rooms[rooms.findIndex(item => item.id === activeRoom)]?.windows.map((item, index) => <div>{"Window " + (index + 1) + ' - ' + (item.windowIsOpen? " Open" : " Closed")}</div>)}
            </td>
            <td>
              {rooms[rooms.findIndex(item => item.id === activeRoom)]?.lights.map((item, index) => <div>{"Light " + (index + 1) + ' - ' + (item.lightIsOn? " On" : " Off")}</div>)}
            </td>
            <td>
              {rooms.find(item => item.id === activeRoom)?.havc_temp + "°C " + ((rooms.find(item => item.id === activeRoom)?.overridden_temperature??null!==null)? "(override)":"")}
              </td>
          </tr>
        </table>
      </div>
    </Grid>
  );
};

export default Preview;
