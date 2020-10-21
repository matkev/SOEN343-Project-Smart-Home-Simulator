// import React from 'react';
import useStyle from '../styles'
import Typography from "@material-ui/core/Typography";
import Canvas from './Canvas'

import React, {useEffect, useState} from 'react';
import FormControl from "@material-ui/core/FormControl";
import MenuItem from "@material-ui/core/MenuItem";
import InputLabel from "@material-ui/core/InputLabel/InputLabel";
import Select from "@material-ui/core/Select/Select";
import {toast} from "react-toastify";
import classNames from "classnames";
import {getRoomList} from "../../../Api/api_rooms";

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

const Preview = props => {
  const classes = useStyle();
  const width = 300;
  const height = 200;
  const offset = 10;

  const [rooms, setRooms] = useState([]);
  const [activeRoom, setActiveRoom] = useState(localStorage.getItem("activeRoom") === "undefined" ? "undefined" : localStorage.getItem("activeRoom"));
  const [canvasRoom, setCanvasRoom] = useState("None");

  useEffect(() => {
    getRoomList(localStorage.getItem("houseId")).then(data => {
      setRooms(data);
    }).catch(err => toast.error(err.message))
  }, []);

  useEffect(() => {
    if (props.activeAgentLoc === "None"){
      setActiveRoom(undefined);
      setCanvasRoom("None");
    }
    else if (props.activeAgentLoc !== "" && props.activeAgentLoc !== undefined){
      setActiveRoom(rooms.filter(item => item.name === props.activeAgentLoc)[0].id);
      setCanvasRoom(props.activeAgentLoc);
    }
  }, [props.activeAgentLoc]);
  
  const handleChangeActiveRoom = (e) => {
    localStorage.setItem("activeRoom", e.target.value);
    setActiveRoom(e.target.value);
    if(e.target.value === ""){
      setCanvasRoom("None");
    }
    else {
      setCanvasRoom(rooms.filter(item => item.id === localStorage.getItem("activeRoom"))[0]["name"]);
    }
  };

  return (
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
          {rooms.map(item => <MenuItem value={item.id}>{item.name}</MenuItem>)}
        </Select>
      </FormControl>
      <Canvas draw={draw} width={width} height={height} offset={offset} room={canvasRoom}/>
    </div>
  );
};

export default Preview;
